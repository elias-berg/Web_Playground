function generateFooter(loc)
{
  var body = document.body;
  var footer = document.createElement("footer");

  footer.classList.add("copyright");
  footer.innerHTML = 
    "<hr class='sep'/>" +
    "<div class='footer-links'>" +
      "<!-- Icons made by Freepik (https://www.flaticon.com/authors/freepik) -->" +
      "<a href='https://www.facebook.com/madisonhurling' target='_blank'><img src='" + loc + "img/fb.png'></a>" +
      "<a href='https://twitter.com/madisonhurling' target='_blank'><img src='" + loc + "img/tw.png'></a>" +
      "<a href='mailto:info@madisonhurling.com' target='_blank'><img src='" + loc + "img/email.png'></a>" +
      "<a href='https://www.instagram.com/hurlingclubofmadison/' target='_blank'><img src='" + loc + "img/ig.png'></a>" +
      "<a href='https://www.youtube.com/channel/UCHExjSjQHq06JVioR14eR5Q' target='_blank'><img src='" + loc + "img/yt.png'></a>" +
    "</div>" +
    "<p>&copy; " + new Date().getFullYear() + " Madison GAA. All Rights Reserved.</p>";

  body.appendChild(footer);
}