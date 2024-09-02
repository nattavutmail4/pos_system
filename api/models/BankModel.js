const { DataTypes } = require('sequelize');
const client = require('../config/connect');

const BankModel = client.define('bank',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    bankType:{
        type:DataTypes.STRING,
    },
    bankCode:{
        type:DataTypes.STRING,
    },
    bankName:{
        type:DataTypes.STRING,
    },
    bankBranch:{
        type:DataTypes.STRING,
    },
})

BankModel.sync({alter: true})

module.exports = BankModel