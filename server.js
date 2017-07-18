var exp = require('express')
var app = exp();
app.set('views', './');
app.set('view engine', 'pug');
app.use(exp.static('./'))
var http = require('http').Server(app);
// var io = require('socket.io')(http);

var _port = 3000;
 
app.listen(_port, function () { console.log('Listening on '+_port); });

app.get('/', function (req, res) { res.render('index'); });

// app.get('/', function(req, res){ res.sendFile(__dirname + '/index.html'); });

// io.on('connection', function(socket){ socket.on('chat message', function(msg){ io.emit('chat message', msg); }); });

// http.listen(8080,function(){ console.log('listening on *:8000'); });
