// 1. Select DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// 2. Load tasks when page loads
window.addEventListener('DOMContentLoaded', loadTasks);

// 3. Event Listener for Add button
addBtn.addEventListener('click', addTask);

// 4. Event Listener for Enter key
taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// =======================
// ADD TASK FUNCTION
// =======================
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert("Please enter a task!");
        return;
    }

    createTaskElement(taskText, false);
    saveTasks();

    taskInput.value = '';
}

// =======================
// CREATE TASK ELEMENT
// =======================
function createTaskElement(text, completed) {

    const li = document.createElement('li');
    if (completed) {
        li.classList.add('completed');
    }

    li.innerHTML = `
        <span class="task-text">${text}</span>
        <button class="delete-btn">Delete</button>
    `;

    // Toggle completed
    li.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') return;
        li.classList.toggle('completed');
        saveTasks();
    });

    // Delete task
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function () {
        taskList.removeChild(li);
        saveTasks();
    });

    taskList.appendChild(li);
}

// =======================
// SAVE TASKS TO LOCAL STORAGE
// =======================
function saveTasks() {
    const tasks = [];

    document.querySelectorAll('#taskList li').forEach(li => {
        tasks.push({
            text: li.querySelector('.task-text').textContent,
            completed: li.classList.contains('completed')
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// =======================
// LOAD TASKS FROM LOCAL STORAGE
// =======================
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    savedTasks.forEach(task => {
        createTaskElement(task.text, task.completed);
    });
}