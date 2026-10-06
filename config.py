"""Конфигурация Flask-приложения."""


class Config:
    """Настройки приложения."""

    SECRET_KEY = "dd56bc5c5eb2caf836cf70543f17ae4e096ccf31c71391596ff7b067d00eb124"
    SQLALCHEMY_DATABASE_URI = "sqlite:///task.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False