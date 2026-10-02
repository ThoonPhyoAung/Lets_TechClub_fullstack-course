function addTask() {
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");

  if (input.value.trim() === "") return;

  const li = document.createElement("li");
  li.innerHTML = `
    <span class="task-text">${input.value}</span>
    <div class="action-btns">
      <button class="btn-check" onclick="toggleTask(this)">Done</button>
      <button class="btn-delete" onclick="deleteTask(this)">✖</button>
    </div>
  `;

  list.appendChild(li);
  input.value = "";
  updateCounts();
}

function toggleTask(btn) {
  // get the closest li element from the btn and add/remove the "completed" class
  btn.closest("li").classList.toggle("completed");
  updateCounts();
}

function deleteTask(btn) {
  btn.closest("li").remove();
  updateCounts();
}

// Task count update function
function updateCounts() {
  const totalTasks = document.querySelectorAll("#task-list li").length;
  const completedTasks = document.querySelectorAll("#task-list li.done").length;

  document.getElementById("total-count").innerText = `Total: ${totalTasks}`;
  document.getElementById("completed-count").innerText =
    `Done: ${completedTasks}`;
}

// Enter key event listener for adding tasks
document
  .getElementById("task-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") addTask();
  });
