import spawnAsync from "./spawnAsync.js";

const ffmpegEncodeBlack = async (
  context,
  { vStandard, vf, verticalRes, vfRate }
) => {
  const params = [
    "-f",
    "lavfi",
    "-i",
    `color=black:s=720x${verticalRes}:r=${vfRate}:d=1`,
    "-f",
    "lavfi",
    "-i",
    "anullsrc=channel_layout=stereo:sample_rate=48000:d=1",
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-t",
    "1",
    "-target",
    `${vStandard}-dvd`,
    "-q:v",
    "2",
    "-minrate",
    "1200k",
    "-maxrate",
    "9200k",
    ...vf,
    "-c:a",
    "ac3",
    "-b:a",
    "192k",
    "-metadata:s:a:0",
    "language=eng",
    "-y",
    context.int.blackPath,
  ];
  // Execute
  await spawnAsync("ffmpeg", params);
};

export default ffmpegEncodeBlack;
