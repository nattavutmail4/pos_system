const { DataTypes } = require('sequelize');
const client = require('../config/connect');

const PackageModels = client.define('package',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bill_amount: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    price: {
        type: DataTypes.BIGINT,
        allowNull: true
    }
});

PackageModels.sync({ alert: true });

module.exports = PackageModels;