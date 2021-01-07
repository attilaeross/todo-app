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
  const todoEl = document.createElement("li");
  todoEl.classList.add("todo");
  todoEl.setAttribute("id", id);
  return todoEl;
};

const createTextEl = (text) => {
  const textElement = document.createElement("p");
  textElement.classList.add("todo-text");
  textElement.innerHTML = text;
  return textElement;
};

const createCompleteButton = (todoItem, todoEl, editButton) => {
  const button = document.createElement("button");
  button.innerHTML = "Mark";
  button.classList.add("complete");
  button.addEventListener("click", () => {
    todoEl.classList.toggle("completed");
    editButton.disabled = todoEl.classList.contains("completed");

    update(todoItem, todoEl);
    persist(todoItems);
  });
  return button;
};

const createCommandButton = (textEl, todoItem, todoEl) => {
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
      update(todoItem, todoEl);
      persist(todoItems);
      button.innerHTML = "Edit";
      button.classList.remove("save");
      button.classList.add("edit");
    }
  });
  return button;
};

const createDeleteButton = (todoItem, todoEl) => {
  const button = document.createElement("button");
  button.innerHTML = "Delete";
  button.classList.add("delete");
  button.addEventListener("click", () => {
    remove(todoItem);
    persist(todoItems);
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

  const editButton = createCommandButton(textElement, todoItem, todoEl);
  todoEl.appendChild(editButton);

  const completeButton = createCompleteButton(todoItem, todoEl, editButton);
  todoEl.appendChild(completeButton);

  const deleteButton = createDeleteButton(todoItem, todoEl);
  todoEl.appendChild(deleteButton);

  todoList.appendChild(todoEl);
};

const loadSavedList = () => {
  while (todoList.firstChild) {
    todoList.removeChild(todoList.firstChild);
  }

  const todos = getStoredTodos(userName);

  todos.forEach((todo) => {
    render(todo);
    todoItems.push(todo);
  });
};

const setUser = () => {
  // eslint-disable-next-line no-alert
  const input = prompt("Please enter your name...Single name please...for now");
  if (!input) {
    setUser();
  } else {
    todoItems = [];
    userName = input.toLowerCase().trim();
    loadSavedList();
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

// TODO todo elements have their display CSS attr set to flex in the stylesheet
// could we hide/show them by adding a style attr display and remove it
// rather than adding an extra `display: flex`?
filterOption.addEventListener("change", (event) => {
  const todos = todoList.childNodes;
  todos.forEach((todo) => {
    const { style } = todo;
    switch (event.target.value) {
      case "completed":
        if (todo.classList.contains("completed")) {
          style.display = "flex";
        } else {
          style.display = "none";
        }
        break;
      case "outstanding":
        if (!todo.classList.contains("completed")) {
          style.display = "flex";
        } else {
          style.display = "none";
        }
        break;
      default:
        style.display = "flex";
        break;
    }
  });
});

changeUserButton.addEventListener("click", setUser);

document.addEventListener("DOMContentLoaded", setUser);
