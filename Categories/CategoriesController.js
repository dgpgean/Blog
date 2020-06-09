const express = require('express')
const router = express.Router()
const category = require('./Categories')
const slugify = require('slugify')
const Article = require('../Articles/Article')
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/categories/new',adminAuth,(req,res)=>{
    res.render('admin/categories/new')
})



router.post('/categories/save',adminAuth,(req,res)=>{
    const title = req.body.title
    if(title != undefined){
        category.create({
            title:title,
            slug: slugify(title)
        }).then(()=>{
            res.redirect('/admin/categories')

        })
    }else{
        res.redirect('/admin/categories/new')
    }
})



router.get('/admin/categories',adminAuth,(req,res)=>{

    category.findAll().then(categories=>{
        res.render('admin/categories/index',{categories:categories})
    }) 
})


router.post('/categories/delete',adminAuth,(req,res)=>{
    const id = req.body.id
    if(id!=undefined){
        if(!isNaN(id)){

            category.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect('/admin/categories')
            })

        }else{
            res.redirect('/admin/categories')
        }
    }else{
        res.redirect('/admin/categories')   
    }
})



router.get('/admin/categories/edit/:id',adminAuth,(req,res)=>{
    const id = req.params.id
    if(isNaN(id)){
        res.redirect('/admin/categories')
    }
    category.findByPk(id).then(categoria=>{ // forma rapida de pesquisar pelo id
        if(categoria!=undefined){
            
            res.render('admin/categories/edit',{categoria:categoria})

        }else{
            res.redirect('/admin/categories')
        }
    }).catch(erro=>{
        res.redirect('/admin/categories')
    })
})

router.post('/categories/update',adminAuth,(req,res)=>{
    const id = req.body.id
    const title = req.body.title
    
    category.update({title:title,slug:slugify(title)},{where: {id:id}}).then(()=>{
        res.redirect('/admin/categories')
    })
    
})


module.exports = router