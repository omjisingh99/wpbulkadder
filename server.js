const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
global.io = io;

app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/api/add-members', require('./routes/addMembers'));
require('./whatsapp');

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
