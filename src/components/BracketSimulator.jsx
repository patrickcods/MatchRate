import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

const SITE_URL = 'https://match-rate-amber.vercel.app';

const GRUPOS_DADOS = {
  A: [
    { nome: 'México', flag: 'https://flagcdn.com/w40/mx.png' },
    { nome: 'África do Sul', flag: 'https://flagcdn.com/w40/za.png' },
    { nome: 'Coreia do Sul', flag: 'https://flagcdn.com/w40/kr.png' },
    { nome: 'República Checa', flag: 'https://flagcdn.com/w40/cz.png' }
  ],
  B: [
    { nome: 'Canadá', flag: 'https://flagcdn.com/w40/ca.png' },
    { nome: 'Bósnia e Herzegovina', flag: 'https://flagcdn.com/w40/ba.png' },
    { nome: 'Catar', flag: 'https://flagcdn.com/w40/qa.png' },
    { nome: 'Suíça', flag: 'https://flagcdn.com/w40/ch.png' }
  ],
  C: [
    { nome: 'Brasil', flag: 'https://flagcdn.com/w40/br.png' },
    { nome: 'Marrocos', flag: 'https://flagcdn.com/w40/ma.png' },
    { nome: 'Haiti', flag: 'https://flagcdn.com/w40/ht.png' },
    { nome: 'Escócia', flag: 'https://flagcdn.com/w40/gb-sct.png' }
  ],
  D: [
    { nome: 'Estados Unidos', flag: 'https://flagcdn.com/w40/us.png' },
    { nome: 'Paraguai', flag: 'https://flagcdn.com/w40/py.png' },
    { nome: 'Austrália', flag: 'https://flagcdn.com/w40/au.png' },
    { nome: 'Turquia', flag: 'https://flagcdn.com/w40/tr.png' }
  ],
  E: [
    { nome: 'Alemanha', flag: 'https://flagcdn.com/w40/de.png' },
    { nome: 'Curaçao', flag: 'https://flagcdn.com/w40/cw.png' },
    { nome: 'Costa do Marfim', flag: 'https://flagcdn.com/w40/ci.png' },
    { nome: 'Equador', flag: 'https://flagcdn.com/w40/ec.png' }
  ],
  F: [
    { nome: 'Holanda', flag: 'https://flagcdn.com/w40/nl.png' },
    { nome: 'Japão', flag: 'https://flagcdn.com/w40/jp.png' },
    { nome: 'Suécia', flag: 'https://flagcdn.com/w40/se.png' },
    { nome: 'Tunísia', flag: 'https://flagcdn.com/w40/tn.png' }
  ],
  G: [
    { nome: 'Bélgica', flag: 'https://flagcdn.com/w40/be.png' },
    { nome: 'Egito', flag: 'https://flagcdn.com/w40/eg.png' },
    { nome: 'Irã', flag: 'https://flagcdn.com/w40/ir.png' },
    { nome: 'Nova Zelândia', flag: 'https://flagcdn.com/w40/nz.png' }
  ],
  H: [
    { nome: 'Espanha', flag: 'https://flagcdn.com/w40/es.png' },
    { nome: 'Cabo Verde', flag: 'https://flagcdn.com/w40/cv.png' },
    { nome: 'Arábia Saudita', flag: 'https://flagcdn.com/w40/sa.png' },
    { nome: 'Uruguai', flag: 'https://flagcdn.com/w40/uy.png' }
  ],
  I: [
    { nome: 'França', flag: 'https://flagcdn.com/w40/fr.png' },
    { nome: 'Senegal', flag: 'https://flagcdn.com/w40/sn.png' },
    { nome: 'Iraque', flag: 'https://flagcdn.com/w40/iq.png' },
    { nome: 'Noruega', flag: 'https://flagcdn.com/w40/no.png' }
  ],
  J: [
    { nome: 'Argentina', flag: 'https://flagcdn.com/w40/ar.png' },
    { nome: 'Argélia', flag: 'https://flagcdn.com/w40/dz.png' },
    { nome: 'Áustria', flag: 'https://flagcdn.com/w40/at.png' },
    { nome: 'Jordânia', flag: 'https://flagcdn.com/w40/jo.png' }
  ],
  K: [
    { nome: 'Portugal', flag: 'https://flagcdn.com/w40/pt.png' },
    { nome: 'RD Congo', flag: 'https://flagcdn.com/w40/cd.png' },
    { nome: 'Uzbequistão', flag: 'https://flagcdn.com/w40/uz.png' },
    { nome: 'Colômbia', flag: 'https://flagcdn.com/w40/co.png' }
  ],
  L: [
    { nome: 'Inglaterra', flag: 'https://flagcdn.com/w40/gb-eng.png' },
    { nome: 'Croácia', flag: 'https://flagcdn.com/w40/hr.png' },
    { nome: 'Gana', flag: 'https://flagcdn.com/w40/gh.png' },
    { nome: 'Panamá', flag: 'https://flagcdn.com/w40/pa.png' }
  ]
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

// Botão de compartilhamento reutilizável
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

function BracketSimulator() {
  const [fase, setFase] = useState('grupos');
  const [escolhas, setEscolhas] = useState({});
  const [terceirosSelecionados, setTerceirosSelecionados] = useState([]);
  const [vencedoresRound32, setVencedoresRound32] = useState({});
  const [vencedoresOitavas, setVencedoresOitavas] = useState({});
  const [vencedoresQuartas, setVencedoresQuartas] = useState({});
  const [vencedoresSemi, setVencedoresSemi] = useState({});
  const [campeao, setCampeao] = useState(null);

  const refRound32 = useRef(null);
  const refOitavas = useRef(null);
  const refQuartas = useRef(null);
  const refSemi = useRef(null);
  const refCampeao = useRef(null);

  const definirPassagem = (grupo, posicao, timeString) => {
    if (!timeString) return;
    setEscolhas(prev => ({ ...prev, [`${grupo}${posicao}`]: JSON.parse(timeString) }));
  };

  const getTerceiros = () => Object.keys(GRUPOS_DADOS).map(g => {
    const p = escolhas[`${g}1`]?.nome, s = escolhas[`${g}2`]?.nome;
    return GRUPOS_DADOS[g].find(t => t.nome !== p && t.nome !== s && (p || s));
  }).filter(Boolean);

  const toggleTerceiro = (time) => {
    setTerceirosSelecionados(prev => {
      const jaEsta = prev.find(t => t.nome === time.nome);
      if (jaEsta) return prev.filter(t => t.nome !== time.nome);
      if (prev.length >= 8) return prev;
      return [...prev, time];
    });
  };

  const gerarRound32 = () => [
    { id: 1,  casa: escolhas['A1'], fora: escolhas['B2'] },
    { id: 2,  casa: escolhas['C1'], fora: escolhas['D2'] },
    { id: 3,  casa: escolhas['E1'], fora: escolhas['F2'] },
    { id: 4,  casa: escolhas['G1'], fora: escolhas['H2'] },
    { id: 5,  casa: escolhas['I1'], fora: escolhas['J2'] },
    { id: 6,  casa: escolhas['K1'], fora: escolhas['L2'] },
    { id: 7,  casa: escolhas['B1'], fora: escolhas['A2'] },
    { id: 8,  casa: escolhas['D1'], fora: escolhas['C2'] },
    { id: 9,  casa: escolhas['F1'], fora: escolhas['E2'] },
    { id: 10, casa: escolhas['H1'], fora: escolhas['G2'] },
    { id: 11, casa: escolhas['J1'], fora: escolhas['I2'] },
    { id: 12, casa: escolhas['L1'], fora: escolhas['K2'] },
    { id: 13, casa: terceirosSelecionados[0], fora: terceirosSelecionados[1] },
    { id: 14, casa: terceirosSelecionados[2], fora: terceirosSelecionados[3] },
    { id: 15, casa: terceirosSelecionados[4], fora: terceirosSelecionados[5] },
    { id: 16, casa: terceirosSelecionados[6], fora: terceirosSelecionados[7] },
  ];

  const gerarOitavas  = () => Array.from({length: 8},  (_, i) => ({ id: i+1, casa: vencedoresRound32[i+1],  fora: vencedoresRound32[i+9]  }));
  const gerarQuartas  = () => Array.from({length: 4},  (_, i) => ({ id: i+1, casa: vencedoresOitavas[i*2+1], fora: vencedoresOitavas[i*2+2] }));
  const gerarSemi     = () => [{ id: 1, casa: vencedoresQuartas[1], fora: vencedoresQuartas[2] }, { id: 2, casa: vencedoresQuartas[3], fora: vencedoresQuartas[4] }];
  const gerarFinal    = () => [{ id: 1, casa: vencedoresSemi[1], fora: vencedoresSemi[2] }];

  const votar = (setter, jogoId, timeObj, timeAdversario) => {
    if (!timeObj || !timeAdversario || timeObj.nome === timeAdversario.nome) return;
    setter(prev => ({ ...prev, [jogoId]: timeObj }));
  };

  // Textos de compartilhamento por fase
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
    const oitavas  = gerarOitavas().map(j  => `  ${j.casa?.nome || '?'} vs ${j.fora?.nome || '?'} → ${vencedoresOitavas[j.id]?.nome || '?'}`).join('\n');
    const quartas  = gerarQuartas().map(j  => `  ${j.casa?.nome || '?'} vs ${j.fora?.nome || '?'} → ${vencedoresQuartas[j.id]?.nome || '?'}`).join('\n');
    const semi     = gerarSemi().map(j     => `  ${j.casa?.nome || '?'} vs ${j.fora?.nome || '?'} → ${vencedoresSemi[j.id]?.nome || '?'}`).join('\n');
    const final    = gerarFinal().map(j    => `  ${j.casa?.nome || '?'} vs ${j.fora?.nome || '?'} → ${campeao?.nome || '?'}`).join('\n');
    return `Minha simulação da Copa 2026:\n\nOitavas:\n${oitavas}\n\nQuartas:\n${quartas}\n\nSemifinais:\n${semi}\n\nFinal:\n${final}\n\n🏆 Campeão: ${campeao?.nome}\n\nFaça a sua em ${SITE_URL}`;
  };

  const containerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '1.5rem' };
  const btnAvancarStyle = { padding: '12px 35px', backgroundColor: '#6c189c', color: '#fff', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', marginTop: '2rem', fontSize: '1rem' };
  const bannerStyle = { backgroundColor: '#1a1a2e', border: '1px solid #6c189c', borderRadius: '10px', padding: '0.75rem 1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' };
  const bannerTexto = { color: '#fff', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 };

  const terceiros = getTerceiros();

  return (
    <div style={{ color: '#fff', padding: '20px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>

      {/* GRUPOS */}
      {fase === 'grupos' && (
        <>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>1. Classificados dos Grupos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {Object.keys(GRUPOS_DADOS).map(g => (
              <div key={g} style={{ backgroundColor: '#141414', border: '1px solid #333', padding: '15px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#6c189c', fontSize: '1.1rem' }}>Grupo {g}</h4>
                <select onChange={(e) => definirPassagem(g, '1', e.target.value)}
                  style={{ width: '100%', marginBottom: '8px', padding: '8px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                  <option value="">1º Lugar</option>
                  {GRUPOS_DADOS[g].filter(t => t.nome !== escolhas[`${g}2`]?.nome).map(t => (
                    <option key={t.nome} value={JSON.stringify(t)}>{t.nome}</option>
                  ))}
                </select>
                <select onChange={(e) => definirPassagem(g, '2', e.target.value)}
                  style={{ width: '100%', padding: '8px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                  <option value="">2º Lugar</option>
                  {GRUPOS_DADOS[g].filter(t => t.nome !== escolhas[`${g}1`]?.nome).map(t => (
                    <option key={t.nome} value={JSON.stringify(t)}>{t.nome}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            {(() => {
              const ok = Object.keys(GRUPOS_DADOS).every(g => escolhas[g+'1'] && escolhas[g+'2']);
              return (
                <button onClick={() => ok && setFase('terceiros')} disabled={!ok}
                  style={{ ...btnAvancarStyle, backgroundColor: ok ? '#6c189c' : '#333', cursor: ok ? 'pointer' : 'not-allowed', opacity: ok ? 1 : 0.5 }}>
                  {ok ? 'Avançar para Melhores Terceiros →' : `Defina todos os grupos primeiro (${Object.keys(GRUPOS_DADOS).filter(g => escolhas[g+'1'] && escolhas[g+'2']).length}/12)`}
                </button>
              );
            })()}
          </div>
        </>
      )}

      {/* TERCEIROS */}
      {fase === 'terceiros' && (
        <div style={{ textAlign: 'center' }}>
          <h2>2. Melhores Terceiros Colocados</h2>
          <div style={bannerStyle}>
            <p style={bannerTexto}><strong>Nova regra da FIFA 2026:</strong> Com 12 grupos, os 8 melhores terceiros colocados também se classificam para o mata-mata. Escolha abaixo quais você acha que vão avançar.</p>
          </div>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Selecione <strong style={{ color: '#fff' }}>8 times</strong> para avançar
            <span style={{ marginLeft: '8px', color: terceirosSelecionados.length === 8 ? '#4ade80' : '#6c189c', fontWeight: 'bold' }}>
              ({terceirosSelecionados.length}/8)
            </span>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '700px', margin: '0 auto' }}>
            {terceiros.map(time => {
              const sel = terceirosSelecionados.find(t => t.nome === time.nome);
              const dis = !sel && terceirosSelecionados.length >= 8;
              return (
                <button key={time.nome} onClick={() => toggleTerceiro(time)} disabled={dis}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px',
                    cursor: dis ? 'not-allowed' : 'pointer', backgroundColor: sel ? '#6c189c' : '#1a1a1a',
                    border: sel ? '1px solid #a855f7' : '1px solid #333', color: dis ? '#555' : '#fff',
                    fontWeight: sel ? 'bold' : 'normal', transition: 'all 0.2s', opacity: dis ? 0.4 : 1 }}>
                  <Bandeira flag={time.flag} nome={time.nome} />
                  {time.nome}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={() => setFase('grupos')} style={{ ...btnAvancarStyle, backgroundColor: '#333' }}>← Voltar</button>
            <button onClick={() => setFase('round32')} disabled={terceirosSelecionados.length < 8}
              style={{ ...btnAvancarStyle, backgroundColor: terceirosSelecionados.length < 8 ? '#333' : '#6c189c', cursor: terceirosSelecionados.length < 8 ? 'not-allowed' : 'pointer' }}>
              Avançar para Round of 32 →
            </button>
          </div>
        </div>
      )}

      {/* ROUND OF 32 */}
      {fase === 'round32' && (
        <div style={{ textAlign: 'center' }}>
          <h2>3. Round of 32</h2>
          <div style={bannerStyle}>
            <p style={bannerTexto}><strong>Fase inédita na história da Copa:</strong> 32 seleções se enfrentam antes das oitavas. Os 12 jogos do topo são 1º vs 2º de grupos cruzados. Os 4 jogos finais são entre os melhores terceiros que você escolheu.</p>
          </div>
          <div ref={refRound32} style={{ backgroundColor: '#0a0a0a', padding: '1rem' }}>
            <div style={containerStyle}>
              {gerarRound32().map(jogo => (
                <JogoCard key={jogo.id} jogo={jogo} vencedores={vencedoresRound32} setter={setVencedoresRound32} votar={votar} />
              ))}
            </div>
          </div>
          <BotoesCompartilhar
            texto={textoFase('Round of 32', gerarRound32(), vencedoresRound32)}
            refArea={refRound32}
          />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={() => setFase('terceiros')} style={{ ...btnAvancarStyle, backgroundColor: '#333' }}>← Voltar</button>
            <button onClick={() => setFase('oitavas')} style={btnAvancarStyle}>Avançar para Oitavas →</button>
          </div>
        </div>
      )}

      {/* OITAVAS */}
      {fase === 'oitavas' && (
        <div style={{ textAlign: 'center' }}>
          <h2>4. Oitavas de Final</h2>
          <div ref={refOitavas} style={{ backgroundColor: '#0a0a0a', padding: '1rem' }}>
            <div style={containerStyle}>
              {gerarOitavas().map(jogo => (
                <JogoCard key={jogo.id} jogo={jogo} vencedores={vencedoresOitavas} setter={setVencedoresOitavas} votar={votar} />
              ))}
            </div>
          </div>
          <BotoesCompartilhar
            texto={textoFase('Oitavas de Final', gerarOitavas(), vencedoresOitavas)}
            refArea={refOitavas}
          />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={() => setFase('round32')} style={{ ...btnAvancarStyle, backgroundColor: '#333' }}>← Voltar</button>
            <button onClick={() => setFase('quartas')} style={btnAvancarStyle}>Avançar para Quartas →</button>
          </div>
        </div>
      )}

      {/* QUARTAS */}
      {fase === 'quartas' && (
        <div style={{ textAlign: 'center' }}>
          <h2>5. Quartas de Final</h2>
          <div ref={refQuartas} style={{ backgroundColor: '#0a0a0a', padding: '1rem' }}>
            <div style={containerStyle}>
              {gerarQuartas().map(jogo => (
                <JogoCard key={jogo.id} jogo={jogo} vencedores={vencedoresQuartas} setter={setVencedoresQuartas} votar={votar} />
              ))}
            </div>
          </div>
          <BotoesCompartilhar
            texto={textoFase('Quartas de Final', gerarQuartas(), vencedoresQuartas)}
            refArea={refQuartas}
          />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={() => setFase('oitavas')} style={{ ...btnAvancarStyle, backgroundColor: '#333' }}>← Voltar</button>
            <button onClick={() => setFase('semi')} style={btnAvancarStyle}>Avançar para Semifinal →</button>
          </div>
        </div>
      )}

      {/* SEMI */}
      {fase === 'semi' && (
        <div style={{ textAlign: 'center' }}>
          <h2>6. Semifinal</h2>
          <div ref={refSemi} style={{ backgroundColor: '#0a0a0a', padding: '1rem' }}>
            <div style={containerStyle}>
              {gerarSemi().map(jogo => (
                <JogoCard key={jogo.id} jogo={jogo} vencedores={vencedoresSemi} setter={setVencedoresSemi} votar={votar} />
              ))}
            </div>
          </div>
          <BotoesCompartilhar
            texto={textoFase('Semifinal', gerarSemi(), vencedoresSemi)}
            refArea={refSemi}
          />
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

          {/* Histórico completo */}
          <div style={{ backgroundColor: '#141414', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem', maxWidth: '500px', margin: '2rem auto', textAlign: 'left' }}>
            <h3 style={{ color: '#ffffff', margin: '0 0 1rem 0', textAlign: 'center' }}>Sua jornada completa</h3>
            {[
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
            onClick={() => { setFase('grupos'); setEscolhas({}); setTerceirosSelecionados([]); setVencedoresRound32({}); setVencedoresOitavas({}); setVencedoresQuartas({}); setVencedoresSemi({}); setCampeao(null); }}
            style={{ ...btnAvancarStyle, marginTop: '1.5rem' }}>
            Reiniciar Simulador
          </button>
        </div>
      )}
    </div>
  );
}

export default BracketSimulator;