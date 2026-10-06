"""Роуты для работы с задачами."""

from flask import Blueprint, render_template, jsonify, request
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

@bp.route('/api/tasks')
@login_required
def api_tasks():
    """Список задач текущего пользователя в JSON."""
    tasks = Task.query.filter_by(user_id=current_user.id).all()
    return jsonify([{'id': t.id, 'text': t.text, 'done': t.done} for t in tasks])

@bp.route('/api/add', methods=['POST'])
@login_required
def api_add():
    """Добавить новую задачу."""
    data = request.get_json()
    text = data.get('text', '').strip()

    if not text:
        return jsonify({'error': 'Текст не может быть пустым'}), 400

    task = Task(text=text, user_id=current_user.id)
    db.session.add(task)
    db.session.commit()

    return jsonify({'ok': True, 'task': {'id': task.id, 'text': task.text, 'done': task.done}})

@bp.route('/api/toggle/<int:task_id>', methods=['POST'])
@login_required
def api_toggle(task_id):
    """Переключить статус задачи (выполнено / не выполнено)."""
    task = Task.query.filter_by(id=task_id, user_id=current_user.id).first()

    if not task:
        return jsonify({'error': 'Задача не найдена'}), 404

    task.done = not task.done
    db.session.commit()

    return jsonify({'ok': True, 'done': task.done})

@bp.route('/api/delete/<int:task_id>', methods=['POST'])
@login_required
def api_delete(task_id):
    """Удалить задачу."""
    task = Task.query.filter_by(id=task_id, user_id=current_user.id).first()

    if not task:
        return jsonify({'error': 'Задача не найдена'}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({'ok': True})

@bp.route('/api/stats')
@login_required
def api_stats():
    """Статистика по задачам пользователя."""
    total = Task.query.filter_by(user_id=current_user.id).count()
    completed = Task.query.filter_by(user_id=current_user.id, done=True).count()
    active = total - completed
    
    rate = round(completed / total * 100, 1) if total > 0 else 0.0
    
    return jsonify({
        'total': total,
        'completed': completed,
        'active': active,
        'completion_rate': rate,
    })

