import { execSync } from "child_process";
import logger from "./logger.js";

/**
 * Analyzes media file using ffprobe and returns structured information
 *
 * @param {string} filePath - Path to the media file to analyze
 * @returns {object} Structured media information including formats, streams, and duration
 */
const ffprobeAnalyse = (filePath) => {
  if (!filePath) {
    logger.error("No file path provided for ffprobe analysis.");
    return false;
  }
  try {
    // Run ffprobe with JSON output format for easy parsing
    const result = execSync(
      `ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`,
      { encoding: "utf8" }
    );

    // Parse the JSON output
    const mediaInfo = JSON.parse(result);

    // Extract common properties for easier access
    const info = {
      format: mediaInfo.format,
      streams: mediaInfo.streams,
      duration: parseFloat(mediaInfo.format.duration || "0"),
      video: mediaInfo.streams.find((s) => s.codec_type === "video"),
      audio: mediaInfo.streams.find((s) => s.codec_type === "audio"),
      bitrate: parseInt(mediaInfo.format.bit_rate || "0", 10),
    };

    return info;
  } catch (error) {
    logger.error(`Error analyzing media with ffprobe: ${error.message}`);
    return null;
  }
};

export default ffprobeAnalyse;
