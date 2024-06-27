let pendingTable = document.querySelector(".pen tbody");
let addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", handleAddButtonClick);
pendingTable.addEventListener("click", function (event) {
  if (event.target.classList.contains("button")) {
    handleDoneButtonClick(event);
  }
});

function handleAddButtonClick(event) {
  event.preventDefault();
  let currentDate = new Date();
  let taskName = document.getElementById("taskName").value;
  let taskUser = document.getElementById("taskUser").value;
  let taskDueDate = document.getElementById("taskDueDate").value;

  let inputedDate = new Date(taskDueDate);
  inputedDate.setHours(23, 59, 59, 999);
  if (!taskDueDate || !taskUser || !taskName) {
    showToast("Please Fill all the Fields");
    return;
  } else if (currentDate > inputedDate) {
    showToast("Due Date should be greater than current date");
    return;
  }
  console.log("name:", taskName);
  console.log("user:", taskUser);
  console.log("DueDate:", taskDueDate);

  let newTask = document.createElement("tr");

  // Apply a class based on whether the row number is odd or even
  let isOddRow = pendingTable.querySelectorAll("tr").length % 2 === 0;
  newTask.className = isOddRow ? "odd-row" : "even-row";

  newTask.innerHTML = `
      <td>${taskName}</td>
      <td>Pending</td>
      <td>${taskUser}</td>
      <td>${taskDueDate}</td>
      <td><button class="button" onclick="handleDoneButtonClick(event)">Done</button></td>
    `;

  // Insert the new task in the correct position
  insertTaskInOrder(newTask, inputedDate);

  // Optionally, clear the form fields after submission
  document.getElementById("taskForm").reset();
}

function insertTaskInOrder(newTask, taskDueDate) {
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

  if (currentDate > taskDueDate) {
    taskRow.cells[1].textContent = "Overdue";
  } else {
    taskRow.cells[1].textContent = "Done";
  }
  let actionCell = taskRow.cells[4];
  actionCell.removeChild(actionCell.querySelector(".button"));
  // Append the task row to the done table
  doneTable.appendChild(taskRow);

  console.log("Task moved to Done");
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

// section la the local storage (self taught)

function addUser(username) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let lastUserId = localStorage.getItem("lastUserId") || 0;
  let newUserId = parseInt(lastUserId) + 1;

  let newUser = {
    id: newUserId,
    username: username,
  };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("lastUserId", newUserId);
  console.log("User added:", newUser);
}
