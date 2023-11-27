module.exports = (req, res, next) => {
    const { nome, email, senha } = req.body

    if (!nome) {
        return res.status(400).json({ mensagem: "O campo nome é obrigatório." })
    }

    if (!email) {
        return res.status(400).json({ mensagem: "O campo email é obrigatório." })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "O campo senha é obrigatório." })
    }

    if (senha.length < 6 || senha.length > 12) {
        return res.status(400).json({ mensagem: "O campo senha deve ter entre 6 e 12 caracteres." })
    }

    next()
}