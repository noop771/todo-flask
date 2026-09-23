"""Инициализация Приложения(фабрика create.app)"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

from config import Config


db = SQLAlchemy()
login_manager = LoginManager()


def create_app(config_class=Config):
    "Создание и настройка экземпляра приложения"
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = "auth.login" #auth пока не существует

    #Зарегистрировать blueprint's
    #from app.routes.auth import bp as auth_bp
    #app.register_blueprint(auth_bp)


    return app