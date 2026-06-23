import { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

function RatingModal({ jogo, onClose }) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [golCasa, setGolCasa] = useState('');
  const [golFora, setGolFora] = useState('');
  const [palpiteSalvo, setPalpiteSalvo] = useState(false);
  const [avaliacaoSalva, setAvaliacaoSalva] = useState(false);

  const timeCasa = jogo.homeTeam.shortName || jogo.homeTeam.name || 'Time A'
  const timeFora = jogo.awayTeam.shortName || jogo.awayTeam.name || 'Time B'

  const handleStarClick = (index, isHalf) => {
    if (avaliacaoSalva) return;
    const novaNota = isHalf ? index + 0.5 : index + 1;
    setNota(novaNota === nota ? (isHalf ? index : nota) : novaNota);
  };

  const salvarPalpite = async () => {
    if (golCasa === '' || golFora === '') return;
    
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/palpites/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          id_jogo: jogo.id,
          jogo_nome: `${timeCasa} vs ${timeFora}`,
          gol_casa: Number(golCasa),
          gol_fora: Number(golFora)
        })
      });

      if (response.ok) {
        setPalpiteSalvo(true);
        setMensagem("Palpite registrado com sucesso!");
      } else {
        setMensagem("Erro ao salvar palpite.");
      }
    } catch (error) {
      console.error("Erro ao salvar palpite:", error);
      setMensagem("Erro de conexão.");
    }
  };

  const compartilhar = () => {
    const texto = `Meu palpite para ${timeCasa} x ${timeFora} é ${golCasa} x ${golFora}! Faz o teu em https://match-rate-amber.vercel.app/ 🏆`;
    if (navigator.share) {
      navigator.share({ text: texto });
    } else {
      navigator.clipboard.writeText(texto);
      setMensagem('Palpite copiado para a área de transferência!');
      setTimeout(() => setMensagem(''), 3000);
    }
  };

  // LÓGICA DE COMPARTILHAR A NOTA
  const compartilharNota = () => {
    const texto = `Acabei de avaliar o jogo ${timeCasa} x ${timeFora} com nota ${nota} ★ no MatchRate! Deixa tua nota também em https://match-rate-amber.vercel.app/ ⚽⭐`;
    if (navigator.share) {
      navigator.share({ text: texto });
    } else {
      navigator.clipboard.writeText(texto);
      setMensagem('Link da avaliação copiado para a área de transferência!');
      setTimeout(() => setMensagem(''), 3000);
    }
  };

  const enviarAvaliacao = async () => {
    const payload = { nota, comentario, id_jogo: jogo.id };
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/avaliacoes/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setAvaliacaoSalva(true);
        setMensagem("Avaliação salva com sucesso!");
      } else if (response.status === 400) {
        setMensagem("Você já avaliou este jogo!");
      } else {
        setMensagem("Erro ao salvar, tente novamente.");
      }
    } catch (error) {
      setMensagem("Erro de conexão com o servidor.");
    }
  };

  const inputPlacar = {
    width: '60px', padding: '10px', fontSize: '1.5rem', fontWeight: 'bold',
    textAlign: 'center', backgroundColor: '#222', border: '1px solid #444',
    borderRadius: '8px', color: '#fff', outline: 'none'
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#141414', padding: '2rem', borderRadius: '15px', color: '#fff', width: '370px', maxHeight: '90vh', overflowY: 'auto' }}>

        <button onClick={onClose} style={{ float: 'right', background: 'none', border: 'none', color: '#888', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>

        <h3 style={{ textAlign: 'center', marginTop: 0 }}>{timeCasa} vs {timeFora}</h3>

        {/* PALPITE */}
        {jogo.status !== 'FINISHED' && (
          <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #2a2a2a' }}>
            <p style={{ color: '#6c189c', fontWeight: 'bold', fontSize: '0.85rem', margin: '0 0 1rem 0', textAlign: 'center' }}>
              PALPITE DE PLACAR
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                {jogo.homeTeam.crest && <img src={jogo.homeTeam.crest} style={{ width: '32px', marginBottom: '6px' }} />}
                <p style={{ color: '#888', fontSize: '0.75rem', margin: '0 0 6px 0' }}>{timeCasa}</p>
                <input type="number" min="0" max="20" value={golCasa}
                  onChange={e => setGolCasa(e.target.value)} style={inputPlacar} />
              </div>
              <span style={{ color: '#555', fontSize: '1.5rem', fontWeight: 'bold' }}>x</span>
              <div style={{ textAlign: 'center' }}>
                {jogo.awayTeam.crest && <img src={jogo.awayTeam.crest} style={{ width: '32px', marginBottom: '6px' }} />}
                <p style={{ color: '#888', fontSize: '0.75rem', margin: '0 0 6px 0' }}>{timeFora}</p>
                <input type="number" min="0" max="20" value={golFora}
                  onChange={e => setGolFora(e.target.value)} style={inputPlacar} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
              <button onClick={salvarPalpite} disabled={golCasa === '' || golFora === '' || palpiteSalvo}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: golCasa === '' || golFora === '' || palpiteSalvo ? 'not-allowed' : 'pointer',
                  backgroundColor: palpiteSalvo ? '#1a472a' : golCasa === '' || golFora === '' ? '#333' : '#6c189c',
                  color: palpiteSalvo ? '#4ade80' : golCasa === '' || golFora === '' ? '#666' : '#fff'
                }}>
                {palpiteSalvo ? '✓ Palpite salvo' : 'Salvar palpite'}
              </button>
              <button onClick={compartilhar} disabled={golCasa === '' || golFora === ''}
                style={{
                  padding: '10px 14px', borderRadius: '8px', border: '1px solid #333',
                  backgroundColor: 'transparent', color: golCasa === '' || golFora === '' ? '#444' : '#fff',
                  cursor: golCasa === '' || golFora === '' ? 'not-allowed' : 'pointer', fontSize: '1rem'
                }}>
                🔗
              </button>
            </div>
          </div>
        )}

        {/* AVALIAÇÃO */}
        <p style={{ color: '#888', fontSize: '0.85rem', fontWeight: 'bold', margin: '0 0 0.75rem 0', textAlign: 'center' }}>
          AVALIAÇÃO DO JOGO
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', margin: '0 0 1rem 0' }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ position: 'relative', cursor: avaliacaoSalva ? 'not-allowed' : 'pointer', display: 'flex' }}>
              <div onClick={() => handleStarClick(i, true)} style={{ width: '15px', height: '30px', position: 'absolute', zIndex: 2 }} />
              <div onClick={() => handleStarClick(i, false)} style={{ width: '15px', height: '30px', position: 'absolute', marginLeft: '15px', zIndex: 2 }} />
              {nota >= i + 1 ? <FaStar color="#ffc107" size={30} /> :
               nota >= i + 0.5 ? <FaStarHalfAlt color="#ffc107" size={30} /> :
               <FaRegStar color="#333" size={30} />}
            </div>
          ))}
        </div>

        <textarea placeholder="O que achou do jogo?" value={comentario}
          disabled={avaliacaoSalva}
          onChange={(e) => setComentario(e.target.value)}
          style={{ width: '100%', height: '70px', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '8px', padding: '10px', marginBottom: '1rem', boxSizing: 'border-box', resize: 'none', cursor: avaliacaoSalva ? 'not-allowed' : 'text' }}
        />

        {/* ESTRUTURA REFORMULADA: BOTÃO PRINCIPAL + COMPARTILHAR NOTA */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={enviarAvaliacao} disabled={nota === 0 || avaliacaoSalva}
            style={{
              flex: 1, padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold',
              backgroundColor: avaliacaoSalva ? '#1a472a' : nota === 0 ? '#444' : '#6c189c',
              color: avaliacaoSalva ? '#4ade80' : nota === 0 ? '#888' : 'white',
              cursor: nota === 0 || avaliacaoSalva ? 'not-allowed' : 'pointer'
            }}>
            {avaliacaoSalva ? '✓ Avaliado' : nota === 0 ? 'Selecione uma nota' : `Avaliar Jogo (${nota} ★)`}
          </button>
          
          <button onClick={compartilharNota} disabled={nota === 0}
            style={{
              padding: '0 14px', borderRadius: '8px', border: '1px solid #333',
              backgroundColor: 'transparent', color: nota === 0 ? '#444' : '#fff',
              cursor: nota === 0 ? 'not-allowed' : 'pointer', fontSize: '1rem'
            }}>
            🔗
          </button>
        </div>

        {mensagem && (
          <div style={{
            marginTop: '1rem', padding: '0.8rem', borderRadius: '8px',
            backgroundColor: mensagem.includes('sucesso') || mensagem.includes('copiado') ? '#1a472a' : '#7f1d1d',
            color: mensagem.includes('sucesso') || mensagem.includes('copiado') ? '#4ade80' : '#fca5a5',
            textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem'
          }}>
            {mensagem}
          </div>
        )}
      </div>
    </div>
  );
}

export default RatingModal;