const { DataTypes } = require('sequelize');
const client = require('../config/connect');

const BillSaleDetailModels = client.define('billSaleDetail',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    billSaleId:{
        type:DataTypes.BIGINT,
    },
    productId:{
        type:DataTypes.BIGINT,
    },
    qty:{
        type:DataTypes.BIGINT,
    },
    price:{
        type:DataTypes.BIGINT,
    },
    userId:{
        type:DataTypes.BIGINT,
    }
})

BillSaleDetailModels.sync({alter: true})

module.exports = BillSaleDetailModels