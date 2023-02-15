// Import express package
const express = require('express');
const socket = require("socket.io");
const path = require('path');
const http = require("http");

const app = express();
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

// Add a static route for index.html
app.use(express.static('public'));

// Socket setup
const io = socket(server);

app.use(require('./controllers/'));

io.on("connection", socket => {
    console.log("Made socket connection", socket.id)
    socket.on('player1', (p1) => {
        io.emit('player1-joined', p1)
        console.log(p1)
    })

    socket.on('player2', (p2) => {
        io.emit('player2-joined', p2)
        console.log(p2)
    })

    socket.on("message", (arg) => {
        console.log(arg)
        io.emit("message", (arg))
    })

    socket.on("d", rightMovement => {
        console.log(rightMovement)
        io.emit('d', rightMovement)

    })

    socket.on('d-up', rightMovement2 => {
        io.emit('d-up', rightMovement2)
    })

    socket.on("a", move3 => {
        io.emit('a', move3)
    })

    socket.on('a-up', move2 => {
        io.emit('a-up', move2)
    })

    socket.on('w', p1Jump => {
        io.emit("w", p1Jump)
    })

    socket.on(' ', p1Attack => {
        io.emit(" ", p1Attack)
    })

    socket.on('ArrowRight', p2rightMovement => {
        io.emit('ArrowRight', p2rightMovement)
    })

    socket.on('ArrowRight-up', p2rightMovement2 => {
        io.emit('ArrowRight-up', p2rightMovement2)
    })

    socket.on('ArrowLeft', p2leftMovement => {
        io.emit('ArrowLeft', p2leftMovement)
    })

    socket.on('ArrowLeft-up', p2leftMovement2 => {
        io.emit('ArrowLeft-up', p2leftMovement2)
    })

    socket.on('ArrowUp', p2Jump => {
        io.emit('ArrowUp', p2Jump)
    })

    socket.on('ArrowDown', p2Attack => {
        io.emit('ArrowDown', p2Attack)
    })
});



server.listen(PORT, () => console.log(`Server running on port ${PORT}`));