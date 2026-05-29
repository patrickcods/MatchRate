import { useState } from 'react';

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
  flag
    ? <img src={flag} alt={nome} style={{ width: '24px', height: '16px', objectFit: 'cover', borderRadius: '2px', flexShrink: 0 }} />
    : null
);

const BotaoTime = ({ time, selecionado, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '10px',
      backgroundColor: selecionado ? '#6c189c' : '#222',
      color: '#fff',
      border: selecionado ? '1px solid #a855f7' : '1px solid #444',
      borderRadius: '6px',
      cursor: time ? 'pointer' : 'default',
      flex: 1,
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontWeight: selecionado ? 'bold' : 'normal',
      transition: 'all 0.2s',
      opacity: time ? 1 : 0.4
    }}
  >
    <Bandeira flag={time?.flag} nome={time?.nome} />
    {time?.nome || 'A definir'}
  </button>
);

function BracketSimulator() {
  const [fase, setFase] = useState('grupos');
  const [escolhas, setEscolhas] = useState({});
  const [vencedoresOitavas, setVencedoresOitavas] = useState({});
  const [vencedoresQuartas, setVencedoresQuartas] = useState({});
  const [vencedoresSemi, setVencedoresSemi] = useState({});
  const [campeao, setCampeao] = useState(null);

  const definirPassagem = (grupo, posicao, timeString) => {
    if (!timeString) return;
    const timeObj = JSON.parse(timeString);
    setEscolhas(prev => ({ ...prev, [`${grupo}${posicao}`]: timeObj }));
  };

  const gerarOitavas = () => [
    { id: 1, casa: escolhas['A1'], fora: escolhas['B2'] },
    { id: 2, casa: escolhas['C1'], fora: escolhas['F2'] },
    { id: 3, casa: escolhas['E1'], fora: escolhas['A2'] },
    { id: 4, casa: escolhas['L1'], fora: escolhas['K2'] },
    { id: 5, casa: escolhas['H1'], fora: escolhas['J2'] },
    { id: 6, casa: escolhas['B1'], fora: escolhas['C2'] },
    { id: 7, casa: escolhas['J1'], fora: escolhas['H2'] },
    { id: 8, casa: escolhas['G1'], fora: escolhas['I2'] }
  ];

  const gerarQuartas = () => [
    { id: 1, casa: vencedoresOitavas[1], fora: vencedoresOitavas[2] },
    { id: 2, casa: vencedoresOitavas[3], fora: vencedoresOitavas[4] },
    { id: 3, casa: vencedoresOitavas[5], fora: vencedoresOitavas[6] },
    { id: 4, casa: vencedoresOitavas[7], fora: vencedoresOitavas[8] },
  ];

  const gerarSemi = () => [
    { id: 1, casa: vencedoresQuartas[1], fora: vencedoresQuartas[2] },
    { id: 2, casa: vencedoresQuartas[3], fora: vencedoresQuartas[4] },
  ];

  const gerarFinal = () => [
    { id: 1, casa: vencedoresSemi[1], fora: vencedoresSemi[2] },
  ];

  const votar = (setter, jogoId, timeObj, timeAdversario) => {
    if (!timeObj || !timeAdversario) return;
    if (timeObj.nome === timeAdversario.nome) return;
    setter(prev => ({ ...prev, [jogoId]: timeObj }));
  };

  const containerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '1.5rem' };
  const cardMatchStyle = { display: 'flex', gap: '15px', backgroundColor: '#141414', padding: '15px', borderRadius: '8px', border: '1px solid #333', width: '340px', justifyContent: 'center', alignItems: 'center' };
  const btnAvancarStyle = { padding: '12px 35px', backgroundColor: '#6c189c', color: '#fff', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', marginTop: '2rem', fontSize: '1rem' };

  const JogoCard = ({ jogo, vencedores, setter }) => (
    <div style={cardMatchStyle}>
      <BotaoTime
        time={jogo.casa}
        selecionado={vencedores[jogo.id]?.nome === jogo.casa?.nome}
        onClick={() => votar(setter, jogo.id, jogo.casa, jogo.fora)}
      />
      <span style={{ fontWeight: 'bold', color: '#555', flexShrink: 0 }}>VS</span>
      <BotaoTime
        time={jogo.fora}
        selecionado={vencedores[jogo.id]?.nome === jogo.fora?.nome}
        onClick={() => votar(setter, jogo.id, jogo.fora, jogo.casa)}
      />
    </div>
  );

  return (
    <div style={{ color: '#fff', padding: '20px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>

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
            <button onClick={() => setFase('oitavas')} style={btnAvancarStyle}>Avançar para Oitavas →</button>
          </div>
        </>
      )}

      {fase === 'oitavas' && (
        <div style={{ textAlign: 'center' }}>
          <h2>2. Oitavas de Final</h2>
          <div style={containerStyle}>
            {gerarOitavas().map(jogo => (
              <JogoCard key={jogo.id} jogo={jogo} vencedores={vencedoresOitavas} setter={setVencedoresOitavas} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={() => setFase('grupos')} style={{ ...btnAvancarStyle, backgroundColor: '#333' }}>← Voltar</button>
            <button onClick={() => setFase('quartas')} style={btnAvancarStyle}>Avançar para Quartas →</button>
          </div>
        </div>
      )}

      {fase === 'quartas' && (
        <div style={{ textAlign: 'center' }}>
          <h2>3. Quartas de Final</h2>
          <div style={containerStyle}>
            {gerarQuartas().map(jogo => (
              <JogoCard key={jogo.id} jogo={jogo} vencedores={vencedoresQuartas} setter={setVencedoresQuartas} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={() => setFase('oitavas')} style={{ ...btnAvancarStyle, backgroundColor: '#333' }}>← Voltar</button>
            <button onClick={() => setFase('semi')} style={btnAvancarStyle}>Avançar para Semifinal →</button>
          </div>
        </div>
      )}

      {fase === 'semi' && (
        <div style={{ textAlign: 'center' }}>
          <h2>4. Semifinal</h2>
          <div style={containerStyle}>
            {gerarSemi().map(jogo => (
              <JogoCard key={jogo.id} jogo={jogo} vencedores={vencedoresSemi} setter={setVencedoresSemi} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={() => setFase('quartas')} style={{ ...btnAvancarStyle, backgroundColor: '#333' }}>← Voltar</button>
            <button onClick={() => setFase('final')} style={btnAvancarStyle}>Avançar para a Final →</button>
          </div>
        </div>
      )}

      {fase === 'final' && (
        <div style={{ textAlign: 'center' }}>
          <h2>🏆 A Grande Final 🏆</h2>
          <div style={containerStyle}>
            {gerarFinal().map(jogo => (
              <div key={jogo.id} style={{ ...cardMatchStyle, width: '380px', padding: '20px' }}>
                <BotaoTime
                  time={jogo.casa}
                  selecionado={campeao?.nome === jogo.casa?.nome}
                  onClick={() => { setCampeao(jogo.casa); setFase('campeao'); }}
                />
                <span style={{ fontWeight: 'bold', color: '#555', margin: '0 15px', flexShrink: 0 }}>VS</span>
                <BotaoTime
                  time={jogo.fora}
                  selecionado={campeao?.nome === jogo.fora?.nome}
                  onClick={() => { setCampeao(jogo.fora); setFase('campeao'); }}
                />
              </div>
            ))}
          </div>
          <button onClick={() => setFase('semi')} style={{ ...btnAvancarStyle, backgroundColor: '#333' }}>← Voltar</button>
        </div>
      )}

      {fase === 'campeao' && (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <img src={campeao?.flag} alt={campeao?.nome} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1.5rem' }} />
          <h1 style={{ fontSize: '4rem', color: '#ffffff', margin: 0, textDecoration: 'bold' }}> {campeao?.nome} </h1><br />
          <h2 style={{ color: '#fff', marginTop: '1rem' }}>É o seu Campeão da Copa do Mundo 2026!</h2>
          <button
            onClick={() => { setFase('grupos'); setEscolhas({}); setVencedoresOitavas({}); setVencedoresQuartas({}); setVencedoresSemi({}); setCampeao(null); }}
            style={btnAvancarStyle}
          >
            Reiniciar Simulador
          </button>
        </div>
      )}

    </div>
  );
}

export default BracketSimulator;