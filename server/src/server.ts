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

// Rota DELETE: EXCLUIR (Apaga um profissional pelo ID)
app.delete('/api/profissionais/:id', async (req, res) => {
    // Pegamos o ID que vem na URL (ex: /api/profissionais/3)
    const { id } = req.params;
    
    try {
        // Executamos o DELETE no banco de dados
        await query('DELETE FROM PROFISSIONAL WHERE id_profissional = $1', [id]);
        res.json({ message: 'Profissional excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir:', error);
        res.status(500).json({ error: 'Erro ao excluir profissional' });
    }
});

// Rota PUT: UPDATE (Atualiza um profissional existente)
app.put('/api/profissionais/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, nome_negocio, telefone_contato } = req.body;
    
    try {
        // Executamos o UPDATE no banco de dados
        await query(
            `UPDATE PROFISSIONAL 
             SET nome = $1, email = $2, nome_negocio = $3, telefone_contato = $4 
             WHERE id_profissional = $5`,
            [nome, email, nome_negocio, telefone_contato, id]
        );
        res.json({ message: 'Profissional atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        res.status(500).json({ error: 'Erro ao atualizar profissional' });
    }
});

app.listen(port, () => {
    console.log(`⚡ API rodando na porta http://localhost:${port}`);
});