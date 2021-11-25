const { Usuarios, Habilidades } = require("../models")
const { usuarioSchema } = require("../schemas/usuarioSchema")
const Op = require("sequelize").Op
const mysql = require("mysql2")
const bcrypt = require("bcrypt")
const checkIfIsUsuarioLogado = require("../utils/isUsuarioLogado")
const checkIfIsAdmin = require("../utils/checkIfIsAdm")

/////////////////////////////////////////////////////////////

//FOI NECESSÁRIO PARA USAR SQL DIRETO COM O BANCO
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "wisedb_sequelize",
})

//GET ALL
const getAll = async function (req, res) {
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

        return res.status(200).json(usuarios)
    } catch (erro) {
        return res.status(500).json(erro)
    }
}

//GET ALL NÃO ADMINISTRADORES:
const getUsuariosComuns = async function (req, res) {
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

        return res.status(200).json(usuarios)
    } catch (erro) {
        console.log(erro)
        return res.status(400).json(erro)
    }
}

//GET UM SÓ USUARIO
const getUsuarioUnico = async function (req, res) {
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

        return res.status(200).json(usuario)
    } catch (erro) {
        return res.status(500).json(erro)
    }
}

// GET USUARIOS POR HABILIDADE

const getUsuariosPorHabilidades = async function (req, res) {
    try {
        const habilidadeInformada = req.params.habilidades

        const sql = `SELECT u.* from Usuarios_Habilidades uh INNER JOIN Usuarios u on u.id = uh.usuarioId WHERE uh.habilidadeId = ${habilidadeInformada}`

        const lista = con.query(sql, function (err, result) {
            console.log(result)
            return res.status(200).json(result)
        })
    } catch (err) {
        console.log(err)
        res.status(400).send({ message: err })
    }
}

//METODO DE REGISTRO DO USER AO SISTEMA
//CREATE
const criaUsuario = async function (req, res) {
    try {
        const input = req.body

        //Validação dos campos da requisição pelo JOI VALIDATOR
        const usuarioValido = await usuarioSchema.validate(req.body)
        if (usuarioValido.error) throw new Error(usuarioValido.error)

        //VERIFICA SE JÁ EXISTE CADASTRO DE LOGIN, CPF E EMAIL EXISTENTES NO BANCO DE DADOS:
        const verificaSeExisteNoSistema = await Usuarios.findOne({
            where: {
                [Op.or]: [
                    { email: { [Op.eq]: input.email } },
                    { login: { [Op.eq]: input.login } },
                    { cpf: { [Op.eq]: input.cpf } },
                ],
            },
        })

        if (verificaSeExisteNoSistema?.dataValues.cpf == input.cpf)
            throw new Error("CPF já cadastrado")
        if (verificaSeExisteNoSistema?.dataValues.login == input.login)
            throw new Error("Login já cadastrado")
        if (verificaSeExisteNoSistema?.dataValues.email == input.email)
            throw new Error("Email já cadastrado")

        // EFETIVA O CADASTRO APÓS PASSAR PELAS LINHAS ACIMA SEM ERRO:
        if (usuarioValido) {
            //CRIPTOGRAFA PASSWORD
            const hashedPassword = await bcrypt.hash(input.password, 10)

            // FINALMENTE CRIA O USUARIO APÓS AS VALIDAÇÕES
            const newUsuario = await Usuarios.create({
                nome: input.nome,
                cpf: input.cpf,
                login: input.login,
                password: hashedPassword,
                dataDeNascimento: input.dataDeNascimento,
                resetPassword: input.resetPassword,
                email: input.email,
                isAdm: input.isAdm,
            })

            console.log("DATA")
            console.log(input)

            return res.status(200).json({
                message: "Usuario cadastrado com sucesso:",
                usuariocriado: newUsuario,
            })
        }
    } catch (erro) {
        console.log(erro)
        return res.status(400).json({
            message: `Ocorreu um erro.. ${erro}`,
        })
    }
}

//DELETE
const deletaUsuario = async function (req, res) {
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

        if (await checkIfIsAdmin(req, res)) {
            const deletedUsuario = await Usuarios.destroy({
                where: {
                    id: req.params.id,
                },
                force: true,
            })
            return res.status(200).json({
                message: `usuario deletado com sucesso`,
                usuarioDeletado: usuarioExistente.dataValues,
            })
        }

        if (!(await checkIfIsUsuarioLogado(req, res))) {
            res.status(401)
            throw new Error(
                "Usuario Logado não corresponde ao id que quer deletar"
            )
        }

        const deletedUsuario = await Usuarios.destroy({
            where: {
                id: req.params.id,
            },
            force: true,
        })

        return res.status(200).json({
            message: `usuario deletado com sucesso`,
            usuarioDeletado: usuarioExistente.dataValues,
        })
    } catch (erro) {
        console.log(erro)
        return res.status(400).json({
            erro,
        })
    }
}

//UPDATE COMPLETO POR PUT
const alteraUsuario = async function (req, res) {
    try {
        const { habilidades, ...data } = req.body

        //Validação
        const usuarioValido = await usuarioSchema.validate(req.body)

        if (usuarioValido.error) throw new Error(usuarioValido.error)

        if (usuarioValido) {
            const updatedUsuario = await Usuarios.update(data, {
                where: {
                    id: req.params.id,
                },
            })
            if (updatedUsuario == 0) throw new Error("Usuario não encontrado")
        }

        //CRIPTOGRAFA O PASSWORD E ENVIA PRO BANCO
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const sql = `UPDATE Usuarios SET password = "${hashedPassword}" WHERE email = "${data.email}";`

        const queryGravaPasswordCriptografado = con.query(sql)

        const id = req.params.id
        const alteraHabilidade = await Usuarios.findByPk(id)
        alteraHabilidade.setHabilidades(habilidades)

        return res.status(200).json({
            message: "Usuario alterado com sucesso",
        })
    } catch (erro) {
        console.log(erro)
        return res.status(400).json(erro)
    }
}

// SE FOR USUARIO COMUM, ELE SÓ VAI PODER UTILIZAR O ADICIONA HABILIDADE AO PERFIL.
// METODO PATCH????

const adicionaHabilidadeAoPerfil = async function (req, res) {
    try {
        //VERIFICA SE HABILIDADE EXISTE no BANCO
        const verificaHabilidade = await Habilidades.findAll({
            where: { id: req.body.habilidade },
        })
        //VER SE NO FRONT ELA VEM POR ID OU POR NOME

        const habilidadeInserida = req.body.habilidade
        console.log("verificaHabilidade")
        console.log(verificaHabilidade.length)
        console.log(verificaHabilidade)

        console.log("habilidadeInserida")

        if (verificaHabilidade.length == 0) {
            res.status(400)
            throw new Error("Id de Habilidade inválido")
        }

        const usuario = await Usuarios.findOne({
            where: { id: req.params.id },
        })

        const usuarioId = usuario.dataValues.id

        const novaData = new Date()
        const novaDataFormatada = novaData
            .toISOString()
            .replace("T", " ")
            .split(".")
        const now = novaDataFormatada[0]

        const sql = `INSERT INTO Usuarios_Habilidades (usuarioId, habilidadeId, createdAt, updatedAt) values ("${usuarioId}", "${habilidadeInserida}", "${now}", "${now}");`

        const gravaNoBanco = con.query(sql, function (err, result) {
            if (err) console.log(err)
            console.log(result)
            return res.status(200).json("Habilidade inserida com sucesso")
        })
    } catch (erro) {
        return res.json({
            message: `Ocorreu um erro.. ${erro}`,
        })
    }
}

module.exports = {
    getAll,
    getUsuariosComuns,
    getUsuarioUnico,
    getUsuariosPorHabilidades,
    criaUsuario,
    deletaUsuario,
    alteraUsuario,
    adicionaHabilidadeAoPerfil,
}
