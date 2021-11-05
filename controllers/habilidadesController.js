const { Router } = require("express")
const { Habilidades } = require("../models")

const router = Router()

//GET ALL
router.get("/", async (req, res) => {
    try {
        console.log(req.body)
        const habilidades = await Habilidades.findAll()
        res.status(200).json(habilidades)
    } catch (erro) {
        res.status(500).json(erro)
    }
})

//GET UMA SÓ HABILIDADE
router.get("/:id", async (req, res) => {
    try {
        const habilidade = await Habilidades.findByPk(req.params.id) // Ou usar o findOne, mas não sei como ligar ele ao front pra pegar o input da habilidade
        res.status(200).json(usuario)
    } catch (erro) {
        res.status(500).json(erro)
    }
})

//CREATE
router.post("/", async (req, res) => {
    try {
        const { nome } = req.body

        const newHabilidade = Habilidades.create({
            nome,
        })

        console.log(req.body)
        console.log(newHabilidade)
        res.status(200).json({
            message: "Nova habilidade cadastrada com sucesso",
            newHabilidade: req.body,
        })
    } catch (erro) {
        res.status(500).json(erro)
    }
})

//DELETE
router.delete("/:id", async (req, res) => {
    try {
        const deletedHabilidade = await Habilidades.destroy({
            where: {
                id: req.params.id,
            },
        })
        res.status(200).json({
            message: "Habilidades deletada com sucesso",
            deletedHabilidade: req.body,
        })
    } catch (erro) {
        res.status(500).json({
            message: erro,
        })
    }
})

//UPDATE
router.put("/:id", async (req, res) => {
    try {
        const { nome } = req.body

        const updatedHabilidade = await Habilidades.update(
            {
                nome,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        )
        res.status(200).json({
            message: "Habilidade alterada com sucesso",
            updatedHabilidade: req.body,
        })
    } catch (erro) {
        res.status(500).json({ message: "Erro ao alterar usuario" })
    }
})

module.exports = router
