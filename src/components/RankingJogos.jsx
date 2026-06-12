import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

function RankingJogos({ jogos }) {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    // Só tenta cruzar os dados se já tivermos carregado a lista de jogos da API externa
    if (jogos.length === 0) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/v1/jogos/ranking`)
      .then(res => res.json())
      .then(data => {
        // Cruza o ID retornado pelo seu banco com os dados do Football-Data
        const rankingCompleto = data.map(item => {
          const jogoEncontrado = jogos.find(j => j.id === item.id_jogo);
          return {
            ...item,
            jogoData: jogoEncontrado
          };
        }).filter(item => item.jogoData); // Ignora se houver algum ID fantasma

        // Pega apenas o Top 5 para não poluir a tela
        setRanking(rankingCompleto.slice(0, 5));
      })
      .catch(err => console.error("Erro ao buscar ranking de jogos:", err));
  }, [jogos]);

  if (ranking.length === 0) return null;

  return (
    <div style={{ marginBottom: '3rem', backgroundColor: '#141414', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
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