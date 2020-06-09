const Sequelize = require('sequelize')
const connection = require('../DataBase/DataBase')

const user = connection.define('users',{
    email:{
        type:Sequelize.STRING,
        allowNull: false,

    },
    password :{
        type:Sequelize.STRING,
        allowNull:false
    },
})
//user.sync({force:true})
module.exports = user