const Sequilize = require('sequelize')
const conection = require('../DataBase/DataBase')

const Category = conection.define('categorias',{
    title:{
        type:Sequilize.STRING,
        allowNull: false,

    },
    slug:{
        type:Sequilize.STRING,
        allowNull:false
    }
})

//Category.sync({force:true})
module.exports = Category