"use strict"

const novaData = new Date()
const novaDataFormatada = novaData
    .toISOString()
    .replace("T", " ")
    .split(".")
const now = novaDataFormatada[0]


module.exports = {
    up: async (queryInterface, Sequelize) => queryInterface.bulkInsert ( 
        "Usuarios",
            [
                {
                    nome: "admSeeder",
                    cpf: "00000000000",
                    login: "admseeder",
                    password: "admseeder",
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
                    password: "usuarioficticio",
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
