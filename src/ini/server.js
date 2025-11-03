import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { setIO } from "./socketInstance.js";
import logger from "../core/utils/logger.js";

const app = express();

// Apply CORS middleware to Express
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Create an HTTP server using the Express app
const server = createServer(app);

// Create a new Socket.IO server instance
const io = new Server(server, {
  cors: {
    origin: "*", // For testing purposes only - make more restrictive later
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

// Add a basic HTTP route for testing
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Available command options to send to the client
const availableOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
  { value: "option4", label: "Option 4" },
];

// Make io available globally
setIO(io);

// Handle socket connections
io.on("connection", (socket) => {
  logger.log("Client connected: " + socket.id);

  // Set this socket as the active socket for directed messages
  logger.setSocket(socket);

  // Send available options to the client when they connect
  socket.emit("options", availableOptions);

  // Handle execute commands from the client
  socket.on("execute", (data) => {
    logger.log(`Executing: ${data.option}`);

    // Example: Simulate command execution with updates
    socket.emit("output", {
      message: `Starting execution of: ${data.option}`,
      type: "info",
      timestamp: new Date().toISOString(),
    });

    // Simulate progress updates
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      socket.emit("output", `Progress: ${progress}%`);

      if (progress >= 100) {
        clearInterval(interval);
        socket.emit("output", `Completed: ${data.option}`);
      }
    }, 1000);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    logger.log("Client disconnected: " + socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server
  .listen(PORT, () => {
    logger.log(`Server running on port ${PORT}`);
  })
  .on("error", (err) => {
    logger.error("Failed to start server: " + err.message);
  });
