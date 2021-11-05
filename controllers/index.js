const { request } = require('express')

const usuariosController = require("./usuariosController")
const habilidadesController = require("./habilidadesController")

module.exports = {
    usuarios: usuariosController,
    habilidades: habilidadesController
}