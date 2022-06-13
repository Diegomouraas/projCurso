// Carregando Modulos
const express = require('express');
const {engine} = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const admin = require("./routes/admin");
const path = require("path");
const mongoose = require('mongoose');
const session = require("express-session");
const flash = require('connect-flash');
const usuarios = require("./routes/usuario");

// Configure
    // Sessao
        app.use(session({
            secret: "lalala",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash());
    // Middlewares  
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next();
        })
    // BodyParser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
    // HandleBars
        app.engine('handlebars', engine({
            defaultLayout: 'main',
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true
            }
        }))
        app.set('view engine', 'handlebars');
    // Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect("mongodb://localhost/blogapp").then(() => {
            console.log("conectado ao DB Mongo")
        }).catch((erro) => {
            console.log("Deu m na conexao com o DB: " + erro)
        })
    // Public
        app.use(express.static(path.join(__dirname, "/public")))
// Rotas
    app.use('/admin', admin)
    app.use("/usuarios", usuarios)
// outros
    const port = 8080
    app.listen(port, () => {
        console.log("Servidor aberto na porta: "+ port)
    });