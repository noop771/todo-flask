// ============================================================
// To-Do приложение — клиентская логика
// ============================================================

const API = {
    list:   '/api/tasks',
    add:    '/api/add',
    toggle: (id) => `/api/toggle/${id}`,
    delete: (id) => `/api/delete/${id}`,
};


// ============================================================
// Утилиты
// ============================================================

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.dataset.id = task.id;

    const span = document.createElement('span');
    span.className = 'task-text';
    span.style.cursor = 'pointer';
    span.textContent = task.text;

    if (task.done) {
        span.style.textDecoration = 'line-through';
        span.style.color = 'gray';
    }

    const btn = document.createElement('button');
    btn.className = 'btn btn-sm btn-outline-danger delete-btn';
    btn.textContent = '✕';

    li.appendChild(span);
    li.appendChild(btn);
    return li;
}


function removeEmptyMessage() {
    const msg = document.getElementById('empty-msg');
    if (msg) msg.remove();
}


function checkEmpty() {
    const list = document.getElementById('task-list');
    if (list.children.length === 0 && !document.getElementById('empty-msg')) {
        const p = document.createElement('p');
        p.className = 'text-muted';
        p.id = 'empty-msg';
        p.textContent = 'Пока задач нет';
        list.parentNode.appendChild(p);
    }
}


// ============================================================
// Операции с задачами
// ============================================================

async function addTask(text) {
    const response = await fetch(API.add, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text: text}),
    });

    if (!response.ok) {
        const err = await response.json();
        alert(err.error || 'Ошибка');
        return;
    }

    const data = await response.json();
    const li = createTaskElement(data.task);

    removeEmptyMessage();
    document.getElementById('task-list').appendChild(li);
}


async function toggleTask(id) {
    const response = await fetch(API.toggle(id), {method: 'POST'});
    if (!response.ok) return;

    const data = await response.json();

    const li = document.querySelector(`[data-id="${id}"]`);
    const span = li.querySelector('.task-text');

    if (data.done) {
        span.style.textDecoration = 'line-through';
        span.style.color = 'gray';
    } else {
        span.style.textDecoration = '';
        span.style.color = '';
    }
}


async function deleteTask(id) {
    const response = await fetch(API.delete(id), {method: 'POST'});
    if (!response.ok) return;

    const li = document.querySelector(`[data-id="${id}"]`);
    li.remove();
    checkEmpty();
}


// ============================================================
// Инициализация — обработчики событий
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. Форма добавления
    document.getElementById('add-form').addEventListener('submit', async (e) => {
        e.preventDefault();    // не перезагружать страницу!

        const input = document.getElementById('task-input');
        const text = input.value.trim();
        if (!text) return;

        await addTask(text);
        input.value = '';
        input.focus();
    });

    // 2. Клик по списку (делегирование событий)
    document.getElementById('task-list').addEventListener('click', (e) => {
        const li = e.target.closest('li[data-id]');
        if (!li) return;

        const id = li.dataset.id;

        if (e.target.classList.contains('delete-btn')) {
            deleteTask(id);
        } else if (e.target.classList.contains('task-text')) {
            toggleTask(id);
        }
    });

});