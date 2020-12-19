// Now John at the bar is a friend of mine
// He gets me my drinks for free
// And he's quick with a joke or to light up your smoke
// But there's someplace that he'd rather be

// REVISIONS:
//  10/18/20 - Cleanup

var quickCodes = {
  "12": ["DES", "Design"],
  "16": ["DES REV", "Design Review"],
  "13": ["DEV", "Development"],
  "14": ["PQA", "PQA"],
  "50337": ["DEV SUPP", "Dev. Support (Internal)"],
  "13279": ["QAN INV", "QAN Investigation"],
  "39509": ["PERF", "Perf. Testing"],
  "11457": ["RN REV", "Release Note Review"],
  "20273": ["DEV SET", "Dev. System Setup"],
  "119": ["WRKPLN", "Workplan"],
  "3048": ["TRVL", "Travel Time"],
  "949": ["FLR SUP", "Go-Live Floor Support"],
  "154": ["TRN", "Training"],
  "808": ["MENT", "Mentoring"],
  "7091": ["MTNG", "Meetings"],
  "2527": ["1TO1", "Team Member 1-to-1"]
};

// If there's anything in the grid and the day isn't finished, make sure they actually wanna close the tab!
window.onbeforeunload = function(ev) {
  return true;
}

/**
 * Click event handler for the quick Code plus buttons.
 * Adds a Code to the grid with no description.
 */
function quickAddCode(ev)
{
  if (dayCalled) { return; }
  
  if (!ev || !ev.target) { return; }
  
  var row = ev.target;
  while (row.nodeName !== "TR")
  {
    row = row.parentNode;
  }
  
  var codeID = row.childNodes[1].innerText;
  var desc = getQuickCode(codeID, true);
  
  saveCode(codeID, desc, "");
  endBreak();
}

/**
 *
 */
function processDomContentLoaded()
{
  loadQuickCodesIntoDOM();
  
  var bufferField = document.getElementById("buffer");
  if (bufferField)
  {
    bufferField.addEventListener("keydown", validateNumeric);
  }
}

/**
 *
 */
function validateNumeric(ev)
{
  if (!ev || !ev.key)
    return;
  
  var bufferField = ev.target;
  var numericText = bufferField.value + ev.key;
  var numericValue = parseFloat(numericText);
  if (isNaN(numericValue))
  {
    alert("Invalid key entered; start buffer should be an integer or decimal value.");
    ev.preventDefault();
    return;
  }
}

/**
 *
 */
function getStartBufferValue()
{
  var bufferField = document.getElementById("buffer");
  if (bufferField)
  {
    var numericValue = parseFloat(bufferField.value);
    if (!isNaN(numericValue))
    {
      return numericValue;
    }
  }
  return 0;
}

/**
 * Load-process run function to create a table of quick-add Codes.
 */
function loadQuickCodesIntoDOM()
{
  var table = document.getElementById("commoncodes");
  if (!table) { return; }
  
  var codeID, tr, td;
  for (codeID in quickCodes)
  {
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.className = "add";
    td.innerHTML = plusSVG();
    td.addEventListener("click", quickAddCode);
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.style.fontSize = "12px";
    td.innerText = codeID;
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.style.fontSize = "12px";
    td.innerText = getQuickCode(codeID);
    tr.appendChild(td);
    
    table.appendChild(tr);
  }
}

/**
 *
 */
function getQuickCode(codeID, fullName)
{
  var codeObj = quickCodes[codeID];
  if (!codeObj) return "";
  
  if (fullName)
    return codeObj[1];
  else
    return codeObj[0];
}

/**
 * The raw SVG markup for a green plus sign.
 */
function plusSVG()
{
  return "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'><g><polygon points='140,60 100,60 100,20 60,20 60,60 20,60 20,100 60,100 60,140 100,140 100,100 140,100 '></polygon></g></svg>"
}

/**
 *
 */
function saveLine()
{
  var curcode = document.getElementById("code");
  var curcomm = document.getElementById("comm");
  var codeID = curcode.value;
  var comm = curcomm.value;
  
  var desc = getQuickCode(codeID, true);
  
  if (codeID === "" && comm === "") // quit if not all data entered
  {
    alert("Either a Code or Comment is needed!");
    return;
  }
    
  saveCode(codeID, desc, comm);
  
  curcode.value = "";
  curcomm.value = "";
  
  endBreak();
}

/**
 * Helper function to:
 * - Add a new line to the grid
 * - Save the last Code to the background data structure
 */
function saveCode(code, desc, comm, isBreak)
{
  code = code || "-";
  
  var timeEnded = getNumericResetTime();
  if (timeStarted > 0) // fill the last cell
    updateLastCell(timeEnded);
  timeStarted = timeEnded;
  
  var table = document.getElementById("timetable");
  var row = table.insertRow(-1);
  
  if (isBreak)
  {
    var cell = row.insertCell();
    cell.colSpan = "3";
    cell.classList.add("break");
    cell.innerHTML = "Break";
    cell.className = "erb_cell";
    cell.id = "lastcode";
  }
  else
  {
    // code cell
    var cell = row.insertCell();
    cell.innerHTML = code;
    cell.id = "lastcode";
    cell.className = "erb_cell";

    // description cell
    cell = row.insertCell();
    cell.innerHTML = desc;
    cell.className = "erb_cell";

    // comments cell
    cell = row.insertCell();
    var commInput = document.createElement("input");
    commInput.dataset.code = code; // Custom property
    commInput.classList.add("codeComm");
    commInput.classList.add("disableme");
    commInput.value = comm;
    cell.appendChild(commInput);
    cell.className = "erb_cell";
  }
  
  // start time cell
  cell = row.insertCell();
  cell.innerHTML = getLocaleTimeString();
  cell.className = "erb_cell";
  
  // time spent cell
  cell = row.insertCell();
  cell.id = "timespent";
  cell.innerHTML = 0;
  cell.className = "erb_cell";
  
  // subtotal cell
  cell = row.insertCell();
  cell.id = "subtotal";
  cell.innerHTML = "-";
  cell.className = "erb_cell";
}

/**
 * Helper function to reset the timer to 'now' and then get the current numeric base-10 time
 * for easier calculations of time spent doing tasks.
 * 
 * For example, 5:30PM returns 17.5
 *
 * So then 5:30PM - 2:15PM -> 17.5 - 14.25 = 3.25 hours!
 * See how easy that was?
 */
function getNumericResetTime()
{
  timerDateObj = new Date();
  return timerDateObj.getHours() + (timerDateObj.getMinutes() / 60);
}

/**
 * Wrapper around getting the locale time string of the global date
 * object for display to the end-user.
 */
function getLocaleTimeString()
{
  return timerDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

/**
 *
 */
function finish()
{
  var atTime = document.getElementById("atTime");
  atTime.innerText = "@ " + getLocaleTimeString();
  
  var timeEnded = getNumericResetTime();
  updateLastCell(timeEnded);
  
  var totals = document.getElementById("totals");
  totals.classList.remove("nodisp");
  
  // Get all comments
  var codeComments = aggregateCodeComments();
  
  // Populate table totals
  var row,cell;
  var table = document.getElementById("totaltable");
  var total = 0;
  for (var codeID in codeMap)
  {
    row = table.insertRow();
    addTotalCell(row, codeID);
    addTotalCell(row, getQuickCode(codeID, true));
    addTotalCell(row, codeComments[codeID]);
    var time = codeMap[codeID];
    addTotalCell(row, time);
    total = total + time;
  }
  
  // Start buffer
  var startBuffer = getStartBufferValue();
  total = total + startBuffer;
  
  row = table.insertRow();
  var cell = addTotalCell(row, "Start Buffer");
  cell.colSpan = "3";
  addTotalCell(row, startBuffer);
  
  // Total total at the bottom of the total table
  row = table.insertRow();
  var cell = addTotalCell(row, "Grand Total");
  cell.colSpan = "3";
  cell.style.fontWeight = 600;
  addTotalCell(row, total);
  
  // Disable the controls
  dayCalled = true;
  var disables = document.getElementsByClassName("disableme");
  for(var i = 0; i < disables.length; i++)
    disables[i].disabled = true;
}

/**
 *
 */
function addTotalCell(row, data)
{
  var cell = row.insertCell();
  cell.innerHTML = data;
  return cell; // in case we want to do anything with the cell
}

/**
 *
 */
function updateLastCell(timeEnded)
{
  var cell, rounded;

  // time spent cell
  cell = document.getElementById("timespent");
  rounded = round(timeEnded - timeStarted);
  cell.innerHTML = rounded;
  cell.id = "";
  
  // subtotal cell
  cell = document.getElementById("subtotal");
  subtotal += rounded;
  cell.innerHTML = round(subtotal);
  cell.id = "";
  
  // update data array
  cell = document.getElementById("lastcode");
  var code = cell.innerHTML;
  addToTotals(code, rounded);
  cell.id = "";
}

/**
 *
 */
function addToTotals(code, rounded)
{
  if (code === "Break")
    return;
  
  // see if the Code exists
  if (!codeMap[code])
    codeMap[code] = rounded;
  else
    codeMap[code] += rounded;
}

/**
 *
 */
function round(num)
{
  var rounded = num;
  rounded = rounded * 100; // to round the number to the nearest hundredth place
  rounded = rounded - (rounded % 1);
  rounded = rounded / 100;
  return rounded;
}

/**
 *
 */
function aggregateCodeComments()
{
  var codeComms = {};
  var inputs = document.getElementsByClassName("codeComm");
  
  for (var i in inputs)
  {
    var input = inputs[i];
    if (!input || !input.dataset) continue;
    var code = input.dataset.code;
    if (!code) continue;
    
    if (!codeComms[code]) codeComms[code] = input.value;
    else codeComms[code] = codeComms[code] + "<br/>" + input.value;
  }
  
  return codeComms;
}

///////////////////////////
///////////////////////////
// BREAK START/STOP
///////////////////////////
///////////////////////////

/**
 *
 */
function pause()
{
  saveCode("","","",true);  
  
  // start break
  var btnPause = document.getElementById("pause");
  btnPause.setAttribute("disabled", true);
  
  var btnUnpause = document.getElementById("unpause");
  btnUnpause.removeAttribute("disabled");
}

/**
 *
 */
function unpause()
{
  getPreBreakCode();
  endBreak();
}

/**
 *
 */
function getPreBreakCode()
{
  var table = document.getElementById("timetable");
  if (table.rows.length < 2) { return; } // Sanity check
  var lastRow = table.rows[table.rows.length - 2];
  var codeCell = lastRow.cells[0];
  
  var code = codeCell.innerText;
  var desc = getQuickCode(code, true);
  saveCode(code);
}

/**
 *
 */
function endBreak()
{  
  var btnUnpause = document.getElementById("unpause");
  if (btnUnpause.hasAttribute("disabled"))
  {
    return;
  }  
  btnUnpause.setAttribute("disabled", true);
  
  var btnPause = document.getElementById("pause");
  btnPause.removeAttribute("disabled");
}

///////////////////////////
///////////////////////////
// SCRIPT START
///////////////////////////
///////////////////////////

document.addEventListener("DOMContentLoaded", processDomContentLoaded);

var timerDateObj;
var dayCalled = false;
var timeStarted = 0;
var subtotal = 0;
var codeMap = [];