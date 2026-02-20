import { useEffect, useState } from 'react';
import './App.css';

interface Profissional {
  id_profissional: number;
  nome: string;
  email: string;
  nome_negocio: string;
  telefone_contato: string;
}

function App() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [negocio, setNegocio] = useState('');
  const [telefone, setTelefone] = useState('');

  // Isolar a busca em uma função para podermos chamar de novo após cadastrar
  const carregarDados = () => {
    setLoading(true);
    fetch('http://localhost:3000/api/profissionais')
      .then((res) => res.json())
      .then((dados) => {
        setProfissionais(dados);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  // Roda uma vez quando a tela abre
  useEffect(() => {
    carregarDados();
  }, []);

  // Função disparada ao enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página dê reload (padrão do HTML)
    
    const novoProfissional = {
      nome,
      email,
      senha: 'senhapadrão123', // Em um app real, o usuário digitaria a senha
      nome_negocio: negocio,
      telefone_contato: telefone
    };

    try {
      // Dispara o POST para a nossa API
      await fetch('http://localhost:3000/api/profissionais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProfissional)
      });

      // Limpa os campos do formulário
      setNome(''); setEmail(''); setNegocio(''); setTelefone('');
      
      // Busca a lista atualizada do banco de dados
      carregarDados();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'left', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>✂️ Sistema de Agendamento</h1>
      <p style={{ color: '#888' }}>Dados integrados em tempo real com PostgreSQL via Node.js</p>

      {/* --- BLOCO DO FORMULÁRIO (CREATE) --- */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0 }}>Cadastrar Novo Profissional</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input required placeholder="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }} />
          <input required type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }} />
          <input required placeholder="Nome do Negócio" value={negocio} onChange={(e) => setNegocio(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }} />
          <input required placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }} />
          <button type="submit" style={{ backgroundColor: '#646cff', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Salvar
          </button>
        </form>
      </div>

      {/* --- BLOCO DA LISTAGEM (READ) --- */}
      {loading ? (
        <p>Acessando o banco de dados...</p>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {profissionais.map((prof) => (
            <div key={prof.id_profissional} style={{ border: '1px solid #444', padding: '1.5rem', borderRadius: '8px', minWidth: '280px', backgroundColor: '#1a1a1a' }}>
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