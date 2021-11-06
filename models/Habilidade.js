

module.exports = (sequelize, DataTypes) => {
    const Habilidade = sequelize.define("Habilidades", {
        nome: DataTypes.STRING,
    })

    Habilidade.associate = (models) => {
            
        Habilidade.Usuario = Habilidade.belongsToMany(models.Usuario, {
            through: "Usuarios_Habilidades",
            as: "usuarios",
            foreignKey: "habilidadeId",
        })
    }

    return Habilidade
}
