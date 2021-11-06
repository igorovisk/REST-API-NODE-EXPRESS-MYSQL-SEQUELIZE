"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable("Usuarios_Habilidades", {
            // nome de tabela é no PLURAL
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            usuarioId: {
                type: Sequelize.INTEGER,
                references: { model: "Usuarios", targetKey: "id" },
               

                allowNull: false,
            },
            habilidadeId: {
                type: Sequelize.INTEGER,
                references: { model: "Habilidades", targetKey: "id" },
               

                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        })
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.dropTable("Usuarios_Habilidades")
    },
}
