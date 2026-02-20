import { useEffect, useState } from 'react';
import './App.css';

// Aqui nós ensinamos o TypeScript qual é o formato da sua tabela no Postgres
interface Profissional {
  id_profissional: number;
  nome: string;
  email: string;
  nome_negocio: string;
  telefone_contato: string;
}

function App() {
  // Criamos os "estados" para guardar os dados e o aviso de carregamento
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(true);

  // O useEffect roda assim que a tela abre, buscando os dados no seu Backend
  useEffect(() => {
    fetch('http://localhost:3000/api/profissionais')
      .then((resposta) => resposta.json())
      .then((dados) => {
        setProfissionais(dados);
        setLoading(false);
      })
      .catch((erro) => console.error("Erro ao buscar dados do banco:", erro));
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'left' }}>
      <h1>✂️ Sistema de Agendamento</h1>
      <p style={{ color: '#888' }}>
        Dados integrados em tempo real com PostgreSQL via Node.js
      </p>

      {/* Se estiver carregando, mostra mensagem. Se não, mostra os cards */}
      {loading ? (
        <p>Acessando o banco de dados...</p>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
          {profissionais.map((prof) => (
            <div 
              key={prof.id_profissional} 
              style={{ 
                border: '1px solid #444', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                minWidth: '280px',
                backgroundColor: '#1a1a1a'
              }}
            >
              <h2 style={{ margin: '0 0 10px 0', color: '#646cff' }}>{prof.nome}</h2>
              <p style={{ margin: '5px 0' }}><strong>💼 Negócio:</strong> {prof.nome_negocio}</p>
              <p style={{ margin: '5px 0' }}><strong>📧 Email:</strong> {prof.email}</p>
              <p style={{ margin: '5px 0' }}><strong>📱 Contato:</strong> {prof.telefone_contato}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;