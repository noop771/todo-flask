"""Роуты для работы с задачами."""

from flask import Blueprint, render_template
from flask_login import login_required, current_user

from app import db
from app.models import Task


bp = Blueprint('tasks', __name__)


@bp.route('/')
@login_required
def index():
    """Главная страница — список задач текущего пользователя."""
    tasks = Task.query.filter_by(user_id=current_user.id).all()
    return render_template('index.html', tasks=tasks)