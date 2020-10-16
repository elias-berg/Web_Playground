// Global Variables
var shineCnt = 0;
var blueCoinCnt = 0;
var shineMap = {};
var blueCoinMap = {};

// Element Handles
var menu;
var shineCounter;
var blueCoinCounter;
var input_file;
var output_file;
var helpbox;

// Timers
var helptimer;
var hidetimer;

// Once loaded, initialize the element-based variables and event listeners
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", hideMenu);
  
  menu = document.getElementById("menu_div");
  shineCounter = document.getElementById("counter");
  blueCoinCounter = document.getElementById("bc-counter");
  input_file = document.getElementById("input_file");
  output_file = document.getElementById("output_file");
  helpbox = document.getElementById("helpbox");
  
  // Helpbox mouse listeners; prevent hiding if the mouse is moving over it
  helpbox.addEventListener("mouseover", resetHideTimer);
  helpbox.addEventListener("mousemove", resetHideTimer);

  // Shine checkbox click listeners
  var i;
  var checkboxes = document.getElementsByClassName("checkbox");
  for (i = 0; i < checkboxes.length; i++)
  {
    checkboxes[i].addEventListener("click", shineChecked);
  }
  
  // Blue coin checkbox click listeners
  checkboxes = document.getElementsByClassName("bc_checkbox");
  for (i = 0; i < checkboxes.length; i++)
  {
    checkboxes[i].addEventListener("click", blueCoinChecked);
    checkboxes[i].addEventListener("contextmenu", showHint);
  }
});

// Menu Code
function showMenu()
{
  var menuActive = !menu.classList.contains("nodisp");
  if (menuActive) // Menu is showing
  {
    menu.classList.add("nodisp");
  }
  else // Menu is hidden
  {
    menu.classList.remove("nodisp");
  }
}

function hideMenuWrapper()
{
  if (menu.classList.contains("nodisp")) { return; }
  menu.classList.add("nodisp");
}

function hideMenu(event)
{
  if (!event || !event.target) { return; } // Sanity check
  if (menu.classList.contains("nodisp")) { return; }
  
  var rect = menu.getBoundingClientRect();
  
  if (event.clientX > rect.right)
  {
    hideMenuWrapper();
  }
}

function goTo(id)
{
  if (!id) { return; }
  
  var elem = document.getElementById(id);
  if (!elem) { return; }
  
  elem.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
  
  hideMenuWrapper();
}

// Shine Checkboxes
function shineChecked(event)
{
  var elem = event.target;
  
  if (!elem.style.backgroundImage)
  {
    elem.style.backgroundImage = 'url("img/check.png")';
    shineCounter.innerText = ++shineCnt;
    shineMap[elem.id] = 1;
  }
  else
  {
    elem.style.backgroundImage = '';
    shineCounter.innerText = --shineCnt;
    delete shineMap[elem.id];
  }
}

// Blue Coins Checkboxes
function blueCoinChecked(event)
{
  var elem = event.target;
  
  if (!elem.style.backgroundImage)
  {
    elem.style.backgroundImage = 'url("img/bccheck.png")';
    blueCoinCounter.innerText = ++blueCoinCnt;
    blueCoinMap[elem.id] = 1;
  }
  else
  {
    elem.style.backgroundImage = '';
    blueCoinCounter.innerText = --blueCoinCnt;
    delete blueCoinMap[elem.id];
  }
}

// Blue Coins Hints
function showHint(event)
{
  event.preventDefault(); // Don't show a right-click menu
  
  var elem = event.target;
  if (!elem) { return; }
  
  var hint = blue_coin_hints[elem.id]; // Hint to display
  helpbox.innerText = hint;
  
  // Reset the timers and help box opacity (if it was on it's way to hiding).
  resetHideTimer();
}

function resetHideTimer()
{
  if (helptimer) // If waiting to hide, then reset the timer
  {
    clearTimeout(helptimer);
    helptimer = null;
  }
  if (hidetimer) // If currently hiding, then clear it since we're about to restart
  {
    clearInterval(hidetimer);
    hidetimer = null;
  }
  
  helpbox.parentElement.style.opacity = 1.0;
    
  // Start hiding after 5 seconds
  helptimer = setTimeout(hideHint, 5000);
}

function hideHint()
{
  helptimer = null;
  hidetimer = setInterval(hideHintHelper, 50);
}
 
function hideHintHelper()
{
  var helpbox = document.getElementById("helpbox");
  if (!helpbox) { return; }
  
  var parentElem = helpbox.parentElement;
  if (!parentElem) { return; }
  
  // Either progress the hiding effect or end the effect altogether if
  // the box is no longer visible
  if (parentElem.style.opacity > 0.0)
  {
    parentElem.style.opacity = parentElem.style.opacity - 0.05;
  }
  else
  {
    clearInterval(hidetimer);
    hidetimer = null;
  }
}

// Loading Checklist File
function loadFile()
{
  input_file.click();
}

function parseFile()
{
  var file = input_file.files[0];
  readFile(file);
}

function readFile(file)
{
  var reader = new FileReader();
  
  reader.onload = function() {
    clearAll();
    processData(JSON.parse(reader.result));
  }
  
  reader.readAsText(file);
  
  hideMenuWrapper(); // Hide menu when done
}

function processData(data)
{
  if (!data) { return; }
  
  var i, id, checkbox;

  var shines = data.shines;
  if (shines)
  {
    for (i = 0; i < shines.length; i++)
    {
      id = shines[i];
      checkbox = document.getElementById(id);
      if (!checkbox) continue;
      shineChecked({ target: checkbox });
    }
  }
  
  var coins = data.coins;
  if (coins)
  {
    for (i = 0; i < coins.length; i++)
    {
      id = coins[i];
      checkbox = document.getElementById(id);
      if (!checkbox) continue;
      blueCoinChecked({ target: checkbox });
    }
  }
}

// Saving Checklist File
function saveFile()
{
  var data = serializeData();
  var file = new Blob([data], {type: 'text/plain'});
  var url = URL.createObjectURL(file);
  output_file.href = url;
  output_file.click();
  
  hideMenuWrapper(); // Hide menu when done
}

function serializeData()
{
  var data = {};
  var id;
  
  // Shines
  data["shines"] = [];
  for (id in shineMap)
  {
    data["shines"].push(id);
  }
  
  // Blue Coins
  data["coins"] = [];
  for (id in blueCoinMap)
  {
    data["coins"].push(id);
  }
  
  return JSON.stringify(data);
}

// Utility Functions
function clearAll()
{
  var id, elem;
  
  for (id in shineMap)
  {
    elem = document.getElementById(id);
    shineChecked({ target: elem });
  }
  for (id in blueCoinMap)
  {
    elem = document.getElementById(id);
    blueCoinChecked({ target: elem });
  }
}