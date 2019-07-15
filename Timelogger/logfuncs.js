//Now John at the bar is a friend of mine
//He gets me my drinks for free
//And he's quick with a joke or to light up your smoke
//But there's someplace that he'd rather be

var DATE;
var curtime = 0;
var subtotal = 0;
var tlpMap = [];

function saveLine()
{
  var curtlp = document.getElementById("tlp");
  var curdesc = document.getElementById("desc");
  var tlp = curtlp.value;
  var desc = curdesc.value;
  
  if (tlp === "") // quit if not all data entered
    return;
  
  var cur = dateInfo();
  if (curtime > 0) // fill the last cell
    updateLastCell(cur);
  curtime = cur;
  
  var table = document.getElementById("timetable");
  var row = table.insertRow(-1);
  
  // tlp cell
  var cell = row.insertCell();
  cell.innerHTML = tlp;
  cell.id = "lasttlp";
  cell.className = "erb_cell";
  
  // description cell;
  cell = row.insertCell();
  cell.innerHTML = desc;
  cell.className = "erb_cell";
  
  // start time cell
  cell = row.insertCell();
  cell.innerHTML = DATE.getHours() + ":" + DATE.getMinutes();
  cell.className = "erb_cell";
  
  // end time cell
  cell = row.insertCell();
  cell.id = "endtime";
  cell.innerHTML = 0;
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
  
  curtlp.value = "";
  curdesc.value = "";
}

function dateInfo()
{
  DATE = new Date();
  return DATE.getHours() + (DATE.getMinutes() / 60);
}

function finish()
{
  var cur = dateInfo();
  updateLastCell(cur);
  
  var totals = document.getElementById("totals");
  totals.style.display = 'block';
  
  // Populate table totals
  var row,cell;
  var table = document.getElementById("totaltable");
  var total = 0;
  for (var tlp in tlpMap)
  {
    row = table.insertRow();
    addERBCell(row, tlp);
    addERBCell(row, "Not Implemented");
    var time = tlpMap[tlp];
    addERBCell(row, time);
    total = total + time;
  }
  
  // Total total at the bottom of the total table
  row = table.insertRow();
  var cell = addERBCell(row, "Total");
  cell.colSpan = "2";
  addERBCell(row, total);
  
  // Disable the controls
  var disables = document.getElementsByClassName("disableme");
  for(var i = 0; i < disables.length; i++)
    disables[i].disabled = true;
}

function addERBCell(row, data)
{
  var cell = row.insertCell();
  cell.innerHTML = data;
  cell.className = "erb_cell";
  return cell; // in case we want to do anything with the cell
}

function getFormattedTime()
{
  var hour = "" + DATE.getHours();
  if (hour.length === 1) hour = "0" + hour;
  
  var minute = "" + DATE.getMinutes();
  if (minute.length === 1) minute = "0" + minute;
  
  return hour + ":" + minute;
}

function updateLastCell(cur)
{
  var cell, rounded;
  
  // end time cell
  cell = document.getElementById("endtime");
  if (!cell)
    return;
  cell.innerHTML = getFormattedTime();
  cell.id = "";

  // time spent cell
  cell = document.getElementById("timespent");
  rounded = round(cur - curtime);
  cell.innerHTML = rounded;
  cell.id = "";
  
  // subtotal cell
  cell = document.getElementById("subtotal");
  subtotal += rounded;
  cell.innerHTML = round(subtotal);
  cell.id = "";
  
  // update data array
  cell = document.getElementById("lasttlp");
  var tlp = cell.innerHTML;
  addToTotals(tlp, rounded);
  cell.id = "";
}

function addToTotals(tlp, rounded)
{
  // see if the TLP exists
  if (!tlpMap[tlp])
    tlpMap[tlp] = rounded;
  else
    tlpMap[tlp] += rounded;
}

function round(num)
{
  var rounded = num;
  rounded = rounded * 100; // to round the number to the nearest hundredth place
  rounded = rounded - (rounded % 1);
  rounded = rounded / 100;
  return rounded;
}