const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const mongoose = require('mongoose')
require('dotenv').config()
const { Server } = require("socket.io");
const io = new Server(server);
const CookieParser = require('cookie-parser')

const { checkUser } = require('./middleware/Auth')

const port = process.env.PORT

// Routes
const AuthRouters = require('./routes/authRoutes')
const ChatRouters = require('./routes/chats')

// mongo
const dbURI = 'mongodb+srv://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASS + '@realtime-chat-cluster.3sczqjy.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }) 
    .catch((err) => console.log(err))
const connection = mongoose.connection;
connection.once("open", function () {
    console.log("MongoDB database connection established successfully");
});

app.set('view engine', 'ejs')

// Middleware
app.use(express.static('public'));
app.use(express.json())
app.use(CookieParser())

// routes
app.get('*', checkUser)// all get requests
app.use(AuthRouters)
app.use(ChatRouters)
app.get('/', (req, res) => {
    res.render('landing_page', {
        title: 'Home page'
    })
});

// events
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', (response) => {
        console.log('response: ' + JSON.stringify(response))
        io.emit('chat message', response);// send to everyone
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});


