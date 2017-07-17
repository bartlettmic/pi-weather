// require all dependencies
var express = require('express');
var app = express();
 
// set up the template engine
app.set('views', './');
app.set('view engine', 'pug');
 
// GET response for '/'
app.get('/', function (req, res) {
 
    // render the 'index' template, and pass in a few variables
    res.render('index', { title: 'Hey', message: 'Hello there!' });
 
});
 
// start up the server
app.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
});
