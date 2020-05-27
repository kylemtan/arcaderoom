var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);


app.get("/", function(req, res, next) {
  res.sendFile(__dirname + "/public/index.html");
});


app.use(express.static("public"));

var players = {};
var items = [];
var itemsThrown = [];

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
    };
  });

  client.on("giveDonut",  function(data) {
    for (var e = 0; e < items.length; e++){
      if(data === items[e]){
        items.splice(e,1);
      }
    }
    items.push(data);
  });
  client.on("throwDonut",  function(data) {
    var x = 0;
    var y = 0;
    for(var e = 0; e < items.length; e++){
      if(data === items[e]){
      items.splice(e,1);
    }
    }
    if(players[client.id].name === data){
      x = (players[client.id].mouseX - players[client.id].x)/30;
      y = (players[client.id].mouseY - players[client.id].y)/30;
      itemsThrown.push(
        {
      name: players[client.id].name,
      x: players[client.id].x,
      y: players[client.id].y,
      xSpeed: x,
      ySpeed: y,
      timer: 0,
        }
      );
  }
  });
  client.on("takeDonut",  function(data) {
    for (var e = 0; e < items.length; e++){
      if(data === items[e]){
        items.splice(e,1);
      }
    }
  });

  client.on('playerData', function(data) {
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

    //collision
    if(player.x > 990){
      player.x = 990;
    }
    if(player.x < 10){
      player.x = 10;
    }
    if(player.y > 590){
      player.y = 590;
    }
    if(player.y < 10){
      player.y = 10;
    }
  });
  
  client.on('disconnect', function() {
    // client.emit("thread", "😔 " + players[client.id].name + " has left the room.😔");
    // client.broadcast.emit("thread", "😔 " + players[client.id].name + " has left the room.😔");
    delete players[client.id];
  });
});



setInterval(function() {
  //updating all itemsThrown
  for(var e = 0; e < itemsThrown.length; e++){
    
    itemsThrown[e].timer += 1;
    if(itemsThrown[e].timer < 40){
      itemsThrown[e].x += itemsThrown[e].xSpeed;
      itemsThrown[e].y += itemsThrown[e].ySpeed;
    } else {
      itemsThrown[e].name = "";
    }
    if(itemsThrown[e].timer > 150){
      itemsThrown.splice(e, 1);
    }

 }
  io.sockets.emit('state', { players: players, items: items, itemsThrown: itemsThrown });
}, 1000 / 60);

setInterval(function() {
  console.log(players);
}, 1000);

//running on 7777...
server.listen(process.env.PORT || 7777);
// server.listen(process.env.PORT);

