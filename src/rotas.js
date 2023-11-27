const express = require('express')

const roteador = express()

const usuarioControlador = require('./controladores/usuario')
const feedControlador = require('./controladores/feed')

const verificaUsuarioLogado = require('./filtros/verifica-usuario-logado')

const loginValidacao = require('./validacoes/login-validacao')
const usuarioValidacao = require('./validacoes/usuario-validacao')


const validaSeguir = require('./filtros/valida-seguir')
const validaRequisicao = require('./filtros/valida-requisicao')

roteador.post('/login', validaRequisicao(loginValidacao), usuarioControlador.login)
roteador.post('/usuario', validaRequisicao(usuarioValidacao), usuarioControlador.cadastro)

roteador.use(verificaUsuarioLogado)
roteador.get('/usuario', usuarioControlador.perfil)

roteador.post('/seguidores', validaSeguir, usuarioControlador.seguir)

roteador.get('/feed', feedControlador.listarPosts)
roteador.post('/posts', feedControlador.criarPost)
roteador.delete('/posts/:id', feedControlador.deletarPost)


module.exports = roteador