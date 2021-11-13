const { Usuarios } = require("../models")

const checkIfIsUsuarioLogado = async function (req, res) {
    const usuario = await Usuarios.findOne({
        where: { id: req.params.id },
    }) 
    if(!usuario) return

    //verifica se o req.login que vem do token é o mesmo do usuario do banco
    const isLogado = req.login != usuario.login ? false : true  
    return isLogado
}

module.exports = checkIfIsUsuarioLogado
