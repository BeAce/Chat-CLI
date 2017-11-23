const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const app = express();
const server = http.Server(app);
const io = socketio(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => {
  console.log("ws is listen on port 3000...");
});

let numUsers = 0;
io.on("connection", socket => {
  let addedUser = false;
  socket.on("new message", data => {
    let msg = {};
    io.emit("new message", {
      username: socket.username,
      message: data,
    });
  });

  socket.on("add user", username => {
    if (addedUser) return;
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit("login", {
      numUsers
    });
    io.emit("user joined", {
      username: socket.username,
      numUsers
    });
  });

  socket.on("typing", () => {
    socket.broadcast.emit("typing", {
      username: socket.username
    });
  });

  socket.on("stop typing", () => {
    socket.broadcast.emit("stop typing", {
      username: socket.username
    });
  });

  socket.on("disconnect", () => {
    if (addedUser) {
      --numUsers;

      socket.broadcast.emit("user left", {
        username: socket.username,
        numUsers
      });
    }
  });
});
