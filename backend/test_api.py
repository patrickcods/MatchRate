import pytest
from httpx import AsyncClient, ASGITransport
from main import app

pytestmark = pytest.mark.anyio

async def test_health_check():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.head("/")
    assert response.status_code == 200

async def test_cadastro_usuario():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post("/api/v1/auth/cadastro", json={
            "nome": "Teste",
            "email": "teste_pytest@example.com",
            "senha": "senha123"
        })
    assert response.status_code in [200, 400]

async def test_login_credenciais_invalidas():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post("/api/v1/auth/login", data={
            "username": "naoexiste@example.com",
            "password": "senhaerrada"
        })
    assert response.status_code == 401

async def test_me_sem_token():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/api/v1/auth/me")
    assert response.status_code == 401

async def test_ranking_jogos():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/api/v1/jogos/ranking")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

async def test_media_jogo_inexistente():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/api/v1/avaliacoes/99999/media")
    assert response.status_code == 200
    assert response.json()["media"] == 0

async def test_ranking_simulacoes_campeoes():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/api/v1/simulacoes/ranking")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

async def test_endpoint_inexistente():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/rota-que-nao-existe")
    assert response.status_code == 404