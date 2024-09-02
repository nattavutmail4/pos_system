const { DataTypes } = require('sequelize');
const client = require('../config/connect');

const AdminModel = client.define('admin',{
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type:DataTypes.STRING,
    },
    usr:{
        type:DataTypes.STRING,
    },
    pwd:{
        type:DataTypes.STRING
    },
    level:{
        type:DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING
    }
    
})

AdminModel.sync({alter: true})

module.exports = AdminModel