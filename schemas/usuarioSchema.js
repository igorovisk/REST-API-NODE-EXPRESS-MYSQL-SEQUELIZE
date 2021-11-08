const Joi = require("@hapi/joi")
// .extend(require("joi-cpf-cnpj"))

const now = Date.now()

const usuarioSchema = Joi.object({
    nome: Joi.string().min(3).required(),
    cpf: Joi.string().min(11).max(11),
    login: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
    dataDeNascimento: Joi.date().less(now),
    resetPassword: Joi.string().min(5), //IMPLEMENTARautogenerate
    email: Joi.string().email().lowercase().required(),
    isAdm: Joi.boolean(),
    habilidades: Joi.array(),
})

module.exports = {
    usuarioSchema,
}