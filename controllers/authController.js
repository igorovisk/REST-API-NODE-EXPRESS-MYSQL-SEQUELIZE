const { Router } = require("express")
const { Usuarios } = require("../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const router = Router()
const { blackList } = require("../middlewares/jwtMiddleware")
const secret = "teste"
const crypto = require("crypto")
const mysql = require("mysql2")
const mailer = require("../modules/mailer")

////////////////////////////////////////

//CONEXÃO COM BANCO
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "wisedb_sequelize",
})

///////////////////////////////////////////////////METODO AUTENTICAÇÃO

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

/////////////////////////////////////////////////////        LOGOUT

router.post("/logout", (req, res) => {
    console.log("DESLOGADO")
    blackList.push(req.headers["x-access-token"])
    res.end()
})

////////////////////////////////////////////////   RECUPERAÇÃO DE SENHA

router.post("/forgotpassword", async (req, res) => {
    const { email, login} = req.body

    try {
        const usuario = await Usuarios.findOne({
            where: {
                login: login,
                email: email,
            },
        })
        if (!usuario)
            return res.status(400).send({ error: "Usuario não encontrado" })

        ///////////////////////////////////     GERA RESET PASSWORD E EXPIRE DATE

        const tokenMail = crypto.randomBytes(20).toString("hex")
        const tokenTime = new Date()
        tokenTime.setHours(tokenTime.getHours() + 1)
        const dataFormatada = tokenTime
            .toISOString()
            .replace("T", " ")
            .split(".")

        //////////////////////////////////      QUERY SQL PRA ADICIONAR AO BANCO

        const sql = `UPDATE Usuarios SET resetPassword = "${tokenMail}", resetPasswordExpires = "${dataFormatada[0]}" WHERE email = "${email}";`

        ///////////////////////////////////     MANDA EXECUTAR A QUERY ACIMA NO BANCO
        con.query(sql, (err, result) => {
            if (err) {
                return res.status(400).json(err)
            } else {
                console.log("Query feita com sucesso")
            }
        })

        ///////////////////////////////////     ENVIA O EMAIL

        mailer.sendMail(
            {
                to: email,
                from: "igorovisk@gmail.com",
                template: "/auth/forgotpassword",
                context: { tokenMail },
            },
            (err) => {
                if (err)
                    return res.status(400).json({ error: "cannot send email" })
            }
        )
        console.log(`Email enviado com sucesso para ${email}`)
        res.status(200).json(`Email enviado com sucesso para ${email}`)
    } catch (err) {
        return res.status(400).json({ err })
    }
})

//////////////////////////////////////////////////////// RESET PASSWORD COM TOKEN DO EMAIL

router.post("/resetPassword", async (req, res) => {
    //Usuario vai informar o token fornecido pela rota /ForgetPassword que tá gravada no banco de dados
    const { email, tokenInformado, novoPassword } = req.body

    try {
        const usuario = await Usuarios.findOne({
            where: {
                email: email,
            },
        })
        console.log(usuario)
        if (usuario == null || email !== usuario.dataValues.email)
            throw new Error("usuario com este email não encontrado")

        const tokenResetPasswordBanco = usuario.dataValues.resetPassword
        if (tokenResetPasswordBanco !== tokenInformado)
            throw new Error("Token de reset password incorreto")

        //VERIFICA SE O TOKEN JÁ TÁ EXPIRADO:
        const now = new Date()
        if (now > usuario.dataValues.resetPasswordExpires)
            throw new Error("Token expirado, por favor, faça uma nova requisição")

        //////////////SE PASSAR PELA VALIDAÇÃO, SETAR NOVO PASSWORD:
        const novoPasswordCriptografado = await bcrypt.hash(novoPassword, 10)

        const sql = `UPDATE Usuarios SET password = "${novoPasswordCriptografado}" WHERE email = "${email}";`

        con.query(sql, (err, result) => {
            if (err) {
                return res.status(400).json(err)
            } else {
                console.log("Query feita com sucesso")
            }
        })

        res.status(200).send({ message: "Password alterado com sucesso!" })
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err })
        //VER O PORQUE O ERRO NÃO TÁ SENDO MANDADO POR JSON, MAS IMPRIMIDO NO CONSOLE
    }
})

module.exports = router
