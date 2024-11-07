const express = require('express');
const sequelize = require('./config/database');
const Tarefa = require('./models/Tarefa');
const tarefasRoutes = require('./routes/tarefas'); // Mover a importação aqui
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.json());

// Configurar as rotas
app.use('/api/tarefas', tarefasRoutes);

sequelize.sync({ force: true }) // Cuidado: Isso apagará dados existentes!
    .then(() => {
        console.log('Banco de dados sincronizado');
    })
    .catch(err => {
        console.error('Erro ao sincronizar o banco de dados:', err);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
