const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterButtons = document.getElementById("filter-buttons");
const toggleEl = document.getElementById("toggle_icon");
const clickSound = document.getElementById('clickSound');
const navigateSound = document.getElementById('navigateSound');
const toggleSound = document.getElementById('toggleSound');
const headerEl = document.getElementById('header');
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

function toggleTheme() {
    togglePlay();
    toggleEl.classList.toggle('fa-toggle-off');
    toggleEl.classList.toggle('fa-toggle-on');

    const state = toggleEl.classList.contains('fa-toggle-on') ? 'ON' : 'OFF';
    localStorage.setItem('tasksTheme', state);
    setTheme(state)
}

function setTheme(state) {
    const taskItem = Array.from(document.getElementsByClassName('task-item'));
    const noTasksEl = document.getElementById('no-tasks');
    const tasksContainer = document.getElementById('tasks-container');

    if (state == 'ON') {
        toggleEl.classList.add('fa-toggle-on');
        toggleEl.classList.remove('fa-toggle-off');

        document.body.style.backgroundColor = '#000';
        taskItem.forEach(el => el.classList.add('dark-item'));
        headerEl.classList.add('dark-header');
        noTasksEl && noTasksEl.classList.add('dark-item');
        taskInput.classList.add('dark-textarea');
        filterButtons.classList.add('dark-filters');
        tasksContainer.classList.add('tasks-container-dark');
    } else {
        toggleEl.classList.add('fa-toggle-off');
        toggleEl.classList.remove('fa-toggle-on');

        document.body.style.backgroundColor = '#fff';
        taskItem.forEach(el => el.classList.remove('dark-item'));
        headerEl.classList.remove('dark-header');
        noTasksEl && noTasksEl.classList.remove('dark-item');
        taskInput.classList.remove('dark-textarea');
        filterButtons.classList.remove('dark-filters');
        tasksContainer.classList.remove('tasks-container-dark');
    }
}

function generateString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

function playSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

function navigatePlay() {
    navigateSound.currentTime = 0;
    navigateSound.play();
}

function togglePlay() {
    toggleSound.currentTime = 0;
    toggleSound.play();
}

function addTask() {
    playSound();
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

function formatDate(str) {
    let date = new Date(str);
    return date.toDateString()
}

function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.setAttribute("id", task.id);
        // <i class="fa fa-thumb-tack pin ${task.completed ? 'hide' : ''}"></i>
        taskItem.innerHTML = `
          <div onclick="toggleTaskCompleted(${index})" class="task-is ${task.completed ? 'completed' : ''}">
          <div>
                <span class="task-text ${task.completed ? 'line-through' : ''}">${task.description}</span>
                <div class="created_at">${formatDate(task.createdAt)}</div>
            </div>
          </div>
          <i class="fa fa-trash delete" onclick="deleteTask(${index}, '${task.id}')"></i>
        `;
        taskList.appendChild(taskItem);
    });

    if (tasks.length === 0) {
        taskList.innerHTML = `<div class="no-tasks" id="no-tasks">
            <i class="fa fa-file italic margin-right"></i>
            No records
        </div>`
    }

    setTheme(localStorage.getItem('tasksTheme'));
}
function toggleTaskCompleted(index) {
    togglePlay();
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function deleteTask(index, id) {
    playSound();
    const element = document.getElementById(id);
    hideThisElement(element)
    tasks.splice(index, 1);
    setTimeout(function () {
        renderTasks();
    }, 300)
}

function filterTasks(filter) {
    navigatePlay();
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
        // <i class="fa fa-thumb-tack pin ${task.completed ? 'hide' : ''}"></i>
        taskItem.innerHTML = `
            <div onclick="toggleTaskCompleted(${index})" class="task-is ${task.completed ? 'completed' : ''}">
                <div>
                    <span class="task-text ${task.completed ? 'line-through' : ''}">${task.description}</span>
                    <div class="created_at">${formatDate(task.createdAt)}</div>
                </div>
            </div>
            <i onclick="deleteTask(${tasks.indexOf(task)}, '${task.id}')" class="fa fa-trash delete"></i>
        `;
        taskList.appendChild(taskItem);
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `<div class="no-tasks" id="no-tasks">
        <i class="fa fa-file italic margin-right"></i>
            No records
        </div>`
    }

    setTheme(localStorage.getItem('tasksTheme'));
}

function archiveTasks() {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
}

function loadSavedTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) tasks = savedTasks;
    else tasks = [];
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load saved tasks when the page loads
window.addEventListener('load', loadSavedTasks);

// Save tasks whenever tasks array is updated
// window.addEventListener('beforeunload', saveTasks);
window.addEventListener('beforeunload', function(event) {
    saveTasks():
    window.location.reload();
});
