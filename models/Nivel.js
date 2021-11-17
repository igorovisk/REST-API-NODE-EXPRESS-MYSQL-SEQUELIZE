module.exports = (sequelize, DataTypes) => {
    const Nivel = sequelize.define("Nivel", {
        nivel: DataTypes.STRING,
    })

    Nivel.associate = (models) => {
        Nivel.Habilidades = Nivel.belongsToMany(
            models.Habilidades,
            {
                through: "Usuarios_Habilidades",
                as: "nivel",
                foreignKey: "nivelHabilidadesId",
            }
        )
    }

    return Nivel
}
