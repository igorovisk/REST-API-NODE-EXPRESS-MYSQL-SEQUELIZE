const nodemailer = require("nodemailer")
const hbs = require('nodemailer-express-handlebars')
const path = require('path')
const {host, port, user, pass} = require("../config/mail")

const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user,pass }
    
})
const handlebarOptions = {
    viewEngine: {
        extName: ".html",
        partialsDir: path.resolve('./resources/mail'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./resources/mail'),
    extName: ".html",
};

transport.use('compile', hbs(handlebarOptions));

module.exports = transport