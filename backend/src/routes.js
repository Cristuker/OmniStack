const express = require('express')

const routes = express.Router();

routes.get('/', (req,res) => {
     //recebendo parametros pela URL
    return res.send(`Salve ${req.query.name}`)
});

routes.post('/devs', (req,res) =>{
    return res.json(req.body);
})

module.exports = routes;