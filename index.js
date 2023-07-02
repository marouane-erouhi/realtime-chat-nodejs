const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + '/frontend'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', (response) => {
        console.log('response: ' + response)
        io.emit('chat message', response);// send to everyone
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});


