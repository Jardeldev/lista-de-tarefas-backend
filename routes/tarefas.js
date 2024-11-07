const express = require('express');
const Tarefa = require('../models/Tarefa');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
    try {
        const tarefas = await Tarefa.findAll();
        res.json(tarefas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar tarefas' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const tarefa = await Tarefa.findByPk(id);
        if (!tarefa) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        return res.json(tarefa);
    } catch (error) {
        console.error('Erro ao buscar tarefa', error);
        return res.status(500).json({ error: 'Erro ao buscar tarefa' });
    }
});

router.post(
    '/',
    [
        body('nome').notEmpty().withMessage('O nome da tarefa é obrigatório.'),
        body('custo').isFloat({ gt: 0 }).withMessage('O custo da tarefa deve ser um número maior que zero.'),
        body('dataLimite').isISO8601().withMessage('A data limite da tarefa deve estar no formato ISO8601.')
    ],

    async (req, res) => {
        const { nome, custo, dataLimite } = req.body;

        try {
            const existingTarefa = await Tarefa.findOne({ where: { nome } });
            if (existingTarefa) {
                return res.status(400).json({ error: 'Uma tarefa com esse nome já existe.' });
            }

            const ordem = await Tarefa.count() + 1;
            const novaTarefa = await Tarefa.create({ nome, custo, dataLimite, ordem });
            return res.status(201).json(novaTarefa);
        } catch (error) {
            console.error('Erro ao criar tarefa', error);
            return res.status(500).json({ error: 'Erro ao criar tarefa' });
        }
    });

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, custo, dataLimite } = req.body;

    try {
        const tarefa = await Tarefa.findByPk(id);
        if (!tarefa) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        tarefa.nome = nome || tarefa.nome;
        tarefa.custo = custo || tarefa.custo;
        tarefa.dataLimite = dataLimite || tarefa.dataLimite;

        await tarefa.save();
        return res.json(tarefa);
    } catch (error) {
        console.error('Erro ao atualizar tarefa', error);
        return res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const tarefa = await Tarefa.findByPk(id);
        if (!tarefa) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        await tarefa.destroy();
        return res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar tarefa', error);
        return res.status(500).json({ error: 'Erro ao deletar tarefa' });
    }
});
router.put('/ordenar', async (req, res) => {
    const tarefas = req.body; // Dados recebidos do front-end
    
    if (!Array.isArray(tarefas)) {
      return res.status(400).json({ message: 'Esperado um array de tarefas.' });
    }

    try {
      for (const tarefa of tarefas) {
        const { id, ordem } = tarefa;
        if (!id || typeof ordem !== 'number') {
          return res.status(400).json({ message: 'Dados inválidos para a tarefa.' });
        }

        // Atualiza a ordem da tarefa no banco de dados
        await Tarefa.update({ ordem }, { where: { id } });
      }

      res.status(200).json({ message: 'Ordem das tarefas atualizada com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar ordem das tarefas:', error);
      res.status(500).json({ message: 'Erro ao atualizar ordem das tarefas', error });
    }
});

module.exports = router;