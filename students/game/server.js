const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files
app.use(express.static('.'));

// Store connected players
const players = new Map();

// Physics rooms for different experiments
const rooms = {
    'mechanics': new Set(),
    'waves': new Set(),
    'electricity': new Set(),
    'thermodynamics': new Set()
};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', (room) => {
        // Leave current room if any
        Object.values(rooms).forEach(roomSet => {
            roomSet.delete(socket.id);
        });

        // Join new room
        if (rooms[room]) {
            rooms[room].add(socket.id);
            socket.join(room);
            
            // Notify others in room
            socket.to(room).emit('newPlayer', {
                id: socket.id,
                room: room
            });

            // Send existing players to new player
            const roomPlayers = Array.from(rooms[room]).map(playerId => ({
                id: playerId,
                ...players.get(playerId)
            }));
            socket.emit('existingPlayers', roomPlayers);
        }
    });

    socket.on('playerMove', (data) => {
        players.set(socket.id, {
            position: data.position,
            velocity: data.velocity,
            rotation: data.rotation
        });

        // Find player's room and broadcast only to that room
        Object.entries(rooms).forEach(([roomName, players]) => {
            if (players.has(socket.id)) {
                socket.to(roomName).emit('playerMove', {
                    id: socket.id,
                    ...data
                });
            }
        });
    });

    socket.on('experimentData', (data) => {
        // Broadcast experiment data to room
        Object.entries(rooms).forEach(([roomName, players]) => {
            if (players.has(socket.id)) {
                socket.to(roomName).emit('experimentUpdate', {
                    id: socket.id,
                    ...data
                });
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        players.delete(socket.id);
        
        // Remove from all rooms and notify others
        Object.entries(rooms).forEach(([roomName, players]) => {
            if (players.delete(socket.id)) {
                io.to(roomName).emit('playerLeft', socket.id);
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});