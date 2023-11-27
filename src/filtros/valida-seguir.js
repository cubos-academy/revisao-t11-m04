module.exports = (req, res, next) => {
    const { usuarioId } = req.body
    if (!usuarioId) {
        return res.status(400).json({ mensagem: "O campo id do usuario é obrigatório." })
    }
    if (req.usuarioId === usuarioId) {
        return res.status(400).json({ mensagem: "Você não pode seguir a si mesmo." })
    }
    next()
}