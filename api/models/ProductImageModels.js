const { DataTypes } = require('sequelize');
const client = require('../config/connect');

const ProductImageModels  = client.define('productImage',{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    productId:{
        type:DataTypes.BIGINT,
    },
    imageName:{
        type:DataTypes.STRING,
    },
    isMain:{
        type:DataTypes.BOOLEAN,
    }
})
ProductImageModels.sync({alter:true})
module.exports = ProductImageModels