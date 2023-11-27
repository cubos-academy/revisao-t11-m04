const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
});

const templates = {
    boasVindas: ({ nome }) => ({
        subject: 'Bem-vindo ao Gira',
        html: `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Boas Vindas</title>
    </head>
    <body>
        <center>Seja bem-vindo, ${nome}</center>
    </body>
    </html>
    `.trim()
    })
}

const enviarUsandoTemplate = async ({ email, nome, template }) => {
    if (!email) {
        throw new Error('Usuário não tem email')
    }
    if (!nome) {
        throw new Error('Usuário não tem nome')
    }
    if (!template) {
        throw new Error('Template não tem HTML')
    }
    await transport.sendMail({
        from: 'from@example.com',
        to: `${nome} <${email}>`,
        ...templates[template](nome)
    })
}

module.exports = { enviarUsandoTemplate };
