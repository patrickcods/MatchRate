import { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

function ComentariosJogo({ jogoId, timeCasa, timeFora }) {
  const [comentarios, setComentarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagemToast, setMensagemToast] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/avaliacoes/${jogoId}/comentarios`)
      .then(res => res.json())
      .then(data => {
        setComentarios(Array.isArray(data) ? data : []);
        setCarregando(false);
      })
      .catch(err => {
        console.error("Erro ao buscar comentários:", err);
        setCarregando(false);
      });
  }, [jogoId]);

  const renderEstrelas = (nota) => {
    const cheias = Math.floor(nota);
    const meia = nota % 1 !== 0;
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[0, 1, 2, 3, 4].map(i => {
          if (i < cheias) return <FaStar key={i} color="#ffc107" size={12} />;
          if (i === cheias && meia) return <FaStarHalfAlt key={i} color="#ffc107" size={12} />;
          return <FaRegStar key={i} color="#333" size={12} />;
        })}
      </div>
    );
  };

  const formatarData = (dataStr) => {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const compartilharComentario = (comentarioObj) => {
    // Tenta usar os nomes dos times que vieram por prop, senão omite
    const tituloJogo = timeCasa && timeFora ? `no jogo ${timeCasa} x ${timeFora}` : `no MatchRate`;
    
    const texto = `Olha o que o ${comentarioObj.nome} comentou ${tituloJogo}: \n\n"${comentarioObj.comentario}" (${comentarioObj.nota} ⭐) \n\nVeja mais em: https://match-rate-amber.vercel.app/`;
    
    if (navigator.share) {
      navigator.share({ text: texto });
    } else {
      navigator.clipboard.writeText(texto);
      setMensagemToast('Comentário copiado!');
      setTimeout(() => setMensagemToast(''), 3000);
    }
  };

  if (carregando) {
    return <p style={{ color: '#666', fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem' }}>Carregando comentários...</p>;
  }

  if (comentarios.length === 0) {
    return null;
  }

  // LIMITA A 30 COMENTÁRIOS PARA NÃO PESAR
  const comentariosParaExibir = comentarios.slice(0, 30);

  return (
    <div style={{ marginTop: '1.5rem', position: 'relative' }}>
      
      {/* Toast Notification (Aviso de copiado) */}
      {mensagemToast && (
        <div style={{ 
          position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#1a472a', color: '#4ade80', padding: '5px 15px', 
          borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', zIndex: 10
        }}>
          {mensagemToast}
        </div>
      )}

      <p style={{ color: '#888', fontSize: '0.85rem', fontWeight: 'bold', margin: '0 0 0.75rem 0', textAlign: 'center' }}>
        COMENTÁRIOS DA COMUNIDADE ({comentarios.length})
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' }}>
        {comentariosParaExibir.map((c, i) => (
          <div key={i} style={{ backgroundColor: '#1a1a1a', borderRadius: '10px', padding: '0.75rem', border: '1px solid #2a2a2a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              {c.avatar_url ? (
                <img 
                  src={c.avatar_url} 
                  alt={c.nome} 
                  style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    backgroundColor: '#f0f0f0', 
                    objectFit: 'cover' 
                  }} 
                />
              ) : (
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  backgroundColor: '#6c189c', 
                  color: '#fff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold' 
                }}>
                  {c.nome ? c.nome.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', flex: 1 }}>{c.nome}</span>
              {renderEstrelas(c.nota)}
            </div>
            
            {/* TEXTO LIMITADO A 3 LINHAS */}
            <p style={{ 
              color: '#aaa', 
              fontSize: '0.82rem', 
              margin: '0 0 8px 0', 
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 3, 
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {c.comentario}
            </p>
            
            {/* RODAPÉ DO COMENTÁRIO: DATA + BOTÃO COMPARTILHAR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: '#555', fontSize: '0.7rem', margin: 0 }}>{formatarData(c.criado_em)}</p>
              
              <button 
                onClick={() => compartilharComentario(c)}
                style={{ 
                  background: 'none', border: 'none', padding: '4px', cursor: 'pointer',
                  color: '#888', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' 
                }}
                title="Compartilhar comentário"
              >
                🔗
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComentariosJogo;