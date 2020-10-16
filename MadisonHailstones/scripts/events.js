/**
 *
 */

// Reference to left side to list events
var eventList = document.getElementById("eventList");

// First, let's create the calendar
var calendar = new Calendar();
calendar.generateCalendar("calendar");

// Now let's parse through the events
var request = new XMLHttpRequest();
request.open("GET", "Events.json", false);
request.send(null);
var data = JSON.parse(request.responseText);

if (data.Events)
{  
  for (var ev in data.Events)
  {
    // Add to the calendar
    calendar.addEvent(ev, data.Events[ev]);
  }
}
else
{
  alert("Could not read events.");
}