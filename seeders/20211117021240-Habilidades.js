"use strict"

const novaData = new Date()
const novaDataFormatada = novaData.toISOString().replace("T", " ").split(".")
const now = novaDataFormatada[0]

module.exports = {
    up: async (queryInterface, Sequelize) =>
        queryInterface.bulkInsert(
            "Habilidades",
            [
                {
                    nome: "Html",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nome: "CSS",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nome: "Javascript",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nome: "C",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nome: "C++",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nome: ".NET",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nome: "GoLang",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nome: "Node",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nome: "React",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nome: "React Native",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nome: "Java",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nome: "NextJs",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nome: "Vue",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nome: "Kotlin",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nome: "Swift",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nome: "Flutter",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nome: "PHP",
                    createdAt: now,
                    updatedAt: now,
                },
            ],
            {}
        ),

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Habilidades", null, {})
    },
}
