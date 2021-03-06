'use strict';
//Calendar global variables//
var calDayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var calMonthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var calDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
console.log(calMonthLabels[4]);
var events = {
  January262017: '<a href="https://www.facebook.com/events/671448336349962/">MalLabel Presents: MUGSY, Peek Levels, Clifford & Shermgerm</a>',
  January272017: '<a href="https://www.facebook.com/events/729929363840375/">STA:The Sounds Of Trance:Thrillseekers</a>',
  January282017: '<a href="https://www.facebook.com/events/231247290639803/">Onset: Year 15 ft Dieselboy</a>',
  February102017: '<a href="https://www.facebook.com/events/1377464888952199/">Seattle Trance Alliance Presents:The Sounds Of Trance: Alex M.O.R.P.H.</a>',
  February112017: '<a href="https://www.facebook.com/events/249552965483974/">AWOL & Track Killerz present: Dissonance w/MEAUX GREEN</a>',
  February242017: '<a href="https://www.facebook.com/events/282426332159332/">STA:The Sounds Of Trance:Neptune Project</a>',
  March242017: '<a   href="https://www.facebook.com/events/227907177660388/">STA:The Sounds Of Trance:Manuel Le Saux & Darren Porter</a>',
  // Monthxx2017: '<a href="url">link text</a>',
  // Monthxx2017: '<a href="url">link text</a>',
};
//Date Object. I need to understand more about date objects.//
var calCurrentDate = new Date();

//Calendar Constructor. That question mark is new for me--a ternary conditional operator. It's not quite an if/else statement, but it's close. Very cool, and way less clunky than an if/else for simple things.//
function Calendar(month, year) {
  this.month = (isNaN(month) || month == null) ? calCurrentDate.getMonth() : month;
  this.year = (isNaN(year) || year == null) ? calCurrentDate.getFullYear() : year;
}
//Oh goody. Prototypes. My favorite thing.//
Calendar.prototype.generateHTML = function(){
//Giving the Date Object a date to parse. It can tell us the day of the week as an integer, from 0 to 6.//
  var firstDay = new Date(this.year, this.month, 1);
//Then we can query the Date Object for the day of the week//
  var startingDay = firstDay.getDay();
//Console logging just because.//
  // console.log(startingDay);
//This gets the number of days in the month//
  var monthLength = calDaysInMonth[this.month];
//So now we have to compensate for Leap Year!//
  if(this.month == 1) { //Because 1(February) is the second item in our months array.//
    if((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0) {
      monthLength = 29;
    //If this instance of year is divisible by four with a remainder of zero AND is divisible by one hundred with a remainder of zero OR if this instance of year is divisible by four hundred with a remainder of zero, then the month length is twenty nine.//
    }//I love running if/else statements without elses. Wild.//
  }

//Now we're going to construct the calendar. Here is the header.//
  var monthName = calMonthLabels[this.month];
  var html = '<table class="calendar-table">';
  html += '<tr><th colspan="7">';
  html += monthName + '&nbsp' + this.year;
  html += '</th></tr>';
  html += '<tr class="calendar-header">';
  for(var i = 0; i <= 6; i++){
    html += '<td class="calendar-header-day">';
    html += calDayLabels[i];
    html += '</td>';
  }

  html += '</tr><tr>';

//Here are the day boxes//
  var day = 1;
//making weeks(rows)//
  for(var i = 0; i < 9; i++) {
  //Making weekdays(cells)//
    for(var j = 0; j <= 6; j++) {
      html += '<td class="calendar-day">';
      if(day <= monthLength && (i > 0 || j >= startingDay)) {
        var eventDay = calMonthLabels[this.month] + day + this.year;
        html += day;
        if(eventDay in events) {
          html += '<br/>' + events[eventDay];
        }
        day++;
      }
      html += '</td>';//Generating a bunch of weeks. Stop the loop when we run out of days//
    }
    if(day > monthLength) {
      break;
    } else {
      html += '</tr><tr>';
    }
  }

  html += '</tr></table>';

  this.html = html;

};

//returning the html//
Calendar.prototype.getHTML = function() {
  return this.html;
};

// Because you can never have too many console logs
console.log(calCurrentDate);
console.log();

// Here's where we're actually drawing the calendar
function drawNewCal(month, year) {
  var cal = new Calendar(month,year);//setting month and year here//
  cal.generateHTML();
  document.getElementById('calBlock').innerHTML = cal.getHTML();
};
// This is how we get the date the user selects from the dropdown into the html to select the data for the calendar.

function calUpdate() {
  var userDate = document.getElementById('dateList').value.split(',');
  console.log(userDate);
  var userMonth = parseInt(userDate[0]);
  var userYear = parseInt(userDate[1]);
  drawNewCal(userMonth, userYear);
}

// console.log(new Date());
// function firstLine() {
//   var str = new Date();
//   var res = str.split(' ', 4);
// }
// firstLine();
// console.log(res);
