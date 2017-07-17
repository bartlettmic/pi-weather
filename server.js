var app = require('express')();
app.set('views', './');
app.set('view engine', 'pug');
var http = require('http').Server(app);
var io = require('socket.io')(http);
 
app.listen(8000, function () { console.log('Listening on http://localhost:8080'); });

app.get('/', function (req, res) { res.render('index', { title: 'Hey', message: 'Hello there!' }); });

// app.get('/', function(req, res){ res.sendFile(__dirname + '/index.html'); });

// io.on('connection', function(socket){ socket.on('chat message', function(msg){ io.emit('chat message', msg); }); });

// http.listen(8080,function(){ console.log('listening on *:8000'); });
