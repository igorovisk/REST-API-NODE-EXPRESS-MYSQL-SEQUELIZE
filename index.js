const express = require("express")
const controllers = require("./controllers")
const app = express()
const port = 5000

app.get("/", (req, res) => res.send("Server Iniciado..."))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/usuarios", controllers.usuarios)
app.use("/habilidades", controllers.habilidades)

app.listen(port, () => console.log("Servidor rodando na porta 5000..."))
