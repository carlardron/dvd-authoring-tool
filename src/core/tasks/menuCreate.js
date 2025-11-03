import fs from "fs";
import { execSync } from "child_process";
import logger from "../utils/logger.js";
import ffmpegEncode from "../utils/encode/ffmpegEncode.js";
import { generateSpuXml } from "../utils/spuXmlGenerator.js";
import highlightTransforms from "./subtasks/menuCreate/highlightTransforms.js";

// Function to round to nearest even number
const roundToEven = (num) => {
  const rounded = Math.round(num);
  return rounded % 2 === 0 ? rounded : rounded + 1;
};

// Round down to nearest even number
const roundDownToEven = (num) => {
  const rounded = Math.floor(num);
  return rounded % 2 === 0 ? rounded : rounded - 1;
};

const menuCreate = async (context) => {
  logger.time("Menu generation");
  const verticalRes = context.args.format === "pal" ? "576" : "480";
  // Calculate the letterboxed height
  const letterboxedHeight = verticalRes / 1.333;
  // Calculate the size of the black bar (top or bottom)
  const blackBarHeight = (verticalRes - letterboxedHeight) / 2;

  // button location
  const playButtonLocation =
    context.args.format === "pal"
      ? { x0: 590, y0: 490, x1: 650, y1: 534 }
      : { x0: 590, y0: 408, x1: 650, y1: 446 };

  // Adjust play button location for letterboxed display
  const playButtonLocation_LB = {
    x0: playButtonLocation.x0,
    y0: roundDownToEven(playButtonLocation.y0 / 1.333 + blackBarHeight),
    x1: playButtonLocation.x1,
    y1: roundToEven(playButtonLocation.y1 / 1.333 + blackBarHeight),
  };

  const highlights = highlightTransforms([playButtonLocation]);
  const highlights_LB = highlightTransforms([playButtonLocation_LB]);

  if (!fs.existsSync(context.int.menuMpgPath) || context.args.forceRebuild) {
    logger.log("Generating DVD menu...");
    // Step 1: Create the menu image
    execSync(
      `convert "${context.args.still}" \\
          -resize 1920x1080! \\
          -fill "rgba(0,0,0,0.7)" -gravity south -draw "rectangle 0,920 1920,995" \\
          -fill white -pointsize 48 -gravity southeast -annotate +206+93 "PLAY" \\
          -resize "720x${verticalRes}!" \\
          -blur 0x0.1 \\
          ${context.int.menuPngPath}`
    );

    // Step 2: Encode the menu image, with silence - 60 seconds
    context.com.enc = "program.dvd.menu";
    await ffmpegEncode(context);
  } else {
    logger.log("Using existing menu video");
  }

  // Step 4: Add interactive buttons with spumux
  logger.log("Adding menu buttons with spumux...");

  const menuWithButtonsPath = `${context.int.scratchDir}/menu_with_buttons.mpg`;
  const spumuxXmlPath = `${context.int.scratchDir}/spumux.xml`;
  const spumuxXmlPath_LB = `${context.int.scratchDir}/spumux_LB.xml`;

  // Generate all three button state images with LIMITED color palette (3 colors)
  // 1. Normal state (default appearance)

  // re. { x0: 590, y0: 490, x1: 650, y1: 534 }
  const buttonNormalPath = `${context.int.scratchDir}/button_normal.png`;
  execSync(
    `convert -size 720x${verticalRes} xc:transparent \\
  -fill "rgba(255, 255, 255, 0.07)" -draw "${highlights[0].normal[0]}" \\
  -colors 3 ${buttonNormalPath}`
  );

  // 2. Highlight state (when navigating/hovering)
  const buttonHighlightPath = `${context.int.scratchDir}/button_highlight.png`;
  execSync(
    `convert -size 720x${verticalRes} xc:transparent \\
  -fill "rgba(255,255,255,0.5)" -draw "${highlights[0].highlight[0]}" \\
  -fill "rgba(255,255,255,0.93)" -draw "${highlights[0].highlight[1]}" \\
  -fill "rgba(255,255,255,0.5)" -draw "${highlights[0].highlight[2]}" \\
  -colors 3 ${buttonHighlightPath}`
  );

  // 3. Select state (when pressed)
  const buttonSelectPath = `${context.int.scratchDir}/button_select.png`;
  execSync(
    `convert -size 720x${verticalRes} xc:transparent \\
  -fill "rgba(255, 183, 0, 0.33)" -draw "${highlights[0].select[0]}" \\
  -colors 3 ${buttonSelectPath}`
  );

  // Create spumux XML control file with ABSOLUTE paths to the images
  const spumuxXml = generateSpuXml({
    buttonNormalPath,
    buttonHighlightPath,
    buttonSelectPath,
    buttonCoordinates: [playButtonLocation],
  });

  fs.writeFileSync(spumuxXmlPath, spumuxXml);

  // Generate letterboxed button state images for 4:3 display
  // 1. Normal state (default appearance) - Letterboxed
  const buttonNormalPath_LB = `${context.int.scratchDir}/button_normal_lb.png`;
  execSync(
    `convert -size 720x${verticalRes} xc:transparent \\
  -fill "rgba(255, 255, 255, 0.07)" -draw "${highlights_LB[0].normal[0]}" \\
  -colors 3 ${buttonNormalPath_LB}`
  );

  // 2. Highlight state (when navigating/hovering) - Letterboxed
  const buttonHighlightPath_LB = `${context.int.scratchDir}/button_highlight_lb.png`;
  execSync(
    `convert -size 720x${verticalRes} xc:transparent \\
  -fill "rgba(255,255,255,0.5)" -draw "${highlights_LB[0].highlight[0]}" \\
  -fill "rgba(255,255,255,0.93)" -draw "${highlights_LB[0].highlight[1]}" \\
  -fill "rgba(255,255,255,0.5)" -draw "${highlights_LB[0].highlight[2]}" \\
  -colors 3 ${buttonHighlightPath_LB}`
  );

  // 3. Select state (when pressed) - Letterboxed
  const buttonSelectPath_LB = `${context.int.scratchDir}/button_select_lb.png`;
  execSync(
    `convert -size 720x${verticalRes} xc:transparent \\
  -fill "rgba(255, 183, 0, 0.33)" -draw "${highlights_LB[0].select[0]}" \\
  -colors 3 ${buttonSelectPath_LB}`
  );

  // Create a separate spumux XML for letterboxed display
  const spumuxXml_LB = generateSpuXml({
    buttonNormalPath: buttonNormalPath_LB,
    buttonHighlightPath: buttonHighlightPath_LB,
    buttonSelectPath: buttonSelectPath_LB,
    buttonCoordinates: [playButtonLocation_LB],
  });

  fs.writeFileSync(spumuxXmlPath_LB, spumuxXml_LB);

  // Run spumux using stdin/stdout redirection
  logger.log("Running spumux to add button overlays...");

  const menuWithWSButtonsPath = `${context.int.scratchDir}/menu_with_ws_buttons.mpg`;
  try {
    // execSync(
    //   `spumux -s 0 ${spumuxXmlPath} < ${context.int.menuMpgPath} > ${menuWithWSButtonsPath}`,
    //   { stdio: "inherit" }
    // );

    logger.log("Adding letterboxed button overlays for widescreen display...");
    execSync(
      `spumux -s 0 ${spumuxXmlPath} < ${context.int.menuMpgPath} > ${menuWithWSButtonsPath}`,
      { stdio: "inherit" }
    );

    logger.log("Adding letterboxed button overlays for 4:3 display...");
    // Now apply the widescreen buttons to the letterboxed version
    execSync(
      `spumux -s 1 ${spumuxXmlPath_LB} < ${menuWithWSButtonsPath} > ${menuWithButtonsPath}`,
      { stdio: "inherit" }
    );

    // Use the enhanced menu for DVD authoring
    context.int.menuMpgPath = menuWithButtonsPath;
  } catch (error) {
    logger.warn(
      "Warning: spumux failed, continuing with original menu:",
      error.message
    );
    throw new Error("SPU Failed: " + error.message);
  }

  // Use the enhanced menu for DVD authoring
  context.int.menuMpgPath = menuWithButtonsPath;
  logger.timeEnd("Menu generation");
};

export default menuCreate;
