import React, { useState, useEffect } from 'react';

function ProfilePage({ usuario }) {
  const [palpites, setPalpites] = useState([]);

  useEffect(() => {
    // Buscar palpites do usuário logado
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/palpites/me`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setPalpites(data))
    .catch(err => console.error("Erro ao buscar histórico:", err));
  }, []);

  return (
    <div style={{ padding: '2rem', color: '#fff' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem' }}>Meu Perfil</h2>
        <p style={{ color: '#888' }}>Olá, {usuario?.nome}</p>
      </header>

      <section>
        <h3 style={{ color: '#6c189c', marginBottom: '1rem' }}>Meus Palpites</h3>
        {palpites.length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {palpites.map((palpite) => (
              <div key={palpite.id} style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '12px' }}>
                <p><strong>Partida:</strong> {palpite.jogo_nome}</p>
                <p><strong>Meu Palpite:</strong> {palpite.placar_casa} x {palpite.placar_fora}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#555' }}>Você ainda não deu nenhum palpite. Vá para a lista de jogos!</p>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;