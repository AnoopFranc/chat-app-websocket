const path = require('path');
const http = require('http');

const express = require('express');
const socketio = require('socket.io');


const app = express();

const server =http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000

app.use(express.json());
app.use(express.static(path.join(__dirname,'../public')));


io.on('connection', () => {
    console.log("Websocket")
})

server.listen(port,() => {
    console.log("Server started")
})


