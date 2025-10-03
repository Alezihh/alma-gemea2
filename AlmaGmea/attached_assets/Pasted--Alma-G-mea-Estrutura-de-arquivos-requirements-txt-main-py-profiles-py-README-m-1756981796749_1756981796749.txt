“Alma Gêmea” 

⸻

Estrutura de arquivos

/
├─ requirements.txt
├─ main.py
├─ profiles.py
└─ README.md


⸻

requirements.txt

flask==3.0.3
flask-cors==4.0.1
SQLAlchemy==2.0.31


⸻

profiles.py

# Lista enxuta de perfis fictícios para o "resultado".
# Você pode expandir à vontade (adicione + imagens, + traços, etc.).

PROFILES = [
    {
        "id": 1,
        "name": "Alex Vega",
        "description": "Intelectual sarcástico, café forte, playlists obscuras e viagens espontâneas.",
        "image_url": "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=1200&auto=format&fit=crop"
    },
    {
        "id": 2,
        "name": "Luna Costa",
        "description": "Criativa caótica, filmes cult, astrologia por hobby e risadas difíceis de esquecer.",
        "image_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop"
    },
    {
        "id": 3,
        "name": "Diego Marin",
        "description": "Extrovertido estratégico, esportes ao ar livre, cozinha apimentada e conversas longas.",
        "image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop"
    },
    {
        "id": 4,
        "name": "Maya Rocha",
        "description": "Minimalista elegante, livros sublinhados, plantas em excesso e ironia refinada.",
        "image_url": "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=1200&auto=format&fit=crop"
    }
]


⸻

main.py

import os
import hashlib
import secrets
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS

from sqlalchemy import Column, Integer, String, DateTime, create_engine, Text
from sqlalchemy.orm import declarative_base, sessionmaker

from profiles import PROFILES

# ---------------------
# Configuração básica
# ---------------------
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///data.db")
SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_hex(16))

app = Flask(__name__)
app.config["SECRET_KEY"] = SECRET_KEY
CORS(app, resources={r"/api/*": {"origins": "*"}})  # ajuste a origem na produção

# ---------------------
# Banco de dados (SQLAlchemy)
# ---------------------
Base = declarative_base()
engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    birthdate = Column(String(20), nullable=True)   # yyyy-mm-dd (texto simples)
    city = Column(String(120), nullable=True)
    gender = Column(String(40), nullable=True)
    email = Column(String(200), nullable=True)
    # Preferências adicionais em texto/JSON (opcional)
    preferences = Column(Text, nullable=True)

    # Resultado
    result_profile_id = Column(Integer, nullable=False)
    result_token = Column(String(64), unique=True, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(engine)

# ---------------------
# Funções utilitárias
# ---------------------

def pick_profile_deterministic(seed_str: str) -> dict:
    """
    Seleciona um perfil de forma determinística a partir de uma seed.
    Assim, o mesmo usuário tende a receber o mesmo perfil (sensação de coerência).
    """
    digest = hashlib.sha256(seed_str.encode("utf-8")).digest()
    idx = int.from_bytes(digest, byteorder="big") % len(PROFILES)
    return PROFILES[idx]

# ---------------------
# Endpoints
# ---------------------

@app.get("/health")
def health():
    return {"status": "ok", "time": datetime.utcnow().isoformat()}

@app.post("/api/submit")
def submit():
    """
    Recebe dados do usuário e retorna o token + perfil selecionado.

    Espera JSON:
    {
      "name": "...",            # obrigatório
      "birthdate": "YYYY-MM-DD",
      "city": "...",
      "gender": "...",
      "email": "...",
      "preferences": "{...}"    # string JSON opcional
    }
    """
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "name is required"}), 400

    birthdate = (data.get("birthdate") or "").strip()
    city = (data.get("city") or "").strip()
    gender = (data.get("gender") or "").strip()
    email = (data.get("email") or "").strip()
    preferences = data.get("preferences")

    # Seed determinística simples (evite dados sensíveis em produção)
    seed = "|".join([name.lower(), birthdate, city.lower(), gender.lower()])
    profile = pick_profile_deterministic(seed)

    token = secrets.token_urlsafe(10)

    session = SessionLocal()
    try:
        sub = Submission(
            name=name,
            birthdate=birthdate,
            city=city,
            gender=gender,
            email=email,
            preferences=preferences,
            result_profile_id=profile["id"],
            result_token=token,
        )
        session.add(sub)
        session.commit()
    except Exception as e:
        session.rollback()
        return jsonify({"error": "db_error", "detail": str(e)}), 500
    finally:
        session.close()

    return jsonify({
        "token": token,
        "profile": profile
    }), 201

@app.get("/api/result/<token>")
def get_result(token):
    session = SessionLocal()
    try:
        sub = session.query(Submission).filter_by(result_token=token).first()
        if not sub:
            return jsonify({"error": "not_found"}), 404
        # Recupera perfil correspondente ao ID
        profile = next((p for p in PROFILES if p["id"] == sub.result_profile_id), None)
        if not profile:
            return jsonify({"error": "profile_missing"}), 500
        return jsonify({
            "token": token,
            "profile": profile,
            "created_at": sub.created_at.isoformat()
        })
    finally:
        session.close()

if __name__ == "__main__":
    # Flask dev server
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)


⸻

README.md

# API “Alma Gêmea”

Backend mínimo em Flask para:
- Receber dados do usuário (`POST /api/submit`)
- Gerar um perfil de “alma gêmea” (determinístico)
- Retornar resultado por token (`GET /api/result/:token`)

## Como rodar no Replit
1. Crie um Repl **Python** (ou **Flask**) vazio.
2. Adicione os arquivos `requirements.txt`, `main.py`, `profiles.py` e `README.md` conforme este repositório.
3. Abra o shell do Replit e rode:
   ```bash
   pip install -r requirements.txt

	4.	Execute main.py (Run). A URL pública do Replit servirá a API.

Testes rápidos (curl)

1) Healthcheck

curl -s https://SEU-REPL-URL/health | jq

2) Enviar submissão

curl -s -X POST https://SEU-REPL-URL/api/submit \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Alice Teste",
    "birthdate": "1998-04-12",
    "city": "Recife",
    "gender": "feminino",
    "email": "alice@exemplo.com"
  }' | jq

Saída esperada:

{
  "token": "abc123...",
  "profile": {
    "id": 4,
    "name": "Maya Rocha",
    "description": "Minimalista elegante...",
    "image_url": "https://..."
  }
}

3) Buscar resultado por token

curl -s https://SEU-REPL-URL/api/result/SEU_TOKEN | jq

Notas de segurança e privacidade
	•	Em produção, defina SECRET_KEY e restrinja o CORS à sua origem.
	•	Mostre consentimento claro ao usuário (LGPD/GDPR): finalidade, retenção e opção de exclusão.
	•	Evite coletar dados sensíveis; armazene mínimo necessário.
	•	Para exclusão, você pode criar um endpoint DELETE /api/result/:token opcional.

Próximos passos
	•	Rate limit (ex.: Flask-Limiter) e Captcha.
	•	Logs estruturados e painel admin com autenticação.
	•	Expandir PROFILES e/ou gerar perfis com IA.
	•	Conectar a uma Landing Page (HTML/React) consumindo esta API.

