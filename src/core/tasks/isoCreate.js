import { execSync } from "child_process";
import logger from "../utils/logger.js";

const isoCreate = async (context) => {
  // Create ISO Image
  logger.log("Creating ISO image...");
  logger.time("ISO creation");
  execSync(
    `genisoimage -dvd-video -V "${context.args.volumeName}" -o ${context.args.output} ${context.out.outputDisc}`
  );
  logger.timeEnd("ISO creation");

  logger.timeEnd("Total DVD authoring process");
  logger.log(`DVD-Video ISO successfully created at: ${context.args.output}`);
};

export default isoCreate;
