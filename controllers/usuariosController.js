const { Router } = require("express")
const { Usuarios } = require("../models")
const { Habilidades } = require("../models")

const router = Router()

//GET ALL
router.get("/", async (req, res) => {
    try {
        const usuarios = await Usuarios.findAll(
            {
            include: [
                {
                    model: Habilidades,
                    as: "Habilidades",
                },
            ],
        })
        console.log("Console log da Lista de usuarios" + usuarios)
        console.log(usuarios)
        res.status(200).json(usuarios)
    } catch (erro) {
        console.log(erro)
        res.status(500).json(erro)
    }
})

//GET UM SÓ USUARIO
router.get("/:id", async (req, res) => {
    try {
        const usuario = await Usuarios.findByPk(req.params.id,          
        )  
        res.status(200).json(usuario)
    } catch (erro) {
        res.status(500).json(erro)
    }
})

//CREATE
router.post("/", async (req, res) => {
    try {
        const { habilidade, ...data } = req.body
        console.log(req.body)

        const newUsuario = Usuarios.create(data)
        
        // if (habilidades && habilidades.length > 0) {
        //     newUsuario.setHabilidades(habilidades)
        // }
        console.log(newUsuario)
        res.status(200).json({
            message: "cadastrado com sucesso",
            usuariocriado: req.body,
        })
    } catch (erro) {
        res.status(500).json({
            message: erro,
        })
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
            message: "Usuario alterado com sucesso",
            updatedUsuario: req.body,
        })
    } catch (erro) {
        res.status(500).json({ message: "Erro ao alterar usuario" })
    }
})

module.exports = router
