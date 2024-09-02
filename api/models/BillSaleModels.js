const { DataTypes } = require('sequelize');
const client = require('../config/connect');


const BillSaleModels = client.define('billSale',{
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    payData:{
        type: DataTypes.DATE,
    },
  
    userId:{
        type:DataTypes.BIGINT,
    },
    status:{
        type: DataTypes.STRING,
        defaultValue: "open",
        allowNull:false
    },
})

BillSaleModels.sync({alter: true})

module.exports = BillSaleModels