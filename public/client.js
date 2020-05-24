// initializing socket, connection to server
var socket = io();
socket.on("connect", function (data) {
  socket.emit("join", "Hello server from client");
});

// listener for 'thread' event, which updates messages
socket.on("thread", function (data) {
  $("#thread").append("<li>" + data + "</li>");
});

// sends message to server, resets & prevents default form action
$("form").submit(function () {
  var message = $("#message").val();
  socket.emit("messages", message);
  this.reset();
  return false;
});






function openVideo() {
  document.getElementById("video-hide").style.display = "none";
  document.getElementById("video-show").style.display = "block";
}

function closeVideo() {
  document.getElementById("video-hide").style.display = "block";
  document.getElementById("video-show").style.display = "none";
}

function play() {
  event.preventDefault();
  var localLink = document.getElementById("link").value;
  document.getElementById("video-player").src = "https://www.youtube.com/embed/" + localLink.slice(32) + "?autoplay=1";
  socket.emit("youtube", localLink);
}

socket.on("youtube", function (data) {
  document.getElementById("video-player").src = "https://www.youtube.com/embed/" + data.slice(32) + "?autoplay=1";
});

function login() {
  event.preventDefault();
  var localName = document.getElementById("name").value;
  var localColor = document.getElementById("color").value;
  socket.emit("newPlayer", { color: localColor, name: localName });
  document.getElementById("start").style.display = "none";
  socket.emit("messages", "🎉" + localName + " has joined the room!🎉");
}

var playerData = {
  up: false,
  down: false,
  left: false,
  right: false,
  kick: false,
  emote: false,
  room: ""
};

document.addEventListener("keydown", function (event) {
  switch (event.keyCode) {
    case 37:
      playerData.left = true;
      break;
    case 38: // W
      playerData.up = true;
      break;
    case 39: // D
      playerData.right = true;
      break;
    case 40: // S
      playerData.down = true;
      break;
    case 32: 
      playerData.kick = true;
      break;
    case 49: 
      playerData.emote = true;
      break;
  }
});
document.addEventListener("keyup", function (event) {
  switch (event.keyCode) {
    case 37: // A
      playerData.left = false;
      break;
    case 38: // W
      playerData.up = false;
      break;
    case 39: // D
      playerData.right = false;
      break;
    case 40: // S
      playerData.down = false;
      break;
    case 32: 
      playerData.kick = false;
      break;
    case 49: 
      playerData.emote = false;
      break;
    }
});

setInterval(function () {
  socket.emit("playerData", playerData);
}, 1000 / 60);



var canvas = document.getElementById("canvas");
canvas.width = 1000;
canvas.height = 600;
var context = canvas.getContext("2d");
socket.on("state", function (players) {
  context.clearRect(0, 0, 1000, 600);



  context.beginPath();
  context.fillStyle = "gray";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = "15px Arial";
  context.textAlign = "center";

  for (var id in players) {
    var player = players[id];

  if(players[id].kick === true){
    context.beginPath();
    context.arc(player.x, player.y, 14, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();

    context.beginPath();
    context.arc(player.x-15, player.y - players[id].emoteHeight, 8, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();

    context.beginPath();
    context.arc(player.x+15, player.y - players[id].emoteHeight, 8, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();
  }

    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fillStyle = players[id].color;
    context.fill();

    context.beginPath();
    context.arc(player.x - 15, player.y - players[id].emoteHeight, 4, 0, 2 * Math.PI);
    context.fillStyle = players[id].color;
    context.fill();

    context.beginPath();
    context.arc(player.x + 15, player.y - players[id].emoteHeight, 4, 0, 2 * Math.PI);
    context.fillStyle = players[id].color;
    context.fill();
    

    context.beginPath();
    context.fillStyle = "black";
    context.fill();
    context.fillText(players[id].name, player.x, player.y-15);
    
  }


});
