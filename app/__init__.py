"""Инициализация приложения(фабрика create_app)"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

from config import Config


db = SQLAlchemy()
login_manager = LoginManager()


def create_app(config_class=Config):
    """Создаёт и настраивает экземпляр Flask-приложения."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = "auth.login"

    from app import models    # noqa: F401
    from app.routes.auth import bp as auth_bp
    from app.routes.tasks import bp as tasks_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(tasks_bp)

    # Создаём таблицы при старте приложения
    with app.app_context():
        db.create_all()

    return app