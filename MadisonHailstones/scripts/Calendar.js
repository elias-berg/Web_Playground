class Calendar
{
  
  constructor()
  {
    
  }
  
  /**
   * Creates a calendar table based on the current month.
   *
   * @returns HTMLTableElement calendar table
   */
  create()
  {
    var calendar = document.createElement("table");
    
    var date = new Date();
    var curMonth = date.getMonth();
    var curDate = 1;
    date.setDate(curDate);
    var firstDay = date.getDay();
    
    var week, day, dayDiv, i;
    var foundFirst = false;
    week = document.createElement("tr");
    
    // Generate the pre-month cells
    var curDay = date.getDay();
    for (i = 0; i < curDay; i++)
    {
      week.appendChild(document.createElement("td"));
    }
    
    // Generate the month's cells
    while (date.getMonth() === curMonth)
    {
      if (date.getDay() === 0)
      {
        calendar.appendChild(week);
        week = document.createElement("tr");
      }
      
      day = document.createElement("td");
      dayDiv = document.createElement("div");
      dayDiv.classList.add("calcell");
      day.appendChild(dayDiv);
      day.classList.add("dayofmonth");
      week.appendChild(day);
      
      date.setDate(++curDate);
    }
    
    
    
    calendar.appendChild(week);
    
    return calendar;
  }
};