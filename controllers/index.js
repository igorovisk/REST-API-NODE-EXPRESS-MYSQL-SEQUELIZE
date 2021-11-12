const usuariosController = require("./usuariosController")
const habilidadesController = require("./habilidadesController")
const authController = require("./authController")

module.exports = {
    usuarios: usuariosController,
    habilidades: habilidadesController,
    autenticacao: authController,
}
