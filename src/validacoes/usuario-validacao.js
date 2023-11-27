const joi = require('joi')

module.exports = joi.object({
    nome: joi.string().required().messages({
        "any.required": "O campo nome é obrigatório.",
        "string.empty": "O campo nome não pode ser vazio."
    }),
    email: joi.string().email().required().messages({
        "any.required": "O campo email é obrigatório.",
        "string.empty": "O campo email não pode ser vazio.",
        "string.email": "O campo email deve ser um email válido."
    }),
    senha: joi.string().min(5).max(10).required().messages({
        "any.required": "O campo senha é obrigatório.",
        "string.empty": "O campo senha não pode ser vazio.",
        "string.min": "O campo senha deve ter pelo menos 5 caracteres."
    }),
})
