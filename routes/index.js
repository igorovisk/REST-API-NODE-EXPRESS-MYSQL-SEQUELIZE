const usuariosRoute = require("./usuariosRoute")
const habilidadesRoute = require("./habilidadesRoute")
const authRoute = require("./authRoute")

module.exports = {
    usuarios: usuariosRoute,
    habilidades: habilidadesRoute,
    autenticacao: authRoute,
   
}
