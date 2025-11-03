console.log("Debug test started at " + new Date().toISOString());
console.log("Waiting 5 seconds for debugger to attach...");

// Give yourself time to attach the debugger
setTimeout(() => {
  console.log("Continuing execution - attach debugger now!");

  // This line will pause execution when debugger is attached
  debugger;

  console.log("If you see this message, debugging is working!");

  // Keep the process running
  setTimeout(() => {
    console.log("Test completed");
  }, 30000);
}, 5000);
