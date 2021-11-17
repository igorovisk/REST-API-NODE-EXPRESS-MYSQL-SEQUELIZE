"use strict"
//CRIADO POR CONTA DO CREATEDAT E UPDATEDAT DO SEQUELIZE ESTAR COMO REQUIRED
const novaData = new Date()
const novaDataFormatada = novaData.toISOString().replace("T", " ").split(".")
const now = novaDataFormatada[0]

module.exports = {
    up: async (queryInterface, Sequelize) =>
        queryInterface.bulkInsert(
            "Nivel",
            [
                {
                    nivel: "basico",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nivel: "intermediario",
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    nivel: "avançado",
                    createdAt: now,
                    updatedAt: now,
                },
            ],
            {}
        ),

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Nivel", null, {})
    },
}
