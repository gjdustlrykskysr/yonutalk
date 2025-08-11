const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);
const path = require('path');

app.use(express.static('public'));
app.use(express.json());

const PORT = process.env.PORT || 3000;

const secretCode = "AF8HSJ29";

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/chat.html'));
});

app.get('/secret', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/secret.html'));
});

app.post('/check-secret', (req, res) => {
  const { code } = req.body;
  if (code === secretCode) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.get('/secret-chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/secret-chat.html'));
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});