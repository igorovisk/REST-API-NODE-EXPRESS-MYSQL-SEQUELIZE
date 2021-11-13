const cookieParser = require("cookie-parser")
const express = require("express")
const routes = require("./routes")
const app = express()
const port = 5000
const session = require("express-session")
const cors = require("cors")
const morganBody = require("morgan-body")

app.get("/", (req, res) => res.send("Server Iniciado..."))

//IMPLEMENTAR MORGANBODY PARA FAZER LOG DO SISTEMA

/////////////////////////

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/usuarios", routes.usuarios)
app.use("/habilidades", routes.habilidades)
app.use("/autenticacao", routes.autenticacao)

//PERMITINDO CORS
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["get", "post", "put", "delete"],
        credentials: true,
    })
)

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
