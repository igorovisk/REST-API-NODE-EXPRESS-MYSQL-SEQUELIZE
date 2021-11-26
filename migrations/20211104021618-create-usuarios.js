"use strict"

const bcrypt = require("bcrypt")

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable("Usuarios", {
            // nome de tabela é no PLURAL
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            nome: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            cpf: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            login: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
                select: false, 
            },
            dataDeNascimento: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            resetPassword: {
                type: Sequelize.STRING,
                allowNull: true,
                select: false, 
            },
            resetPasswordExpires: {
                type: Sequelize.DATE,
                select: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            isAdm: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                default: false,
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
        return queryInterface.dropTable("Usuarios")
    },
}
