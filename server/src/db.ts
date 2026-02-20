import { Pool } from 'pg';

// Configuração do Pool de conexões (Padrão para APIs robustas)
const pool = new Pool({
    user: 'luciano',       // Seu usuário do Mac
    host: 'localhost',
    database: 'luciano',   // O banco que vimos no seu DBeaver
    password: '',          // Sem senha no Postgres.app local
    port: 5432,
});

// Evento para avisar que deu certo
pool.on('connect', () => {
    console.log('📦 Conectado ao banco de dados PostgreSQL!');
});

// Exportamos uma função genérica para rodar as queries depois
export const query = (text: string, params?: any[]) => pool.query(text, params);