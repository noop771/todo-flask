"""Роуты аутентификации: регистрация, вход, выход."""

from flask import Blueprint, render_template, request, redirect, url_for
from flask_login import login_user, logout_user, login_required

from app import db
from app.models import User


bp = Blueprint('auth', __name__)


@bp.route('/register', methods=['GET', 'POST'])
def register():
    """Регистрация нового пользователя."""
    if request.method == "POST":
        username = request.form.get('username')
        password = request.form.get('password')

        if not username or not password:
            return render_template('register.html', error='Заполните все поля')

        if User.query.filter_by(username=username).first():
            return render_template('register.html', error='Пользователь уже существует')

        user = User(username=username)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        return redirect(url_for('auth.login'))

    return render_template('register.html')


@bp.route('/login', methods=['GET', 'POST'])
def login():
    """Вход пользователя."""
    if request.method == "POST":
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            login_user(user)
            return redirect('/')          # временно, потом → tasks.index

        return render_template('login.html', error='Неверный логин или пароль')

    return render_template('login.html')


@bp.route('/logout')
@login_required
def logout():
    """Выход пользователя."""
    logout_user()
    return redirect(url_for('auth.login'))