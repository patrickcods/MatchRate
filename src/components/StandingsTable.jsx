 import { useState, useEffect } from 'react';

function StandingsTable() {
  const [data, setData] = useState(null);
  const [grupoIndex, setGrupoIndex] = useState(0);
  const [verGeral, setVerGeral] = useState(false);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL;
    fetch(`${baseUrl}/api/v1/tabela`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Erro na tabela:", err));
  }, []);

  if (!data) return <p style={{ color: '#fff', textAlign: 'center' }}>Carregando tabela...</p>;

  const grupoAtual = data.standings[grupoIndex];
  const mudarGrupo = (direcao) => {
    let novoIndex = grupoIndex + direcao;
    if (novoIndex < 0) novoIndex = data.standings.length - 1;
    if (novoIndex >= data.standings.length) novoIndex = 0;
    setGrupoIndex(novoIndex);
  };

  // Geral: todos os times de todos os grupos, ordenados por pontos > saldo > gols pró
  const geral = data.standings
    .flatMap(g => g.table.map(t => ({ ...t, grupo: g.group.replace('GROUP_', '') })))
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor);

  return (
    <div style={{ backgroundColor: '#1e1e1e', padding: '1rem', borderRadius: '12px', margin: '1rem auto', maxWidth: '600px', border: '1px solid #2d2d2d'}}>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '1rem' }}>
        <button onClick={() => setVerGeral(false)} style={{
          padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid',
          borderColor: !verGeral ? '#6c189c' : '#333',
          backgroundColor: !verGeral ? '#6c189c' : 'transparent',
          color: !verGeral ? '#fff' : '#888', cursor: 'pointer', fontSize: '0.85rem'
        }}>Por Grupo</button>
        <button onClick={() => setVerGeral(true)} style={{
          padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid',
          borderColor: verGeral ? '#6c189c' : '#333',
          backgroundColor: verGeral ? '#6c189c' : 'transparent',
          color: verGeral ? '#fff' : '#888', cursor: 'pointer', fontSize: '0.85rem'
        }}>Classificação Geral</button>
      </div>

      {!verGeral ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span onClick={() => mudarGrupo(-1)} style={{ cursor: 'pointer', color: '#6c189c', fontSize: '1.2rem' }}>{'<'}</span>
            <h3 style={{ color: '#fff', margin: 0 }}>{grupoAtual.group.replace('_', ' ')}</h3>
            <span onClick={() => mudarGrupo(1)} style={{ cursor: 'pointer', color: '#6c189c', fontSize: '1.2rem' }}>{'>'}</span>
          </div>

          <table style={{ width: '100%', color: '#fff', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ color: '#888' }}>
                <th style={{ padding: '5px' }}>Pos</th><th style={{ textAlign: 'left' }}>Time</th><th>Pts</th><th>SG</th>
              </tr>
            </thead>
            <tbody>
              {grupoAtual.table.map((time) => (
                <tr key={time.team.id} style={{ borderTop: '1px solid #222' }}>
                  <td style={{ padding: '8px' }}>{time.position}</td>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', textAlign: 'left' }}>
                    <img src={time.team.crest} style={{ width: '20px' }} /> {time.team.shortName}
                  </td>
                  <td>{time.points}</td>
                  <td>{time.goalDifference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <h3 style={{ color: '#fff', margin: '0 0 1rem 0', textAlign: 'center' }}>Classificação Geral</h3>
          <p style={{ color: '#666', fontSize: '0.75rem', textAlign: 'center', margin: '0 0 1rem 0' }}>
            Top 24 avançam direto · 8 melhores 3ºs completam o mata-mata
          </p>
          <table style={{ width: '100%', color: '#fff', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ color: '#888' }}>
                <th style={{ padding: '5px' }}>Pos</th><th style={{ textAlign: 'left' }}>Time</th><th>Grupo</th><th>Pts</th><th>SG</th>
              </tr>
            </thead>
            <tbody>
              {geral.map((time, i) => {
                const zona = i < 24 ? '#1a472a' : i < 32 ? '#3a3a1a' : 'transparent';
                return (
                  <tr key={time.team.id} style={{ borderTop: '1px solid #222', backgroundColor: zona }}>
                    <td style={{ padding: '6px' }}>{i + 1}</td>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px', textAlign: 'left' }}>
                      <img src={time.team.crest} style={{ width: '18px' }} /> {time.team.shortName}
                    </td>
                    <td style={{ color: '#888' }}>{time.grupo}</td>
                    <td>{time.points}</td>
                    <td>{time.goalDifference}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
export default StandingsTable;