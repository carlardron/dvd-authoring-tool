import fs from "fs";
import logger from "../utils/logger.js";
import ffmpegEncode from "../utils/encode/ffmpegEncode.js";

const introCreate = async (context) => {
  // Encode video and audio files
  if (!fs.existsSync(context.int.introPath) || context.args.forceRebuild) {
    logger.log("Converting intro to DVD format (muxed)...");

    logger.time("Intro AV conversion");

    context.com.enc = "program.dvd.intro";
    await ffmpegEncode(context);
    logger.timeEnd("Intro AV conversion");
  } else {
    logger.log("Using existing AV (muxed) file");
  }
};

export default introCreate;
