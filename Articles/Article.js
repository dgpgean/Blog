const Sequilize = require('sequelize')
const conection = require('../DataBase/DataBase')
const category = require('../Categories/Categories')

const Article = conection.define('artigos',{
    title:{
        type:Sequilize.STRING,
        allowNull: false,

    },
    slug:{
        type:Sequilize.STRING,
        allowNull:false
    },
    body:{
        type:Sequilize.TEXT,
        allowNull:false
    }
})
category.hasMany(Article) // tem muitos artigos
Article.belongsTo(category)// tem uma categoria

//Article.sync({force:true})
module.exports = Article 