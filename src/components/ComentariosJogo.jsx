import { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

function ComentariosJogo({ jogoId }) {
  const [comentarios, setComentarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

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

  if (carregando) {
    return <p style={{ color: '#666', fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem' }}>Carregando comentários...</p>;
  }

  if (comentarios.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={{ color: '#888', fontSize: '0.85rem', fontWeight: 'bold', margin: '0 0 0.75rem 0', textAlign: 'center' }}>
        COMENTÁRIOS DA COMUNIDADE ({comentarios.length})
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' }}>
        {comentarios.map((c, i) => (
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
                    backgroundColor: '#f0f0f0', // Fundo claro para o SVG do DiceBear destacar no tema dark
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
            <p style={{ color: '#aaa', fontSize: '0.82rem', margin: '0 0 4px 0', lineHeight: 1.4 }}>{c.comentario}</p>
            <p style={{ color: '#555', fontSize: '0.7rem', margin: 0 }}>{formatarData(c.criado_em)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComentariosJogo;