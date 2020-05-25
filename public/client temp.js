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


var mouseX = 0;
var mouseY = 0;
var overlay = document.getElementById("overlay");

function getMousePos(overlay, evt) {
  var rect = overlay.getBoundingClientRect();
  return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
  };
}

overlay.addEventListener("mousemove", function (evt) {
  var mouse = getMousePos(overlay, evt);
  mouseX = mouse.x;
  mouseY = mouse.y;
}, false);


var playerData = {
  up: false,
  down: false,
  left: false,
  right: false,
  kick: false,
  emote: false,
  interact: false,
  mouseX: 0,
  mouseY: 0,
  room: "",
  item: "",
};



document.addEventListener("keydown", function (event) {
  console.log(playerData.mouseX);
  switch (event.keyCode) {
    case 65:
      playerData.left = true;
      break;
    case 87: // W
      playerData.up = true;
      break;
    case 68: // D
      playerData.right = true;
      break;
    case 83: // S
      playerData.down = true;
      break;
    case 32: 
      playerData.kick = true;
      break;
    case 49: 
      playerData.emote = true;
      break;
    case 69:
      playerData.interact = true;
      break;
  }
});
document.addEventListener("keyup", function (event) {
  switch (event.keyCode) {
    case 65: // A
      playerData.left = false;
      break;
    case 87: // W
      playerData.up = false;
      break;
    case 68: // D
      playerData.right = false;
      break;
    case 83: // S
      playerData.down = false;
      break;
    case 32: 
      playerData.kick = false;
      break;
    case 49: 
      playerData.emote = false;
      break;
    case 69:
      playerData.interact = false;
      break;
    }
});

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  } 
  return color;
}

var canvas = document.getElementById("canvas");
canvas.width = 1000;
canvas.height = 600;
var context = canvas.getContext("2d");
socket.on("state", function (players) {
  context.clearRect(0, 0, 1000, 600);

  context.fillStyle = "gray";
  context.fillRect(0, 0, canvas.width, canvas.height);


  context.fillStyle = "lightgray";
  context.fillRect(710, 400, 190, 190);

  context.fillStyle = getRandomColor();
  context.fillRect(720, 410, 50, 50);

  context.fillStyle = getRandomColor();
  context.fillRect(720, 470, 50, 50);

  context.fillStyle = getRandomColor();
  context.fillRect(720, 530, 50, 50);

  context.fillStyle = getRandomColor();
  context.fillRect(780, 410, 50, 50);

  context.fillStyle = getRandomColor();
  context.fillRect(780, 470, 50, 50);
  
  context.fillStyle = getRandomColor();
  context.fillRect(780, 530, 50, 50);

  context.fillStyle = getRandomColor();
  context.fillRect(840, 410, 50, 50);

  context.fillStyle = getRandomColor();
  context.fillRect(840, 470, 50, 50);
  
  context.fillStyle = getRandomColor();
  context.fillRect(840, 530, 50, 50);

  context.beginPath();
  context.arc(1000, 500, 100, 0.5 * Math.PI, 1.5 * Math.PI);
  context.fillStyle = "lightgray";
  context.fill();




  context.beginPath();
  context.arc(950, 450, 10, 0, 2 * Math.PI);
  context.fillStyle = "red";
  context.fill();

  context.beginPath();
  context.arc(935, 450, 4, 0, 2 * Math.PI);
  context.fillStyle = "red";
  context.fill();

  context.beginPath();
  context.arc(963, 455, 4, 0, 2 * Math.PI);
  context.fillStyle = "red";
  context.fill();


  context.fillStyle = "black";
  context.fill();
  context.fillText("🎸", 955, 458);




  context.beginPath();
  context.arc(950, 500, 10, 0, 2 * Math.PI);
  context.fillStyle = "green";
  context.fill();

  context.beginPath();
  context.arc(935, 506, 5, 0, 2 * Math.PI);
  context.fillStyle = "green";
  context.fill();

  context.beginPath();
  context.arc(963, 505, 4, 0, 2 * Math.PI);
  context.fillStyle = "green";
  context.fill();

  context.fillStyle = "black";
  context.fill();
  context.fillText("🎤", 937, 510);



  context.beginPath();
  context.arc(950, 550, 10, 0, 2 * Math.PI);
  context.fillStyle = "blue";
  context.fill();

  context.beginPath();
  context.arc(937, 555, 4, 0, 2 * Math.PI);
  context.fillStyle = "blue";
  context.fill();

  context.beginPath();
  context.arc(963, 555, 4, 0, 2 * Math.PI);
  context.fillStyle = "blue";
  context.fill();

  context.fillStyle = "black";
  context.fill();
  context.fillText("🥁", 950, 565);

  context.font = "30px Arial";

  context.fillStyle = "black";
  context.fill();
  context.fillText("🍩", 30, 580);


  context.font = "15px Arial";
  context.textAlign = "center";

  for (var id in players) {
    var player = players[id];

  if(player.kick === true){
    context.beginPath();
    context.arc(player.x, player.y, 14, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();

    context.setTransform(1, 0, 0, 1, player.x, player.y);


    context.rotate(Math.atan2(player.mouseY - player.y, player.mouseX - player.x));

    context.beginPath();
    context.arc(0 + player.emoteHeight, -15, 8, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();

    context.beginPath();
    context.arc(0 + player.emoteHeight, 15, 8, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();

    context.setTransform(1, 0, 0, 1, 0, 0);
  }



    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fillStyle = player.color;
    context.fill();

    context.setTransform(1, 0, 0, 1, player.x, player.y);


    context.rotate(Math.atan2(player.mouseY - player.y, player.mouseX - player.x));

    context.beginPath();
    context.arc(0 + player.emoteHeight, -15, 4, 0, 2 * Math.PI);
    context.fillStyle = player.color;
    context.fill();

    context.fillStyle = player.color;
    context.fill();
    context.beginPath();
    context.arc(0 + player.emoteHeight, 15, 4, 0, 2 * Math.PI);

    

    if(player.item === "donut" || player.interact && player.y > 570 && player.x < 30 && player.item === ""){
      player.item = "donut";
      context.fillText("🍩", 0 + player.emoteHeight, -15);
      }

    context.setTransform(1, 0, 0, 1, 0, 0);

    context.fillStyle = "black";
    context.fill();
    context.fillText(player.name, player.x, player.y-15);
    
  }

  context.beginPath();
  context.arc(mouseX, mouseY, 1, 0, 2 * Math.PI);
  context.fillStyle = "black";
  context.fill();
});



setInterval(function () {
  playerData.mouseX = mouseX;
  playerData.mouseY = mouseY;
  socket.emit("playerData", playerData);
}, 1000 / 60);

