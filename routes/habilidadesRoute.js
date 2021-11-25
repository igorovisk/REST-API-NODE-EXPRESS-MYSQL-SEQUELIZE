////////////////////////////////IMPORTS
const {
    getAll,
    getHabilidadeUnica,
    criaHabilidade,
    alteraHabilidade,
    deletaHabilidade,
} = require("../controllers/habilidadesController")


const { verificaJWT } = require("../middlewares/jwtMiddleware")
const { Router } = require("express")
const router = Router()
const cors = require("cors")
router.use(cors());
///////////////////////////////////////////////////////////////////

//GETALL HABILIDADES
router.get("/", verificaJWT, async (req, res) => {
    getAll(req, res)
})

//GET HABILIDADE POR ID
router.get("/:id", verificaJWT, async (req, res) => {
    getHabilidadeUnica(req, res)
})

//CRIA HABILIDADE
router.post("/", verificaJWT, async (req, res) => {
    criaHabilidade(req, res)
})

//DELETA HABILIDADE
router.delete("/:id", verificaJWT, async (req, res) => {
    deletaHabilidade(req, res)
})

//ALTERA HABILIDADE
router.put("/:id", verificaJWT, async (req, res) => {
    alteraHabilidade(req, res)
})

module.exports = router
