const { Router } = require("express")

const { Usuarios, Sequelize } = require("../models")
const { Habilidades } = require("../models")
const { usuarioSchema } = require("../schemas/usuarioSchema")
const Op = require("sequelize").Op

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
        //Destruct da requisição
        const { habilidades, ...data } = req.body

        //Validação dos campos da requisição pelo JOI VALIDATOR
        const usuarioValido = await usuarioSchema.validate(req.body)
        if (usuarioValido.error) throw new Error(usuarioValido.error)

        //VERIFICA SE HABILIDADE EXISTE

        const verificaHabilidade = await Habilidades.findAll({
            where: { id: req.body.habilidades },
        })
        if (verificaHabilidade.length != req.body.habilidades.length) {
            throw new Error(
                "Id de alguma habilidade é inexistente, favor verificar dados..."
            )
        }

        //VERIFICA SE JÁ EXISTE CADASTRO DE LOGIN, CPF E EMAIL EXISTENTES NO BANCO DE DADOS:
        const verificaSeExisteNoSistema = await Usuarios.findOne({
            where: {
                [Op.or]: [
                    { email: { [Op.eq]: data.email } },
                    { login: { [Op.eq]: data.login } },
                    { cpf: { [Op.eq]: data.cpf } },
                ],
            },
        })
        console.log("EXISTE NO SISTEMA:")
    

        if(verificaSeExisteNoSistema && verificaSeExisteNoSistema.dataValues.cpf == data.cpf) throw new Error("CPF já cadastrado")
        if(verificaSeExisteNoSistema && verificaSeExisteNoSistema.dataValues.login == data.login) throw new Error("Login já cadastrado")
        if(verificaSeExisteNoSistema && verificaSeExisteNoSistema.dataValues.email == data.email) throw new Error("Email já cadastrado")

        // const loginExiste = await Usuarios.findOne({
        //     where: {login: data.login },
        // })
        // const cpfExiste = await Usuarios.findOne({
        //     where: {cpf: data.cpf },
        // })
        // const emailExiste = await Usuarios.findOne({
        //     where: {email: data.email },
        // })
        // if (loginExiste != null) throw new Error("Login já cadastrado")
        // if (cpfExiste != null) throw new Error("CPF já cadastrado")
        // if (emailExiste != null) throw new Error("Email já cadastrado")

        //EFETIVA O CADASTRO APÓS PASSAR PELAS LINHAS ACIMA SEM ERRO:
        if (usuarioValido) {
            const newUsuario = await Usuarios.create(data)
            newUsuario.setHabilidades(habilidades)

            res.status(200).json({
                message: "Usuario cadastrado com sucesso:",
                usuariocriado: newUsuario,
                habilidades,
            })
        }
    } catch (erro) {
        res.status(400).json({
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
        res.status(400).json({
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
