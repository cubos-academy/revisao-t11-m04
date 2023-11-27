const conexao = require('../conexao')

const criarPost = async (req, res) => {
    const { conteudo } = req.body
    const { usuarioId } = req
    const { rows, rowCount } = await conexao.query(
        'insert into posts (conteudo, usuario_id) values ($1, $2) returning *',
        [conteudo, usuarioId]
    )
    if (rowCount === 0) {
        return res.status(400).json({ mensagem: 'Não foi possível criar o post' })
    }
    return res.status(200).json({ mensagem: 'Post criado com sucesso', post: rows[0] })
}

const listarPosts = async (req, res) => {
    const { usuario } = req.query
    if (usuario === 'seguindo') {
        const seguidores = await conexao.query('select usuario_id from conexoes where seguidor_id = $1', [req.usuarioId])
        const ids = seguidores.rows.map(item => item.usuario_id)
        const query = `select p.*, u.nome from posts p inner join usuarios u on p.usuario_id = u.id where p.usuario_id = ANY($1) order by p.id desc`
        const { rows } = await conexao.query(query, [ids])
        return res.status(200).json(rows)
    }

    if (usuario) {
        const { rows } = await conexao.query('select * from posts where usuario_id = $1', [usuario])
        return res.status(200).json(rows)
    }
    const { rows } = await conexao.query('select * from posts')
    return res.status(200).json(rows)
}



const deletarPost = async (req, res) => {
    const { id } = req.params
    const { usuarioId } = req
    const query = 'select * from posts where id = $1'
    const { rows, rowCount } = await conexao.query(query, [id])
    if (rowCount === 0) {
        return res.status(404).json({ mensagem: 'Post não encontrado' })
    }
    const post = rows[0]
    if (post.usuario_id !== usuarioId) {
        return res.status(403).json({ mensagem: 'Você não tem permissão para deletar este post' })
    }
    const queryDeletar = 'delete from posts where id = $1'
    const postDeletado = await conexao.query(queryDeletar, [id])
    if (postDeletado.rowCount === 0) {
        return res.status(400).json({ mensagem: 'Não foi possível deletar o post' })
    }
    return res.status(200).json({ mensagem: 'Post deletado com sucesso' })
}

module.exports = {
    listarPosts,
    criarPost,
    deletarPost
}