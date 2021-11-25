////////////////////////////////IMPORTS
const {
    getAll,
    getUsuariosComuns,
    getUsuarioUnico,
    getUsuariosPorHabilidades,
    criaUsuario,
    alteraUsuario,
    adicionaHabilidadeAoPerfil,
    deletaUsuario,
} = require("../controllers/usuariosController")
const { verificaJWT } = require("../middlewares/jwtMiddleware")
const { Router } = require("express")
const router = Router()
const cors = require("cors")
router.use(cors());
///////////////////////////////////////////////////////////////////

//GETALL
router.get("/", verificaJWT, async (req, res) => {
    getAll(req, res)
})

//GET USUARIOS COMUNS
router.get("/usuarioscomuns", verificaJWT, async (req, res) => {
    getUsuariosComuns(req, res)
})

//GET USUARIO POR ID
router.get("/:id", verificaJWT, async (req, res) => {
    getUsuarioUnico(req, res)
})

//GET USUARIOS POR HABILIDADE
router.get("/habilidades/:habilidades", verificaJWT, async (req, res) => {
    getUsuariosPorHabilidades(req, res)
})

//CRIA USUARIO
router.post("/", async (req, res) => {
    criaUsuario(req, res)
})

//DELETA USUARIO
router.delete("/:id", verificaJWT, async (req, res) => {
    deletaUsuario(req, res)
})

//ALTERA USUARIO
router.put("/:id", verificaJWT, async (req, res) => {
    alteraUsuario(req, res)
})

//ADICIONA HABILIDADE AO PERFIL
router.patch("/:id", verificaJWT, async (req, res) => {
    adicionaHabilidadeAoPerfil(req, res)
})


module.exports = router
