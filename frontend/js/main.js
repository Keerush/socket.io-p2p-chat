var socket = io.connect();
var opts = { peerOpts: { trickle: false }, autoUpgrade: false };
var p2psocket = new P2P(socket, opts, function() {
    p2psocket.useSockets = false;
    p2psocket.emit('peer-obj', { peerId: p2psocket.peerId });
});

p2psocket.on('message', function(data) {
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(data.textVal));
    document.getElementById('messages').appendChild(li);
});

document.getElementById('msg-form').addEventListener('submit', function(e, d) {
    e.preventDefault();
    var li = document.createElement('li');
    var inputMessage = document.getElementById('message_input');
    console.log(li);
    li.appendChild(document.createTextNode(inputMessage.value));
    document.getElementById('messages').appendChild(li);

    p2psocket.emit('message', { textVal: inputMessage.value });
    inputMessage.value = '';
});