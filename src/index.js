const path = require('path');
const http = require('http');

const express = require('express');
const socketio = require('socket.io');

const {generateMessage} = require('./utils/messages');
const {addUser,getUser,getUsersInRoom,removeUser} = require('./utils/users');


const app = express();

const server =http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000

app.use(express.json());
app.use(express.static(path.join(__dirname,'../public')));


io.on('connection', (socket) => {
    console.log("Websocket");

    socket.on('join', ({ username, room },callback) => {
        const {err,user} = addUser({id: socket.id,username,room})
        if(err){
           return callback(err)
        }
        socket.join(user.room)

        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${username} has joined!`))
        callback()
        // socket.emit, io.emit, socket.broadcast.emit
        // io.to.emit, socket.broadcast.to.emit
    })

    socket.on('messageNew',(mess) => {
        console.log(mess);
        io.emit('message',generateMessage(mess));
    })
    socket.on('send-loc',(position,callback) => {
        io.emit('sendlocation',`https://www.google.com/maps?q=${position.latitude},${position.longitude}`)
        callback();
    })
    socket.on('disconnect',() => {
        const user =removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage(`${user.username} has left the room`));
        }
        
    })
})

server.listen(port,() => {
    console.log("Server started")
})


