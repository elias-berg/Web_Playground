function Calendar() {}

Calendar.prototype =
{
  /**
   * The day this code is being run.
   */
  initialDate: -1,
  
  /**
   * The month this code is being run.
   */
  initialMonth: -1,
  
  /**
   * The month this code is being run.
   */
  initialYear: -1,
  
  /**
   * The month that the calendar is currently showing.
   */
  currentMonth: -1,
  
  /**
   * The year that the calendar is currently showing.
   */
  currentYear: -1,
  
  /**
   * Cached events by month.
   * Each first key is the month, followed by event name.
   * cachedEventByMonth[<Month #>] = Array of event objects
   */
  cachedEventByMonth: {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
  },
  
  /**
   * The actual calendar element.
   */
  calendar: null,
  
  /**
   * PUBLIC
   *
   * Creates the calendar table within the given parent element.
   * 
   * @param parentID (String) - Parent element ID for the calendar.
   */
  generateCalendar: function(parentID)
  {
    if (!parentID) { return; }
    var parentElem = document.getElementById(parentID);
    if (!parentElem) { return; }    
    
    this.calendar = document.createElement("table");
    
    // Get the date of creation of this calendar
    var date = new Date();
    this.initialDate = date.getDate();
    this.initialMonth = date.getMonth();
    this.initialYear = date.getFullYear();
    
    // Generate the month cells for this month
    date.setDate(1);
    this.generateMonth(date);
    
    // And finally add to the parent
    parentElem.appendChild(this.calendar);
  },
  
  /**
   * PRIVATE
   *
   * Generates the week day header rows.
   */
  generateHeader: function()
  {
    var headerDate, week, day, i;
    
    // Set the date to the first Sunday of the month
    headerDate = new Date();
    headerDate.setDate(1);
    headerDate.setDate(8 - headerDate.getDay());
    
    // Now generate locale-friendly header cells
    week = document.createElement("tr");
    for (i = 0; i < 7; i++)
    {
      day = document.createElement("th");
      day.classList.add("dayofweek"); // Text formatting class
      day.innerText = headerDate.toLocaleString(window.navigator.language, {weekday: 'long'});
      
      week.appendChild(day);
      headerDate.setDate(headerDate.getDate() + 1);
    }
    // Don't forget to add to the calendar table!
    this.calendar.appendChild(week);
  },
  
  /**
   * PRIVATE
   *
   */
  generateCaption: function(monthText)
  {    
    var caption = document.createElement("caption");
    caption.classList.add("sectiontitle");
    caption.innerText = monthText;
    
    var right = document.createElement("div");
    right.style.float = "right";
    right.classList.add("monthtoggle");
    right.addEventListener("click", this.nextMonth.bind(this));
    right.innerText = String.fromCharCode(0x2B9E);
    caption.appendChild(right);
    
    var left = document.createElement("div");
    left.style.float = "left";
    left.classList.add("monthtoggle");
    left.addEventListener("click", this.prevMonth.bind(this));
    left.innerText = String.fromCharCode(0x2B9C);
    caption.appendChild(left);
    
    this.calendar.appendChild(caption);
  },
  
  /**
   * PRIVATE
   *
   */
  prevMonth: function()
  {
    var date = new Date();
    date.setDate(1);
    date.setFullYear(this.currentYear);
    date.setMonth(this.currentMonth - 1);
    this.calendar.innerHTML = "";
    this.generateMonth(date);
  },
  
  /**
   * PRIVATE
   *
   */
  nextMonth: function()
  {
    var date = new Date();
    date.setDate(1);
    date.setFullYear(this.currentYear);
    date.setMonth(this.currentMonth + 1);
    this.calendar.innerHTML = "";
    this.generateMonth(date);
  },
  
  /**
   * PRIVATE
   *
   * Generates the entire calendar table; month caption, week day headers,
   * and every day of the month.
   */
  generateMonth: function(date)
  {
    var firstDay, week, i, dayNum, dayText, month, day, today;
    
    // Generate the caption
    this.generateCaption(date.toLocaleString("en-US", { month: 'long', year: 'numeric' }));
    
    // Generate the headers
    this.generateHeader();
    
    // Generate the pre-month cells
    firstDay = date.getDay();
    week = document.createElement("tr");
    for (i = 0; i < firstDay; i++)
    {
      week.appendChild(document.createElement("td"));
    }
    
    // Set calendar-level variables
    this.currentMonth = date.getMonth();
    this.currentYear = date.getFullYear();
    
    // Generate the month's cells
    dayNum = 1;
    while (date.getMonth() === this.currentMonth)
    {
      if (date.getDay() === 0)
      {
        this.calendar.appendChild(week);
        week = document.createElement("tr");
      }
      
      day = document.createElement("td");
      day.classList.add("dayofmonth");
      day.id = dayNum;
      
      dayText = document.createElement("p");
      dayText.innerText = "" + dayNum;
      dayText.classList.add("daytext");
      day.appendChild(dayText);
      
      // Apply a special class to the current day in the calendar
      if (this.currentYear === this.initialYear && this.currentMonth === this.initialMonth && dayNum === this.initialDate)
      {
        day.classList.add("today");
      }
      
      week.appendChild(day);
      
      dayNum++;
      date.setDate(dayNum);
    }
    this.calendar.appendChild(week);
    
    // Let's display any cached events
    this.displayCachedEventsFor(this.currentMonth);
  },
  
  /**
   * PUBLIC
   *
   * Adds events to the current month's view and caches non-visible events to display
   * in case the month is toggled to a different month.
   *
   * TODO: incorporate recurring events/end date
   */
  addEvent: function(name, eventObj)
  {
    if (!eventObj) return;
    
    var start = eventObj.start;
    if (!start || start.length < 1) return;
    
    var startDate = new Date(start);
    if (!startDate) return;
    
    // Cache the event!
    eventObj.name = name; // Need to store off the name for future-reference
    var startMonth = startDate.getMonth();
    this.cachedEventByMonth[startMonth].push(eventObj);
    this.displayEvent(name, eventObj);
    
    // Calculate recurring events
    var end = eventObj.end;
    if (end && end.length > 0)
    {
      const endDate = new Date(end);
      var recurDate = new Date(start)
      recurDate.setDate(recurDate.getDate() + 7);
      
      while (!this.afterTargetDate(recurDate, endDate))
      {
        var recurMonth = recurDate.getMonth();
        var recurEventObj = { "name": name, "start": recurDate.toLocaleDateString("en-US", { year: 'numeric', month: 'numeric', day: 'numeric' }) };
        this.cachedEventByMonth[recurMonth].push(recurEventObj);
        this.displayEvent(name, recurEventObj);
        
        // Increment date by a week
        recurDate.setDate(recurDate.getDate() + 7);
      }
    }
  },
  
  /**
   * PRIVATE
   *
   */
  afterTargetDate: function(sourceDate, targetDate)
  {
    return (sourceDate.getFullYear() > targetDate.getFullYear() || 
           (sourceDate.getMonth() > targetDate.getMonth() && sourceDate.getFullYear() === targetDate.getFullYear()) || 
           (sourceDate.getDate() > targetDate.getDate() && sourceDate.getMonth() === targetDate.getMonth()));
  },
  
  /**
   * PRIVATE
   *
   */
  displayCachedEventsFor: function(month)
  {
    if (this.cachedEventByMonth[month].length < 1) return;
    
    for (var i in this.cachedEventByMonth[month])
    {
      var eventObj = this.cachedEventByMonth[month][i];
      this.displayEvent(eventObj.name, eventObj);
    }
  },
  
  /**
   * PRIVATE
   * 
   */
  displayEvent: function(name, eventObj)
  {
    if (!eventObj) return;
    
    var start = eventObj.start;
    if (!start || start.length < 1) return;
    
    var date = new Date(start);
    
    if (date.getMonth() !== this.currentMonth) return;
    if (date.getFullYear() !== this.currentYear) return;
        
    var id = date.getDate();
    var day = document.getElementById(id);
    if (!day) return;
    
    var eventDiv = document.createElement("div");
    eventDiv.classList.add("event");
    if (eventObj.canceled) eventDiv.classList.add("canceled");
    eventDiv.innerText = name;
    day.appendChild(eventDiv);
  }
};

/*
  Notes:
  The "eventObj" must conform to the following shape:
  
  REQUIRED
  - name:     string,   Name of the event. This is what gets displayed in
                        the calendar.
  - start:    string,   Start date string parseable by the Date constructor.
                        This is either the only date the event should be displayed
                        or the start date/first instance of a recurring event.
  OPTIONAL
  - end:      string,   End date string parseable by the Date constructor.
                        This indicates an event is recurring and is used to represent
                        the last date that the event occurs.
  - canceled: boolean,  Flag whether or not the event was canceled. Will cause the text
                        to be crossed out.
*/