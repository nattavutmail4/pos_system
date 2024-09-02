const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('db_workshop_pos', 'postgres', '123456', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
    port: 5432
});

module.exports = sequelize;