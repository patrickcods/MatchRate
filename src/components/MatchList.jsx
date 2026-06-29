import { useState, useEffect } from 'react';
import MatchCard from './MatchCard';

function MatchList({ jogos, onSelecionar }) {
  const fases = ['GROUP_STAGE', 'LAST_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'FINAL'];
  const labels = { GROUP_STAGE: 'Grupos', LAST_16: 'Oitavas', QUARTER_FINALS: 'Quartas', SEMI_FINALS: 'Semifinal', FINAL: 'Final' };
  const jogosAtuais = jogos || [];

  // Descobre a fase atual: a última fase que já tem jogo FINISHED ou IN_PLAY
  const detectarFaseAtual = () => {
    for (let i = fases.length - 1; i >= 0; i--) {
      const temJogo = jogosAtuais.some(j => j.stage === fases[i] && (j.status === 'FINISHED' || j.status === 'IN_PLAY' || j.status === 'PAUSED'));
      if (temJogo) return fases[i];
    }
    return 'GROUP_STAGE';
  };

  const [filtro, setFiltro] = useState(null);

  useEffect(() => {
    if (jogosAtuais.length > 0 && filtro === null) {
      setFiltro(detectarFaseAtual());
    }
  }, [jogosAtuais]);

  const filtroAtivo = filtro || 'GROUP_STAGE';

  const jogosDaFase = jogosAtuais.filter(j => j.stage === filtroAtivo);

  const jogosEncerrados = jogosDaFase
    .filter(j => j.status === 'FINISHED')
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));

  const jogosFuturos = jogosDaFase
    .filter(j => j.status === 'TIMED' || j.status === 'SCHEDULED' || j.status === 'POSTPONED' || j.status === 'IN_PLAY' || j.status === 'PAUSED')
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {fases.map(fase => (
          <button key={fase} onClick={() => setFiltro(fase)} style={{
            padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid',
            borderColor: filtroAtivo === fase ? '#6c189c' : '#333',
            backgroundColor: filtroAtivo === fase ? '#6c189c' : 'transparent',
            color: filtroAtivo === fase ? '#fff' : '#888',
            cursor: 'pointer', fontSize: '0.85rem'
          }}>
            {labels[fase]}
          </button>
        ))}
      </div>

      <h2 style={{ color: '#fff', textAlign: 'center' }}>Jogos para Avaliar</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', minHeight: '100px' }}>
        {jogosEncerrados.length > 0 ? (
          jogosEncerrados.map(jogo => <MatchCard key={jogo.id} jogo={jogo} tipo="avaliar" onSelecionar={onSelecionar} />)
        ) : (
          <p style={{ color: '#444' }}>Nenhum jogo finalizado nesta fase.</p>
        )}
      </div>

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