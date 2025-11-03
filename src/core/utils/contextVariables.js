import path from "path";

const contextVariables = (context) => {
  // Validate required arguments
  const requiredArgs = [
    "video",
    "audio",
    "still",
    "intro",
    "format",
    "output",
    "scratch",
  ];
  for (const key of requiredArgs) {
    if (!context.args[key]) {
      throw new Error(`Missing required parameter: ${key}`);
    }
  }

  // Scratch path
  context.int["scratchDir"] = path.resolve(context.args.scratch);
  // Ensure output directory path exists
  context.out["outputPath"] = path.dirname(path.resolve(context.args.output));
  context.out["outputDisc"] = path.join(
    path.dirname(path.resolve(context.args.output)),
    "0"
  );
  // Main AV paths
  context.int["rawMpegPath"] = `${context.int.scratchDir}/raw_movie.m2v`;
  context.int["moviePath"] = `${context.int.scratchDir}/movie.mpg`;
  context.int["audioPath"] = `${context.int.scratchDir}/audio.ac3`;
  // Menu paths
  context.int["menuPngPath"] = `${context.int.scratchDir}/menu_temp.png`;
  context.int["rawMenuMpgPath"] = `${context.int.scratchDir}/raw_menu.m2v`;
  context.int["menuMpgPath"] = `${context.int.scratchDir}/menu.mpg`;
  // Black path
  context.int["blackPath"] = `${context.int.scratchDir}/black.mpg`;
  // Introduction path
  context.int["introPath"] =
    context.args.intro.length > 0
      ? `${context.int.scratchDir}/intro.mpg`
      : context.int.blackPath;
};

export default contextVariables;
