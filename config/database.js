const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tarefas_db', 'postgres', '123', {
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize;