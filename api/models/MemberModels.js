const { DataTypes } = require('sequelize');
const client = require('../config/connect');

const MemberModels = client.define('member',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    packageId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pass:{
        type: DataTypes.STRING,
    }
});

MemberModels.sync({ alert: true });

module.exports = MemberModels;