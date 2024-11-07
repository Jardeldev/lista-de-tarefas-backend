const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Tarefa extends Model { }

Tarefa.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    custo: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    dataLimite: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    ordem: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
}, {
    sequelize,
    modelName: 'Tarefa',
});

module.exports = Tarefa;