/* eslint-disable no-param-reassign */
// Getting Elements - selectors

const addButton = document.querySelector("button.add");
const todoList = document.querySelector("ul.list");
const filterOption = document.querySelector("select.filter");
const changeUserButton = document.querySelector("button.change-user");
const listHeader = document.querySelector("h2.list-header");

// global variables
let userKey;
let todoItems = [];

// Functions

const storageKey = () => `${userKey}Todos`;

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
  todoItem.isComplete = todoEl.classList.contains("complete");
};

const createTodoEl = (id) => {
  const todoEl = document.createElement("li");
  todoEl.classList.add("todo-item");
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
  const completeButton = document.createElement("button");
  completeButton.innerHTML = "Mark";
  completeButton.classList.add("complete-button");
  completeButton.addEventListener("click", () => {
    todoEl.classList.toggle("complete");
    editButton.disabled = todoEl.classList.contains("complete");

    update(todoItem, todoEl);
    persist(todoItems);
  });
  return completeButton;
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
};

const render = (todoItem) => {
  const todoEl = createTodoEl(todoItem.id);

  if (todoItem.isComplete === true) {
    todoEl.classList.toggle("complete");
  }

  const textElement = createTextEl(todoItem.text);
  todoEl.appendChild(textElement);

  const editButton = createCommandButton(textElement, todoItem, todoEl);
  todoEl.appendChild(editButton);

  const completeButton = createCompleteButton(todoItem, todoEl, editButton);
  todoEl.appendChild(completeButton);

  const deleteButton = createDeleteButton(todoItem, todoEl);
  todoEl.appendChild(deleteButton);

  // append to the list
  todoList.appendChild(todoEl);
};

const loadSavedList = () => {
  while (todoList.firstChild) {
    todoList.removeChild(todoList.firstChild);
  }

  const todos = getStoredTodos(userKey);

  todos.forEach((todo) => {
    render(todo);
    todoItems.push(todo);
  });
};

const setUser = () => {
  // eslint-disable-next-line no-alert
  const userName = prompt(
    "Please enter your name...Single name please...for now"
  );
  if (!userName) {
    setUser();
  } else {
    todoItems = [];
    userKey = userName.toLowerCase().trim();
    loadSavedList();
    listHeader.innerHTML = `Todo list for ${userName}`;
  }
};

addButton.addEventListener("click", (event) => {
  event.preventDefault();

  const textInput = document.querySelector("input.todo");
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

// TODO learn how Event Bubbling works in browsers
todoList.addEventListener("click", () => {
  // TODO do we assume that in ALL cases when a descendant element of todoList receives a click
  // its parent will be 100% a todo DOM element?
  // what happens if we change the DOM structure
  // TODO all buttons should have their own click handlers, rather than one click handler
  // on the main todoList DOM element
  // TODO which would be better? having a single button where we change its text Edit <-> Save
  // or two buttons which have their dedicated DOM element and their own functionality?
  // TODO it'd be better to have a CSS query collecting only the buttons
  // which are inside the todoList element, rather than all the buttons
  // in the whole of the document
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
        if (todo.classList.contains("complete")) {
          style.display = "flex";
        } else {
          style.display = "none";
        }
        break;
      case "outstanding":
        if (!todo.classList.contains("complete")) {
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

document.addEventListener("DOMContentLoaded", setUser);
changeUserButton.addEventListener("click", setUser);
