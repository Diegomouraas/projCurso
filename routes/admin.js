const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria")
const Categorias = mongoose.model('categorias')
require("../models/Postagens")
const Postagens = mongoose.model("postagens")

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

router.get("/postagens", (req, res) => {
    res.render("admin/postagens")
})

router.get("/postagens/add", (req, res) => {
    Categorias.find().lean().then((categorias) => {
        res.render("admin/addpostagem", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Erro ao carregar")
        res.redirect("/admin/categorias")
    })
    
})

router.post("/postagens/nova", (req, res) => {
    var errors = []
    if(req.body.categoria == 0){
        errors.push({texto: "Categoria Invalida"})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagens(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro durante o save: ", err)
            res.redirect("/admin/postagens")
        })
    }


})

module.exports = router