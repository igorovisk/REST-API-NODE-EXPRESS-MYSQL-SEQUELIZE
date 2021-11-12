module.exports = (sequelize, DataTypes) => {
    const Usuarios = sequelize.define("Usuarios", {
        nome: DataTypes.STRING,
        cpf: DataTypes.STRING,
        login: DataTypes.STRING,
        password: DataTypes.STRING,
        dataDeNascimento: DataTypes.DATEONLY,
        resetPassword: DataTypes.STRING,
        resetPasswordExpires: DataTypes.DATE,
        email: DataTypes.STRING,
        isAdm: DataTypes.BOOLEAN,
    })

    Usuarios.associate = (models) => {
        Usuarios.Habilidades = Usuarios.belongsToMany(models.Habilidades, {
            through: "Usuarios_Habilidades",
            as: "habilidades",
            foreignKey: "usuarioId",
        })
    }

    return Usuarios
}
