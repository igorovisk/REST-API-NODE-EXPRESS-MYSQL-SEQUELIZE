const { Usuarios, Habilidades } = require("../models")
const { habilidadeSchema } = require("../schemas/habilidadeSchema")
const checkIfIsAdmin = require("../utils/checkIfIsAdm")

//GET ALL
const getAll = async function (req, res) {
    try {
        const habilidades = await Habilidades.findAll()
        return res.status(200).json(habilidades)
    } catch (erro) {
        return res.status(500).json(erro)
    }
}

//GET UMA SÓ HABILIDADE
const getHabilidadeUnica = async function (req, res) {
    try {
        const habilidade = await Habilidades.findByPk(req.params.id) // Ou usar o findOne, mas não sei como ligar ele ao front pra pegar o input da habilidade
        return res.status(200).json(habilidade)
    } catch (erro) {
        return res.status(500).json({ message: erro })
    }
}

//CREATE
// SE FOR USUARIO COMUM, ELE SÓ VAI PODER UTILIZAR O ADICIONA HABILIDADE AO PERFIL.
//METODO PATCH????
// const adicionaHabilidadeAoPerfil = async function (req, res) {
//     try {
//         if (!(await checkIfIsUsuarioLogado(req, res))) {
//             res.status(401)
//             throw new Error(
//                 "Usuario Não Logado"
//             )
//         }
//         const habilidades = await Habilidades.findAll()

//          //VERIFICA SE HABILIDADE EXISTE no BANCO
//          //VER SE NO FRONT ELA VEM POR ID OU POR NOME
//          const verificaHabilidade = await Habilidades.findAll({
//             where: { id: req.body.habilidades },
//         })

//         //O USUARIO PRA CHEGAR ATÉ AQUI TEM ESTAR LOGADO, ENTÃO ELE EXISTE E É VALIDO

//         newUsuario.setHabilidades(habilidades)







//     } catch (erro) {
//         console.log(erro)
//         return res.status(400).json({
//             message: `Ocorreu um erro.. ${erro}`,
//         })
//     }
// }

//ESSE METODO É PRA CADASTRAR A HABILIDADE NO SISTEMA PROS USUARIOS PODEREM SELECIONAR ELA NO CHECKBOX E ADICIONAR AO SEU PERFIL
const criaHabilidade = async function (req, res) {
    try {
        if (!(await checkIfIsAdmin(req, res))) {
            res.status(401)
            throw new Error("Usuario não administrador")
        }

        const data = req.body

        const habilidadeValida = await habilidadeSchema.validate(data)

        if (habilidadeValida.error) {
            res.status(400)
            throw new Error(habilidadeValida.error)
        }

        const existeNoSistema = await Habilidades.findOne({
            where: { nome: data.nome },
        })
        if (existeNoSistema) {
            res.status(400)
            throw new Error("habilidade já cadastrada no sistema")
        }

        if (habilidadeValida && !existeNoSistema) {
            const habilidadeCriada = await Habilidades.create(data)

            return res.status(200).json({
                message: "Habilidade cadastrada com sucesso:",
                habilidadeCriada: habilidadeCriada,
            })
        }
    } catch (erro) {
        return res.json({
            message: `Ocorreu um erro.. ${erro}`,
        })
    }
}

//DELETE
const deletaHabilidade = async function (req, res) {
    try {
        if (!(await checkIfIsAdmin(req, res))) {
            res.status(401)
            throw new Error("Usuario não administrador")
        }

        const deletedHabilidade = await Habilidades.destroy({
            where: {
                id: req.params.id,
            },
        })
        return res.status(200).json({
            message: "Habilidades deletada com sucesso",
            deletedHabilidade: req.body,
        })
    } catch (erro) {
        return res.status(500).json({
            message: erro,
        })
    }
}

//UPDATE
const alteraHabilidade = async function (req, res) {
    try {
        if (!(await checkIfIsAdmin(req, res))) {
            res.status(401)
            throw new Error("Usuario não administrador")
        }

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
        return res.status(200).json({
            message: "Habilidade alterada com sucesso",
            updatedHabilidade: req.body,
        })
    } catch (erro) {
        return res.status(500).json({ message: erro })
    }
}

module.exports = {
    getAll,
    getHabilidadeUnica,
    criaHabilidade,
    alteraHabilidade,
    deletaHabilidade,
}
