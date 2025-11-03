import author from "../core/author.js";
import logger from "../core/utils/logger.js";

// Simple test with sample files
author({
  video: "/media/sample.mp4",
  audio: "/media/sample.wav",
  still: "/media/sample.jpg",
  intro: "/media/Copyright-Generic-1080p25.mp4",
  format: "ntsc", // "ntsc" or "pal"
  output: "/output/test.iso",
  scratch: "/scratch",
  debug: true,
  debugWaitTime: 5,
})
  .then((result) => logger.log(result))
  .catch((err) => logger.error(err));
