/* 
  Utility Scripts!
  This file should be added at the tail end of HTML files so as to allow all
  DOM elements to load first, just in case.
*/

// The following chunk of code just causes the 'selected' style to get added to
// whichever page title the user is currently viewing (to indicate which page they're on).
var url = window.location.href;
var pieces = url.split("/");
var last = pieces[pieces.length - 1];
if (last === "") last = pieces[pieces.length - 2];
var links = document.querySelectorAll("a[href='../" + last + "/']");
if (links && links.length > 0) { links[0].classList.add("selected"); }