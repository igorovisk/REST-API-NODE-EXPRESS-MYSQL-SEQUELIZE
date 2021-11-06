const { Router } = require("express")
const { Usuarios, Sequelize } = require("../models")
const { Habilidades } = require("../models")

const router = Router()

//GET ALL
router.get("/", async (req, res) => {
    try {
        const usuarios = await Usuarios.findAll({
            include: [
                {
                    model: Habilidades,
                    as: "habilidades",
                    through: { attributes: [] },
                },
            ],
        })

       
        res.status(200).json(usuarios)
    } catch (erro) {
        console.log(erro)
        res.status(500).json(erro)
    }
})

//GET UM SÓ USUARIO
router.get("/:id", async (req, res) => {
    try {
        const usuario = await Usuarios.findByPk(req.params.id)
        res.status(200).json(usuario)
    } catch (erro) {
        res.status(500).json(erro)
    }
})

//CREATE
router.post("/", async (req, res) => {
    try {
        const { habilidades, ...data } = req.body

        // const habilidade = await Habilidades.findByPk(1)

        const newUsuario = await Usuarios.create(data)
        
        newUsuario.setHabilidades(habilidades);     

        res.status(200).json({
            message: "cadastrado com sucesso",
            usuariocriado: newUsuario,
        })
    } catch (erro) {
        res.status(500).json({
            message: erro,
        })
        console.log(erro)
    }
})

//DELETE
router.delete("/:id", async (req, res) => {
    try {
        const deletedUsuario = await Usuarios.destroy({
            where: {
                id: req.params.id,
            },
        })
        res.status(200).json({
            message: "usuario deletado com sucesso",
            deletedUsuario: req.body,
        })
    } catch (erro) {
        res.status(500).json({
            message: erro,
        })
        console.log(erro)
    }
})

//UPDATE
router.put("/:id", async (req, res) => {
    try {
        const {
            nome,
            cpf,
            login,
            password,
            dataDeNascimento,
            resetPassword,
            email,
            isAdm,
        } = req.body

        const updatedUsuario = await Usuarios.update(
            {
                nome,
                cpf,
                login,
                password,
                dataDeNascimento,
                resetPassword,
                email,
                isAdm,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        )
        res.status(200).json({
            message: "Usuarios alterado com sucesso",
            updatedUsuario: req.body,
        })
    } catch (erro) {
        res.status(500).json({ message: "Erro ao alterar usuario" })
    }
})

module.exports = router
