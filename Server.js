const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("join-room", ({ name, room }) => {
    socket.join(room);
    socket.username = name;
    socket.room = room;
    io.to(room).emit("chat message", `${name} joined the chat`);
  });

  socket.on("chat message", (msg) => {
    if (socket.room && socket.username) {
      io.to(socket.room).emit("chat message", `${socket.username}: ${msg}`);
    }
  });

  socket.on("disconnect", () => {
    if (socket.room && socket.username) {
      io.to(socket.room).emit("chat message", `${socket.username} left the chat`);
    }
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
