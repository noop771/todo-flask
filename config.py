"""Конфигурация Flask-приложения."""


class Config:
    """Настройки приложения."""

    SECRET_KEY = "..."
    SQLALCHEMY_DATABASE_URI = "sqlite:////data/task.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False