module.exports = (sequelize, DataTypes) => {
    const NivelHabilidades = sequelize.define("NivelHabilidades", {
        nivel: DataTypes.STRING,
    })

    NivelHabilidades.associate = (models) => {
        NivelHabilidades.Habilidades = NivelHabilidades.belongsToMany(
            models.Habilidades,
            {
                through: "Usuarios_Habilidades",
                as: "NivelHabilidades",
                foreignKey: "nivelHabilidadesId",
            }
        )
    }

    return NivelHabilidades
}
