var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/frontend'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/frontend/index.html');
});

var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log('Running at port ' + port);
});

io.on('connection', function(socket) {
    socket.on('message', function(message) {
        console.log('recieved ', message);
        io.sockets.in(socket.room).emit('message', message);
    });

    socket.on('joinroom', function(room) {
        var roomUsers = io.sockets.adapter.rooms[room] ? io.sockets.adapter.rooms[room].length : 0;
        console.log(roomUsers + ' in the room.');
        if (roomUsers === 0) {
            console.log(room + ' created.');
            socket.join(room);
            socket.emit('created', room, socket.id);
        } else {
            console.log('joined room ' + room);
            socket.broadcast.to(room).emit('join', room);
            socket.join(room);
            socket.emit('joined', room, socket.id);
            io.sockets.in(room).emit('ready', socket.id);
        }
        socket.room = room;
    });

    socket.on('signal', function(data, id) {
        socket.broadcast.to(socket.room).emit('peer-connect', data, id);
    });
});