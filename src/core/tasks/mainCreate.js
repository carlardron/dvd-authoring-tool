import fs from "fs";
import logger from "../utils/logger.js";
import ffmpegEncode from "../utils/encode/ffmpegEncode.js";

const mainCreate = async (context) => {
  if (!fs.existsSync(context.int.moviePath) || context.args.forceRebuild) {
    logger.log("Converting video to DVD format (muxed)...");

    logger.time("Main AV conversion");
    context.com.enc = "program.dvd.main";
    await ffmpegEncode(context);
    logger.timeEnd("Main AV conversion");
  } else {
    logger.log("Using existing AV (muxed) file");
  }
};

export default mainCreate;
