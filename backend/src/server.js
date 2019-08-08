const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const cors = require('cors')

const server = express();//inicia o server


mongoose.connect('mongodb+srv://cristuker:136crcc12@cluster0-gszt9.azure.mongodb.net/tindev?retryWrites=true&w=majority',{
    useNewUrlParser: true
});

server.use(cors());

server.use(express.json())
server.use(routes)

server.listen(3333);
//escutando a porta 3333 ou sejá o servidor está rodando aqui
/*
-D para instalar dependencia de desenvolvimento  
*/