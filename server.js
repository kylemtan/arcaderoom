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

  client.on('youtube', function(data) {
    client.broadcast.emit("youtube", data);
    console.log(1);
  });

  client.on("newPlayer", function(data) {
    players[client.id] = {
      x: 300,
      y: 300,
      kick: false,
      color: data.color,
      name: data.name,
      emote: false,
      interact: false,
      emoteHeight: 0,
      emoteSpeed: -0.5,
      mouseX: 0, 
      mouseY: 0,
      room: "",
      item: "",
    };
    console.log(players);
  });
  client.on('playerData', function(data) {
    var player = players[client.id] || {};
    if (data.left) {
      player.x -= 6;
    }
    if (data.up) {
      player.y -= 6;
    }
    if (data.right) {
      player.x += 6;
    }
    if (data.down) {
      player.y += 6;
    }
    if (data.kick) {
      player.kick = true;
    } else {
      player.kick = false;
    }
    if (data.emote) {
      player.emote = true;
    } else {
      player.emote = false;
    }

    if (data.interact) {
      player.interact = true;
    } else {
      player.interact = false;
    }

    player.item = data.item;

    if(player.emote === true){
      player.emoteHeight-=player.emoteSpeed;
      if(player.emoteHeight === 0 || player.emoteHeight === 15){
        player.emoteSpeed = player.emoteSpeed*-1;
      }
    } else {
      player.emoteHeight = 0;
      player.emoteSpeed = -0.5;
    }
    player.mouseX = data.mouseX;
    player.mouseY = data.mouseY;
  });
  client.on('disconnect', function() {
    //console.log(players[client.id].name);
    // client.emit("thread", "😔 " + players[client.id].name + " has left the room.😔");
    // client.broadcast.emit("thread", "😔 " + players[client.id].name + " has left the room.😔");
    delete players[client.id];
  });
});



setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);

//running on 7777...
server.listen(process.env.PORT || 7777);
// server.listen(process.env.PORT);

