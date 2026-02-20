import express from 'express';
import cors from 'cors';
import { query } from './db';

const app = express();
const port = 3000;

// Middlewares
app.use(cors()); // Libera o acesso para o React depois
app.use(express.json()); // Permite receber dados em JSON

// Rota de Health Check (pra ver se a API tá viva)
app.get('/api/status', (req, res) => {
    res.json({ message: '🚀 Servidor rodando liso no Mac M4!' });
});

// Rota para testar a busca no Banco de Dados
app.get('/api/profissionais', async (req, res) => {
    try {
        const result = await query('SELECT * FROM PROFISSIONAL');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro na query:', error);
        res.status(500).json({ error: 'Erro ao buscar dados no banco' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`⚡ API rodando na porta http://localhost:${port}`);
});