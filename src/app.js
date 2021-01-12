/* eslint-disable no-param-reassign */
// Getting Elements - selectors

const addButton = document.querySelector("button.add");
const todoList = document.querySelector("ul.list");
const filterOption = document.querySelector("select.filter");
const changeUserButton = document.querySelector("button.change-user");
const listHeader = document.querySelector("h2.list-header");

// global variables
let userName;
let todoItems = [];

const storageKey = () => `${userName}Todos`;

const getStoredTodos = () => {
  if (localStorage.getItem(storageKey()) === null) {
    return [];
  }
  return JSON.parse(localStorage.getItem(storageKey()));
};

const persist = (todoItem) => {
  localStorage.setItem(storageKey(), JSON.stringify(todoItem));
};

const remove = (todoItem) => {
  todoItems = todoItems.filter(({ id }) => todoItem.id !== id);
};

const update = (todoItem, todoEl) => {
  todoItem.text = todoEl.childNodes[0].innerHTML;
  todoItem.isComplete = todoEl.classList.contains("completed");
};

const createTodoEl = (id) => {
  const li = document.createElement("li");
  li.classList.add("todo");
  li.setAttribute("id", id);
  return li;
};

const createTextEl = (text) => {
  const p = document.createElement("p");
  p.classList.add("todo-text");
  p.innerHTML = text;
  return p;
};

const createCompleteButton = (todoEl, editButton, saveTodoItem) => {
  const button = document.createElement("button");
  button.innerHTML = "Mark";
  button.classList.add("complete");
  button.addEventListener("click", () => {
    todoEl.classList.toggle("completed");
    editButton.disabled = todoEl.classList.contains("completed");
    saveTodoItem();
  });
  return button;
};

const createCommandButton = (textEl, saveTodoItem) => {
  const button = document.createElement("button");
  button.innerHTML = "Edit";
  button.classList.add("edit");
  button.addEventListener("click", () => {
    if (button.innerHTML === "Edit") {
      textEl.contentEditable = true;
      textEl.focus();
      button.innerHTML = "Save";
      button.classList.remove("edit");
      button.classList.add("save");
    } else {
      textEl.contentEditable = false;
      saveTodoItem();
      button.innerHTML = "Edit";
      button.classList.remove("save");
      button.classList.add("edit");
    }
  });
  return button;
};

const createDeleteButton = (todoEl, removeTodoItem) => {
  const button = document.createElement("button");
  button.innerHTML = "Delete";
  button.classList.add("delete");
  button.addEventListener("click", () => {
    removeTodoItem();
    todoEl.remove();
  });
  return button;
};

const render = (todoItem) => {
  const todoEl = createTodoEl(todoItem.id);

  if (todoItem.isComplete === true) {
    todoEl.classList.toggle("completed");
  }

  const textElement = createTextEl(todoItem.text);
  todoEl.appendChild(textElement);

  const editButton = createCommandButton(textElement, () => {
    update(todoItem, todoEl);
    persist(todoItems);
  });
  todoEl.appendChild(editButton);

  const completeButton = createCompleteButton(todoEl, editButton, () => {
    update(todoItem, todoEl);
    persist(todoItems);
  });
  todoEl.appendChild(completeButton);

  const deleteButton = createDeleteButton(todoEl, () => {
    remove(todoItem);
    persist(todoItems);
  });
  todoEl.appendChild(deleteButton);

  todoList.appendChild(todoEl);
};

const removeAllTodoElements = () => {
  while (todoList.firstChild) {
    todoList.removeChild(todoList.firstChild);
  }
};

const renderAll = (todos) => {
  todos.forEach((todo) => {
    render(todo);
  });
};

const setUser = () => {
  // eslint-disable-next-line no-alert
  const input = prompt("Please enter your name...");

  if (!input) {
    setUser();
  } else {
    userName = input.toLowerCase().trim();
    todoItems = getStoredTodos(userName);

    removeAllTodoElements();

    renderAll(todoItems);

    listHeader.innerHTML = `Todo list for ${input}`;
  }
};

addButton.addEventListener("click", (event) => {
  event.preventDefault();

  const textInput = document.querySelector("input.new-todo");
  const todo = {
    text: textInput.value,
    isComplete: false,
    id: new Date(),
  };

  todoItems.push(todo);
  render(todo);
  persist(todoItems);

  // clear todo input value;
  textInput.value = "";
});

filterOption.addEventListener("change", (event) => {
  const todos = todoList.childNodes;
  const { value: filter } = event.target;
  todos.forEach((todo) => {
    const { style } = todo;
    const completed = todo.classList.contains("completed");
    switch (filter) {
      case "completed":
        style.display = completed ? "flex" : "none";
        break;
      case "outstanding":
        style.display = completed ? "none" : "flex";
        break;
      default:
        style.display = "flex";
        break;
    }
  });
});

changeUserButton.addEventListener("click", setUser);

document.addEventListener("DOMContentLoaded", setUser);
