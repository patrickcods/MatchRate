import { useState, useEffect } from 'react';

function StandingsTable() {
  const [data, setData] = useState(null);
  const [grupoIndex, setGrupoIndex] = useState(0);

 useEffect(() => {
  const baseUrl = import.meta.env.VITE_API_URL;
  
  fetch(`${baseUrl}/api/v1/tabela`)
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.error("Erro na tabela:", err));
}, []);

  if (!data) return <p style={{color: '#fff', textAlign: 'center'}}>Carregando tabela...</p>;

  const grupoAtual = data.standings[grupoIndex];

  const mudarGrupo = (direcao) => {
    let novoIndex = grupoIndex + direcao;
    if (novoIndex < 0) novoIndex = data.standings.length - 1;
    if (novoIndex >= data.standings.length) novoIndex = 0;
    setGrupoIndex(novoIndex);
  };

  return (
    <div style={{ backgroundColor: '#141414', padding: '1rem', borderRadius: '12px', margin: '1rem auto', maxWidth: '600px', border: '1px solid #333' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span onClick={() => mudarGrupo(-1)} style={{ cursor: 'pointer', color: '#6c189c', fontSize: '1.2rem' }}>{'<'}</span>
        <h3 style={{ color: '#fff', margin: 0 }}>{grupoAtual.group.replace('_', ' ')}</h3>
        <span onClick={() => mudarGrupo(1)} style={{ cursor: 'pointer', color: '#6c189c', fontSize: '1.2rem' }}>{'>'}</span>
      </div>

      <table style={{ width: '100%', color: '#fff', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ color: '#888' }}>
            <th style={{padding: '5px'}}>Pos</th><th style={{textAlign: 'left'}}>Time</th><th>Pts</th><th>SG</th>
          </tr>
        </thead>
        <tbody>
          {grupoAtual.table.map((time) => (
            <tr key={time.team.id} style={{ borderTop: '1px solid #222' }}>
              <td style={{padding: '8px'}}>{time.position}</td>
              <td style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', textAlign: 'left' }}>
                <img src={time.team.crest} style={{ width: '20px' }} /> {time.team.shortName}
              </td>
              <td>{time.points}</td>
              <td>{time.goalDifference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default StandingsTable;