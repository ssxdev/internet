const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;
const AUDIO_FILE = path.join(__dirname, "silicon-valley-audio.m4a");

let connectedUsers = 0;
let activeListeners = 0;
let streamStartTime = Date.now();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/audio", (req, res) => {
  const stat = fs.statSync(AUDIO_FILE);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(AUDIO_FILE, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "audio/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "audio/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(AUDIO_FILE).pipe(res);
  }
});

io.on("connection", (socket) => {
  connectedUsers++;
  io.emit("userCount", {
    connected: connectedUsers,
    listening: activeListeners,
  });

  socket.on("startListening", () => {
    activeListeners++;
    console.log(`Connected: ${connectedUsers}, Listening: ${activeListeners}`);
    io.emit("userCount", {
      connected: connectedUsers,
      listening: activeListeners,
    });
  });

  socket.on("requestSync", () => {
    const currentTime = (Date.now() - streamStartTime) / 1000;
    socket.emit("sync", { currentTime });
  });

  socket.on("stopListening", () => {
    if (activeListeners > 0) {
      activeListeners--;
      io.emit("userCount", {
        connected: connectedUsers,
        listening: activeListeners,
      });
    }
  });

  socket.on("disconnect", () => {
    connectedUsers--;
    if (activeListeners > 0) {
      activeListeners--;
    }
    io.emit("userCount", {
      connected: connectedUsers,
      listening: activeListeners,
    });
  });
});

// Reset stream start time every hour to prevent potential timing drift
setInterval(() => {
  streamStartTime = Date.now();
  io.emit("resetAudio");
}, 3600000);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
