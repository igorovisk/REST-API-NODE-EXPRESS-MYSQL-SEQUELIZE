const { Router } = require("express")
const { Usuarios } = require("../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const router = Router()
const { verificaJWT } = require("../middlewares/jwtMiddleware")
const { blackList } = require("../middlewares/jwtMiddleware")
const secret = "teste"

////////////////////////////////////////

//METODO AUTENTICAÇÃO
router.post("/login", async (req, res) => {
    const { login, password } = req.body
    const usuario = await Usuarios.findOne({ where: { login: login } })

    try {
        if (
            usuario &&
            (await bcrypt.compare(password, usuario.dataValues.password))
        ) {
            const token = jwt.sign({ login: login }, secret, {
                expiresIn: 5000,
            })
            res.status(200).json({
                message: "logado no sistema!",
                auth: true,
                token,
            })
        } else throw new Error("login falhou")
    } catch (erro) {
        res.status(401).json({ message: `${erro}` })
        console.log(erro)
    }
})

router.post("/logout", (req, res) => {
    blackList.push(req.headers["x-access-token"])    
    res.end()
})

module.exports = router
