const { Router } = require("express")
const { Usuarios } = require("../models")
const { Habilidades } = require("../models")
const { usuarioSchema } = require("../schemas/usuarioSchema")
const {verificaJWT} = require("../middlewares/jwtMiddleware")

const Op = require("sequelize").Op
const mysql = require("mysql2")
const bcrypt = require("bcrypt")
const router = Router()

/////////////////////////////////////////////////////////////

//FOI NECESSÁRIO PARA USAR SQL DIRETO COM O BANCO
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "wisedb_sequelize",
})

//GET ALL
router.get("/", verificaJWT, async (req, res) => {
    try {
        const usuarios = await Usuarios.findAll({
            attributes: { exclude: ["password"] },
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

//GET ALL NÃO ADMINISTRADORES:
router.get("/usuarioscomuns", verificaJWT, async (req, res) => {
    try {
        const usuarios = await Usuarios.findAll({
            where: {
                isAdm: false,
            },
            attributes: { exclude: ["password"] },
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
        res.status(400).json(erro)
        console.log(erro)
    }
})

//GET UM SÓ USUARIO
router.get("/:id", verificaJWT, async (req, res) => {
    try {
        const usuario = await Usuarios.findByPk(req.params.id, {
            attributes: { exclude: ["password"] },
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

        if (verificaHabilidade.length != req.body.habilidades.length)
            throw new Error(
                "Id de alguma habilidade é inexistente, favor verificar dados..."
            )

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

        if (verificaSeExisteNoSistema?.dataValues.cpf == data.cpf)
            throw new Error("CPF já cadastrado")
        if (verificaSeExisteNoSistema?.dataValues.login == data.login)
            throw new Error("Login já cadastrado")
        if (verificaSeExisteNoSistema?.dataValues.email == data.email)
            throw new Error("Email já cadastrado")

        // EFETIVA O CADASTRO APÓS PASSAR PELAS LINHAS ACIMA SEM ERRO:
        if (usuarioValido) {
            //CRIPTOGRAFA PASSWORD
            const hashedPassword = await bcrypt.hash(data.password, 10)

            // FINALMENTE CRIA O USUARIO APÓS AS VALIDAÇÕES
            const newUsuario = await Usuarios.create({
                nome: data.nome,
                cpf: data.cpf,
                login: data.login,
                password: hashedPassword,
                dataDeNascimento: data.dataDeNascimento,
                resetPassword: data.resetPassword,
                email: data.email,
                isAdm: data.isAdm,
            })
            newUsuario.setHabilidades(habilidades)
            console.log("DATA")
            console.log(data)

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
router.delete("/:id", verificaJWT, async (req, res) => {
    try {
        const sql = `DELETE FROM Usuarios_Habilidades where usuarioId = ${req.params.id} `

        //DELETA A HABILIDADE LIGADA AO USUARIO ANTES
        const deleteRelation = con.query(sql)

        const usuarioExistente = await Usuarios.findOne({
            where: { id: req.params.id },
        })

        if (req.params.id != usuarioExistente.dataValues.id) {
            throw new Error("Usuario inexistente")
        }

        const deletedUsuario = await Usuarios.destroy({
            where: {
                id: req.params.id,
            },
            force: true,
        })

        res.status(200).json({
            message: `usuario deletado com sucesso`,
            usuarioDeletado: usuarioExistente.dataValues,
        })
    } catch (erro) {
        res.status(400).json({
            message: erro,
        })
        console.log(erro)
    }
})

//UPDATE
router.put("/:id", verificaJWT, async (req, res) => {
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
