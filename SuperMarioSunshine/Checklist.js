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

// Once loaded, initialize the element-based variables and event listeners
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", hideMenu);
  
  menu = document.getElementById("menu_div");
  shineCounter = document.getElementById("counter");
  blueCoinCounter = document.getElementById("bc-counter");
  input_file = document.getElementById("input_file");
  output_file = document.getElementById("output_file");

  var i;
  var checkboxes = document.getElementsByClassName("checkbox");
  for (i = 0; i < checkboxes.length; i++)
  {
    checkboxes[i].addEventListener("click", shineChecked);
  }
  
  checkboxes = document.getElementsByClassName("bc_checkbox");
  for (i = 0; i < checkboxes.length; i++)
  {
    checkboxes[i].addEventListener("click", blueCoinChecked);
    checkboxes[i].addEventListener("mouseenter", showHint);
    checkboxes[i].addEventListener("mouseleave", hideHint);
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

function showHint(event)
{
  var elem = event.target;
  if (!elem) { return; }
  
  var id = elem.id;
  var stage = id.substring(0, 2);
  console.log(stage);
  var helpbox = document.getElementById(stage + "_help");
  helpbox.innerText = blue_coin_hints[id];
}

function hideHint(event)
{
  var elem = event.target;
  if (!elem) { return; }
  
  var id = elem.id;
  var stage = id.substring(0, 2);
  var helpbox = document.getElementById(stage + "_help");
  helpbox.innerText = "Hover over a blue coin to show a hint.";
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