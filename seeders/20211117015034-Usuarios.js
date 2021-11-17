"use strict"
const bcrypt = require("bcrypt")

//CRIADO PARA CRIPTOGRAFAR SENHA DO SEED AO BANCO

const senhaAdmSeeder = "admseeder"
const senhaUsuarioFicticio = "usuarioFicticio"

const criptografaSenha = async function (senha) {
  const senhaCriptografada = await bcrypt.hash(senha, 10) 
  return senhaCriptografada
}






//CRIADO POR CONTA DO CREATEDAT E UPDATEDAT DO SEQUELIZE ESTAR COMO REQUIRED
const novaData = new Date()
const novaDataFormatada = novaData.toISOString().replace("T", " ").split(".")
const now = novaDataFormatada[0]

module.exports = {
    up: async (queryInterface, Sequelize) =>
        queryInterface.bulkInsert(
            "Usuarios",
            [
                {
                    nome: "admSeeder",
                    cpf: "00000000000",
                    login: "admseeder",
                    password: await criptografaSenha(senhaAdmSeeder),
                    dataDeNascimento: "1994/02/01",
                    email: "admseeder@gmail.com",
                    isAdm: true,
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nome: "UsuarioFicticio",
                    cpf: "11111111111",
                    login: "usuarioficticio",
                    password: await criptografaSenha(senhaUsuarioFicticio),
                    dataDeNascimento: "1994/02/01",
                    email: "usuarioficticio@gmail.com",
                    isAdm: false,
                    createdAt: now,
                    updatedAt: now,
                },
            ],
            {}
        ),

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Usuarios", null, {})
    },
}
