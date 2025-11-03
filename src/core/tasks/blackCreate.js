import logger from "../utils/logger.js";
import ffmpegEncode from "../utils/encode/ffmpegEncode.js";

const blackCreate = async (context) => {
  // write 1sec black video file for DVD menu
  logger.log(
    `Creating template video segments for ${context.args.format.toUpperCase()} DVD-Video...`
  );
  context.com.enc = "program.dvd.black";
  await ffmpegEncode(context);
};

export default blackCreate;
