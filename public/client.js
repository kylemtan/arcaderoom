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
  mouseX = mouse.x-4;
  mouseY = mouse.y-3;
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
};



document.addEventListener("keydown", function (event) {
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



var svg = document.getElementById("svg");
var NS = "http://www.w3.org/2000/svg";

socket.on("state", function (data) {
  while (svg.lastChild) {
    svg.removeChild(svg.lastChild);
}



var tiles = document.getElementsByClassName("danceFloor");
for (var e = 0; e < 9; e++){
  tiles[e].style.fill = getRandomColor();
}






  for (var id in data.players) {
    var player = data.players[id];

  var rotateNumber = Math.atan2(player.mouseX - player.x, player.mouseY - player.y);
  var degrees = rotateNumber * (180 / Math.PI) * -1 + 90;

  if(player.kick === true){
    var kickBody = document.createElementNS(NS, "circle");
    kickBody.setAttribute("cx", player.x);
    kickBody.setAttribute("cy", player.y);
    kickBody.setAttribute("r", 14);
    kickBody.setAttribute("fill", "white");
    svg.appendChild(kickBody);

    var kickHand1 = document.createElementNS(NS, "circle");
    kickHand1.setAttribute("cx", player.x + player.emoteHeight);
    kickHand1.setAttribute("cy", player.y - 15);
    kickHand1.setAttribute("r", 8);
    kickHand1.setAttribute("fill", "white");
    kickHand1.setAttribute("transform", "rotate(" + degrees + " " + player.x + " " + player.y + ")");
    svg.appendChild(kickHand1);

    var kickHand2 = document.createElementNS(NS, "circle");
    kickHand2.setAttribute("cx", player.x + player.emoteHeight);
    kickHand2.setAttribute("cy", player.y + 15);
    kickHand2.setAttribute("r", 8);
    kickHand2.setAttribute("fill", "white");
    kickHand2.setAttribute("transform", "rotate(" + degrees + " " + player.x + " " + player.y + ")");
    svg.appendChild(kickHand2);
  }



  var body = document.createElementNS(NS, "circle");
  body.setAttribute("cx", player.x);
  body.setAttribute("cy", player.y);
  body.setAttribute("r", 10);
  body.setAttribute("fill", player.color);
  svg.appendChild(body);

  var hand1 = document.createElementNS(NS, "circle");
  hand1.setAttribute("cx", player.x + player.emoteHeight);
  hand1.setAttribute("cy", player.y - 15);
  hand1.setAttribute("r", 4);
  hand1.setAttribute("fill", player.color);
  hand1.setAttribute("transform", "rotate(" + degrees + " " + player.x + " " + player.y + ")");
  svg.appendChild(hand1);

  var hand2 = document.createElementNS(NS, "circle");
  hand2.setAttribute("cx", player.x + player.emoteHeight);
  hand2.setAttribute("cy", player.y + 15);
  hand2.setAttribute("r", 4);
  hand2.setAttribute("fill", player.color);
  hand2.setAttribute("transform", "rotate(" + degrees + " " + player.x + " " + player.y + ")");
  svg.appendChild(hand2); 

  var items = data.items;
    if(player.interact && player.y > 500 && player.x < 100){
      socket.emit("giveDonut", player.name);
    }
    if(player.kick){
      socket.emit("takeDonut", player.name);
    }
    for(var e = 0; e < items.length; e++){
    if(items[e] === player.name){
      var donut = document.createElementNS(NS, "text");
      donut.setAttribute("x", player.x + player.emoteHeight);
      donut.setAttribute("y", player.y - 15);
      var donutFinal = document.createTextNode("🍩");
      donut.appendChild(donutFinal);
      svg.appendChild(donut);
    }
  }



      var name = document.createElementNS(NS, "text");
      name.setAttribute("x", player.x);
      name.setAttribute("y", player.y-11);
      name.setAttribute("id", player.name);
      var nameFinal = document.createTextNode(player.name);
      name.appendChild(nameFinal);
      svg.appendChild(name);
      var nameTemp = document.getElementById(player.name)
      var resizeMiddle = nameTemp.getBBox();
      svg.removeChild(nameTemp);
      name.setAttribute("x", player.x - resizeMiddle.width/2);
      svg.appendChild(name);
  }
});



setInterval(function () {
  playerData.mouseX = mouseX;
  playerData.mouseY = mouseY;
  socket.emit("playerData", playerData);
}, 1000 / 60);

