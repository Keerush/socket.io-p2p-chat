var isInitiator;
var socket = io.connect();
window.room = prompt("Enter room name:");

if (room !== "") {
    console.log('Message from client: Asking to join room ' + room);
    socket.emit('joinroom', room);
}


socket.on('message', function(data) {
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(data.textVal));
    document.getElementById('messages').appendChild(li);
});

document.getElementById('msg-form').addEventListener('submit', function(e, d) {
    e.preventDefault();
    var li = document.createElement('li');
    var inputMessage = document.getElementById('message_input');
    li.appendChild(document.createTextNode(inputMessage.value));
    document.getElementById('messages').appendChild(li);

    for (var id in connectedP)
        connectedP[id].send(inputMessage.value);
    inputMessage.value = '';
});

socket.on('created', function(room, clientId) {
    console.log('created room' + room + clientId);
    isInitiator = false;
});

socket.on('joined', function(room, clientId) {
    console.log('joined room' + room + clientId);
    isInitiator = true;
    socket.emit('connectroom', room);
});

socket.on('full', function(room) {
    console.log('Message from client: Room ' + room + ' is full :^(');
});

var connectedP = {};

socket.on('connectroom', function(sockets) {
    for (var id in sockets) {
        if (id !== socket.id) {
            // Create p2p connection with socket client.
            createConnection(id);
        }
    }
    isInitiator = false; // only for joiners afterwards.
    console.log('connections established');
    console.log(connectedP);
});

socket.on('ready', function(id) {
    console.log('ready - ' + id);
    console.log(socket.id);
    createConnection(id);
});

socket.on('peer-connect', function(data, id) {
    console.log('connect ' + id);
    if (!connectedP[id])
        createConnection(id);
    connectedP[id].signal(data);
});

var createConnection = function(id) {
    var p = new SimplePeer({ initiator: isInitiator, trickle: false });

    p.on('signal', function(data) {
        console.log('SIGNAL', JSON.stringify(data));
        socket.emit('offer', data, id);
    });

    p.on('connect', function() {
        console.log('CONNECT');
        p.send('whatever' + Math.random());
    });

    p.on('data', function(data) {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(data));
        document.getElementById('messages').appendChild(li);
    });
    connectedP[id] = p;
};