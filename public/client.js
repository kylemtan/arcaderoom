// initializing socket, connection to server
var socket = io.connect("http://localhost:7777" || "https://warm-ravine-86373.herokuapp.com/");
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



function login() {
  event.preventDefault();
  var localName = document.getElementById("name").value;
  var localColor = document.getElementById("color").value;
  socket.emit("newPlayer", { color: localColor, name: localName });
  document.getElementById("start").style.display = "none";
}

var movement = {
  up: false,
  down: false,
  left: false,
  right: false,
  kick: false,
};

document.addEventListener("keydown", function (event) {
  switch (event.keyCode) {
    case 37:
      movement.left = true;
      console.log("hi");
      break;
    case 38: // W
      movement.up = true;
      break;
    case 39: // D
      movement.right = true;
      break;
    case 40: // S
      movement.down = true;
      break;
    case 32: 
      movement.kick = true;
      break;
  }
});
document.addEventListener("keyup", function (event) {
  switch (event.keyCode) {
    case 37: // A
      movement.left = false;
      break;
    case 38: // W
      movement.up = false;
      break;
    case 39: // D
      movement.right = false;
      break;
    case 40: // S
      movement.down = false;
      break;
    case 32: 
      movement.kick = false;
      break;
  }
});

setInterval(function () {
  socket.emit("movement", movement);
}, 1000 / 60);

var canvas = document.getElementById("canvas");
canvas.width = 1000;
canvas.height = 600;
var context = canvas.getContext("2d");
socket.on("state", function (players) {
  context.clearRect(0, 0, 1000, 600);


  context.beginPath();
  context.fillStyle = "green";
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
  }

    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fillStyle = players[id].color;
    context.fill();
    

    context.beginPath();
    context.fillStyle = "black";
    context.fill();
    context.fillText(players[id].name, player.x, player.y-15);
    
  }


});
