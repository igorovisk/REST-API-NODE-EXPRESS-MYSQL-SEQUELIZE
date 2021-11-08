const Joi = require("@hapi/joi")
// .extend(require("joi-cpf-cnpj"))

const habilidadeSchema = Joi.object({
    nome: Joi.string().required(),
   
})

module.exports = {
    habilidadeSchema,
}
