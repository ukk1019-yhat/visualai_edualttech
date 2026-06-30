import sys
from pathlib import Path

# Make backend package importable
backend_dir = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.main import app

# Vercel ASGI handler
handler = app
