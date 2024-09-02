const { DataTypes } = require('sequelize');
const client = require('../config/connect');

const StockModels = client.define('stock',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    productId:{
        type:DataTypes.BIGINT,
    },
    qty:{
        type:DataTypes.BIGINT,
    },
    userId:{
        type:DataTypes.BIGINT,
    }
})

StockModels.sync({alter: true})

module.exports = StockModels