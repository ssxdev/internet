const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;
const MP3_FILE_PATH = path.join(__dirname, "silicon-valley-audio.m4a");

// Serve static files
app.use(express.static("public"));

// Stream route
app.get("/stream", (req, res) => {
  const stat = fs.statSync(MP3_FILE_PATH);
  const fileSize = stat.size;
  res.writeHead(200, {
    "Content-Type": "audio/mpeg",
    "Content-Length": fileSize,
  });

  const stream = fs.createReadStream(MP3_FILE_PATH);
  stream.pipe(res);

  // When the stream ends, start it again
  stream.on("end", () => {
    stream.destroy(); // Close the current stream
    const newStream = fs.createReadStream(MP3_FILE_PATH);
    newStream.pipe(res);
  });
});

// Get audio duration (approximate)
const stat = fs.statSync(MP3_FILE_PATH);
const audioDuration = stat.size / ((128 * 1024) / 8); // Approximate duration in seconds

// Track the start time of the current playback cycle
let streamStartTime = Date.now();

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle request for playback state
  socket.on("requestPlaybackState", () => {
    const currentTime = ((Date.now() - streamStartTime) / 1000) % audioDuration;
    socket.emit("playbackState", { currentTime });
  });

  // Periodically update all clients with the current time
  const intervalId = setInterval(() => {
    const currentTime = ((Date.now() - streamStartTime) / 1000) % audioDuration;
    io.emit("timeUpdate", currentTime);
  }, 1000);

  socket.on("disconnect", () => {
    console.log("User disconnected");
    clearInterval(intervalId);
  });
});

// Reset streamStartTime every time the audio loops
setInterval(() => {
  streamStartTime = Date.now();
}, audioDuration * 1000);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
