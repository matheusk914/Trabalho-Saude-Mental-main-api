const { Client } = require('pg');

const client = new Client({
  host: 'dpg-d8u29cdaeets73fmhde0-a.oregon-postgres.render.com',
  port: 5432,
  database: 'saude_mental_db2',
  user: 'saude_mental_db2_user',
  password: 'bRp0jq3hXnxwV3i8YZFtaRZCRDtBvmid',
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
  CREATE TABLE IF NOT EXISTS comentarios (
    id SERIAL PRIMARY KEY,
    servico_id INTEGER NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    texto VARCHAR(1000) NOT NULL CHECK (char_length(texto) >= 1),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_comentarios_servico_id ON comentarios(servico_id);
  CREATE INDEX IF NOT EXISTS idx_comentarios_usuario_id ON comentarios(usuario_id);
`;

async function criarTabelas() {
  try {
    console.log('🔌 Conectando ao banco...');
    await client.connect();
    console.log('✅ Conectado!');
    console.log('🏗️  Criando tabelas...');
    await client.query(sql);
    console.log('✅ Tabelas criadas com sucesso!');
  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    await client.end();
  }
}

criarTabelas();
