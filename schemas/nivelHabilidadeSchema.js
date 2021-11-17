const Joi = require("@hapi/joi")
// .extend(require("joi-cpf-cnpj"))

const nivelHabilidadeSchema = Joi.object({
    nome: Joi.string().required(),
   
})
module.exports = {
    nivelHabilidadeSchema,
}
