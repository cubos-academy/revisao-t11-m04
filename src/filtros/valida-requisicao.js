module.exports = (joiSchema) => async (req, res, next) => {
    try {
        await joiSchema.validateAsync(req.body)
        next()
    } catch (error) {
        const errors = error.details.map(item => item.message)
        res.status(400).json({ erros: errors })
    }
}
