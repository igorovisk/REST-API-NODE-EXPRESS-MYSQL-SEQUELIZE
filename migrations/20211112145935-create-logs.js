"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable("Logs", {
            // nome de tabela é no PLURAL
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            descricao: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            metodo: {
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
        return queryInterface.dropTable("Logs")
    },
}
