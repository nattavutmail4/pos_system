const { DataTypes } = require('sequelize');
const client = require('../config/connect');
const ProductModels = client.define('product',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    barcode: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING,
    },
    cost: {
        type: DataTypes.BIGINT,
    },
    price: {
        type: DataTypes.BIGINT,
    },
    detail: {
        type: DataTypes.STRING,
    },
    userId:{
        type: DataTypes.BIGINT,
    }
})
ProductModels.sync({alter: true})

module.exports = ProductModels;