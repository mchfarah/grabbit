const form = document.querySelector(".addItemForm");
const itemNameInput = document.getElementById("itemName");
const itemQuantityInput = document.getElementById("itemQuantity");
const itemCategoryInput = document.getElementById("itemCategory");
const shoppingList = document.getElementById("shoppingList");

let items = [];

function saveToStorage() {
  localStorage.setItem("grabbit-items", JSON.stringify(items));
}

function loadFromStorage() {
  const saved = localStorage.getItem("grabbit-items");
  if (saved) {
    items = JSON.parse(saved);
    renderList();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = itemNameInput.value.trim();
  const quantity = itemQuantityInput.value;
  const category = itemCategoryInput.value;

  if (!name) return;

  const newItem = {
    id: Date.now(),
    name,
    quantity,
    category,
    completed: false,
  };

  items.push(newItem);
  renderList();
  form.reset();
});

function renderList() {
  shoppingList.innerHTML = "";
  saveToStorage();

  items.forEach((item) => {
    const li = document.createElement("li");

    li.className = "shoppingItem";
    li.dataset.category = item.category;
    li.dataset.id = item.id;

    li.innerHTML = `
      <span class="itemCheck ${item.completed ? "checked" : ""}"></span>
      <span class="itemName ${item.completed ? "completed" : ""}">${item.name}</span>
      <span class="itemQuantity">${item.quantity}x</span>
      <span class="itemCategory">${item.category}</span>
      <button class="deleteBtn">✕</button>
    `;

    shoppingList.appendChild(li);
  });
}

shoppingList.addEventListener("click", (event) => {
  const li = event.target.closest(".shoppingItem");
  if (!li) return;

  const id = Number(li.dataset.id);

  if (event.target.classList.contains("itemCheck")) {
    items = items.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item,
    );
    renderList();
  }

  if (event.target.classList.contains("deleteBtn")) {
    items = items.filter((item) => item.id !== id);
    renderList();
  }
});

const filterButtons = document.querySelectorAll(".filterBtn");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    document.querySelectorAll(".shoppingItem").forEach((item) => {
      if (filter === "all" || item.dataset.category === filter) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  });
});

loadFromStorage();
