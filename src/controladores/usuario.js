const knex = require('../conexao')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const login = async (req, res) => {
    const { email, senha } = req.body
    const usuario = await knex('usuarios').where({ email }).first()
    if (!usuario) {
        return res.status(400).json({ mensagem: 'Usuário não encontrado' })
    }
    const senhaVerificada = await bcrypt.compare(senha, usuario.senha)
    if (!senhaVerificada) {
        return res.status(400).json({ mensagem: 'Email e senha não confere' })
    }
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    return res.status(200).json({ token })
}

const cadastro = async (req, res) => {
    const { nome, email, senha } = req.body
    const existeUsuario = await knex('usuarios').where({ email }).first()
    if (existeUsuario) {
        return res.status(400).json({ mensagem: 'Email já cadastrado' })
    }
    const senhaCriptografada = await bcrypt.hash(senha, 10)
    const novoUsuario = await knex('usuarios')
        .insert({ nome, email, senha: senhaCriptografada })
        .returning(['id', 'nome', 'email'])
    return res.status(200).json(novoUsuario)
}


const perfil = async (req, res) => {
    const { usuarioId } = req

    const usuario = await knex('usuarios').where({ id: usuarioId }).first()
    if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' })
    }

    const usuarioConexaoQB = knex('usuarios')
        .join('conexoes', 'usuarios.id', 'conexoes.usuario_id')
        .select('usuarios.id', 'usuarios.nome', 'usuarios.email')

    const seguidores = await usuarioConexaoQB.where('conexoes.usuario_id', usuarioId)
    const seguindo = await usuarioConexaoQB.where('conexoes.seguidor_id', usuarioId)

    return res.status(200).json({
        ...usuario,
        seguidores,
        seguindo,
    })
}

const seguir = async (req, res) => {
    const existeConexao = await knex('conexoes').where({
        usuario_id: req.body.usuarioId,
        seguidor_id: req.usuarioId,
    }).first()
    if (existeConexao) {
        return res.status(400).json({ mensagem: 'Você já segue este usuário' })
    }
    await knex('conexoes').insert({
        usuario_id: req.body.usuarioId,
        seguidor_id: req.usuarioId,
    })
    return res.status(200).json({ mensagem: 'Usuário seguido com sucesso' })
}

module.exports = {
    login,
    cadastro,
    perfil,
    seguir,
}