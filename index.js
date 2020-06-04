const express = require('express')
const app = express()
const conection = require('./DataBase/DataBase')

const categoriesController = require('./Categories/CategoriesController')
const articleController = require('./Articles/ArticleController')

const Article = require('./Articles/Article')
const Category = require('./Categories/Categories')


// configuração do ejs
app.set('view engine','ejs')
// pasta Public
app.use(express.static('Public'))


// pra pegar dados dos fomularios
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//conecção com o banco
conection.authenticate().then(()=>{
    console.log('Conectado com o banco!')
}).catch((erro)=>{
    console.log(erro)
})

app.use('/',categoriesController)
app.use('/',articleController)

//rotas
app.get('/',(req,res)=>{

    Article.findAll({
        order:[['id','DESC']],limit:4
    }).then(articles =>{
        Category.findAll().then((categories)=>{
            res.render('index',{articles,categories})
        })
    })
    
})


app.post('/teste',(req,res)=>{
    const n1 = 0
    res.redirect('/',{
        n1:n1
    })
})

app.get('/:slug',(req,res)=>{
    const slug = req.params.slug
    Article.findOne({
        where:{slug:slug}
    }).then(article=>{
        if(article!=undefined){
            Category.findAll().then((categories)=>{
                res.render('article',{article,categories})
            })
        }else{
            res.redirect('/')
        }
    }).catch(err=>{
        res.redirect('/')
    })
})

app.get('/category/:slug',(req,res)=>{
    const slug = req.params.slug
    Category.findOne({
        where:{slug:slug},
        include:[{model:Article}]
    }).then(category =>{    
        if(category!=undefined){           
            Category.findAll().then(categories=>{
                res.render('index',{articles:category.artigos,categories:categories})
            })           
        }else{
            res.send('caiu no else')
        }
    }).catch(err=>{
        res.send('erro')
    })
})

app.listen(8080,()=>{
    console.log('Servidor Rodando')
})