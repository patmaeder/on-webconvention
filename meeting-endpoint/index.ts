const fs = require("fs");
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors({
    origin: "https://localhost:3000"
}))

const credentials = {
    key: fs.readFileSync(".ddev/ssl/certs/master.key"),
    cert: fs.readFileSync(".ddev/ssl/certs/master.crt"),
}

const server = require('https').createServer(credentials, app)
const io = require('socket.io')(server, {
    cors: {
        origin: "https://localhost:3000"
    }
});
const { v4: uuidV4 } = require('uuid')


app.get('/', (req, res) => {
    res.send(uuidV4());
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log("Joined room", roomId);
        socket.join(roomId);
        console.log("emitted join", userId);
        socket.broadcast.to(roomId).emit("user-connected", userId)

        socket.on("disconnect", () => {
            socket.broadcast.to(roomId).emit("user-disconnected", userId);
        });
    });


})

server.listen(3030)