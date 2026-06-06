// Script para criar as tabelas no banco do Render
// 
// Como usar:
//   1. Abra o terminal na pasta do projeto da API (Trabalho-Saude-Mental)
//   2. Execute: node criar-tabelas.js

const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://saude_mental_db_user:LipAA54erK8dUwfinJFRkodO2iEvkpRl@dpg-d891a2favr4c73981bb0-a.oregon-postgres.render.com/saude_mental_db',
  ssl: { rejectUnauthorized: false }
});

const sql = `
  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    telefone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS servicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    gratuito BOOLEAN NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6)
  );

  CREATE TABLE IF NOT EXISTS funcionarios (
    id SERIAL PRIMARY KEY,
    servico_id INTEGER REFERENCES servicos(id),
    nome VARCHAR(255) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    data_admissao DATE,
    salario DECIMAL(10, 2),
    senha VARCHAR(255)
  );

  CREATE TABLE IF NOT EXISTS avaliacoes (
    id SERIAL PRIMARY KEY,
    servico_id INTEGER REFERENCES servicos(id) ON DELETE CASCADE,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

async function criarTabelas() {
  try {
    console.log('🔌 Conectando ao banco...');
    await client.connect();
    console.log('✅ Conectado!');

    console.log('🏗️  Criando tabelas...');
    await client.query(sql);

    console.log('✅ Tabelas criadas com sucesso!');
    console.log('   - usuarios');
    console.log('   - servicos');
    console.log('   - funcionarios');
    console.log('   - avaliacoes');
  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    await client.end();
  }
}

criarTabelas();
