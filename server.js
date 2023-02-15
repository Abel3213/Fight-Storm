// Import express package
const express = require('express');
const socket = require("socket.io");
const path = require('path');
const http = require("http");

const app = express();
const PORT = 3001;
const server = http.createServer(app);


// Add a static route for index.html
app.use(express.static(path.join(__dirname, 'public')));

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

    socket.on("d", move => {
        io.emit('d', move)
    })

    socket.on('d-up', move1 => {
        io.emit('d-up', move1)
    })

    socket.on("a", move3 => {
        io.emit('a', move3)
    })

    socket.on('a-up', move2 => {
        io.emit('a-up', move2)
    })
});



server.listen(PORT, () => console.log(`Server running on port ${PORT}`));