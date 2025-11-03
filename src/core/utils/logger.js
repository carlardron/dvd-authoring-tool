import { io } from "../../ini/socketInstance.js";

class Logger {
  constructor() {
    this.activeSocket = null;
    this.timers = {}; // Store custom timers
  }

  setSocket(socket) {
    this.activeSocket = socket;
  }

  log(message, type = "info") {
    // Standard console output
    console.log(message);

    // Use a single broadcast mechanism for all connected sockets
    if (io) {
      io.emit("output", {
        message,
        type,
        timestamp: new Date().toISOString(),
      });
    }
    // Only use direct socket emission if io is unavailable
    else if (this.activeSocket) {
      this.activeSocket.emit("output", {
        message,
        type,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Add other logging levels
  error(message) {
    console.error(message);
    this.log(message, "error");
  }

  warn(message) {
    console.warn(message);
    this.log(message, "warning");
  }

  progress(current, total, message = "") {
    const percent = Math.floor((current / total) * 100);
    const progressMessage = `${message} ${percent}% (${current}/${total})`;

    console.log(progressMessage);

    if (this.activeSocket) {
      this.activeSocket.emit("progress", {
        percent,
        current,
        total,
        message,
      });
    }

    if (io) {
      io.emit("progress", {
        percent,
        current,
        total,
        message,
      });
    }
  }

  // Start timing with a label
  time(label) {
    this.timers[label] = performance.now();
    console.time(label);
  }

  // End timing and report duration
  timeEnd(label) {
    if (!this.timers[label]) {
      this.warn(`Timer '${label}' does not exist`);
      return;
    }

    // Calculate duration
    const duration = performance.now() - this.timers[label];
    const formattedDuration = `${(duration / 1000).toFixed(2)}s`;

    // Use native console.timeEnd for terminal output
    console.timeEnd(label);

    // Send the timing information through the existing log mechanism
    this.log(`${label}: completed in ${formattedDuration}`, "timing");

    // Clean up
    delete this.timers[label];

    return duration; // Return duration in ms for programmatic use
  }
}

export default new Logger();
