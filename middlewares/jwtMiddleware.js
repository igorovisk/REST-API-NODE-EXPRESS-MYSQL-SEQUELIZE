const { Usuarios } = require("../models")
const jwt = require("jsonwebtoken")

const secret = "teste"

//LISTA PARA INVIABILIZAR O USO DE UM TOKEN QUE VAI SER DESLOGADO
const blackList = []

const verificaJWT = function (req, res, next) {
    const token = req.headers["x-access-token"]

    //VERIFICA BLACKLIST DE TOKENS QUE FOI FEITO LOGOUT PRA N USAR ELE DE NOVO
    const index = blackList.findIndex((item) => item === token)
    if (index !== -1) {
        console.log(blackList)
        return res.status(404).json("token na blacklist")        
    }
    
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            res.status(401).json(err)
            console.log(err)
        }
        req.login = decoded.userLogin
        next()
    })
}

module.exports = { verificaJWT: verificaJWT, blackList: blackList }
