const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterButtons = document.getElementById("filter-buttons");
let tasks = [];

addTaskBtn.addEventListener('click', addTask);

addTaskBtn.style.display = 'none';
taskInput.addEventListener('input', function () {
    if (taskInput.value && taskInput.value.trim() != '') {
        addTaskBtn.style.display = 'block';
    } else {
        addTaskBtn.style.display = 'none';
    }
})

function generateString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

function addTask() {
    const taskDescription = taskInput.value;
    if (taskDescription.trim() !== '') {
        const task = {
            id: generateString(5),
            description: taskDescription,
            completed: false,
            createdAt: new Date()
        };
        tasks.push(task);
        renderTasks();
        taskInput.value = '';
        hideThisElement(addTaskBtn)
    }
}

function hideThisElement(element) {
    element.classList.add('hide_it');
    setTimeout(function () {
        element.style.display = 'none';
        element.classList.remove('hide_it');
    }, 300);
}

function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.setAttribute("id", task.id);
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        taskItem.innerHTML = `
          <div class="task-is">
            <i class="fa fa-thumb-tack pin ${task.completed ? 'hide' : ''}"></i>
            <input type="checkbox" onchange="toggleTaskCompleted(${index})" ${task.completed ? 'checked' : ''}>
            <span class="${task.completed ? 'line-through' : ''}">${task.description}</span>
          </div>
          <i class="fa fa-trash delete" onclick="deleteTask(${index}, '${task.id}')"></i>
        `;
        taskList.appendChild(taskItem);
    });

    if (tasks.length === 0) {
        taskList.innerHTML = `<div class="no-tasks">
            <i class="fa fa-file italic margin-right"></i>
            No tasks found
        </div>`
    }
}
function toggleTaskCompleted(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function deleteTask(index, id) {
    const element = document.getElementById(id);
    hideThisElement(element)
    tasks.splice(index, 1);
    setTimeout(function () {
        renderTasks();
    }, 300)
}

function filterTasks(filter) {
    let filteredTasks = [];
    if (filter === 'all') {
        filteredTasks = tasks;
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    highlightTab(filter)
    renderFilteredTasks(filteredTasks);
}

function highlightTab(filter) {
    const buttons = filterButtons.querySelectorAll("button")
    buttons.forEach(button => {
        const id = button.getAttribute("id")
        if (id == filter) {
            button.classList.add("active")
        } else {
            button.classList.remove("active")
        }
    })
}

function renderFilteredTasks(filteredTasks) {
    taskList.innerHTML = '';

    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.setAttribute('id', task.id);
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        taskItem.innerHTML = `
            <div class="task-is">
                <i class="fa fa-thumb-tack pin ${task.completed ? 'hide' : ''}"></i>
                <input type="checkbox" onchange="toggleTaskCompleted(${tasks.indexOf(task)})" ${task.completed ? 'checked' : ''}>
                <span class="${task.completed ? 'line-through' : ''}">${task.description}</span>
            </div>
            <i onclick="deleteTask(${tasks.indexOf(task)}, '${task.id}')" class="fa fa-trash delete"></i>
        `;
        taskList.appendChild(taskItem);
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `<div class="no-tasks">
        <i class="fa fa-file italic margin-right"></i>
            No tasks found
        </div>`
    }
}

function archiveTasks() {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
}

function loadSavedTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
        tasks = savedTasks;
        renderTasks();
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load saved tasks when the page loads
window.addEventListener('load', loadSavedTasks);

// Save tasks whenever tasks array is updated
window.addEventListener('beforeunload', saveTasks);