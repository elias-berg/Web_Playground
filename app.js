var express = require('express');
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, './')));
app.use(express.static(path.join(__dirname, './ChexQuest')));

app.listen(8080, () => {
    console.log("Web Playground listening to port 8080.");
});