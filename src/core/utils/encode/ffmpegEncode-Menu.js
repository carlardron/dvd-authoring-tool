import spawnAsync from "./spawnAsync.js";

const ffmpegEncodeMenu = async (context, { vStandard, vf }) => {
  const params = [
    "-loop",
    "1",
    "-i",
    context.int.menuPngPath,
    "-f",
    "lavfi",
    "-i",
    "anullsrc=channel_layout=stereo:sample_rate=48000",
    "-t",
    "60",
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
    "-y",
    context.int.menuMpgPath,
  ];
  // Execute
  await spawnAsync("ffmpeg", params);
};

export default ffmpegEncodeMenu;
