var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

app.get("/", function(req, res, next) {
  res.sendFile(__dirname + "/public/index.html");
});


app.use(express.static("public"));

var players = {};

//anything in static.js
io.on("connection", function(client) {
  console.log("Client connected...");

  client.on("join", function(data) {
    console.log(data);
  });

  client.on("messages", function(data) {
    client.emit("thread", data);
    client.broadcast.emit("thread", data);
  });

  client.on("newPlayer", function(data) {
    players[client.id] = {
      x: 300,
      y: 300,
      kick: false,
      color: data.color,
      name: data.name
    };
    console.log(players);
  });
  client.on('movement', function(data) {
    var player = players[client.id] || {};
    if (data.left) {
      player.x -= 3;
    }
    if (data.up) {
      player.y -= 3;
    }
    if (data.right) {
      player.x += 3;
    }
    if (data.down) {
      player.y += 3;
    }
    if (data.kick) {
      player.kick = true;
    } else {
      player.kick = false;
    }
  });
  client.on('disconnect', function() {
    delete players[client.id];
  });
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);

//running on 7777...
server.listen(process.env.PORT);
// server.listen(process.env.PORT);

