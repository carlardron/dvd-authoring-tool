import { spawn } from "node:child_process";
import logger from "../logger.js";

const spawnAsync = (processor, args) => {
  const child = spawn(processor, args);

  let stdout = Buffer.alloc(0);
  let stderr = Buffer.alloc(0);

  if (child.stdout) {
    child.stdout.on("data", (data) => {
      stdout = Buffer.concat([stdout, data]);
    });
  }

  if (child.stderr) {
    child.stderr.on("data", (data) => {
      stderr = Buffer.concat([stderr, data]);
    });
  }

  const promise = new Promise((resolve, reject) => {
    child.on("error", (error) => {
      logger.error(`Child process error: ${error}`);
      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        const err = new Error(`child exited with code ${code}`);
        err.code = code;
        err.stderr = stderr.toString(); // Convert stderr buffer to string
        err.stdout = stdout.toString(); // Convert stdout buffer to string
        reject(err);
      }
    });
  });

  return promise;
};

export default spawnAsync;
