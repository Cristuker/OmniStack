const express = require('express');
const routes = require('./routes')
const server = express();

server.use(express.json())
server.use(routes)

server.listen(3333);
//escutando a porta 3333 ou sejá o servidor está rodando aqui
/*
-D para instalar dependencia de desenvolvimento
*/