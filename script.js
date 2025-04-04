const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const completedList = document.getElementById("completed-list");
const addBtn = document.getElementById("add-btn");
const dueDateInput = document.getElementById("due-date");
const prioritySelect = document.getElementById("priority");
const searchInput = document.getElementById("search-input");
const toastContainer = document.getElementById("toast-container");
const toggleDark = document.getElementById("toggle-dark");
const taskCounter = document.getElementById("task-counter");
const progressBar = document.getElementById("progress");
const clearAllBtn = document.getElementById("clear-all");

let tasks = [];

function updateTaskStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  taskCounter.textContent = `${completed} of ${total} completed`;
  progressBar.style.width = total === 0 ? "0%" : `${(completed / total) * 100}%`;
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = `task ${task.completed ? "completed" : ""}`;
  li.innerHTML = `
    <span>${task.text}</span><br/>
    <small>📅 ${task.dueDate || "No due date"} | 🏷️ ${task.priority}</small>
  `;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑";
  deleteBtn.onclick = () => {
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
    renderTasks();
  };

  li.onclick = () => {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  };

  li.appendChild(deleteBtn);
  return li;
}

function renderTasks() {
  taskList.innerHTML = "";
  completedList.innerHTML = "";
  const searchTerm = searchInput.value.toLowerCase();

  tasks.forEach(task => {
    if (!task.text.toLowerCase().includes(searchTerm)) return;

    const el = createTaskElement(task);
    if (task.completed) {
      completedList.appendChild(el);
    } else {
      taskList.appendChild(el);
    }
  });

  updateTaskStats();
}

function addTask() {
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = prioritySelect.value;

  if (text === "") return;

  const task = {
    id: Date.now(),
    text,
    dueDate,
    priority,
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskInput.value = "";
  dueDateInput.value = "";
  prioritySelect.value = "Low";

  showToast(`✅ Task Added: "${task.text}"`);

  if (dueDate) {
    const timeUntil = new Date(dueDate) - new Date();
    if (timeUntil > 0) {
      setTimeout(() => {
        showToast(`⏰ Task "${task.text}" is due!`);
      }, timeUntil);
    }
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
  renderTasks();
}

function clearAllTasks() {
  tasks = [];
  saveTasks();
  renderTasks();
  showToast("🗑 All tasks cleared!");
}

// 🌗 Toggle Dark Mode
toggleDark.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("dark", document.body.classList.contains("dark"));
};

// 🌓 Keep Dark Mode on Reload
window.onload = () => {
  if (localStorage.getItem("dark") === "true") {
    document.body.classList.add("dark");
  }
  loadTasks();
};

// 🔍 Live Search
searchInput.addEventListener("input", renderTasks);
addBtn.addEventListener("click", addTask);
clearAllBtn.addEventListener("click", clearAllTasks);

// Autofocus on input field
taskInput.focus();
