from flask import Flask
from flask_cors import CORS
from config import Config
from routes import register_routes
from models import init_db

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Initialize configuration
    app.config.from_object(Config)
    
    # Create required directories
    Config.create_directories()
    
    # Initialize database
    init_db()
    
    # Register routes
    register_routes(app)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(port=5000, debug=True)