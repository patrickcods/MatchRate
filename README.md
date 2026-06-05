MatchRate - App de Engajamento da Copa do Mundo 2026
Uma plataforma intuitiva para avaliar e prever a jornada das partidas da Copa do Mundo 2026. Acompanhe placares, veja a classificação, simule o chaveamento final e contribua com avaliações personalizadas e curvas de engajamento das partidas.

⚽ Funcionalidades:

Lista de Partidas: Visualize partidas da Copa 2026, integradas via API externa de futebol.
Classificação dos Grupos: Tabelas detalhadas de todos os grupos, atualizadas de acordo com os resultados.
Avaliações Personalizadas: Avalie as partidas pelo nível de emoção e por momentos específicos (Início, Meio, Fim).
Simulador de Chaveamento: Preveja o caminho até a taça com um simulador de mata-mata.
Perfil e Autenticação: Contas seguras utilizando JWT para salvar suas avaliações, palpites e previsões.
Compartilhamento Social: Exporte e compartilhe ilustrações das curvas de engajamento das suas partidas favoritas diretamente nas redes sociais.

🛠️ Tecnologias Utilizadas:

Frontend: React (Vercel)
Backend: FastAPI, Python (Render)
Banco de Dados: PostgreSQL (SQLAlchemy)
Autenticação: JWT, python-jose, passlib[bcrypt]
Visualização de Dados: Recharts, html2canvas

🚀 Começando (Desenvolvimento):

Backend:

Bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Certifique-se de que python-multipart está no requirements
gunicorn main:app --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT


Frontend:

Bash
cd frontend
npm install
# Configure VITE_API_URL no seu arquivo .env
npm run dev


⚙️ Configuração e Deploy (Vercel/Render):
Configurações detalhadas para variáveis de ambiente (como SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES), configuração do CORSMiddleware, URL da API no Vercel e o comando de inicialização (Start Command) no Render.

🛣️ Roadmap:
(Painéis de usuário personalizados, compartilhamento de chaveamentos personalizados, suporte a múltiplos idiomas, seções de comentários aprimoradas).

🤝 Contribuições:
Contribuições são muito bem-vindas! Sinta-se à vontade para enviar um Pull Request.

📄 Licença:
Licença MIT.
