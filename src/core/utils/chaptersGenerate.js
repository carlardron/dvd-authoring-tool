import logger from "./logger.js";

/**
 * Generates an array of chapter points at specified intervals
 * @param {number} duration - Total duration in seconds
 * @param {number} intervalMinutes - Interval between chapters in minutes
 * @param {number} endBuffer - Buffer time from the end in seconds
 * @returns {number[]} Array of chapter timestamps in seconds
 */
const chaptersGenerate = (context, intervalMinutes = 10, endBuffer = 0.5) => {
  if (!context.media?.video?.duration) {
    throw new Error("No video duration available for chapter generation.");
  }

  const duration = context.media.video.duration;

  if (!duration || duration <= 0) return [];

  const intervalSeconds = intervalMinutes * 60;
  const chapters = [];

  // Generate chapters at each interval
  for (
    let time = intervalSeconds;
    time < duration - endBuffer;
    time += intervalSeconds
  ) {
    chapters.push(Math.floor(time)); // Floor to avoid decimal values
  }

  // Check if the last interval-based chapter is too close to the end
  if (chapters.length > 0) {
    const lastChapter = chapters[chapters.length - 1];
    const distanceToEnd = duration - lastChapter;

    // If less than one minute from the end, remove that last chapter
    if (distanceToEnd < 60) {
      chapters.pop();
      logger.log(`Removed chapter at ${lastChapter}s (too close to end)`);
    }
  }

  // Add the end chapter
  // chapters.push(Math.floor(duration - endBuffer));

  // chapters.push(duration - endBuffer); // end skip

  context.media.chapters = chapters;

  logger.log(
    `Generated ${context.media.chapters.length} chapter points at 10-minute intervals`
  );

  if (context.media.chapters.length > 0) {
    logger.log(
      `Chapter points (seconds): ${context.media.chapters.join(", ")}`
    );
  }
};

export default chaptersGenerate;
