var socket = io();

console.log('script loaded')

let form = document.getElementById('form');
let messageInput = document.getElementById('messageInput');
let messages = document.getElementById('messages');
let username = "<%= String(user.username) %>"


form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (messageInput.value) {
        socket.emit('chat message', { username, msg: messageInput.value }); // send message
        messageInput.value = ''; // reset chat
    }
});

socket.on('chat message', function (res) {
    let item = document.createElement('li');
    item.textContent = res.username + ': ' + res.msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});