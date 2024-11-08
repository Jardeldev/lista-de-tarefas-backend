const { Sequelize } = require('sequelize');

// Configurando o Sequelize para usar variáveis de ambiente
const sequelize = new Sequelize(
    process.env.DB_NAME || 'tarefas_db',          // Nome do banco de dados
    process.env.DB_USER || 'postgres',            // Usuário do banco de dados
    process.env.DB_PASSWORD || '123',             // Senha do banco de dados
    {
        host: process.env.DB_HOST || 'localhost', // Host do banco de dados
        port: process.env.DB_PORT || 5432,        // Porta do banco de dados
        dialect: 'postgres',                      // Dialeto do banco de dados (PostgreSQL)
        logging: false,                           // Opcional: desativa logs do Sequelize no console
    }
);

module.exports = sequelize;
