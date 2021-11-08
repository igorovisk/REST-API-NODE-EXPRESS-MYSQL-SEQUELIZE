const { Router } = require("express")
const { Habilidades } = require("../models")
const { habilidadeSchema } = require("../schemas/habilidadeSchema")

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
        res.status(200).json(habilidade)
    } catch (erro) {
        res.status(500).json({message: erro})
    }
})

//CREATE
router.post("/", async (req, res) => {
    try {
        const data = req.body

        const habilidadeValida = await habilidadeSchema.validate(data)
        console.log(habilidadeValida)

        if (habilidadeValida.error) throw new Error(habilidadeValida.error)

        const existeNoSistema = await Habilidades.findOne({
            where: { nome: data.nome },
        })
        if (existeNoSistema)
            throw new Error("habilidade já cadastrada no sistema")

        if (habilidadeValida && !existeNoSistema) {
            const habilidadeCriada = await Habilidades.create(data)

            res.status(200).json({
                message: "Habilidade cadastrada com sucesso:",
                habilidadeCriada: habilidadeCriada,
            })
        }
    } catch (erro) {
        res.status(500).json({
            message: `Ocorreu um erro.. ${erro}`,
        })
        console.log(erro)
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
        res.status(500).json({ message: erro })
    }
})

module.exports = router
