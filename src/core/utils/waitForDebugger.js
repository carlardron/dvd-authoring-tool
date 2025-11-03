/**
 * Pauses execution to allow time for attaching a debugger
 * @param {number} seconds - Number of seconds to wait before continuing
 * @returns {Promise} - Resolves when the wait is complete
 */
export default function waitForDebugger(seconds = 5) {
  return new Promise((resolve) => {
    const isDebugging = process.execArgv.some((arg) =>
      arg.includes("--inspect")
    );

    if (!isDebugging) {
      return resolve();
    }

    console.log("⚙️  Debug mode detected!");
    console.log("⏱️  Waiting ${seconds} seconds for debugger to attach...");
    console.log("🔗  Use VS Code debugger or open chrome://inspect in Chrome");

    setTimeout(() => {
      console.log(
        "⚠️  Place a breakpoint or you will miss the debugging opportunity!"
      );
      console.log("▶️ Continuing execution...");
      resolve();
    }, seconds * 1000);
  });
}
