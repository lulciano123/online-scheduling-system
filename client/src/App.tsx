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

  // NOVO ESTADO: Controla qual ID estamos editando (se for null, estamos criando)
  const [editandoId, setEditandoId] = useState<number | null>(null);

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

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    const dadosFormulario = {
      nome, email, senha: '123', nome_negocio: negocio, telefone_contato: telefone
    };

    try {
      if (editandoId) {
        // MODO EDIÇÃO: Dispara o PUT para a rota de atualização
        await fetch(`http://localhost:3000/api/profissionais/${editandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosFormulario)
        });
      } else {
        // MODO CRIAÇÃO: Dispara o POST normal
        await fetch('http://localhost:3000/api/profissionais', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosFormulario)
        });
      }

      // Limpa os campos e sai do modo de edição
      cancelarEdicao();
      carregarDados();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este profissional?")) return;
    try {
      await fetch(`http://localhost:3000/api/profissionais/${id}`, { method: 'DELETE' });
      carregarDados();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  // --- NOVA FUNÇÃO: Prepara o formulário para edição ---
  const handleEdit = (prof: Profissional) => {
    setEditandoId(prof.id_profissional);
    setNome(prof.nome);
    setEmail(prof.email);
    setNegocio(prof.nome_negocio);
    setTelefone(prof.telefone_contato);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola a tela pro topo suavemente
  };

  // --- NOVA FUNÇÃO: Limpa o formulário e cancela edição ---
  const cancelarEdicao = () => {
    setEditandoId(null);
    setNome(''); setEmail(''); setNegocio(''); setTelefone('');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'left', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>✂️ Sistema de Agendamento</h1>
      <p style={{ color: '#888' }}>Dados integrados em tempo real com PostgreSQL via Node.js</p>

      {/* FORMULÁRIO */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: editandoId ? '2px solid #646cff' : 'none' }}>
        <h3 style={{ marginTop: 0 }}>
          {editandoId ? '✏️ Editando Profissional' : 'Cadastrar Novo Profissional'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input required placeholder="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }} />
          <input required type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }} />
          <input required placeholder="Nome do Negócio" value={negocio} onChange={(e) => setNegocio(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }} />
          <input required placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }} />
          
          <button type="submit" style={{ backgroundColor: '#646cff', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {editandoId ? 'Atualizar Dados' : 'Salvar'}
          </button>
          
          {/* Botão de Cancelar (só aparece se estiver editando) */}
          {editandoId && (
            <button type="button" onClick={cancelarEdicao} style={{ backgroundColor: '#555', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      {/* LISTAGEM DOS CARDS */}
      {loading ? (
        <p>Acessando o banco de dados...</p>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {profissionais.map((prof) => (
            <div key={prof.id_profissional} style={{ border: '1px solid #444', padding: '1.5rem', borderRadius: '8px', minWidth: '280px', backgroundColor: '#1a1a1a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ margin: '0 0 10px 0', color: '#646cff' }}>{prof.nome}</h2>
                <p style={{ margin: '5px 0' }}><strong>💼 Negócio:</strong> {prof.nome_negocio}</p>
                <p style={{ margin: '5px 0' }}><strong>📧 Email:</strong> {prof.email}</p>
                <p style={{ margin: '5px 0' }}><strong>📱 Contato:</strong> {prof.telefone_contato}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button 
                  onClick={() => handleEdit(prof)}
                  style={{ flex: 1, backgroundColor: '#444', color: 'white', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={() => handleDelete(prof.id_profissional)}
                  style={{ flex: 1, backgroundColor: '#ff4a4a', color: 'white', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;