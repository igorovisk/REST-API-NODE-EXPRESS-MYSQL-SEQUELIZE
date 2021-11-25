const cookieParser = require("cookie-parser")
const express = require("express")
const routes = require("./routes")
const app = express()
const port = 5000
const session = require("express-session")
const cors = require("cors")
const morganBody = require("morgan-body")

app.get("/", (req, res) => res.send("Server Iniciado..."))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/usuarios", routes.usuarios)
app.use("/habilidades", routes.habilidades)
app.use("/autenticacao", routes.autenticacao)

//PERMITINDO CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*") // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    next()
})

//USANDO COOKIE PARSER
app.use(cookieParser())
app.listen(port, () => console.log("Servidor rodando na porta 5000..."))

app.use(
    session({
        key: "login",
        secret: "teste",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24,
        },
    })
)

// module.exports = jwt
