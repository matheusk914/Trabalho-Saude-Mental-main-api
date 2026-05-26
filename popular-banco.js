// Script para popular o banco com clínicas de exemplo
//
// Como usar:
//   1. Coloque esse arquivo na pasta Trabalho-Saude-Mental
//   2. Execute: node popular-banco.js

const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://saude_mental_db_user:LipAA54erK8dUwfinJFRkodO2iEvkpRl@dpg-d891a2favr4c73981bb0-a.oregon-postgres.render.com/saude_mental_db',
  ssl: { rejectUnauthorized: false }
});

const servicos = [
  {
    nome: 'Clínica Ser',
    tipo: 'Clínica de Psicologia',
    cidade: 'São Paulo',
    endereco: 'Av. Paulista, 1000 - São Paulo',
    telefone: '(11) 3000-0001',
    gratuito: false,
    categoria: 'Ansiedade • TCC',
    latitude: -23.5505,
    longitude: -46.6333
  },
  {
    nome: 'Instituto Serenare',
    tipo: 'Instituto de Psicanálise',
    cidade: 'São Paulo',
    endereco: 'Rua Oscar Freire, 500 - São Paulo',
    telefone: '(11) 3000-0002',
    gratuito: false,
    categoria: 'Psicanálise • Trauma',
    latitude: -23.5565,
    longitude: -46.6500
  },
  {
    nome: 'Espaço Mente Viva',
    tipo: 'Centro de Mindfulness',
    cidade: 'São Paulo',
    endereco: 'Rua Bandeira, 200 - São Paulo',
    telefone: '(11) 3000-0003',
    gratuito: true,
    categoria: 'Mindfulness',
    latitude: -23.5600,
    longitude: -46.6200
  },
  {
    nome: 'CAPS Centro',
    tipo: 'Centro de Atenção Psicossocial',
    cidade: 'Rio de Janeiro',
    endereco: 'Rua da Carioca, 50 - Rio de Janeiro',
    telefone: '(21) 3000-0004',
    gratuito: true,
    categoria: 'Saúde Mental Pública',
    latitude: -22.9068,
    longitude: -43.1729
  },
  {
    nome: 'Clínica Equilíbrio',
    tipo: 'Clínica de Psicologia',
    cidade: 'Belo Horizonte',
    endereco: 'Av. Afonso Pena, 300 - Belo Horizonte',
    telefone: '(31) 3000-0005',
    gratuito: false,
    categoria: 'Terapia Familiar • Casal',
    latitude: -19.9191,
    longitude: -43.9386
  }
];

async function popularBanco() {
  try {
    console.log('🔌 Conectando ao banco...');
    await client.connect();
    console.log('✅ Conectado!\n');

    console.log('📝 Inserindo serviços...');
    for (const servico of servicos) {
      await client.query(
        `INSERT INTO servicos (nome, tipo, cidade, endereco, telefone, gratuito, categoria, latitude, longitude)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT DO NOTHING`,
        [
          servico.nome, servico.tipo, servico.cidade, servico.endereco,
          servico.telefone, servico.gratuito, servico.categoria,
          servico.latitude, servico.longitude
        ]
      );
      console.log(`   ✅ ${servico.nome}`);
    }

    console.log('\n🎉 Banco populado com sucesso!');
  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    await client.end();
  }
}

popularBanco();