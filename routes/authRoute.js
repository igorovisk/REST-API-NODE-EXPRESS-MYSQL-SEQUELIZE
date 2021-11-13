//IMPORTS
const {
    login,
    logout,
    esqueceuSenha,
    resetaPassword,
} = require("../controllers/authController")
const { Router } = require("express")
const router = Router()

///////////////////////////////////////////////////////////////////
//ROTAS



//FAZ LOGIN E RECEBE TOKEN JWT
router.post("/login", async (req, res) => {
    login(req, res)
})
//FAZ LOGOUT
router.post("/logout", (req, res) => {
    logout(req, res)
})

//ESQUECEU PASSWORD, ENVIA POR EMAIL
router.post("/forgotpassword", async (req, res) => {
    esqueceuSenha(req, res)
})

//RESETA PASSWORD
router.post("/resetPassword", async (req, res) => {
    resetaPassword(req, res)
})

module.exports = router
