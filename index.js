const express = require("express")
const jwt = require("jsonwebtoken")
const controllers = require("./controllers")
const app = express()
const port = 5000
// const { verificaJWT } = require("./controllers/authController")

// console.log(verificaJWT)

app.get("/", (req, res) => res.send("Server Iniciado..."))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/usuarios", controllers.usuarios)
app.use("/habilidades", controllers.habilidades)
app.use("/autenticacao", controllers.autenticacao)

app.listen(port, () => console.log("Servidor rodando na porta 5000..."))

// module.exports = jwt
