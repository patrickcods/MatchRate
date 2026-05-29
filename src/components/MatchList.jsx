import { useState } from 'react';
import MatchCard from './MatchCard';

function MatchList({ jogos, onSelecionar }) {
  const [filtro, setFiltro] = useState('GROUP_STAGE');
  const fases = ['GROUP_STAGE', 'LAST_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'FINAL'];
  const labels = { GROUP_STAGE: 'Grupos', LAST_16: 'Oitavas', QUARTER_FINALS: 'Quartas', SEMI_FINALS: 'Semifinal', FINAL: 'Final' };

  // 1. Definição correta dos dados
  const jogosAtuais = jogos || [];

  // 2. LOG DE INVESTIGAÇÃO (Isso vai resolver o mistério)
  if (jogosAtuais.length > 0) {
    console.log("ESTRUTURA DO PRIMEIRO JOGO:", jogosAtuais[0]);
    console.log("VALOR DO STAGE:", jogosAtuais[0].stage);
  }

  // 3. Filtro corrigido
  // Aqui estamos filtrando pela fase que o usuário selecionou
  const jogosDaFase = jogosAtuais.filter(j => j.stage === filtro);
  
  const jogosEncerrados = jogosDaFase.filter(j => j.status === 'FINISHED');
  const jogosFuturos = jogosDaFase.filter(j => 
    j.status === 'TIMED' || 
    j.status === 'SCHEDULED' || 
    j.status === 'POSTPONED'
  );

  return (
    <div>
      {/* Botões de Filtro */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {fases.map(fase => (
          <button key={fase} onClick={() => setFiltro(fase)} style={{
            padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid',
            borderColor: filtro === fase ? '#6c189c' : '#333',
            backgroundColor: filtro === fase ? '#6c189c' : 'transparent',
            color: filtro === fase ? '#fff' : '#888',
            cursor: 'pointer', fontSize: '0.85rem'
          }}>
            {labels[fase]}
          </button>
        ))}
      </div>

      {/* Lista de Avaliar */}
      <h2 style={{ color: '#fff', textAlign: 'center' }}>Jogos para Avaliar</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', minHeight: '100px' }}>
        {jogosEncerrados.length > 0 ? (
          jogosEncerrados.map(jogo => <MatchCard key={jogo.id} jogo={jogo} tipo="avaliar" onSelecionar={onSelecionar} />)
        ) : (
          <p style={{ color: '#444' }}>Nenhum jogo finalizado nesta fase.</p>
        )}
      </div>

      {/* Lista de Futuros */}
      <h2 style={{ color: '#fff', textAlign: 'center', marginTop: '2rem' }}>Próximos Jogos</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', minHeight: '100px' }}>
        {jogosFuturos.length > 0 ? (
          jogosFuturos.map(jogo => <MatchCard key={jogo.id} jogo={jogo} tipo="palpite" onSelecionar={onSelecionar} />)
        ) : (
          <p style={{ color: '#444' }}>Nenhum jogo agendado para esta fase.</p>
        )}
      </div>
    </div>
  );
}

export default MatchList;