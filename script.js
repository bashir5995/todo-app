// Select Elements
const taskInput = document.getElementById("taskInput");
const taskCategory = document.getElementById("taskCategory");
const addTaskBtn = document.getElementById("addTaskBtn");
const doList = document.getElementById("doList");
const doingList = document.getElementById("doingList");
const doneList = document.getElementById("doneList");
const progressFill = document.querySelector(".progress-fill");
const progressText = document.getElementById("progressText");
const themeToggle = document.getElementById("themeToggle");

// Load Tasks & Theme on Page Load
document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    updateProgress();
    checkTheme();
});

// Dark Mode Toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    themeToggle.innerHTML = document.body.classList.contains("dark-mode")
        ? '<i class="fa-solid fa-sun"></i> Light Mode'
        : '<i class="fa-solid fa-moon"></i> Dark Mode';
});

// Add Task with Category
addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    const category = taskCategory.value;

    if (taskText) {
        createTask(taskText, category, "doList");
        taskInput.value = "";
    }
});

// Create Task
function createTask(text, category, list) {
    const li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

    const taskText = document.createElement("span");
    taskText.textContent = text;
    li.appendChild(taskText);

    const categoryLabel = document.createElement("span");
    categoryLabel.classList.add("badge", `category-${category.toLowerCase()}`);
    categoryLabel.textContent = category;
    li.appendChild(categoryLabel);

    const actions = document.createElement("div");
    actions.classList.add("task-actions", "d-flex", "gap-2");

    // Move Backward Button
    const moveBackwardBtn = document.createElement("button");
    moveBackwardBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    moveBackwardBtn.classList.add("btn", "btn-primary", "shadow-sm");
    moveBackwardBtn.style.display = "none";

    // Move Forward Button
    const moveForwardBtn = document.createElement("button");
    moveForwardBtn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
    moveForwardBtn.classList.add("btn", "btn-primary", "shadow-sm");

    // Edit Button
    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editBtn.classList.add("btn", "btn-warning", "shadow-sm");

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteBtn.classList.add("btn", "btn-danger", "shadow-sm");

    actions.appendChild(moveBackwardBtn);
    actions.appendChild(moveForwardBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    li.appendChild(actions);

    document.getElementById(list).appendChild(li);

    attachTaskEvents(li);
    saveTasks();
    updateProgress();
}

// Move Task Forward
function moveTaskForward(task) {
    if (task.parentElement.id === "doList") {
        doingList.appendChild(task);
    } else if (task.parentElement.id === "doingList") {
        doneList.appendChild(task);
    }
    updateTaskButtons(task);
    saveTasks();
    updateProgress();
}

// Move Task Backward
function moveTaskBackward(task) {
    if (task.parentElement.id === "doingList") {
        doList.appendChild(task);
    } else if (task.parentElement.id === "doneList") {
        doingList.appendChild(task);
    }
    updateTaskButtons(task);
    saveTasks();
    updateProgress();
}

// Attach Event Listeners
function attachTaskEvents(task) {
    updateTaskButtons(task);

    const buttons = task.querySelectorAll(".btn-primary");
    const moveBackwardBtn = buttons[0]; // First button
    const moveForwardBtn = buttons[1]; // Second button

    const editBtn = task.querySelector(".btn-warning");
    const deleteBtn = task.querySelector(".btn-danger");

    if (moveForwardBtn) {
        moveForwardBtn.addEventListener("click", () => moveTaskForward(task));
    }
    if (moveBackwardBtn) {
        moveBackwardBtn.addEventListener("click", () => moveTaskBackward(task));
    }
    if (editBtn) {
        editBtn.addEventListener("click", () => editTask(task));
    }
    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
            task.remove();
            saveTasks();
            updateProgress();
        });
    }
}

// Update Button Visibility
function updateTaskButtons(task) {
    const buttons = task.querySelectorAll(".btn-primary");
    const moveBackwardBtn = buttons[0];
    const moveForwardBtn = buttons[1];

    if (task.parentElement.id === "doList") {
        moveBackwardBtn.style.display = "none";
        moveForwardBtn.style.display = "inline-block";
    } else if (task.parentElement.id === "doingList") {
        moveBackwardBtn.style.display = "inline-block";
        moveForwardBtn.style.display = "inline-block";
    } else {
        moveBackwardBtn.style.display = "inline-block";
        moveForwardBtn.style.display = "none";
    }
}

// Edit Task
function editTask(task) {
    const taskText = task.querySelector("span");
    const newText = prompt("Edit your task:", taskText.textContent);
    if (newText !== null && newText.trim() !== "") {
        taskText.textContent = newText;
        saveTasks();
    }
}

// Save & Load Tasks
function saveTasks() {
    let tasks = {
        doList: Array.from(doList.children).map(task => task.outerHTML),
        doingList: Array.from(doingList.children).map(task => task.outerHTML),
        doneList: Array.from(doneList.children).map(task => task.outerHTML),
    };
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || { doList: [], doingList: [], doneList: [] };

    doList.innerHTML = tasks.doList.join("");
    doingList.innerHTML = tasks.doingList.join("");
    doneList.innerHTML = tasks.doneList.join("");

    document.querySelectorAll("#doList li, #doingList li, #doneList li").forEach(task => {
        attachTaskEvents(task);
    });

    updateProgress();
}

// Update Progress Bar
function updateProgress() {
    let total = doList.children.length + doingList.children.length + doneList.children.length;
    let completed = doneList.children.length;
    let percent = total === 0 ? 0 : (completed / total) * 100;
    progressFill.style.width = percent + "%";
    progressText.textContent = Math.round(percent) + "% Completed";
}

// Check & Apply Theme
function checkTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
    }
}

// Subtitle Effect - Typed.js
document.addEventListener("DOMContentLoaded", function () {
    new Typed("#typed-subtitle", {
        strings: ["Plan Your Day ✍️", "Stay Organised ✅"],
        typeSpeed: 80,
        backSpeed: 50,
        backDelay: 1500,
        loop: true,
        showCursor: false
    });
});
