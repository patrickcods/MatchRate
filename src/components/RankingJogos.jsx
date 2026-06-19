import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

function RankingJogos({ jogos }) {
  const [rankingCompleto, setRankingCompleto] = useState([]);
  const [expandido, setExpandido] = useState(false);
  const LIMITE_INICIAL = 4;

  useEffect(() => {
    if (jogos.length === 0) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/v1/jogos/ranking`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.warn("O ranking não retornou uma lista válida:", data);
          setRankingCompleto([]);
          return;
        }

        const lista = data.map(item => {
          const jogoEncontrado = jogos.find(j => j.id === item.id_jogo);
          return { ...item, jogoData: jogoEncontrado };
        }).filter(item => item.jogoData);

        setRankingCompleto(lista);
      })
      .catch(err => {
        console.error("Erro ao buscar ranking de jogos:", err);
        setRankingCompleto([]);
      })
  }, [jogos]);

  if (rankingCompleto.length === 0) return null;

  const rankingExibido = expandido ? rankingCompleto : rankingCompleto.slice(0, LIMITE_INICIAL);
  const temMais = rankingCompleto.length > LIMITE_INICIAL;

  return (
    <div style={{ backgroundColor: '#141414', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
      <h3 style={{ color: '#ffc107', textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <FaStar /> Melhores Jogos da Copa <FaStar />
      </h3>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '10px',
        maxHeight: expandido ? 'min(500px, 100%)' : 'none',
        overflowY: expandido && rankingCompleto.length > 9 ? 'auto' : 'visible',
        paddingRight: expandido && rankingCompleto.length > 9 ? '4px' : '0'
      }}>
        {rankingExibido.map((item, index) => {
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

      {temMais && (
        <button
          onClick={() => setExpandido(!expandido)}
          style={{
            width: '100%', marginTop: '1rem', padding: '10px',
            backgroundColor: 'transparent', border: '1px solid #333',
            borderRadius: '8px', color: '#a78bfa', cursor: 'pointer',
            fontSize: '0.85rem', fontWeight: 'bold'
          }}
        >
          {expandido ? `▲ Ver menos` : `▼ Ver todos os ${rankingCompleto.length} jogos`}
        </button>
      )}
    </div>
  );
}

export default RankingJogos;