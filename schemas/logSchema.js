const Joi = require("@hapi/joi")
// .extend(require("joi-cpf-cnpj"))

const logSchema = Joi.object({
    descricao: Joi.string().required(),
    metodo: Joi.string().required(),
})

module.exports = {
    logSchema,
}
