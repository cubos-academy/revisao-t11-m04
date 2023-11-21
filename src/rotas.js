const express = require('express')

const roteador = express()

const usuarioControlador = require('./controladores/usuario')
const feedControlador = require('./controladores/feed')

const verificaUsuarioLogado = require('./filtros/verifica-usuario-logado')

const validaLogin = require('./filtros/valida-login')
const validaCadastro = require('./filtros/valida-cadastro')
const validaSeguir = require('./filtros/valida-seguir')

roteador.post('/login', validaLogin, usuarioControlador.login)
roteador.post('/usuario', validaCadastro, usuarioControlador.cadastro)

roteador.use(verificaUsuarioLogado)
roteador.get('/usuario', usuarioControlador.perfil)

roteador.post('/seguidores', validaSeguir, usuarioControlador.seguir)

roteador.get('/feed', feedControlador.listarPosts)
roteador.post('/posts', feedControlador.criarPost)
roteador.delete('/posts/:id', feedControlador.deletarPost)


module.exports = roteador