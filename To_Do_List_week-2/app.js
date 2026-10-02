function addTask() {
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");

  if (input.value.trim() === "") return;

  const li = document.createElement("li");
  li.innerHTML = `
    <span class="task-text">${input.value}</span>
    <div class="action-btns">
      <button class="btn-check" onclick="toggleTask(this)">Done</button>
      <button class="btn-edit" onclick="editTask(this)">Edit</button>
      <button class="btn-delete" onclick="deleteTask(this)">✖</button>
    </div>
  `;

  list.appendChild(li);
  input.value = "";
  updateCounts();
}

// EDIT TASK
function editTask(btn) {
  const li = btn.closest("li");
  const doneBtn = li.querySelector(".btn-check");

  if (btn.innerText === "Edit") {
    const span = li.querySelector(".task-text");
    if (!span) return;

    // 1. Input Element create
    const input = document.createElement("input");
    input.type = "text";
    input.className = "edit-input";
    input.value = span.textContent; // current text value

    // Enter to save the edited task
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") editTask(btn);
    });

    // 2. <span> to <input> changing
    span.replaceWith(input);
    input.focus(); // put cursor in the input field
    btn.innerText = "Save";

    //  pointer-events: none; the "Done" button while editing
    if (doneBtn) doneBtn.style.pointerEvents = "none";
  } else {
    // Save the edited task
    const input = li.querySelector(".edit-input");
    if (!input) return;

    const newText = input.value.trim();
    if (newText === "") {
      input.focus();
      return;
    }

    // 1. Span Element recreate
    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = newText; // updated text value

    // 2. <input> to <span> after save clicked
    input.replaceWith(span);
    btn.innerText = "Edit";

    // pointer-events: auto; the "Done" button after editing
    if (doneBtn) doneBtn.style.pointerEvents = "auto";
  }
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
  const completedTasks = document.querySelectorAll(
    "#task-list li.completed",
  ).length;

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
