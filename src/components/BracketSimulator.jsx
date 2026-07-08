import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import html2canvas from 'html2canvas';

const SITE_URL = 'https://match-rate-amber.vercel.app';

// Mapa de fase reduzido: começa nas quartas
const STAGE_MAP = {
  quartas: 'QUARTER_FINALS',
  semi: 'SEMI_FINALS',
  final: 'FINAL',
};

const Bandeira = ({ flag, nome }) => (
  flag ? <img src={flag} alt={nome} style={{ width: '24px', height: '16px', objectFit: 'cover', borderRadius: '2px', flexShrink: 0 }} /> : null
);

const BotaoTime = ({ time, selecionado, onClick, bloqueado }) => (
  <button onClick={bloqueado ? undefined : onClick} style={{
    padding: '10px', backgroundColor: selecionado ? '#6c189c' : '#222', color: '#fff',
    border: selecionado ? '1px solid #a855f7' : '1px solid #444', borderRadius: '6px',
    cursor: time && !bloqueado ? 'pointer' : 'default', flex: 1, fontSize: '0.9rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    fontWeight: selecionado ? 'bold' : 'normal', transition: 'all 0.2s', opacity: time ? 1 : 0.4
  }}>
    <Bandeira flag={time?.flag} nome={time?.nome} />
    {time?.nome || 'A definir'}
    {bloqueado && selecionado && <span style={{ fontSize: '0.7rem', color: '#4ade80' }}>✓ Passou</span>}
  </button>
);

const cardMatchStyle = { display: 'flex', gap: '15px', backgroundColor: '#1c1c1e', padding: '15px', borderRadius: '8px', border: '1px solid #2c2c2e', width: '340px', justifyContent: 'center', alignItems: 'center' };

const JogoCard = ({ jogo, vencedor, votar, automatico }) => (
  <div style={cardMatchStyle}>
    <BotaoTime time={jogo.casa} selecionado={vencedor?.nome === jogo.casa?.nome}
      onClick={() => votar(jogo, jogo.casa)} bloqueado={automatico} />
    <span style={{ fontWeight: 'bold', color: '#555', flexShrink: 0 }}>VS</span>
    <BotaoTime time={jogo.fora} selecionado={vencedor?.nome === jogo.fora?.nome}
      onClick={() => votar(jogo, jogo.fora)} bloqueado={automatico} />
  </div>
);

const BotoesCompartilhar = ({ texto, refArea }) => {
  const [copiado, setCopiado] = useState(false);

  const compartilharTexto = () => {
    if (navigator.share) {
      navigator.share({ text: texto });
    } else {
      navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const tirarPrint = async () => {
    if (!refArea?.current) return;
    const canvas = await html2canvas(refArea.current, { backgroundColor: '#121212', scale: 2 });
    const link = document.createElement('a');
    link.download = 'matchrate-simulador.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
      <button onClick={compartilharTexto} style={{
        padding: '10px 20px', borderRadius: '20px', border: '1px solid #6c189c',
        backgroundColor: 'transparent', color: '#fff', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        {copiado ? '✓ Copiado!' : '🔗 Compartilhar texto'}
      </button>
      <button onClick={tirarPrint} style={{
        padding: '10px 20px', borderRadius: '20px', border: '1px solid #444',
        backgroundColor: 'transparent', color: '#fff', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        📸 Salvar print
      </button>
    </div>
  );
};

const timeDaApi = (teamObj) => {
  if (!teamObj || !teamObj.name) return null;
  return { nome: teamObj.shortName || teamObj.name, flag: teamObj.crest };
};

function BracketSimulator({ usuario }) {
  const [jogosApi, setJogosApi] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  // O Simulador agora começa nas quartas
  const [fase, setFase] = useState('quartas'); 
  const [vencedores, setVencedores] = useState({});
  const [campeao, setCampeao] = useState(null);

  const refQuartas = useRef(null);
  const refSemi = useRef(null);
  const refCampeao = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/jogos`)
      .then(res => res.json())
      .then(data => {
        const lista = Array.isArray(data?.matches) ? data.matches : Array.isArray(data) ? data : [];
        setJogosApi(lista);
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  const gerarFase = useCallback((stage) => {
    const resolverTime = (team, sourceMatchId) => {
      if (team?.name) return timeDaApi(team);
      if (sourceMatchId == null) return null;
      return vencedores[sourceMatchId] ?? null;
    };

    return jogosApi
      .filter(j => j.stage === stage)
      .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
      .map((j, i) => {
        const sourceHome = j.source?.home ?? j.homeSource?.matchId;
        const sourceAway = j.source?.away ?? j.awaySource?.matchId;

        return {
          id: i + 1,
          apiId: j.id,
          casa: resolverTime(j.homeTeam, sourceHome),
          fora: resolverTime(j.awayTeam, sourceAway),
          finalizado: j.status === 'FINISHED',
          placarCasa: j.score?.fullTime?.home,
          placarFora: j.score?.fullTime?.away,
        };
      });
  }, [jogosApi, vencedores]);

  useEffect(() => {
    if (!jogosApi.length) return;

    setVencedores(prev => {
      const novo = { ...prev };
      jogosApi.forEach(j => {
        if (j.status !== 'FINISHED') return;
        
        const casa = timeDaApi(j.homeTeam);
        const fora = timeDaApi(j.awayTeam);
        if (!casa || !fora) return;

        const score = j.score?.fullTime;
        const penalties = j.score?.penalties;

        if (!score) return;

        if (score.home > score.away) {
          novo[j.id] = casa;
        } else if (score.away > score.home) {
          novo[j.id] = fora;
        } else if (penalties) {
          if (penalties.home > penalties.away) {
            novo[j.id] = casa;
          } else if (penalties.away > penalties.home) {
            novo[j.id] = fora;
          }
        }
      });
      return novo;
    });
  }, [jogosApi]);

  const votar = (jogo, time) => {
    setVencedores(prev => ({
      ...prev,
      [jogo.apiId]: time,
    }));
  };

  const jogos8  = useMemo(() => gerarFase(STAGE_MAP.quartas), [gerarFase]);
  const jogos4  = useMemo(() => gerarFase(STAGE_MAP.semi), [gerarFase]);
  const jogos2  = useMemo(() => gerarFase(STAGE_MAP.final), [gerarFase]);

  const textoFase = (titulo, jogos) => {
    const linhas = jogos.map(j => {
      const casa = j.casa?.nome || 'A definir';
      const fora = j.fora?.nome || 'A definir';
      const v = vencedores[j.apiId];
      return v ? `  ${casa} vs ${fora} → ${v.nome}` : `  ${casa} vs ${fora}`;
    }).join('\n');
    return `${titulo} — Minha simulação:\n\n${linhas}\n\nFaça a sua em ${SITE_URL}`;
  };

  const textoCampeao = () => {
    const qua = jogos8.map(j => `  ${j.casa?.nome || '?'} vs ${j.fora?.nome || '?'} → ${vencedores[j.apiId]?.nome || '?'}`).join('\n');
    const sem = jogos4.map(j => `  ${j.casa?.nome || '?'} vs ${j.fora?.nome || '?'} → ${vencedores[j.apiId]?.nome || '?'}`).join('\n');
    const fin = jogos2.map(j => `  ${j.casa?.nome || '?'} vs ${j.fora?.nome || '?'} → ${campeao?.nome || '?'}`).join('\n');
    return `Minha simulação da Copa 2026 (Fase Final):\n\nQuartas:\n${qua}\n\nSemifinais:\n${sem}\n\nFinal:\n${fin}\n\n🏆 Campeão: ${campeao?.nome}\n\nFaça a sua em ${SITE_URL}`;
  };

  const containerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '1.5rem' };
  const btnAvancarStyle = { padding: '12px 35px', backgroundColor: '#6c189c', color: '#fff', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', marginTop: '2rem', fontSize: '1rem' };
  const bannerStyle = { backgroundColor: '#1a1a2e', border: '1px solid #6c189c', borderRadius: '10px', padding: '0.75rem 1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' };
  const bannerTexto = { color: '#fff', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 };

  const [salvando, setSalvando] = useState(false);
  const [simulacaoSalva, setSimulacaoSalva] = useState(false);

  if (carregando) {
    return <p style={{ color: '#fff', textAlign: 'center', padding: '3rem' }}>Carregando confrontos da Copa...</p>;
  }

  return (
    <div style={{ color: '#fff', padding: '20px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>

      {fase === 'quartas' && (
        <div style={{ textAlign: 'center' }}>
          <h2>Quartas de Final</h2>
          <div style={bannerStyle}>
            <p style={bannerTexto}>A Copa afunilou! Simule a reta final do torneio a partir dos confrontos já definidos.</p>
          </div>
          <div ref={refQuartas} style={{ backgroundColor: '#121212', padding: '1rem' }}>
            <div style={containerStyle}>
              {jogos8.map(jogo => (
                <JogoCard key={jogo.apiId} jogo={jogo} vencedor={vencedores[jogo.apiId]} votar={votar} automatico={jogo.finalizado} />
              ))}
            </div>
          </div>
          <BotoesCompartilhar texto={textoFase('Quartas de Final', jogos8)} refArea={refQuartas} />
          <div style={{ textAlign: 'center' }}>
            {/* Como quartas é a primeira etapa agora, não tem botão voltar */}
            <button onClick={() => setFase('semi')} style={btnAvancarStyle}>Avançar para Semifinais →</button>
          </div>
        </div>
      )}

      {fase === 'semi' && (
        <div style={{ textAlign: 'center' }}>
          <h2>Semifinal</h2>
          <div ref={refSemi} style={{ backgroundColor: '#121212', padding: '1rem' }}>
            <div style={containerStyle}>
              {jogos4.map(jogo => (
                <JogoCard key={jogo.apiId} jogo={jogo} vencedor={vencedores[jogo.apiId]} votar={votar} automatico={jogo.finalizado} />
              ))}
            </div>
          </div>
          <BotoesCompartilhar texto={textoFase('Semifinal', jogos4)} refArea={refSemi} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={() => setFase('quartas')} style={{ ...btnAvancarStyle, backgroundColor: '#333' }}>← Voltar</button>
            <button onClick={() => setFase('final')} style={btnAvancarStyle}>Avançar para a Final →</button>
          </div>
        </div>
      )}

      {fase === 'final' && (
        <div style={{ textAlign: 'center' }}>
          <h2>A Grande Final:</h2>
          <div style={containerStyle}>
            {jogos2.map(jogo => {
              const vencedorFinal = jogo.finalizado ? vencedores[jogo.apiId] : campeao;
              
              return (
                <div key={jogo.apiId} style={{ ...cardMatchStyle, width: '380px', padding: '20px' }}>
                  <BotaoTime 
                    time={jogo.casa} 
                    selecionado={vencedorFinal?.nome === jogo.casa?.nome} 
                    bloqueado={jogo.finalizado}
                    onClick={() => { setCampeao(jogo.casa); setFase('campeao'); }} 
                  />
                  <span style={{ fontWeight: 'bold', color: '#555', margin: '0 15px', flexShrink: 0 }}>VS</span>
                  <BotaoTime 
                    time={jogo.fora} 
                    selecionado={vencedorFinal?.nome === jogo.fora?.nome} 
                    bloqueado={jogo.finalizado}
                    onClick={() => { setCampeao(jogo.fora); setFase('campeao'); }} 
                  />
                </div>
              );
            })}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
            <button onClick={() => setFase('semi')} style={{ ...btnAvancarStyle, marginTop: 0, backgroundColor: '#333' }}>← Voltar</button>
            
            {jogos2[0]?.finalizado && (
              <button onClick={() => {
                setCampeao(vencedores[jogos2[0].apiId]);
                setFase('campeao');
              }} style={{ ...btnAvancarStyle, marginTop: 0 }}>
                Ver Campeão 🏆
              </button>
            )}
          </div>
        </div>
      )}

      {fase === 'campeao' && (
        <div ref={refCampeao} style={{ textAlign: 'center', padding: '3rem 0', backgroundColor: '#121212' }}>
          <img src={campeao?.flag} alt={campeao?.nome} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1.5rem' }} />
          <h1 style={{ fontSize: '4rem', color: '#ffffff', margin: 0 }}>{campeao?.nome}</h1> <br />
          <h2 style={{ color: '#fff', marginTop: '1rem' }}>É o seu Campeão da Copa do Mundo 2026!</h2>

          <div style={{ margin: '1.5rem auto', maxWidth: '400px' }}>
            {usuario ? (
              <button
                onClick={async () => {
                  setSalvando(true);
                  try {
                    const token = localStorage.getItem('token');
                    await fetch(`${import.meta.env.VITE_API_URL}/api/v1/simulacoes/`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify({
                        campeao_nome: campeao.nome,
                        campeao_flag: campeao.flag,
                        semi: jogos4.map(j => ({ casa: j.casa?.nome, fora: j.fora?.nome, vencedor: vencedores[j.apiId]?.nome })),
                        quartas: jogos8.map(j => ({ casa: j.casa?.nome, fora: j.fora?.nome, vencedor: vencedores[j.apiId]?.nome }))
                        // Removidos oitavas e dezesseis_avos do payload
                      })
                    });
                    setSimulacaoSalva(true);
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setSalvando(false);
                  }
                }}
                disabled={salvando || simulacaoSalva}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                  backgroundColor: simulacaoSalva ? '#1a472a' : '#6c189c',
                  color: simulacaoSalva ? '#4ade80' : '#fff',
                  fontWeight: 'bold', fontSize: '1rem',
                  cursor: salvando || simulacaoSalva ? 'default' : 'pointer'
                }}>
                {simulacaoSalva ? '✓ Simulação salva no perfil!' : salvando ? 'Salvando...' : '💾 Salvar no meu perfil'}
              </button>
            ) : (
              <div style={{ backgroundColor: '#1c1c1e', border: '1px solid #2c2c2e', borderRadius: '12px', padding: '1rem' }}>
                <p style={{ color: '#888', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                  Faça login para salvar sua simulação e aparecer no ranking!
                </p>
              </div>
            )}
          </div>

          <div style={{ backgroundColor: '#1c1c1e', border: '1px solid #2c2c2e', borderRadius: '12px', padding: '1.5rem', maxWidth: '500px', margin: '2rem auto', textAlign: 'left' }}>
            <h3 style={{ color: '#ffffff', margin: '0 0 1rem 0', textAlign: 'center' }}>Sua jornada na reta final</h3>
            {[
              { titulo: 'Quartas de Final', jogos: jogos8 },
              { titulo: 'Semifinais', jogos: jogos4 },
              { titulo: 'Final', jogos: jogos2 },
            ].map(({ titulo, jogos }) => (
              <div key={titulo} style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#888', fontSize: '0.75rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '1px' }}>{titulo}</p>
                {jogos.map(j => (
                  <div key={j.apiId} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.85rem' }}>
                    <span style={{ color: '#666' }}>{j.casa?.nome || '?'} vs {j.fora?.nome || '?'}</span>
                    {vencedores[j.apiId] && <>
                      <span style={{ color: '#555' }}>→</span>
                      <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>{vencedores[j.apiId].nome}</span>
                    </>}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <BotoesCompartilhar texto={textoCampeao()} refArea={refCampeao} />

          <button
            onClick={() => { setFase('quartas'); setVencedores({}); setCampeao(null); setSimulacaoSalva(false); }}
            style={{ ...btnAvancarStyle, marginTop: '1.5rem' }}>
            Reiniciar Simulador
          </button>
        </div>
      )}
    </div>
  );
}

export default BracketSimulator;