// Espera a que la página cargue
document.addEventListener('DOMContentLoaded', loadTasks);

// Obtén elementos del HTML
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');

// Cuando envíes el formulario, agrega la tarea a pendientes
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const taskText = input.value.trim();
    if (taskText) {
        addTask(taskText, false); // false = pendiente
        input.value = '';
    }
});

// Función para agregar tarea
function addTask(text, completed, completedDate = null) {
    const task = { 
        text: text, 
        completed: completed,
        completedDate: completedDate
    };
    saveTask(task);
    renderTask(task);
}

// Función para mostrar tarea en la lista correcta
function renderTask(task) {
    const li = document.createElement('li');
    
    if (task.completed) {
        // Formatear la fecha de manera legible
        const date = new Date(task.completedDate);
        const formattedDate = date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        li.innerHTML = `
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                <div class="buttons">
                    <button class="delete-btn" onclick="deleteTask(this)">X</button>
                </div>
            </div>
            <div class="completed-date">Completada: ${formattedDate}</div>
        `;
        completedList.appendChild(li);
    } else {
        li.innerHTML = `
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                <div class="buttons">
                    <button class="complete-btn" onclick="toggleComplete(this)">✓</button>
                    <button class="delete-btn" onclick="deleteTask(this)">X</button>
                </div>
            </div>
        `;
        pendingList.appendChild(li);
    }
}

// Función para marcar como completada
function toggleComplete(button) {
    const li = button.parentElement.parentElement.parentElement;
    const taskText = li.querySelector('.task-text').textContent;
    li.remove(); // Quita de la lista actual
    
    // Agregar fecha y hora actual
    const now = new Date().toISOString();
    addTask(taskText, true, now); // Agrega a completadas con fecha
}

// Función para eliminar tarea
function deleteTask(button) {
    const li = button.parentElement.parentElement.parentElement;
    const taskText = li.querySelector('.task-text').textContent;
    
    // Si la tarea está en la lista de pendientes, muévela a hechas
    if (li.parentElement.id === 'pending-list') {
        li.remove(); // Quita de pendientes
        const now = new Date().toISOString();
        addTask(taskText, true, now); // Agrega a hechas con fecha
    } else {
        // Si está en hechas, elimínala completamente
        li.remove();
        removeTask(taskText);
    }
}

// Funciones para localStorage
function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(renderTask);
}

function removeTask(text) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const filtered = tasks.filter(t => t.text !== text);
    localStorage.setItem('tasks', JSON.stringify(filtered));
}