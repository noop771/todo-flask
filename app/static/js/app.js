// ============================================================
// To-Do приложение — клиентская логика
// ============================================================

const API = {
    list:   '/api/tasks',
    add:    '/api/add',
    toggle: (id) => `/api/toggle/${id}`,
    delete: (id) => `/api/delete/${id}`,
    stats:  '/api/stats',
};


// ============================================================
// Создание DOM-элемента задачи
// ============================================================

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex align-items-center gap-2';
    li.dataset.id = task.id;

    // Кнопка-toggle
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn btn-sm toggle-btn';
    updateToggleButton(toggleBtn, task.done);

    // Текст задачи
    const span = document.createElement('span');
    span.className = 'task-text flex-grow-1';
    span.textContent = task.text;
    updateTaskText(span, task.done);

    // Кнопка удаления
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm btn-outline-danger delete-btn';
    deleteBtn.textContent = '✕';

    li.appendChild(toggleBtn);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    return li;
}


function updateToggleButton(btn, done) {
    if (done) {
        btn.classList.remove('btn-outline-secondary');
        btn.classList.add('btn-success');
        btn.textContent = '✅';
    } else {
        btn.classList.remove('btn-success');
        btn.classList.add('btn-outline-secondary');
        btn.textContent = '⬜';
    }
}


function updateTaskText(span, done) {
    if (done) {
        span.classList.add('text-decoration-line-through', 'text-muted');
    } else {
        span.classList.remove('text-decoration-line-through', 'text-muted');
    }
}


// ============================================================
// Утилиты
// ============================================================

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
// Статистика
// ============================================================

async function updateStats() {
    const response = await fetch(API.stats);
    if (!response.ok) return;

    const data = await response.json();

    document.getElementById('stat-total').textContent = data.total;
    document.getElementById('stat-completed').textContent = data.completed;
    document.getElementById('stat-active').textContent = data.active;
    document.getElementById('stat-rate').textContent = data.completion_rate;
    document.getElementById('stat-progress').style.width = data.completion_rate + '%';
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

    await updateStats();
}


async function toggleTask(id) {
    const response = await fetch(API.toggle(id), {method: 'POST'});
    if (!response.ok) return;

    const data = await response.json();

    const li = document.querySelector(`[data-id="${id}"]`);
    const btn = li.querySelector('.toggle-btn');
    const span = li.querySelector('.task-text');

    updateToggleButton(btn, data.done);
    updateTaskText(span, data.done);

    await updateStats();
}


async function deleteTask(id) {
    const response = await fetch(API.delete(id), {method: 'POST'});
    if (!response.ok) return;

    const li = document.querySelector(`[data-id="${id}"]`);
    li.remove();
    checkEmpty();

    await updateStats();
}


// ============================================================
// Инициализация
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // Обновляем статистику при загрузке
    updateStats();

    // Форма добавления
    document.getElementById('add-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const input = document.getElementById('task-input');
        const text = input.value.trim();
        if (!text) return;

        await addTask(text);
        input.value = '';
        input.focus();
    });

    // Клик по списку (делегирование)
    document.getElementById('task-list').addEventListener('click', (e) => {
        const li = e.target.closest('li[data-id]');
        if (!li) return;

        const id = li.dataset.id;

        if (e.target.classList.contains('delete-btn')) {
            deleteTask(id);
        } else if (e.target.classList.contains('toggle-btn') || e.target.classList.contains('task-text')) {
            toggleTask(id);
        }
    });

});