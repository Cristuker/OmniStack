const Dev = require('../models/Dev')


module.exports = {
    async store(req,res){

        

        const { user } = req.headers; //quem esta logado/"dá o like"
        const { devId } = req.params; //quem "recebe o like"

        const loggedDev = await Dev.findById(user)  //consigo acessar qualquer info dele do banco de dados/ "loggedDev.avatar"
        const targetDev = await Dev.findById(devId)

        if(!targetDev){
            return res.status(400).json({error:'Dev not exists'})
        }

        if(targetDev.likes.includes(loggedDev._id)){
            //web socket será usado para avisar os dois usuarios que o match aconteceu
            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devId];

            if(loggedSocket){
                req.io.to(loggedSocket).emit('match', targetDev)
            }
            if(targetSocket){
                req.io.to(targetSocket).emit('match', loggedDev)
            }
        }

        loggedDev.likes.push(targetDev._id) //_id como o mongo salva

        await loggedDev.save() //para modificar a base de dados.

        return res.json(loggedDev) 
        
    }
}