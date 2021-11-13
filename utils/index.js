const { Usuarios } = require("../models")

const checkIfIsAdmin = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            login: req.login,
        },
    })
    return usuario?.isAdm
}

module.exports = checkIfIsAdmin
