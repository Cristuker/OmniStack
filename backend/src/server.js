const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const cors = require('cors')

const app = express();//inicia o server

const server = require('http').Server(app)
const io = require('socket.io')(server)

const connectedUsers = { };

io.on( 'connection', socket =>{

    const { user } = socket.handshake.query;

    connectedUsers[user] = socket.id
    
})

mongoose.connect('mongodb+srv://cristuker:136crcc12@cluster0-gszt9.azure.mongodb.net/tindev?retryWrites=true&w=majority',{
    useNewUrlParser: true
});

app.use((req,res,next) =>{
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
})

app.use(cors());

app.use(express.json())
app.use(routes)

server.listen(3333);
//escutando a porta 3333 ou sejá o servidor está rodando aqui
/*
-D para instalar dependencia de desenvolvimento  
*/