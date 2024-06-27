document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("taskForm")) {
    populateUserDropdown();
    setupTaskPage();
  } else if (document.getElementById("userForm")) {
    setupUserPage();
  }

  function setupTaskPage() {
    let pendingTable = document.querySelector(".pen tbody");
    loadTasks(pendingTable);
    let addBtn = document.getElementById("addBtn");

    addBtn.addEventListener("click", function (event) {
      handleAddButtonClick(event, pendingTable);
    });

    pendingTable.addEventListener("click", function (event) {
      if (event.target.classList.contains("button")) {
        handleDoneButtonClick(event);
      }
    });
  }

  function setupUserPage() {
    document
      .getElementById("userForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        handleAddUser();
      });
  }

  function handleAddButtonClick(event, pendingTable) {
    event.preventDefault();
    let currentDate = new Date();
    let taskName = document.getElementById("taskName").value;
    let taskUser = document.getElementById("taskUser").value;
    let taskDueDate = document.getElementById("taskDueDate").value;

    let inputedDate = new Date(taskDueDate);
    inputedDate.setHours(23, 59, 59, 999);
    if (!taskDueDate || !taskUser || !taskName) {
      showToast("Please fill all the fields.");
      return;
    } else if (currentDate > inputedDate) {
      showToast("Due Date should be greater than the current date.");
      return;
    }
    console.log("name:", taskName);
    console.log("user:", taskUser);
    console.log("DueDate:", taskDueDate);

    let newTask = document.createElement("tr");

    let isOddRow = pendingTable.querySelectorAll("tr").length % 2 === 0;
    newTask.className = isOddRow ? "odd-row" : "even-row";

    newTask.innerHTML = `
            <td>${taskName}</td>
            <td>Pending</td>
            <td>${taskUser}</td>
            <td>${taskDueDate}</td>
            <td><button class="button" onclick="handleDoneButtonClick(event)">Done</button></td>
        `;

    insertTaskInOrder(newTask, inputedDate, pendingTable);
    saveAllTasks(pendingTable);
    document.getElementById("taskForm").reset();
  }

  function insertTaskInOrder(newTask, taskDueDate, pendingTable) {
    let rows = Array.from(pendingTable.querySelectorAll("tr"));
    let inserted = false;

    for (let i = 0; i < rows.length; i++) {
      let rowDate = new Date(rows[i].cells[3].textContent);
      rowDate.setHours(23, 59, 59, 999);

      if (taskDueDate < rowDate) {
        pendingTable.insertBefore(newTask, rows[i]);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      pendingTable.appendChild(newTask);
    }
  }

  function handleDoneButtonClick(event) {
    let taskRow = event.target.closest("tr");
    let date = taskRow.cells[3].textContent;
    let taskDueDate = new Date(date);
    let doneTable = document.querySelector(".Done .table tbody");
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    taskRow.cells[1].textContent =
      currentDate > taskDueDate ? "Overdue" : "Done";

    taskRow.removeChild(taskRow.lastElementChild);

    doneTable.appendChild(taskRow);

    saveAllTasks();
  }

  function populateUserDropdown() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userDropdown = document.getElementById("taskUser");
    userDropdown.innerHTML = "";
    users.forEach((user) => {
      let option = document.createElement("option");
      option.value = user.username;
      option.textContent = user.username;
      userDropdown.appendChild(option);
    });
  }

  function handleAddUser() {
    let username = document.getElementById("username").value;
    if (username.trim() === "") {
      showToast("Username cannot be empty.");
      return;
    }
    addUser(username);
    document.getElementById("userForm").reset();
    showToast("User added successfully!");
  }

  function addUser(username) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let lastUserId = localStorage.getItem("lastUserId") || 0;
    let newUserId = parseInt(lastUserId) + 1;
    let newUser = { id: newUserId, username: username };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("lastUserId", newUserId);
    console.log("User added:", newUser);
  }
  function saveAllTasks() {
    const pendingTable = document.querySelector(".pen tbody");
    const doneTable = document.querySelector(".Done .table tbody");

    let tasks = [];
    const collectTasks = (table) => {
      table.querySelectorAll("tr").forEach((row) => {
        let task = {
          name: row.cells[0].textContent,
          status: row.cells[1].textContent,
          user: row.cells[2].textContent,
          dueDate: row.cells[3].textContent,
        };
        tasks.push(task);
      });
    };

    collectTasks(pendingTable);
    collectTasks(doneTable);

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const pendingTable = document.querySelector(".pen tbody");
    const doneTable = document.querySelector(".Done .table tbody");

    pendingTable.innerHTML = "";
    doneTable.innerHTML = "";

    tasks.forEach((task) => {
      let row = document.createElement("tr");
      row.innerHTML = `
      <td>${task.name}</td>
      <td>${task.status}</td>
      <td>${task.user}</td>
      <td>${task.dueDate}</td>
    `;
      if (task.status === "Pending") {
        row.innerHTML += `<td><button class="button" onclick="handleDoneButtonClick(event)">Done</button></td>`;
        pendingTable.appendChild(row);
      } else {
        doneTable.appendChild(row);
      }
    });
  }
  function showToast(message, duration = 3000) {
    const toast = document.getElementById("toast");
    const toastBody = document.querySelector(".toast-body");
    toastBody.textContent = message;
    toast.style.display = "block";

    setTimeout(() => {
      toast.style.display = "none";
    }, duration);
  }
  window.handleAddUser = handleAddUser;
  window.populateUserDropdown = populateUserDropdown;
  window.handleAddButtonClick = handleAddButtonClick;
  window.handleDoneButtonClick = handleDoneButtonClick;
});
