"""Конфигурация Flask-приложения."""


class Config:
    """Настройки приложения."""

    SECRET_KEY = "16be02c45fbe54d11fa038b0919bdb4649055cb55ac1d1c53f9b3da7ec6be2c8"
    SQLALCHEMY_DATABASE_URI = "sqlite:////data/task.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False