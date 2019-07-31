const path = require('path');
const http = require('http');

const express = require('express');
const socketio = require('socket.io');

const {generateMessage} = require('./utils/message');


const app = express();

const server =http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000

app.use(express.json());
app.use(express.static(path.join(__dirname,'../public')));


io.on('connection', (socket) => {
    console.log("Websocket");



    socket.emit('message',generateMessage('Welcome!'))
    socket.broadcast.emit('message','A new User Has Joined')

    socket.on('messageNew',(mess) => {
        console.log(mess);
        io.emit('message',generateMessage(mess));
    })
    socket.on('send-loc',(position,callback) => {
        io.emit('sendlocation',`https://www.google.com/maps?q=${position.latitude},${position.longitude}`)
        callback();
    })
    socket.on('disconnect',() => {
        io.emit('message','A user has left');
    })
})

server.listen(port,() => {
    console.log("Server started")
})


