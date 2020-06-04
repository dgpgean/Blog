const express = require('express')
const router = express.Router()
const category = require('../Categories/Categories')
const article = require('./Article')
const slugfy = require('slugify')


router.get('/admin/articles',(req,res)=>{

    article.findAll({
        include:[{model:category}]
    }).then(articles =>{
        res.render('admin/articles/index',{
            articles
        })
    })    
})

router.get('/admin/articles/new',(req,res)=>{

    category.findAll().then(categories=>{
        res.render('admin/articles/new',{
            categories
        })
    })
})

router.post('/articles/save',(req,res)=>{
    const title = req.body.title
    const body = req.body.body
    var category = req.body.category

    article.create({
         title:title,
         slug:slugfy(title),
         body:body,
         categoriaId:category
    }).then(()=>{
        res.redirect('/admin/articles')
    })
})

router.get('/admin/articles/edit/:id',(req,res)=>{
    const id = req.params.id
    isNaN(id)?res.redirect('/admin/articles'):
    article.findByPk(id).then(article =>{
        if(article!=undefined){
            category.findAll().then(categories=>{
                res.render('admin/articles/edit',{article,categories})
            })
            
        }
        else{
            res.redirect('/admin/articles')
        }
    }).catch(err=>{
        res.redirect('/admin/articles')
    })
    
})

router.post('/articles/update',(req,res)=>{
    const id = req.body.id
    const title = req.body.title
    const body = req.body.body
    const categoryId = req.body.category

    article.update({title:title,slug:slugfy(title),body:body,caterogiaId:categoryId},{where:{id:id}}).then(()=>{
        res.redirect('/admin/articles')
    })
})



router.post('/articles/delete',(req,res)=>{
    const id = req.body.id
    if(id!=undefined){
        if(!isNaN(id)){

            article.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect('/admin/articles')
            })

        }else{
            res.redirect('/admin/articles')
        }
    }else{
        res.redirect('/admin/articles')   
    }
})

router.get('/articles/page/:num',(req,res)=>{
    let page = req.params.num
    let offset = 0
    if(isNaN(page) || page ==1){
        offset = 0
    }else{
        offset = (parseInt(page)-1)*4
    }

    article.findAndCountAll({
        limit:4,
        offset:offset,
        order:[
            ['id','DESC']
        ]
    }).then(articles=>{
        let next 
        if(offset+4 >= articles.count){
            next = false
        }else{
            next = true
        }
        var result = {next,articles,page:parseInt(page)}

        category.findAll().then(categories=>{
            res.render('admin/articles/page',{result,categories})
        })

        
    })
})


module.exports = router