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
  }
  
  //var epTxts = document.getElementsByClassName("ep");
  //for (i = 0; i < epTxts.length; i++)
  //{
  //  epTxts[i].toolTip = "This blue coin is available starting with Episode " + epTxts[i].innerText;
  //}
});

// Menu Code
function showMenu()
{
  var menuActive = !menu.classList.contains("nodisp");
  if (menuActive)
  {
    menu.classList.add("nodisp");
  }
  else
  {
    menu.classList.remove("nodisp");
  }
}

function hideMenu(event)
{
  if (!event || !event.target) { return; } // Sanity check
  if (menu.classList.contains("nodisp")) { return; }
  
  var rect = menu.getBoundingClientRect();
  
  if (event.clientX > rect.right)
    menu.classList.add("nodisp");
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

  if (!menu.classList.contains("nodisp"))
    menu.classList.add("nodisp");
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

// Loading Checklist File
function loadFile()
{
  input_file.click();
}

function parseFile()
{
  var file = input_file.files[0];
  var reader = new FileReader();
  
  reader.onload = function() {
    clearAll();
    processData(JSON.parse(reader.result));
  }
  
  reader.readAsText(file);
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