# Gira API

## Configuração

```
Defina o seu arquivo .env utilizando o .env.exemplo
```

## Documentação

Esta a API Rest para servir dados para plataforma Gira.

### RF01 - Cadastro de usuário

Esta funcionalidade será responsável por cadastrar um usuário no sistema permitindo acesso a outras funcionalidades.

**Critérios de aceite**
```
- Deve receber um email valido
- Deve receber uma senha com no minimo 6 caracteres
- Deve receber um nome com no minimo 6 caracteres
- Deve retornar o status code 201 quando o usuário for cadastrado
- Não deve ter dois usuários com mesmo email
```

#### POST /login

**Entrada**

```json
// content-type: application/json
{
    "nome": "Silas",
    "email": "silas@mail.com",
    "senha": "123456"
}
```

**Saídas**

```json
// content-type: application/json
// status-code: 201
{
    "id": 1,
    "nome": "Silas",
    "email": "silas@mail.com"
}
```

```json
// content-type: application/json
// status-code: 400
{
    "erro": "Falta o campo nome"
}
```

```json
// content-type: application/json
// status-code: 400
{
    "erro": "Falta o campo email"
}
```

Tentativa de cadastro com email duplicado
```json
// content-type: application/json
// status-code: 409
{
    "erro": "Usuário já cadastrado com este e-mail"
}
```




### RF02 - Login de usuário

> Dependências: RF01


### RF03 - Visualização do perfil do usuário logado

### RF04 - Visualização de Feed Geral
