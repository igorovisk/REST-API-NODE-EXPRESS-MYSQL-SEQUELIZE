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
            usuario_id: {
                type: Sequelize.INTEGER,
                references: { model: "Usuarios", key: "id" },
                //SE DELETAR UM USUARIO ID, A TABELA DE RELACIOMENTO TBM DELETARÁ, ISSO É O MODO CASCADE
                onDelete: "CASCADE",
                allowNull: false,
                
            },
            habilidade_id: {
                type: Sequelize.INTEGER,
                references: { model: "Habilidades", key: "id" },
                //SE DELETAR UM USUARIO ID, A TABELA DE RELACIOMENTO TBM DELETARÁ, ISSO É O MODO CASCADE
                onDelete: "CASCADE",
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
