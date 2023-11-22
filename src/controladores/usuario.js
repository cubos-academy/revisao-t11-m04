const conexao = require('../conexao')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
    const { email, senha } = req.body
    const query = 'select * from usuarios where email = $1'
    const { rows, rowCount } = await conexao.query(query, [email])
    if (!rowCount) {
        return res.status(400).json({ mensagem: 'Usuário não encontrado' })
    }
    const usuario = rows[0]
    const senhaVerificada = await bcrypt.compare(senha, usuario.senha)
    if (!senhaVerificada) {
        return res.status(400).json({ mensagem: 'Email e senha não confere' })
    }
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    return res.status(200).json({ token })
}

const cadastro = async (req, res) => {
    const { nome, email, senha } = req.body
    const { rowCount } = await conexao.query('select id from usuarios where email = $1', [email])
    console.log(rowCount)
    if (rowCount > 0) {
        return res.status(400).json({ mensagem: 'Email já cadastrado' })
    }
    const senhaCriptografada = await bcrypt.hash(senha, 10)
    const query = 'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning id, nome, email'
    const usuario = await conexao.query(query, [nome, email, senhaCriptografada])
    if (usuario.rowCount === 0) {
        return res.status(400).json({ mensagem: 'Não foi possível cadastrar o usuário' })
    }
    return res.status(200).json(usuario.rows[0])
}


const perfil = async (req, res) => {
    const { usuarioId } = req
    const dadosUsuario = await conexao.query('select id, nome, email from usuarios where id = $1', [usuarioId])
    if (dadosUsuario.rowCount === 0) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' })
    }
    const seguidores = await conexao.query('select u.id, u.nome, u.email from usuarios u inner join conexoes c on u.id = c.usuario_id where c.usuario_id = $1', [usuarioId])
    const seguindo = await conexao.query('select u.id, u.nome, u.email from usuarios u inner join conexoes c on u.id = c.usuario_id where c.seguidor_id = $1', [usuarioId])
    return res.status(200).json({
        ...dadosUsuario.rows[0],
        seguidores: seguidores.rows,
        seguindo: seguindo.rows,
    })
}

const seguir = async (req, res) => {
    const { rowCount } = await conexao.query(
        'select * from conexoes where usuario_id=$1 and seguidor_id=$2',
        [req.body.usuarioId, req.usuarioId]
    )
    if (rowCount > 0) {
        return res.status(400).json({ mensagem: 'Você já segue este usuário' })
    }
    const query = 'insert into conexoes (usuario_id, seguidor_id) values ($1, $2)'
    const conexaoUsuario = await conexao.query(query, [req.body.usuarioId, req.usuarioId])
    if (!conexaoUsuario.rowCount) {
        return res.status(400).json({ mensagem: 'Não foi possível seguir o usuário' })
    }
    return res.status(200).json({ mensagem: 'Usuário seguido com sucesso' })
}

module.exports = {
    login,
    cadastro,
    perfil,
    seguir,
}