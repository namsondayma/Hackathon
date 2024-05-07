document.addEventListener("DOMContentLoaded", function() {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const confirmModal = document.getElementById("confirmModal");
  const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
  const editModal = document.getElementById("editModal");
  const confirmEditBtn = document.getElementById("confirm-edit-btn");
  const errorAlert = document.getElementById("error-alert");

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      if (task.completed) {
        li.classList.add("completed");
      }
      li.innerHTML = `
        <div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" ${task.completed ? "checked" : ""} data-index="${index}" id="checkbox-${index}">
          <label class="custom-control-label ${task.completed ? "completed" : ""}" for="checkbox-${index}">${task.name}</label>
        </div>
        <button type="button" class="btn btn-sm btn-primary edit-btn" data-index="${index}">Edit</button>
        <button type="button" class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button>`;
      taskList.appendChild(li);
    });
    updateCompletedTasksCount();
  }

  addTaskBtn.addEventListener("click", function() {
    const taskName = taskInput.value.trim();
    if (!taskName) {
      showError("Không được để trống công việc.");
      return;
    }
    if (tasks.some(task => task.name === taskName)) {
      showError("Tên công việc bị trùng,vui lòng thử lại");
      return;
    }
    tasks.push({ name: taskName, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    taskInput.value = "";
  });

  taskList.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-btn")) {
      const index = event.target.dataset.index;
      confirmModal.dataset.index = index;
      $('#confirmModal').modal('show');
    }
  });

  confirmDeleteBtn.addEventListener("click", function() {
    const index = confirmModal.dataset.index;
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    $('#confirmModal').modal('hide');
  });

  taskList.addEventListener("click", function(event) {
    if (event.target.classList.contains("edit-btn")) {
      const index = event.target.dataset.index;
      const taskName = tasks[index].name;
      document.getElementById("edit-task-input").value = taskName;
      editModal.dataset.index = index;
      $('#editModal').modal('show');
    }
  });

  confirmEditBtn.addEventListener("click", function() {
    const index = editModal.dataset.index;
    const newTaskName = document.getElementById("edit-task-input").value.trim();
    if (!newTaskName) {
      showError("Task name cannot be empty.");
      return;
    }
    if (tasks.some((task, i) => i !== parseInt(index) && task.name === newTaskName)) {
      showError("Task name must be unique.");
      return;
    }
    tasks[index].name = newTaskName;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    $('#editModal').modal('hide');
  });
  taskList.addEventListener("change", function(event) {
    if (event.target.classList.contains("custom-control-input")) {
      const index = event.target.dataset.index;
      tasks[index].completed = event.target.checked;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    }
  });
  function showError(message) {
    errorAlert.textContent = message;
    errorAlert.classList.remove("d-none");
    setTimeout(() => {
      errorAlert.classList.add("d-none");
    }, 3000);
  }
  function updateCompletedTasksCount() {
    const completedTasksCount = tasks.filter(task => task.completed).length;
    if (completedTasksCount === tasks.length && tasks.length > 0) {
      alert("All tasks completed!");
    }
  }

  renderTasks();
});
