import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

const SITE_URL = 'https://match-rate-amber.vercel.app';

// Confrontos reais do Round of 16 (atualizado pós-fase de grupos)
const ROUND16_TIMES = {
  1:  { casa: { nome: 'Holanda', flag: 'https://flagcdn.com/w40/nl.png' }, fora: { nome: 'Marrocos', flag: 'https://flagcdn.com/w40/ma.png' } },
  2:  { casa: { nome: 'Alemanha', flag: 'https://flagcdn.com/w40/de.png' }, fora: { nome: 'Paraguai', flag: 'https://flagcdn.com/w40/py.png' } },
  3:  { casa: { nome: 'Brasil', flag: 'https://flagcdn.com/w40/br.png' }, fora: { nome: 'Japão', flag: 'https://flagcdn.com/w40/jp.png' } },
  4:  { casa: { nome: 'África do Sul', flag: 'https://flagcdn.com/w40/za.png' }, fora: { nome: 'Canadá', flag: 'https://flagcdn.com/w40/ca.png' } },
  5:  { casa: { nome: 'Costa do Marfim', flag: 'https://flagcdn.com/w40/ci.png' }, fora: { nome: 'Noruega', flag: 'https://flagcdn.com/w40/no.png' } },
  6:  { casa: { nome: 'França', flag: 'https://flagcdn.com/w40/fr.png' }, fora: { nome: 'Suécia', flag: 'https://flagcdn.com/w40/se.png' } },
  7:  { casa: { nome: 'México', flag: 'https://flagcdn.com/w40/mx.png' }, fora: { nome: 'Equador', flag: 'https://flagcdn.com/w40/ec.png' } },
  8:  { casa: { nome: 'Inglaterra', flag: 'https://flagcdn.com/w40/gb-eng.png' }, fora: { nome: 'RD Congo', flag: 'https://flagcdn.com/w40/cd.png' } },
  9:  { casa: { nome: 'Bélgica', flag: 'https://flagcdn.com/w40/be.png' }, fora: { nome: 'Senegal', flag: 'https://flagcdn.com/w40/sn.png' } },
  10: { casa: { nome: 'Estados Unidos', flag: 'https://flagcdn.com/w40/us.png' }, fora: { nome: 'Bósnia e Herzegovina', flag: 'https://flagcdn.com/w40/ba.png' } },
  11: { casa: { nome: 'Espanha', flag: 'https://flagcdn.com/w40/es.png' }, fora: { nome: 'Áustria', flag: 'https://flagcdn.com/w40/at.png' } },
  12: { casa: { nome: 'Portugal', flag: 'https://flagcdn.com/w40/pt.png' }, fora: { nome: 'Croácia', flag: 'https://flagcdn.com/w40/hr.png' } },
  13: { casa: { nome: 'Suíça', flag: 'https://flagcdn.com/w40/ch.png' }, fora: { nome: 'Argélia', flag: 'https://flagcdn.com/w40/dz.png' } },
  14: { casa: { nome: 'Austrália', flag: 'https://flagcdn.com/w40/au.png' }, fora: { nome: 'Egito', flag: 'https://flagcdn.com/w40/eg.png' } },
  15: { casa: { nome: 'Argentina', flag: 'https://flagcdn.com/w40/ar.png' }, fora: { nome: 'Cabo Verde', flag: 'https://flagcdn.com/w40/cv.png' } },
  16: { casa: { nome: 'Colômbia', flag: 'https://flagcdn.com/w40/co.png' }, fora: { nome: 'Gana', flag: 'https://flagcdn.com/w40/gh.png' } },
};

const Bandeira = ({ flag, nome }) => (
  flag ? <img src={flag} alt={nome} style={{ width: '24px', height: '16px', objectFit: 'cover', borderRadius: '2px', flexShrink: 0 }} /> : null
);

const BotaoTime = ({ time, selecionado, onClick }) => (
  <button onClick={onClick} style={{
    padding: '10px', backgroundColor: selecionado ? '#6c189c' : '#222', color: '#fff',
    border: selecionado ? '1px solid #a855f7' : '1px solid #444', borderRadius: '6px',
    cursor: time ? 'pointer' : 'default', flex: 1, fontSize: '0.9rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    fontWeight: selecionado ? 'bold' : 'normal', transition: 'all 0.2s', opacity: time ? 1 : 0.4
  }}>
    <Bandeira flag={time?.flag} nome={time?.nome} />
    {time?.nome || 'A definir'}
  </button>
);

const cardMatchStyle = { display: 'flex', gap: '15px', backgroundColor: '#141414', padding: '15px', borderRadius: '8px', border: '1px solid #333', width: '340px', justifyContent: 'center', alignItems: 'center' };

const JogoCard = ({ jogo, vencedores, setter, votar }) => (
  <div style={cardMatchStyle}>
    <BotaoTime time={jogo.casa} selecionado={vencedores[jogo.id]?.nome === jogo.casa?.nome} onClick={() => votar(setter, jogo.id, jogo.casa, jogo.fora)} />
    <span style={{ fontWeight: 'bold', color: '#555', flexShrink: 0 }}>VS</span>
    <BotaoTime time={jogo.fora} selecionado={vencedores[jogo.id]?.nome === jogo.fora?.nome} onClick={() => votar(setter, jogo.id, jogo.fora, jogo.casa)} />
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
    const canvas = await html2canvas(refArea.current, { backgroundColor: '#0a0a0a', scale: 2 });
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

function BracketSimulator({ usuario }) {
  const [fase, setFase] = useState('round16');
  const [vencedoresRound16, setVencedoresRound16] = useState({});
  const [vencedoresOitavas, setVencedoresOitavas] = useState({});
  const [vencedoresQuartas, setVencedoresQuartas] = useState({});
  const [vencedoresSemi, setVencedoresSemi] = useState({});
  const [campeao, setCampeao] = useState(null);

  const refRound16 = useRef(null);
  const refOitavas = useRef(null);
  const refQuartas = useRef(null);
  const refSemi = useRef(null);
  const refCampeao = useRef(null);

  const gerarRound16 = () => Object.keys(ROUND16_TIMES).map(id => ({
    id: Number(id),
    casa: ROUND16_TIMES[id].casa,
    fora: ROUND16_TIMES[id].fora
  }));

  const gerarOitavas = () => Array.from({ length: 8 }, (_, i) => ({
    id: i + 1, casa: vencedoresRound16[i * 2 + 1], fora: vencedoresRound16[i * 2 + 2]
  }));
  const gerarQuartas = () => Array.from({ length: 4 }, (_, i) => ({
    id: i + 1, casa: vencedoresOitavas[i * 2 + 1], fora: vencedoresOitavas[i * 2 + 2]
  }));
  const gerarSemi = () => [
    { id: 1, casa: vencedoresQuartas[1], fora: vencedoresQuartas[2] },
    { id: 2, casa: vencedoresQuartas[3], fora: vencedoresQuartas[4] }
  ];
  const gerarFinal = () => [{ id: 1, casa: vencedoresSemi[1], fora: vencedoresSemi[2] }];

  const votar = (setter, jogoId, timeObj, timeAdversario) => {
    if (!timeObj || !timeAdversario || timeObj.nome === timeAdversario.nome) return;
    setter(prev => ({ ...prev, [jogoId]: timeObj }));
  };

  const textoFase = (titulo, jogos, vencedores) => {
    const linhas = jogos.map(j => {
      const casa = j.casa?.nome || 'A definir';
      const fora = j.fora?.nome || 'A definir';
      const v = vencedores[j.id];
      return v ? `  ${casa} vs ${fora} → ${v.nome}` : `  ${casa} vs ${fora}`;
    }).join('\n');
    return `${titulo} — Minha simulação:\n\n${linhas}\n\nFaça a sua em ${SITE_URL}`;
  };

  const textoCampeao = () => {
    const round16 = gerarRound16().map(j => `  ${j.casa?.nome} vs ${j.fora?.nome} → ${vencedoresRound16[j.id]?.nome || '?'}`).join('\n');
    const oitavas = gerarOitavas().map(j => `  ${j.casa?.nome || '?'} vs ${j.fora?.nome || '?'} → ${vencedoresOitavas[j.id]?.nome || '?'}`).join('\n');
    const quartas = gerarQuartas().map(j => `  ${j.casa?.nome || '?'} vs ${j.fora?.nome || '?'} → ${vencedoresQuartas[j.id]?.nome || '?'}`).join('\n');
    const semi = gerarSemi().map(j => `  ${j.casa?.nome || '?'} vs ${j.fora?.nome || '?'} → ${vencedoresSemi[j.id]?.nome || '?'}`).join('\n');
    const final = gerarFinal().map(j => `  ${j.casa?.nome || '?'} vs ${j.fora?.nome || '?'} → ${campeao?.nome || '?'}`).join('\n');
    return `Minha simulação da Copa 2026 (a partir dos 16 avos):\n\n16 Avos:\n${round16}\n\nOitavas:\n${oitavas}\n\nQuartas:\n${quartas}\n\nSemifinais:\n${semi}\n\nFinal:\n${final}\n\n🏆 Campeão: ${campeao?.nome}\n\nFaça a sua em ${SITE_URL}`;
  };

  const containerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '1.5rem' };
  const btnAvancarStyle = { padding: '12px 35px', backgroundColor: '#6c189c', color: '#fff', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', marginTop: '2rem', fontSize: '1rem' };
  const bannerStyle = { backgroundColor: '#1a1a2e', border: '1px solid #6c189c', borderRadius: '10px', padding: '0.75rem 1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' };
  const bannerTexto = { color: '#fff', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 };

  const [salvando, setSalvando] = useState(false);
  const [simulacaoSalva, setSimulacaoSalva] = useState(false);

  return (
    <div style={{ color: '#fff', padding: '20px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>

      {/* ROUND OF 16 — ponto de partida real */}
      {fase === 'round16' && (
        <div style={{ textAlign: 'center' }}>
          <h2>16 Avos de Final</h2>
          <div style={bannerStyle}>
            <p style={bannerTexto}>Os confrontos reais já estão definidos! Escolha quem avança em cada jogo dos 16 avos.</p>
          </div>
          <div ref={refRound16} style={{ backgroundColor: '#0a0a0a', padding: '1rem' }}>
            <div style={containerStyle}>
              {gerarRound16().map(jogo => (
                <JogoCard key={jogo.id} jogo={jogo} vencedores={vencedoresRound16} setter={setVencedoresRound16} votar={votar} />
              ))}
            </div>
          </div>
          <BotoesCompartilhar texto={textoFase('16 Avos de Final', gerarRound16(), vencedoresRound16)} refArea={refRound16} />
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => setFase('oitavas')} style={btnAvancarStyle}>Avançar para Oitavas →</button>
          </div>
        </div>
      )}

      {/* OITAVAS */}
      {fase === 'oitavas' && (
        <div style={{ textAlign: 'center' }}>
          <h2>Oitavas de Final</h2>
          <div ref={refOitavas} style={{ backgroundColor: '#0a0a0a', padding: '1rem' }}>
            <div style={containerStyle}>
              {gerarOitavas().map(jogo => (
                <JogoCard key={jogo.id} jogo={jogo} vencedores={vencedoresOitavas} setter={setVencedoresOitavas} votar={votar} />
              ))}
            </div>
          </div>
          <BotoesCompartilhar texto={textoFase('Oitavas de Final', gerarOitavas(), vencedoresOitavas)} refArea={refOitavas} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={() => setFase('round16')} style={{ ...btnAvancarStyle, backgroundColor: '#333' }}>← Voltar</button>
            <button onClick={() => setFase('quartas')} style={btnAvancarStyle}>Avançar para Quartas →</button>
          </div>
        </div>
      )}

      {/* QUARTAS */}
      {fase === 'quartas' && (
        <div style={{ textAlign: 'center' }}>
          <h2>Quartas de Final</h2>
          <div ref={refQuartas} style={{ backgroundColor: '#0a0a0a', padding: '1rem' }}>
            <div style={containerStyle}>
              {gerarQuartas().map(jogo => (
                <JogoCard key={jogo.id} jogo={jogo} vencedores={vencedoresQuartas} setter={setVencedoresQuartas} votar={votar} />
              ))}
            </div>
          </div>
          <BotoesCompartilhar texto={textoFase('Quartas de Final', gerarQuartas(), vencedoresQuartas)} refArea={refQuartas} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={() => setFase('oitavas')} style={{ ...btnAvancarStyle, backgroundColor: '#333' }}>← Voltar</button>
            <button onClick={() => setFase('semi')} style={btnAvancarStyle}>Avançar para Semifinal →</button>
          </div>
        </div>
      )}

      {/* SEMI */}
      {fase === 'semi' && (
        <div style={{ textAlign: 'center' }}>
          <h2>Semifinal</h2>
          <div ref={refSemi} style={{ backgroundColor: '#0a0a0a', padding: '1rem' }}>
            <div style={containerStyle}>
              {gerarSemi().map(jogo => (
                <JogoCard key={jogo.id} jogo={jogo} vencedores={vencedoresSemi} setter={setVencedoresSemi} votar={votar} />
              ))}
            </div>
          </div>
          <BotoesCompartilhar texto={textoFase('Semifinal', gerarSemi(), vencedoresSemi)} refArea={refSemi} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={() => setFase('quartas')} style={{ ...btnAvancarStyle, backgroundColor: '#333' }}>← Voltar</button>
            <button onClick={() => setFase('final')} style={btnAvancarStyle}>Avançar para a Final →</button>
          </div>
        </div>
      )}

      {/* FINAL */}
      {fase === 'final' && (
        <div style={{ textAlign: 'center' }}>
          <h2>A Grande Final:</h2>
          <div style={containerStyle}>
            {gerarFinal().map(jogo => (
              <div key={jogo.id} style={{ ...cardMatchStyle, width: '380px', padding: '20px' }}>
                <BotaoTime time={jogo.casa} selecionado={campeao?.nome === jogo.casa?.nome} onClick={() => { setCampeao(jogo.casa); setFase('campeao'); }} />
                <span style={{ fontWeight: 'bold', color: '#555', margin: '0 15px', flexShrink: 0 }}>VS</span>
                <BotaoTime time={jogo.fora} selecionado={campeao?.nome === jogo.fora?.nome} onClick={() => { setCampeao(jogo.fora); setFase('campeao'); }} />
              </div>
            ))}
          </div>
          <button onClick={() => setFase('semi')} style={{ ...btnAvancarStyle, backgroundColor: '#333' }}>← Voltar</button>
        </div>
      )}

      {/* CAMPEÃO */}
      {fase === 'campeao' && (
        <div ref={refCampeao} style={{ textAlign: 'center', padding: '3rem 0', backgroundColor: '#0a0a0a' }}>
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
                        semi: gerarSemi().map(j => ({ casa: j.casa?.nome, fora: j.fora?.nome, vencedor: vencedoresSemi[j.id]?.nome })),
                        quartas: gerarQuartas().map(j => ({ casa: j.casa?.nome, fora: j.fora?.nome, vencedor: vencedoresQuartas[j.id]?.nome })),
                        oitavas: gerarOitavas().map(j => ({ casa: j.casa?.nome, fora: j.fora?.nome, vencedor: vencedoresOitavas[j.id]?.nome }))
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
              <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1rem' }}>
                <p style={{ color: '#888', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                  Faça login para salvar sua simulação e aparecer no ranking!
                </p>
              </div>
            )}
          </div>

          <div style={{ backgroundColor: '#141414', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem', maxWidth: '500px', margin: '2rem auto', textAlign: 'left' }}>
            <h3 style={{ color: '#ffffff', margin: '0 0 1rem 0', textAlign: 'center' }}>Sua jornada completa</h3>
            {[
              { titulo: '16 Avos', jogos: gerarRound16(), vencedores: vencedoresRound16 },
              { titulo: 'Oitavas', jogos: gerarOitavas(), vencedores: vencedoresOitavas },
              { titulo: 'Quartas', jogos: gerarQuartas(), vencedores: vencedoresQuartas },
              { titulo: 'Semifinais', jogos: gerarSemi(), vencedores: vencedoresSemi },
              { titulo: 'Final', jogos: gerarFinal(), vencedores: { 1: campeao } },
            ].map(({ titulo, jogos, vencedores }) => (
              <div key={titulo} style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#888', fontSize: '0.75rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '1px' }}>{titulo}</p>
                {jogos.map(j => (
                  <div key={j.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.85rem' }}>
                    <span style={{ color: '#666' }}>{j.casa?.nome || '?'} vs {j.fora?.nome || '?'}</span>
                    {vencedores[j.id] && <>
                      <span style={{ color: '#555' }}>→</span>
                      <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>{vencedores[j.id].nome}</span>
                    </>}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <BotoesCompartilhar texto={textoCampeao()} refArea={refCampeao} />

          <button
            onClick={() => { setFase('round16'); setVencedoresRound16({}); setVencedoresOitavas({}); setVencedoresQuartas({}); setVencedoresSemi({}); setCampeao(null); setSimulacaoSalva(false); }}
            style={{ ...btnAvancarStyle, marginTop: '1.5rem' }}>
            Reiniciar Simulador
          </button>
        </div>
      )}
    </div>
  );
}

export default BracketSimulator;