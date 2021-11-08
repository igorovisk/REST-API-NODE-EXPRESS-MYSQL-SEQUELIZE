const { Router } = require("express")

const { Usuarios, Sequelize } = require("../models")
const { Habilidades } = require("../models")
const { usuarioSchema } = require("../schemas/usuarioSchema")

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
        res.status(500).json(erro)
    }
})

//GET UM SÓ USUARIO
router.get("/:id", async (req, res) => {
    try {
        const usuario = await Usuarios.findByPk(req.params.id, {
            include: [
                {
                    model: Habilidades,
                    as: "habilidades",
                    through: { attributes: [] },
                },
            ],
        })

        res.status(200).json(usuario)
    } catch (erro) {
        res.status(500).json(erro)
    }
})

//CREATE
router.post("/", async (req, res) => {
    try {
        const { habilidades, ...data } = req.body

        //Validação
        const usuarioValido = await usuarioSchema.validate(req.body)
        console.log(usuarioValido.error)

        if (usuarioValido.error) throw new Error(usuarioValido.error)

        const existeNoSistema = await Usuarios.findOne({
            where: { email: data.email, cpf: data.cpf, login: data.login },
        })
        if (existeNoSistema)
            throw new Error("email, cpf ou login já cadastrados")

        if (usuarioValido && !existeNoSistema) {
            const newUsuario = await Usuarios.create(data)
            console.log("USUARIO CRIADO:")
            console.log(newUsuario)
            newUsuario.setHabilidades(habilidades)

            res.status(200).json({
                message: "Usuario cadastrado com sucesso:",
                usuariocriado: newUsuario,
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
        const { habilidades, ...data } = req.body

        //Validação
        const usuarioValido = await usuarioSchema.validate(req.body)
        console.log(usuarioValido.error)

        if (usuarioValido.error) throw new Error(usuarioValido.error)

        if (usuarioValido) {
            const updatedUsuario = await Usuarios.update(data, {
                where: {
                    id: req.params.id,
                },
            })
            const usuarioSelecionado = `Usuarios`
            console.log("UPDATED USUARIO:")
        }
        const id = req.params.id
        const alteraHabilidade = await Usuarios.findByPk(id)
        alteraHabilidade.setHabilidades(habilidades)

        res.status(200).json({
            message: "Usuario alterado com sucesso",
            updatedUsuario: req.body,
        })
    } catch (erro) {
        res.status(500).json({ message: erro })
        console.log(erro)
    }
})

module.exports = router
