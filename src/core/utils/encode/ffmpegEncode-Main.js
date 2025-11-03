import spawnAsync from "./spawnAsync.js";
import logger from "../logger.js";

// Calculate available space with headroom
function calculateVideoBitrate(durationSeconds, audioKbps = 224) {
  // DVD-5 capacity in bytes
  const dvd5Capacity = 4700000000;

  // Apply 12% headroom
  const availableBytes = dvd5Capacity * (1 - 0.12);

  // Audio bit calculation
  const audioBitsTotal = durationSeconds * audioKbps * 1000;
  const audioBytesTotal = audioBitsTotal / 8;

  // Remaining space for video
  const videoBytesAvailable = availableBytes - audioBytesTotal;

  // Convert to bits and calculate bitrate
  const videoBitsAvailable = videoBytesAvailable * 8;
  const videoBitrateKbps = Math.floor(
    videoBitsAvailable / (durationSeconds * 1000)
  );

  return {
    availableCapacity: Math.floor(availableBytes),
    audioBytesTotal: Math.floor(audioBytesTotal),
    videoBytesAvailable: Math.floor(videoBytesAvailable),
    videoBitrateKbps: videoBitrateKbps > 6000 ? 6000 : videoBitrateKbps, // Cap at 6000 kbps
  };
}

const ffmpegEncodeMain = async (
  context,
  { incomingFrameRateChange, vStandard, forceKeyframes, vf, af }
) => {
  // Common parameters
  const commonParams = [
    ...incomingFrameRateChange,
    "-i",
    context.args.video,
    "-i",
    context.args.audio,
    "-target",
    `${vStandard}-dvd`,
    "-map",
    "0:v:0",
    "-minrate",
    "1200k",
    "-maxrate",
    "9200k",
    ...forceKeyframes,
    ...vf,
    "-flags",
    "+ildct+ilme",
  ];

  if (context.args.twoPass) {
    const duration = context.media.video.duration;
    const bitBudget = calculateVideoBitrate(duration, 224); // Assuming 224 kbps audio

    logger.log(
      `Available capacity: ${bitBudget.availableCapacity} bytes, Audio total: ${
        bitBudget.audioBytesTotal
      } bytes, Video available: ${
        bitBudget.videoBytesAvailable
      } bytes, Video bitrate${
        bitBudget.videoBitrateKbps === 6000 ? " (capped)" : ""
      }: ${bitBudget.videoBitrateKbps} kbps`
    );
    // First pass - analysis only
    const firstPassParams = [
      ...commonParams,
      "-b:v",
      `${bitBudget.videoBitrateKbps}k`, // Target bitrate
      "-pass",
      "1",
      "-an", // No audio in first pass
      "-f",
      "null",
      "/dev/null", // In Linux/Alpine we use /dev/null
    ];

    // Use the scratch directory directly for the pass log file
    const passLogfile = `${context.int.scratchDir}/ffmpeg2pass`;

    // Second pass - actual encoding
    const secondPassParams = [
      ...commonParams,
      "-b:v",
      `${bitBudget.videoBitrateKbps}k`, // Target bitrate
      "-pass",
      "2",
      "-map",
      "1:a:0",
      ...af,
      "-c:a",
      "ac3",
      "-b:a",
      "192k",
      "-ar",
      "48000",
      "-ac",
      "2",
      "-y",
      context.int.moviePath,
    ];

    // Execute first pass
    console.log("Starting first pass encoding...");
    await spawnAsync("ffmpeg", [
      ...firstPassParams,
      "-passlogfile",
      passLogfile,
    ]);

    // Execute second pass
    console.log("Starting second pass encoding...");
    await spawnAsync("ffmpeg", [
      ...secondPassParams,
      "-passlogfile",
      passLogfile,
    ]);
  } else {
    const onePassParams = [
      ...commonParams,
      "-q:v",
      "2",
      "-map",
      "1:a:0",
      ...af,
      "-c:a",
      "ac3",
      "-b:a",
      "224k",
      "-ar",
      "48000",
      "-ac",
      "2",
      "-y",
      context.int.moviePath,
    ];
    // Execute second pass
    console.log("Starting constant quality one-pass encoding...");
    await spawnAsync("ffmpeg", onePassParams);
  }

  return;
};

export default ffmpegEncodeMain;
