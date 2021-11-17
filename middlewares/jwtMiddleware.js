const { Usuarios } = require("../models")
const jwt = require("jsonwebtoken")

const secret = "teste"


const verificaJWT = function (req, res, next) {
    const token = req.headers["x-access-token"]

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            res.status(401).json(err)
        }

        req.login = decoded.login

        next()
    })
}

module.exports = { verificaJWT: verificaJWT }
