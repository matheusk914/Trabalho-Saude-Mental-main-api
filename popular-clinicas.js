const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://saude_mental_db2_user:bRpOjq3hXnxwV3i8YZFtaRZCRDtBvmid@dpg-d8u29cdaeets73fmhde0-a.oregon-postgres.render.com/saude_mental_db2',
  ssl: { rejectUnauthorized: false }
});

const clinicas = [
  { nome: 'Clínica Bem Estar SP', tipo: 'Clínica', cidade: 'São Paulo', endereco: 'Av. Paulista, 1000', telefone: '(11) 3000-0001', gratuito: false, categoria: 'Psicologia', latitude: -23.5505, longitude: -46.6333 },
  { nome: 'Centro de Saúde Mental SP', tipo: 'Centro', cidade: 'São Paulo', endereco: 'Rua Augusta, 500', telefone: '(11) 3000-0002', gratuito: true, categoria: 'Público', latitude: -23.5515, longitude: -46.6565 },
  { nome: 'Clínica Mental Muriaé', tipo: 'Clínica', cidade: 'Muriaé', endereco: 'Avenida Getúlio Vargas, 200', telefone: '(32) 3000-0001', gratuito: false, categoria: 'Psicologia', latitude: -20.9084, longitude: -42.3651 },
  { nome: 'Centro de Apoio Muriaé', tipo: 'Centro', cidade: 'Muriaé', endereco: 'Rua Dr. João Pessoa, 150', telefone: '(32) 3000-0002', gratuito: true, categoria: 'Público', latitude: -20.9074, longitude: -42.3641 },
  { nome: 'Clínica Vida BH', tipo: 'Clínica', cidade: 'Belo Horizonte', endereco: 'Av. Getúlio Vargas, 1500', telefone: '(31) 3000-0001', gratuito: false, categoria: 'Psicologia', latitude: -19.9167, longitude: -43.9345 },
  { nome: 'Instituto de Saúde Mental BH', tipo: 'Instituto', cidade: 'Belo Horizonte', endereco: 'Rua da Bahia, 2000', telefone: '(31) 3000-0002', gratuito: true, categoria: 'Público', latitude: -19.9177, longitude: -43.9355 }
];

async function popular() {
  try {
    console.log('🔌 Conectando...');
    await client.connect();
    console.log('✅ Conectado!');
    
    for (const c of clinicas) {
      await client.query(
        'INSERT INTO servicos (nome, tipo, cidade, endereco, telefone, gratuito, categoria, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [c.nome, c.tipo, c.cidade, c.endereco, c.telefone, c.gratuito, c.categoria, c.latitude, c.longitude]
      );
      console.log(`✅ ${c.nome}`);
    }
    
    console.log('\n✅ Clínicas inseridas!');
  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    await client.end();
  }
}

popular();