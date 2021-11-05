const { Usuario } = require("./Usuario")

module.exports = (sequelize, DataTypes) => {
    const Habilidade = sequelize.define("Habilidades", {
        nome: DataTypes.STRING,
    })

    Habilidade.associate = (models) => {
        Habilidade.belongsToMany(models.Usuario, {
            through: "Usuarios_Habilidades",
            as: "usuarios",
            foreignKey: "habilidade_id",
        })
    }

    return Habilidade
}
