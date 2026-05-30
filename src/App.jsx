import { useState, useEffect } from 'react';
import MatchList from './components/MatchList';
import RatingModal from './components/RatingModal';
import StandingsTable from './components/StandingsTable';
import BracketSimulator from './components/BracketSimulator';

function App() {
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [jogos, setJogos] = useState([]);
  const [pagina, setPagina] = useState('home'); // 'home' ou 'simulador'

 useEffect(() => {
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log("Variável de ambiente carregada:", apiUrl); // Isso vai te dizer se está undefined ou não

  if (!apiUrl) {
    console.error("A URL da API não foi definida!");
    return;
  }

  fetch(`${apiUrl}/api/v1/jogos`)
    .then(res => res.json())
    .then(data => {
      setJogos(data.matches || data);
    })
    .catch(err => console.error("Erro ao buscar jogos no endpoint:", err));
}, []);

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
      
      {/* HEADER E TÍTULO */}
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: '#fff', fontSize: '5rem', fontWeight: '900', margin: 15 }}>
          Match<span style={{ color: '#6c189c' }}>Rate</span>
        </h1>
        <p style={{ color: '#888', marginTop: '1.8rem', fontSize: '1.1rem' }}>
          Avalie os jogos da Copa do Mundo 2026
        </p>
      </header>

      {/* MENU DE NAVEGAÇÃO */}
      <nav style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button onClick={() => setPagina('home')} style={{ margin: '0 10px', padding: '10px 20px', cursor: 'pointer' }}>Jogos</button>
        <button onClick={() => setPagina('simulador')} style={{ margin: '0 10px', padding: '10px 20px', cursor: 'pointer' }}>Simulador</button>
      </nav>

      {/* RENDERIZAÇÃO CONDICIONAL */}
      {pagina === 'home' ? (
        <>
          <StandingsTable />
          <MatchList jogos={jogos} onSelecionar={setJogoSelecionado} />
        </>
      ) : (
        <BracketSimulator />
      )}
      
      {/* MODAL DE AVALIAÇÃO */}
      {jogoSelecionado && (
        <RatingModal 
          jogo={jogoSelecionado} 
          onClose={() => setJogoSelecionado(null)} 
        />
      )}
      
    </div>
  );
}

export default App;