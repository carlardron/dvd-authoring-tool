import logger from "../utils/logger.js";
import ffprobeAnalyse from "../utils/ffprobeAnalyse.js";

const mainProbe = async (context) => {
  // Analyze source media files and store information in context
  logger.log("Analyzing source media files...");
  context["media"] = {
    video: ffprobeAnalyse(context.args.video),
    audio: ffprobeAnalyse(context.args.audio),
    intro: ffprobeAnalyse(context.args.intro),
    chapters: [600, 1200, 1800], // Default chapters, can be customized later
  };

  logger.log(
    `Video duration: ${context.media.video.duration.toFixed(2)} seconds`
  );
  logger.log(
    `Video resolution: ${context.media.video.video.width}x${context.media.video.video.height}`
  );
  logger.log(`Audio format: ${context.media.audio.audio.codec_name}`);
};

export default mainProbe;
