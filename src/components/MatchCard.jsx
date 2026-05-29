function MatchCard({ jogo, onSelecionar }) {
  const data = new Date(jogo.utcDate).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo'
  })

  const fases = {
    GROUP_STAGE: 'Fase de Grupos',
    ROUND_OF_16: 'Oitavas de Final',
    QUARTER_FINALS: 'Quartas de Final',
    SEMI_FINALS: 'Semifinal',
    THIRD_PLACE: 'Terceiro Lugar',
    FINAL: 'Final'
  }

  const status = jogo.status
  const encerrado = status === 'FINISHED'
  const aoVivo = status === 'IN_PLAY' || status === 'PAUSED'

  const timeCasa = jogo.homeTeam.name || 'A definir'
  const timeVisitante = jogo.awayTeam.name || 'A definir'
  const placar = jogo.score.fullTime.home !== null
    ? `${jogo.score.fullTime.home} x ${jogo.score.fullTime.away}`
    : 'x'

  const corBorda = aoVivo ? '#16a34a' : '#222'
  const corHover = aoVivo ? '#16a34a' : encerrado ? '#333' : '#6c189c'
  const opacidade = encerrado ? 0.5 : 1

  const badgeStatus = aoVivo
    ? { texto: '● AO VIVO', cor: '#16a34a' }
    : encerrado
    ? { texto: 'ENCERRADO', cor: '#555' }
    : null

  return (
    <div
      onClick={() => !encerrado && onSelecionar(jogo)}
      style={{
        backgroundColor: '#141414',
        border: `1px solid ${corBorda}`,
        borderRadius: '12px',
        padding: '1.25rem',
        cursor: encerrado ? 'default' : 'pointer',
        width: '300px',
        transition: 'border-color 0.2s, opacity 0.2s',
        opacity: opacidade
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = corHover}
      onMouseLeave={e => e.currentTarget.style.borderColor = corBorda}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <p style={{ color: '#6c189c', fontSize: '0.75rem', fontWeight: 'bold', margin: 0 }}>
          {fases[jogo.stage] || jogo.stage}
        </p>
        {badgeStatus && (
          <span style={{ color: badgeStatus.cor, fontSize: '0.7rem', fontWeight: 'bold' }}>
            {badgeStatus.texto}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          {jogo.homeTeam.crest
            ? <img src={jogo.homeTeam.crest} alt={timeCasa} style={{ width: '60px', height: '60px', marginBottom: '5px' }} />
            : <div style={{ width: '60px', height: '60px', marginBottom: '5px' }} />
          }
          <span style={{ color: encerrado ? '#666' : '#fff', fontSize: '0.85rem', textAlign: 'center' }}>{timeCasa}</span>
        </div>

        <span style={{ color: aoVivo ? '#16a34a' : '#888', fontSize: '1.1rem', fontWeight: 'bold' }}>
          {placar}
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          {jogo.awayTeam.crest
            ? <img src={jogo.awayTeam.crest} alt={timeVisitante} style={{ width: '60px', height: '60px', marginBottom: '5px' }} />
            : <div style={{ width: '60px', height: '60px', marginBottom: '5px' }} />
          }
          <span style={{ color: encerrado ? '#666' : '#fff', fontSize: '0.85rem', textAlign: 'center' }}>{timeVisitante}</span>
        </div>
      </div>

      <p style={{ color: encerrado ? '#444' : '#555', fontSize: '0.8rem', margin: '0.75rem 0 0 0', textAlign: 'center' }}>
        {data}
      </p>
    </div>
  )
}

export default MatchCard