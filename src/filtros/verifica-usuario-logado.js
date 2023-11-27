const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try {
        const { authorization } = req.headers
        if (!authorization) {
            return res.status(404).json({ mensagem: 'Token não encontrado' })
        }
        const token = authorization.replace('Bearer', '').trim()
        const { id } = jwt.verify(token, process.env.JWT_SECRET)
        req.usuarioId = id
        next()
    } catch (error) {
        return res.status(400).json({ mensagem: 'Token inválido' })
    }
}