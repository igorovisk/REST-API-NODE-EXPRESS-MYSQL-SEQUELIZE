module.exports = (sequelize, DataTypes) => {
    const Habilidades = sequelize.define("Habilidades", {
        nome: DataTypes.STRING,
    })

    Habilidades.associate = (models) => {
            
        Habilidades.Usuarios = Habilidades.belongsToMany(models.Usuarios, {
            through: "Usuarios_Habilidades",
            as: "usuarios",
            foreignKey: "habilidadeId",
        })          
            
        Habilidades.NivelHabilidades = Habilidades.belongsToMany(models.NivelHabilidades, {
            through: "Usuarios_Habilidades",
            as: "nivelHabilidades",
            foreignKey: "habilidadeId",
        })
    
    }

    

    return Habilidades
}
