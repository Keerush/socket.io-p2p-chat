var express = require('express');
var app = express();
var server = require('http').createServer(app);
var p2pserver = require('socket.io-p2p-server').Server;
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/frontend'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/frontend/index.html');
});
io.use(p2pserver);

var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log('Running at port ' + port);
});

io.on('connection', function(socket) {
    socket.on('message', function(data) {
        console.log(data);
        socket.broadcast.emit('message', data);
    });
});