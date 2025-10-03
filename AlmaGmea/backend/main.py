import os
import hashlib
import secrets
import requests
from datetime import datetime
from time import time

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

# Facebook Pixel configuration
FACEBOOK_PIXEL_ID = os.getenv("FACEBOOK_PIXEL_ID")
FACEBOOK_ACCESS_TOKEN = os.getenv("FACEBOOK_ACCESS_TOKEN")

app = Flask(__name__)
app.config["SECRET_KEY"] = SECRET_KEY
CORS(app, resources={r"/api/*": {"origins": "*"}})  # ajuste a origem na produção

# ---------------------
# Banco de dados (SQLAlchemy)
# ---------------------
Base = declarative_base()
# Configure engine based on database type
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL configuration with connection pooling
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        pool_pre_ping=True,  # Verify connections before using
        pool_recycle=300,    # Recycle connections every 5 minutes
    )
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    birthdate = Column(String(20), nullable=True)   # yyyy-mm-dd (texto simples)
    city = Column(String(120), nullable=True)
    email = Column(String(200), nullable=True)
    
    # Campos mantidos
    zodiac_sign = Column(String(40), nullable=True)
    height = Column(String(40), nullable=True)
    
    # Preferências adicionais em texto/JSON (opcional)
    preferences = Column(Text, nullable=True)
    
    # Cartas de tarot selecionadas (formato: "1,3,7" ou JSON)
    tarot_cards = Column(Text, nullable=True)

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

def send_facebook_pixel_event(email: str, event_name: str = "Purchase", value: float = 19.90, currency: str = "BRL"):
    """
    Sends a conversion event to Facebook Pixel using Conversions API.
    Email is hashed with SHA256 before sending.
    """
    if not FACEBOOK_PIXEL_ID or not FACEBOOK_ACCESS_TOKEN:
        print("Facebook Pixel not configured, skipping event tracking")
        return None
    
    # Hash email with SHA256 (lowercase first)
    hashed_email = hashlib.sha256(email.lower().strip().encode()).hexdigest() if email else None
    
    event_data = {
        "data": [{
            "event_name": event_name,
            "event_time": int(time()),
            "action_source": "website",
            "user_data": {
                "em": [hashed_email] if hashed_email else []
            },
            "custom_data": {
                "currency": currency,
                "value": str(value)
            }
        }]
    }
    
    url = f"https://graph.facebook.com/v18.0/{FACEBOOK_PIXEL_ID}/events"
    params = {"access_token": FACEBOOK_ACCESS_TOKEN}
    
    try:
        response = requests.post(url, json=event_data, params=params, timeout=5)
        response.raise_for_status()
        if hashed_email:
            print(f"Facebook Pixel event sent: {event_name} for email hash {hashed_email[:16]}...")
        else:
            print(f"Facebook Pixel event sent: {event_name} (no email)")
        return response.json()
    except Exception as e:
        print(f"Error sending Facebook Pixel event: {e}")
        return None

# ---------------------
# Endpoints
# ---------------------

@app.get("/health")
def health():
    return {"status": "ok", "time": datetime.utcnow().isoformat()}

@app.post("/submit")
def submit():
    """
    Recebe dados do usuário e retorna o token + perfil selecionado.
    """
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "name is required"}), 400

    birthdate = (data.get("birthdate") or "").strip()
    city = (data.get("city") or "").strip()
    email = (data.get("email") or "").strip()
    zodiac_sign = (data.get("zodiacSign") or "").strip()
    height = (data.get("height") or "").strip()
    preferences = data.get("preferences")
    tarot_cards = data.get("tarotCards", [])
    
    # Converte array de cartas para string para storage
    tarot_cards_str = ",".join(str(card) for card in tarot_cards) if tarot_cards else ""

    # Seed determinística usando mais características para melhor matching
    seed_parts = [
        name.lower(), 
        birthdate, 
        city.lower(), 
        zodiac_sign.lower(),
        height.lower(),
        tarot_cards_str  # Adiciona cartas de tarot na seed
    ]
    seed = "|".join([part for part in seed_parts if part])
    profile = pick_profile_deterministic(seed)

    token = secrets.token_urlsafe(10)

    session = SessionLocal()
    try:
        sub = Submission(
            name=name,
            birthdate=birthdate,
            city=city,
            email=email,
            zodiac_sign=zodiac_sign,
            height=height,
            preferences=preferences,
            tarot_cards=tarot_cards_str,
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

@app.post("/track-conversion/<token>")
def track_conversion(token):
    """
    Tracks Facebook Pixel Purchase event when user confirms payment.
    Should be called before redirecting to payment page.
    """
    session = SessionLocal()
    try:
        sub = session.query(Submission).filter_by(result_token=token).first()
        if not sub:
            return jsonify({"error": "not_found"}), 404
        
        # Send Facebook Pixel event with user's email
        user_email = str(sub.email) if sub.email is not None else ""
        pixel_result = send_facebook_pixel_event(
            email=user_email,
            event_name="Purchase",
            value=19.90,
            currency="BRL"
        )
        
        return jsonify({
            "success": True,
            "pixel_tracked": pixel_result is not None
        }), 200
    finally:
        session.close()

@app.get("/result/<token>")
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
    port = int(os.getenv("FLASK_PORT", 8000))
    print(f"Starting Flask backend on port {port}")
    app.run(host="0.0.0.0", port=port, debug=True)