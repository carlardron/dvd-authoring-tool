import fs from 'fs';
import path from 'path';
import logger from '../utils/logger.js';

const directoryEstablish = async (context) => {
  // Clean up existing output directory if it exists
  if (fs.existsSync(context.out.outputPath)) {
    logger.log(
      `Cleaning contents of existing output directory: ${context.out.outputPath}`
    );
    // Delete the contents of the directory but keep the directory itself
    fs.readdirSync(context.out.outputPath).forEach((file) => {
      const curPath = path.join(context.out.outputPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        fs.rmSync(curPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(curPath);
      }
    });
  }

  // Create fresh output directory
  fs.mkdirSync(context.out.outputDisc, { recursive: true });
  logger.log(`Created output directory: ${context.out.outputDisc}`);

  // Ensure the scratch directory exists
  if (!fs.existsSync(context.int.scratchDir)) {
    fs.mkdirSync(context.int.scratchDir, { recursive: true });
    logger.log(`Created scratch directory: ${context.int.scratchDir}`);
  } else {
    logger.log(`Using existing scratch directory: ${context.int.scratchDir}`);
  }
};

export default directoryEstablish;
