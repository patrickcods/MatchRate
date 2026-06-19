import React, { useState, useEffect } from 'react';

const GRUPOS_DADOS = {
  A: [{ nome: 'México', flag: 'https://flagcdn.com/w40/mx.png' }, { nome: 'África do Sul', flag: 'https://flagcdn.com/w40/za.png' }, { nome: 'Coreia do Sul', flag: 'https://flagcdn.com/w40/kr.png' }, { nome: 'República Checa', flag: 'https://flagcdn.com/w40/cz.png' }],
  B: [{ nome: 'Canadá', flag: 'https://flagcdn.com/w40/ca.png' }, { nome: 'Bósnia e Herzegovina', flag: 'https://flagcdn.com/w40/ba.png' }, { nome: 'Catar', flag: 'https://flagcdn.com/w40/qa.png' }, { nome: 'Suíça', flag: 'https://flagcdn.com/w40/ch.png' }],
  C: [{ nome: 'Brasil', flag: 'https://flagcdn.com/w40/br.png' }, { nome: 'Marrocos', flag: 'https://flagcdn.com/w40/ma.png' }, { nome: 'Haiti', flag: 'https://flagcdn.com/w40/ht.png' }, { nome: 'Escócia', flag: 'https://flagcdn.com/w40/gb-sct.png' }],
  D: [{ nome: 'Estados Unidos', flag: 'https://flagcdn.com/w40/us.png' }, { nome: 'Paraguai', flag: 'https://flagcdn.com/w40/py.png' }, { nome: 'Austrália', flag: 'https://flagcdn.com/w40/au.png' }, { nome: 'Turquia', flag: 'https://flagcdn.com/w40/tr.png' }],
  E: [{ nome: 'Alemanha', flag: 'https://flagcdn.com/w40/de.png' }, { nome: 'Curaçao', flag: 'https://flagcdn.com/w40/cw.png' }, { nome: 'Costa do Marfim', flag: 'https://flagcdn.com/w40/ci.png' }, { nome: 'Equador', flag: 'https://flagcdn.com/w40/ec.png' }],
  F: [{ nome: 'Holanda', flag: 'https://flagcdn.com/w40/nl.png' }, { nome: 'Japão', flag: 'https://flagcdn.com/w40/jp.png' }, { nome: 'Suécia', flag: 'https://flagcdn.com/w40/se.png' }, { nome: 'Tunísia', flag: 'https://flagcdn.com/w40/tn.png' }],
  G: [{ nome: 'Bélgica', flag: 'https://flagcdn.com/w40/be.png' }, { nome: 'Egito', flag: 'https://flagcdn.com/w40/eg.png' }, { nome: 'Irã', flag: 'https://flagcdn.com/w40/ir.png' }, { nome: 'Nova Zelândia', flag: 'https://flagcdn.com/w40/nz.png' }],
  H: [{ nome: 'Espanha', flag: 'https://flagcdn.com/w40/es.png' }, { nome: 'Cabo Verde', flag: 'https://flagcdn.com/w40/cv.png' }, { nome: 'Arábia Saudita', flag: 'https://flagcdn.com/w40/sa.png' }, { nome: 'Uruguai', flag: 'https://flagcdn.com/w40/uy.png' }],
  I: [{ nome: 'França', flag: 'https://flagcdn.com/w40/fr.png' }, { nome: 'Senegal', flag: 'https://flagcdn.com/w40/sn.png' }, { nome: 'Iraque', flag: 'https://flagcdn.com/w40/iq.png' }, { nome: 'Noruega', flag: 'https://flagcdn.com/w40/no.png' }],
  J: [{ nome: 'Argentina', flag: 'https://flagcdn.com/w40/ar.png' }, { nome: 'Argélia', flag: 'https://flagcdn.com/w40/dz.png' }, { nome: 'Áustria', flag: 'https://flagcdn.com/w40/at.png' }, { nome: 'Jordânia', flag: 'https://flagcdn.com/w40/jo.png' }],
  K: [{ nome: 'Portugal', flag: 'https://flagcdn.com/w40/pt.png' }, { nome: 'RD Congo', flag: 'https://flagcdn.com/w40/cd.png' }, { nome: 'Uzbequistão', flag: 'https://flagcdn.com/w40/uz.png' }, { nome: 'Colômbia', flag: 'https://flagcdn.com/w40/co.png' }],
  L: [{ nome: 'Inglaterra', flag: 'https://flagcdn.com/w40/gb-eng.png' }, { nome: 'Croácia', flag: 'https://flagcdn.com/w40/hr.png' }, { nome: 'Gana', flag: 'https://flagcdn.com/w40/gh.png' }, { nome: 'Panamá', flag: 'https://flagcdn.com/w40/pa.png' }],
}
const TODOS_TIMES = Object.values(GRUPOS_DADOS).flat();

const AVATARES_PRONTOS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=1',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=2',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=3',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=5',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=6',
];

function ProfilePage({ usuario, onAtualizarUsuario, onAtualizarCampeao }) {
  const [palpites, setPalpites] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [simulacao, setSimulacao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [nome, setNome] = useState(usuario?.nome || '');
  const [bio, setBio] = useState(usuario?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(usuario?.avatar_url || '');
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);

  const [trocandoCampeao, setTrocandoCampeao] = useState(false);
  const [busca, setBusca] = useState('');
  const [salvandoCampeao, setSalvandoCampeao] = useState(false);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { setCarregando(false); return; }

    Promise.all([
      fetch(`${API}/api/v1/palpites/me`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API}/api/v1/avaliacoes/me`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API}/api/v1/simulacoes/me`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([p, a, s]) => {
      setPalpites(Array.isArray(p) ? p : []);
      setAvaliacoes(Array.isArray(a) ? a : []);
      setSimulacao(s);
      setCarregando(false);
    }).catch(err => {
      console.error("Erro ao buscar dados do perfil:", err);
      setCarregando(false);
    });
  }, []);

  const salvarPerfil = async () => {
    setSalvandoPerfil(true);
    try {
      const res = await fetch(`${API}/api/v1/auth/perfil`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nome, bio, avatar_url: avatarUrl })
      });
      const data = await res.json();
      onAtualizarUsuario && onAtualizarUsuario(data);
      setEditandoPerfil(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSalvandoPerfil(false);
    }
  };

  const trocarCampeao = async (time) => {
    setSalvandoCampeao(true);
    try {
      await fetch(`${API}/api/v1/simulacoes/campeao`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ campeao_nome: time.nome, campeao_flag: time.flag })
      });
      const novaSimulacao = { ...(simulacao || {}), campeao_nome: time.nome, campeao_flag: time.flag };
      setSimulacao(novaSimulacao);
      onAtualizarCampeao && onAtualizarCampeao(novaSimulacao);
      setTrocandoCampeao(false);
      setBusca('');
    } catch (e) {
      console.error(e);
    } finally {
      setSalvandoCampeao(false);
    }
  };

  const timesFiltrados = busca
    ? TODOS_TIMES.filter(t => t.nome.toLowerCase().includes(busca.toLowerCase()))
    : TODOS_TIMES;

  const cardStyle = { background: '#1a1a1a', padding: '1.25rem', borderRadius: '12px', border: '1px solid #2a2a2a' };
  const btnStyle = { padding: '8px 16px', borderRadius: '8px', border: '1px solid #6c189c', backgroundColor: 'transparent', color: '#a78bfa', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' };
  const inputStyle = { width: '100%', padding: '10px', backgroundColor: '#222', border: '1px solid #333', borderRadius: '8px', color: '#fff', boxSizing: 'border-box', marginBottom: '0.75rem' };

  if (!usuario) {
    return <div style={{ padding: '2rem', color: '#888', textAlign: 'center' }}>Faça login para ver seu perfil.</div>;
  }

  return (
    <div style={{ padding: '2rem', color: '#fff', maxWidth: '700px', margin: '0 auto' }}>

      <div style={{ ...cardStyle, marginBottom: '1.5rem', textAlign: 'center', position: 'relative' }}>
        <img
          src={usuario.avatar_url || AVATARES_PRONTOS[0]}
          alt="avatar"
          style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #6c189c', marginBottom: '1rem' }}
        />
        <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem' }}>{usuario.nome}</h2>
        <p style={{ color: '#666', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>{usuario.email}</p>
        {usuario.bio && <p style={{ color: '#a78bfa', fontSize: '0.9rem', margin: '0 0 1rem 0', fontStyle: 'italic' }}>"{usuario.bio}"</p>}

        {!editandoPerfil ? (
          <button onClick={() => setEditandoPerfil(true)} style={btnStyle}>✏️ Editar perfil</button>
        ) : (
          <div style={{ marginTop: '1rem', textAlign: 'left' }}>
            <p style={{ color: '#888', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>Escolha um avatar:</p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {AVATARES_PRONTOS.map(url => (
                <img key={url} src={url} onClick={() => setAvatarUrl(url)}
                  style={{
                    width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer',
                    border: avatarUrl === url ? '3px solid #a855f7' : '2px solid #333'
                  }} />
              ))}
            </div>
            <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} style={inputStyle} />
            <textarea placeholder="Bio curta (ex: torcedor de carteirinha do Brasil)" value={bio} onChange={e => setBio(e.target.value)}
              style={{ ...inputStyle, height: '60px', resize: 'none' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={salvarPerfil} disabled={salvandoPerfil} style={{ ...btnStyle, backgroundColor: '#6c189c', color: '#fff', flex: 1 }}>
                {salvandoPerfil ? 'Salvando...' : 'Salvar'}
              </button>
              <button onClick={() => setEditandoPerfil(false)} style={{ ...btnStyle, flex: 1 }}>Cancelar</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#ffc107', margin: '0 0 1rem 0', fontSize: '1.1rem' }}>🏆 Meu Campeão</h3>

        {!trocandoCampeao ? (
          simulacao?.campeao_nome ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {simulacao.campeao_flag && <img src={simulacao.campeao_flag} style={{ width: '48px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />}
              <span style={{ fontSize: '1.3rem', fontWeight: 'bold', flex: 1 }}>{simulacao.campeao_nome}</span>
              <button onClick={() => setTrocandoCampeao(true)} style={btnStyle}>Trocar</button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#666', margin: '0 0 1rem 0' }}>Você ainda não escolheu seu campeão.</p>
              <button onClick={() => setTrocandoCampeao(true)} style={{ ...btnStyle, backgroundColor: '#6c189c', color: '#fff' }}>Escolher agora</button>
            </div>
          )
        ) : (
          <div>
            <input placeholder="Buscar país..." value={busca} onChange={e => setBusca(e.target.value)} style={inputStyle} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', maxHeight: '280px', overflowY: 'auto', marginBottom: '0.75rem' }}>
              {timesFiltrados.map(time => (
                <button key={time.nome} onClick={() => trocarCampeao(time)} disabled={salvandoCampeao}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                    padding: '8px 4px', borderRadius: '8px', cursor: 'pointer',
                    backgroundColor: simulacao?.campeao_nome === time.nome ? '#2d1b4e' : '#1a1a1a',
                    border: simulacao?.campeao_nome === time.nome ? '1px solid #a855f7' : '1px solid #2a2a2a',
                    color: '#fff', fontSize: '0.72rem', textAlign: 'center'
                  }}>
                  <img src={time.flag} style={{ width: '28px', height: '18px', objectFit: 'cover', borderRadius: '2px' }} />
                  {time.nome}
                </button>
              ))}
            </div>
            <button onClick={() => { setTrocandoCampeao(false); setBusca(''); }} style={{ ...btnStyle, width: '100%' }}>Cancelar</button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ ...cardStyle, flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#a78bfa', margin: '0 0 0.25rem 0' }}>{palpites.length}</p>
          <p style={{ color: '#666', fontSize: '0.8rem', margin: 0 }}>Palpites</p>
        </div>
        <div style={{ ...cardStyle, flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ffc107', margin: '0 0 0.25rem 0' }}>{avaliacoes.length}</p>
          <p style={{ color: '#666', fontSize: '0.8rem', margin: 0 }}>Avaliações</p>
        </div>
      </div>

      <section style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#6c189c', marginBottom: '1rem' }}>Meus Palpites</h3>
        {carregando ? (
          <p style={{ color: '#888' }}>Carregando...</p>
        ) : palpites.length > 0 ? (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {palpites.map((p) => (
              <div key={p.id} style={cardStyle}>
                <p style={{ margin: '0 0 4px 0' }}><strong>{p.jogo_nome}</strong></p>
                <p style={{ margin: 0, color: '#a78bfa' }}>Palpite: {p.gol_casa} x {p.gol_fora}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#555' }}>Você ainda não deu nenhum palpite.</p>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;