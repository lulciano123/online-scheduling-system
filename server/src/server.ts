import express from 'express';
import cors from 'cors';
import { query } from './db';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Muito importante: ensina o Express a ler JSON no POST

app.get('/api/status', (req, res) => {
    res.json({ message: '🚀 Servidor rodando liso no Mac M4!' });
});

// Rota GET: READ (Busca os profissionais)
app.get('/api/profissionais', async (req, res) => {
    try {
        const result = await query('SELECT * FROM PROFISSIONAL ORDER BY id_profissional DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro na query:', error);
        res.status(500).json({ error: 'Erro ao buscar dados no banco' });
    }
});

// Rota POST: CREATE (Salva um novo profissional)
app.post('/api/profissionais', async (req, res) => {
    // 1. Pegamos os dados que o React vai enviar no 'body' da requisição
    const { nome, email, senha, nome_negocio, telefone_contato } = req.body;
    
    try {
        // 2. Executamos o INSERT no banco de dados
        await query(
            `INSERT INTO PROFISSIONAL (nome, email, senha, nome_negocio, telefone_contato) 
             VALUES ($1, $2, $3, $4, $5)`,
            [nome, email, senha, nome_negocio, telefone_contato]
        );
        res.status(201).json({ message: 'Profissional cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao inserir:', error);
        res.status(500).json({ error: 'Erro ao cadastrar profissional' });
    }
});

app.listen(port, () => {
    console.log(`⚡ API rodando na porta http://localhost:${port}`);
});