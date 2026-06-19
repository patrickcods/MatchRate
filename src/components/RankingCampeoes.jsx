import { useState, useEffect } from 'react'

function RankingCampeoes() {
  const [ranking, setRanking] = useState([])
  const [expandido, setExpandido] = useState(false)
  const LIMITE_INICIAL = 4

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/simulacoes/ranking`)
      .then(res => res.json())
      .then(setRanking)
      .catch(console.error)
  }, [])

  if (!ranking.length) return null

  const rankingExibido = expandido ? ranking : ranking.slice(0, LIMITE_INICIAL)
  const temMais = ranking.length > LIMITE_INICIAL

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', backgroundColor: '#141414', borderRadius: '16px', padding: '1.5rem', border: '1px solid #222' }}>
      <h2 style={{ color: '#fff', textAlign: 'center', margin: '0 0 1.5rem 0', fontSize: '1.3rem' }}>
        🏆 Quem a comunidade acha que vai ganhar?
      </h2>

      <div style={{
        maxHeight: expandido && ranking.length > 9 ? '500px' : 'none',
        overflowY: expandido && ranking.length > 9 ? 'auto' : 'visible',
        paddingRight: expandido && ranking.length > 9 ? '4px' : '0'
      }}>
        {rankingExibido.map((r, i) => (
          <div key={r.campeao} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ color: '#555', fontSize: '0.85rem', width: '20px' }}>{i + 1}º</span>
              {r.flag && <img src={r.flag} style={{ width: '28px', height: '18px', objectFit: 'cover', borderRadius: '2px' }} />}
              <span style={{ color: '#fff', fontWeight: i === 0 ? 'bold' : 'normal', flex: 1 }}>{r.campeao}</span>
              <span style={{ color: '#a78bfa', fontWeight: 'bold', fontSize: '0.9rem' }}>{r.percentual}%</span>
            </div>
            <div style={{ height: '6px', backgroundColor: '#222', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '3px',
                width: `${r.percentual}%`,
                backgroundColor: i === 0 ? '#6c189c' : '#333',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        ))}
      </div>

      {temMais && (
        <button
          onClick={() => setExpandido(!expandido)}
          style={{
            width: '100%', marginTop: '0.5rem', padding: '10px',
            backgroundColor: 'transparent', border: '1px solid #333',
            borderRadius: '8px', color: '#a78bfa', cursor: 'pointer',
            fontSize: '0.85rem', fontWeight: 'bold'
          }}
        >
          {expandido ? '▲ Ver menos' : `▼ Ver todos os ${ranking.length} países`}
        </button>
      )}

      <p style={{ color: '#555', fontSize: '0.75rem', textAlign: 'center', margin: '1rem 0 0 0' }}>
        Baseado em {ranking.reduce((a, r) => a + r.total, 0)} simulações
      </p>
    </div>
  )
}

export default RankingCampeoes