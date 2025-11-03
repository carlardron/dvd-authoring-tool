import spawnAsync from "./spawnAsync.js";

const ffmpegEncodeIntro = async (context, { vStandard, vf, af }) => {
  const params = [
    "-i",
    context.args.intro,
    "-target",
    `${vStandard}-dvd`,
    "-q:v",
    "2",
    "-minrate",
    "4000k",
    "-b:v",
    "6000k",
    "-maxrate",
    "9000k",
    ...vf,
    "-flags",
    "+ildct+ilme",
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
    context.int.introPath,
  ];
  // Execute
  await spawnAsync("ffmpeg", params);
};

export default ffmpegEncodeIntro;
