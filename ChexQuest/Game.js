// State variables
var fps = 10;
var animationFrame = 0;
var prevDirKey = "SHD";
var dirKey = "SHD"; // Shoot-down
var ox = 0;
var oy = 0;
var px = 0;
var py = 0;
var moveDist = 10;
var fredSrc = "assets/fred.png";

var fred = new Image();
fetch("fred.json")
  .then(response => response.json())
  .then(json => {
    fredMap = json;

    // Fred Chexter
    fred.addEventListener(
      "load",
      () => {
        doDraw();
        gameLoop();
      },
      false
    );
    fred.src = fredSrc;
  });

var keyState = {};    
window.addEventListener('keydown',function(e){
    keyState[e.key] = true;
},true);    
window.addEventListener('keyup',function(e){
    keyState[e.key] = false;
},true);

// Shamelessly ripped off StackOverflow
function gameLoop() {
  prevDirKey = dirKey;
  let key1 = "";
  let key2 = "";
  if (keyState["ArrowLeft"]){
    px -= moveDist;
    key2 = "L";
  }
  if (keyState["ArrowUp"]){
    py -= moveDist;
    key1 = "U";
  }
  if (keyState["ArrowRight"]){
    px += moveDist;
    key2 = "R";
  }
  if (keyState["ArrowDown"]){
    py += moveDist;
    key1 = "D";
  }

  dirKey = key1 + key2 || "SHD";
  //console.log(dirKey);
  if (dirKey == prevDirKey) {
    animationFrame++;
  } else {
    animationFrame = 0;
  }
  requestAnimationFrame(doDraw);

  setTimeout(gameLoop, 1000 / fps);
}

// Drawing logic
function doDraw() {
  // First, clear the screen
  ctx.clearRect(0, 0, gameview.width, gameview.height);

  var w = 60;
  var h = 60;

  // Redraw based on new info
  animationFrame = animationFrame % fredMap[dirKey].length;
  var curFred = fredMap[dirKey][animationFrame];
  var x = curFred["x"];
  var y = curFred["y"];
  var w = curFred["w"];
  var h = curFred["h"];
  ctx.drawImage(fred, x, y, w, h, ox + px, oy + py, w, h);
}

///////////////////
// Main game script

var gameview = document.getElementById("gameview");
gameview.width = window.innerWidth;
gameview.height = window.innerHeight;
ox = gameview.width / 2;
oy = gameview.height / 2;

var ctx = gameview.getContext("2d");
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;