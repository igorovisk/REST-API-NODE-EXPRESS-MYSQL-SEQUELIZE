module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define("Usuario", {
        nome: DataTypes.STRING,
        cpf: DataTypes.STRING,
        login: DataTypes.STRING,
        password: DataTypes.STRING,
        dataDeNascimento: DataTypes.DATEONLY,
        resetPassword: DataTypes.STRING,
        email: DataTypes.STRING,
        isAdm: DataTypes.BOOLEAN,
    })

    Usuario.associate = (models) => {
        Usuario.Habilidades = Usuario.belongsToMany(models.Habilidades, {
            through: "Usuarios_Habilidades",
            as: "habilidades",
            foreignKey: "usuarioId",
        })
    }
    return Usuario
}
