const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const cors = require("cors");

const peerServer = ExpressPeerServer(server, {
    debug: true,
    key: "peerjs",
    allow_discovery: true
});
app.use('/peerjs', peerServer);

app.get("/", (req, res) => {
    res.send("Hallo");
});

io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);

        socket.on('message', (message) => {
            io.to(roomId).emit('createMessage', message);
        });

        socket.on("disconnect", () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        })
    });
})

app.listen(3030, () => {
    console.log("Server listening on port 3030")
});