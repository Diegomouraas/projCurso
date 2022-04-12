const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria")
const Categorias = mongoose.model('categorias')

router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/posts', (req, res) =>{
    res.send("pagina de posts")
})

router.get('/categorias', (req, res) => {

    Categorias.find().lean().then((categorias) => {
        if(categorias.length == 0) {
            req.flash("error_msg", "nada encontrado")
            res.redirect("/admin")
        }else{
            res.render("admin/categorias", {categorias: categorias})
            
        }
        
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        console.log(erro)
        res.redirect("/admin")
    })
    //res.render("admin/categorias")
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', (req, res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "nome invalido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({texto: "slug invalido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome muito pequeno"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categorias(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada")
            res.redirect("/admin/categorias")
            
        }).catch((err) => {
            req.flash("error_msg", "houve um erro na categoria")
            res.redirect("/admin")
        })
        
    }

    
})

router.get("/categorias/edit/:id", (req, res) => {
    Categorias.findOne({_id:req.params.id}).then((categoria) => {
        let id = categoria._id
        console.log(id);
        console.log(categoria)
        res.render("admin/editCategoria", {categoria: categoria})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não exxistente.");
        res.redirect("/admin/categorias")
    })
    
})

router.post("/categorias/edit", (req, res) => {
    Categorias.findOne({_id:req.body.id}).then((categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        console.log(categoria)

        categoria.save().then(() => {
            req.flash("success_msg", "Categoria alterada!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Houve um erro interno ao editar")
            res.redirect("/admin/categorias")
        })

    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Houve um erro ao editar")
        res.redirect("/admin/categorias")
    })
})

router.post("/categoria/deletar", (req, res) => {
    Categorias.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar")
        res.redirect("/admin/categorias")
    })
})

module.exports = router