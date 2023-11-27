require('dotenv').config()

const express = require('express')

const app = express()
app.use(express.json())
app.use(require('./rotas'))

app.listen(process.env.PORT, () => {
    console.log('Servidor rodando em http://localhost:3000')
})