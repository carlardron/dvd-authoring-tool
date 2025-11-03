import stateManager from "./ini/statemanager";
import config from "./ini/config";

// this is the scaffold for standalone operation
// unconfigured, it will just start and stop

let start = async () => {
  try {
    if (config.ENVTEST !== true)
      throw new Error("Environment variable 'ENVTEST' not set");
    console.log(`ENV: ${config.ENV}`);

    // run the core

    stateManager.setIsRunning(false);
    closeGracefully(0);
  } catch (error) {
    console.error("Logger pek8_standard does not exist.", error.message);
    closeGracefully(1);
  }
};

let closeGracefully = async (signal) => {
  try {
    console.log(`Received signal to terminate: ${signal}`);
    if (stateManager.getIsRunning() && signal !== 1) {
      console.log("Waiting for processes to complete current round");
      stateManager.setIsExit(true);
    } else {
      // disconnect from whatever needs disconnecting
      console.log("Disconnecting from all connections");

      // ensure signal is a number, default to 0 if undefined or null
      signal = Number(signal || 0);
      if (isNaN(signal)) {
        signal = 0; // just to be sure!
      }

      // if (server && server.listening)
      //   server.close(() => {
      //     console.log(`Server closed`);
      //   });
      process.exit(signal);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
process.stdin.resume();
process.on("SIGINT", closeGracefully);
process.on("SIGTERM", closeGracefully);

export { closeGracefully };
