module.exports = (sequelize, DataTypes) => {
    const Logs = sequelize.define("Logs", {

        descricao: DataTypes.TEXT,
        metodo: DataTypes.STRING,

    })    

    return Logs
}