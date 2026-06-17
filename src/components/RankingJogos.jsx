import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

function RankingJogos({ jogos }) {
  const [ranking, setRanking] = useState([]);
  const fases = {
    GROUP_STAGE: 'Fase de Grupos',
    ROUND_OF_16: 'Oitavas de Final',
    QUARTER_FINALS: 'Quartas de Final',
    SEMI_FINALS: 'Semifinal',
    THIRD_PLACE: 'Terceiro Lugar',
    FINAL: 'Final'
  };

  useEffect(() => {
    if (jogos.length === 0) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/v1/jogos/ranking`)
      .then(res => res.json())
      .then(data => {

        if (!Array.isArray(data)) {
          console.warn("O ranking não retornou uma lista válida:", data);
          setRanking([]);
          return;
        }

        const rankingCompleto = data.map(item => {
          const jogoEncontrado = jogos.find(j => j.id === item.id_jogo);
          return {
            ...item,
            jogoData: jogoEncontrado
          };
        }).filter(item => item.jogoData);

        setRanking(rankingCompleto.slice(0, 5));
      })
      .catch(err => {
        console.error("Erro ao buscar ranking de jogos:", err);
        setRanking([]);
      })
  }, [jogos]);

  if (ranking.length === 0) return null;

  return (
    <div style={{backgroundColor: '#141414', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', height: '100%' }}>
      <h3 style={{ color: '#ffc107', textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <FaStar /> Melhores Jogos da Copa <FaStar />
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {ranking.map((item, index) => {
          const timeCasa = item.jogoData.homeTeam.shortName || item.jogoData.homeTeam.name || 'Time A';
          const timeFora = item.jogoData.awayTeam.shortName || item.jogoData.awayTeam.name || 'Time B';
          
          return (
            <div key={item.id_jogo} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a', padding: '10px 20px', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ color: '#6c189c', fontWeight: 'bold', fontSize: '1.2rem' }}>{index + 1}º</span>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>{timeCasa} vs {timeFora}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#ffc107', fontWeight: 'bold', fontSize: '1.1rem' }}>{item.media.toFixed(1)}</span>
                <FaStar color="#ffc107" size={14} />
                <span style={{ color: '#666', fontSize: '0.8rem' }}>({item.total_votos})</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default RankingJogos;