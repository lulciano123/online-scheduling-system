-- ==============================================================================
-- PROJETO PRÁTICO DE BANCO DE DADOS - GRUPO 12
-- SISTEMA DE AGENDAMENTO ONLINE
-- ==============================================================================

-- 0. LIMPEZA GERAL (Garante que o script pode ser rodado múltiplas vezes)
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- ==============================================================================
-- 1. DDL: CRIAÇÃO DO BANCO DE DADOS, TABELAS E RESTRIÇÕES
-- ==============================================================================

CREATE TABLE PROFISSIONAL (
    id_profissional SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    nome_negocio VARCHAR(100),
    telefone_contato VARCHAR(20),
    endereco TEXT
);

CREATE TABLE CATEGORIA_SERVICO (
    id_categoria SERIAL PRIMARY KEY,
    nome_categoria VARCHAR(50) NOT NULL,
    descricao TEXT
);

CREATE TABLE CLIENTE (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20)
);

CREATE TABLE SERVICO (
    id_servico SERIAL PRIMARY KEY,
    nome_servico VARCHAR(100) NOT NULL,
    descricao TEXT,
    duracao_minutos INT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    id_profissional INT NOT NULL,
    id_categoria INT NOT NULL,
    FOREIGN KEY (id_profissional) REFERENCES PROFISSIONAL(id_profissional) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES CATEGORIA_SERVICO(id_categoria)
);

CREATE TABLE JORNADA_DE_TRABALHO (
    id_jornada SERIAL PRIMARY KEY,
    dia_da_semana VARCHAR(20) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    inicio_intervalo TIME,
    fim_intervalo TIME,
    id_profissional INT NOT NULL,
    FOREIGN KEY (id_profissional) REFERENCES PROFISSIONAL(id_profissional) ON DELETE CASCADE
);

CREATE TABLE BLOQUEIO_AGENDA (
    id_bloqueio SERIAL PRIMARY KEY,
    data_hora_inicio TIMESTAMP NOT NULL,
    data_hora_fim TIMESTAMP NOT NULL,
    motivo TEXT,
    id_profissional INT NOT NULL,
    FOREIGN KEY (id_profissional) REFERENCES PROFISSIONAL(id_profissional) ON DELETE CASCADE
);

-- Tabela corrigida (sem id_profissional) conforme feedback do Modelo Lógico
CREATE TABLE AGENDAMENTO (
    id_agendamento SERIAL PRIMARY KEY,
    data_hora_inicio TIMESTAMP NOT NULL,
    data_hora_fim TIMESTAMP, 
    status VARCHAR(20) DEFAULT 'Agendado',
    id_cliente INT NOT NULL,
    id_servico INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES CLIENTE(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_servico) REFERENCES SERVICO(id_servico)
);

-- ==============================================================================
-- 2. PROCESSAMENTO ATIVO: GATILHOS (TRIGGERS) E FUNÇÕES
-- ==============================================================================
-- Regra de negócio: Calcula a hora de término do agendamento automaticamente 
-- com base na duração do serviço escolhido.

CREATE OR REPLACE FUNCTION calcular_fim_agendamento()
RETURNS TRIGGER AS $$
DECLARE
    duracao INT;
BEGIN
    SELECT duracao_minutos INTO duracao FROM SERVICO WHERE id_servico = NEW.id_servico;
    
    -- Só calcula se o usuário/sistema não informou a hora final
    IF NEW.data_hora_fim IS NULL THEN
        NEW.data_hora_fim := NEW.data_hora_inicio + (duracao || ' minutes')::INTERVAL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calcula_fim_agendamento
BEFORE INSERT ON AGENDAMENTO
FOR EACH ROW
EXECUTE FUNCTION calcular_fim_agendamento();


-- ==============================================================================
-- 3. DML: OPERAÇÕES DE INSERÇÃO DE DADOS (INSTANCIAÇÃO)
-- ==============================================================================

INSERT INTO PROFISSIONAL (nome, email, senha, nome_negocio, telefone_contato) VALUES
('Carlos Oliveira', 'carlos@studio.com', 'hash123', 'Carlos Studio Hair', '51999999999'),
('Fernanda Costa', 'fernanda@consulting.com', 'hash456', 'FC Consultoria Tech', '53999990000');

INSERT INTO CATEGORIA_SERVICO (nome_categoria, descricao) VALUES 
('Cabelo', 'Cortes e tratamentos capilares'), 
('Barba', 'Estilização de barbas'), 
('Consultoria', 'Apoio técnico especializado');

INSERT INTO CLIENTE (nome, email, telefone) VALUES 
('Roberto Almeida', 'roberto@email.com', '53999991111'),
('Juliana Martins', 'juliana@teste.com', '53988882222'),
('Marcos Souza', 'marcos@gmail.com', '53977773333');

INSERT INTO SERVICO (nome_servico, descricao, duracao_minutos, preco, id_profissional, id_categoria) VALUES
('Corte Moderno', 'Corte com degradê', 45, 60.00, 1, 1), 
('Consultoria BD', 'Otimização de banco de dados', 60, 200.00, 2, 3),
('Hidratação', 'Hidratação profunda', 60, 120.00, 1, 1); 

-- Inserindo Jornada de Trabalho
INSERT INTO JORNADA_DE_TRABALHO (dia_da_semana, hora_inicio, hora_fim, id_profissional) VALUES
('Segunda', '09:00', '18:00', 2),
('Terça', '09:00', '18:00', 2);

-- Inserindo Agendamentos (Note que omitimos data_hora_fim para testar o Trigger)
INSERT INTO AGENDAMENTO (data_hora_inicio, id_cliente, id_servico) VALUES 
('2026-02-21 14:00:00', 1, 2), -- Roberto fará Consultoria BD com Fernanda (Duração 60m)
('2026-02-22 10:00:00', 2, 1), -- Juliana fará Corte Moderno com Carlos (Duração 45m)
('2026-02-22 15:00:00', 3, 3), -- Marcos fará Hidratação com Carlos (Duração 60m)
('2026-02-25 09:00:00', 1, 1); -- Roberto fará Corte Moderno com Carlos (Duração 45m)


-- ==============================================================================
-- 4. DQL: CONSULTAS (MÍNIMO DE 6, SENDO 4 COM JUNÇÕES)
-- ==============================================================================

-- CONSULTA 1 (Com JOIN Triplo): Agenda Detalhada do Sistema
-- Mostra agendamentos cruzando com dados do cliente, do serviço e do profissional
SELECT 
    A.id_agendamento,
    A.data_hora_inicio AS inicio_calculado,
    A.data_hora_fim AS fim_calculado_pelo_trigger,
    C.nome AS cliente,
    S.nome_servico AS servico,
    P.nome AS profissional
FROM AGENDAMENTO A
JOIN CLIENTE C ON A.id_cliente = C.id_cliente
JOIN SERVICO S ON A.id_servico = S.id_servico
JOIN PROFISSIONAL P ON S.id_profissional = P.id_profissional
ORDER BY A.data_hora_inicio;

-- CONSULTA 2 (Com JOIN): Faturamento Previsto Agrupado por Profissional
-- Soma o valor de todos os serviços agendados para cada profissional
SELECT 
    P.nome AS profissional,
    COUNT(A.id_agendamento) AS quantidade_atendimentos,
    SUM(S.preco) AS faturamento_bruto_previsto
FROM PROFISSIONAL P
JOIN SERVICO S ON P.id_profissional = S.id_profissional
JOIN AGENDAMENTO A ON S.id_servico = A.id_servico
GROUP BY P.nome
ORDER BY faturamento_bruto_previsto DESC;

-- CONSULTA 3 (Com JOIN): Catálogo Completo de Serviços e suas Categorias
SELECT 
    S.nome_servico, 
    C.nome_categoria, 
    S.duracao_minutos, 
    S.preco
FROM SERVICO S
JOIN CATEGORIA_SERVICO C ON S.id_categoria = C.id_categoria
ORDER BY C.nome_categoria, S.preco;

-- CONSULTA 4 (Com JOIN e HAVING): Identificação de Clientes Recorrentes (Mais de 1 agendamento)
SELECT 
    C.nome, 
    C.telefone,
    COUNT(A.id_agendamento) AS total_agendamentos
FROM CLIENTE C
JOIN AGENDAMENTO A ON C.id_cliente = A.id_cliente
GROUP BY C.nome, C.telefone
HAVING COUNT(A.id_agendamento) > 1;

-- CONSULTA 5 (Sem JOIN): Filtro de Serviços Acessíveis (Abaixo de R$ 100)
SELECT 
    nome_servico, 
    preco, 
    duracao_minutos 
FROM SERVICO 
WHERE preco < 100.00
ORDER BY preco ASC;

-- CONSULTA 6 (Sem JOIN): Busca por nome do Cliente
SELECT 
    id_cliente, 
    nome, 
    email 
FROM CLIENTE 
WHERE nome ILIKE '%Roberto%';