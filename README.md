# To-Do приложение

Простой to-do лист на Flask с авторизацией, AJAX и статистикой.

## Функции

- Регистрация / вход / выход
- Список задач у каждого пользователя
- Добавление, отметка выполненных, удаление
- Статистика в реальном времени
- AJAX (без перезагрузки страницы)

## Стек

- Flask
- Flask-SQLAlchemy
- Flask-Login
- SQLite
- Bootstrap 5
- Vanilla JS (fetch)

## Установка и запуск

```bash
git clone https://github.com/noop771/todo-flask.git
cd todo-flask
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py
