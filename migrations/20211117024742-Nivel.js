"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable("Nivel", {
            // nome de tabela é no PLURAL
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            nivel: {
                type: Sequelize.STRING,
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
        return queryInterface.dropTable("Nivel")
    },
}
