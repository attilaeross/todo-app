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

const updateStoredTodos = (todos) => {
  localStorage.setItem(storageKey(), JSON.stringify(todos));
};

const changeTodoMarkLocalStorage = (todoElement) => {
  const todos = getStoredTodos();
  const todoText = todoElement.childNodes[0].innerText;
  const todoItem = todos.find(({ text }) => text === todoText);
  todoItem.isComplete = !todoItem.isComplete;
  updateStoredTodos(todos);
};

const removeStoredTodo = (todoElement) => {
  const todos = getStoredTodos();

  const todoText = todoElement.childNodes[0].innerText;
  // TODO extra mile: try removing the todo item using `.filter()`
  // this is to use a "functional programming" approach as opposed to mutation of the existing array
  todos.splice(todos.indexOf(todoText), 1);

  updateStoredTodos(todos);
};

const updateTodoItems = (newTodo) => {
  const { id } = newTodo;
  const todoItem = todoItems.find((todo) => todo.id === id);
  todoItem.text = newTodo.childNodes[0].innerHTML;
  todoItem.isComplete = newTodo.classList.contains("complete");
};

const addToList = (todo) => {
  // TODO consider splitting this into two steps:
  // - create new todo DOM structure
  // - add new todo to the DOM

  // prepare the structure
  const newTodo = document.createElement("li");
  newTodo.classList.add("todo-item");
  newTodo.setAttribute("id", todo.id);

  // TODO consider moving the creation of these DOM elements to separate functions
  // which takes necessary parameters and returns a DOM element which then you can use
  // to add to the DOM

  // creating elements needed
  const textElement = document.createElement("p");
  const completedButton = document.createElement("button");
  const editButton = document.createElement("button");
  const saveButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  // add text element
  textElement.classList.add("todo-text");
  textElement.innerHTML = todo.text;
  newTodo.appendChild(textElement);

  // add check mark button
  completedButton.innerHTML = "Mark";
  completedButton.classList.add("complete-button");
  completedButton.addEventListener("click", () => {
    newTodo.classList.toggle("complete");
    newTodo.isComplete = newTodo.classList.contains("complete");
    editButton.disabled = newTodo.classList.contains("complete");
    changeTodoMarkLocalStorage(newTodo);
  });

  if (todo.isComplete === true) {
    newTodo.classList.toggle("complete");
  }
  newTodo.appendChild(completedButton);

  // add edit button
  editButton.innerHTML = "Edit";
  editButton.classList.add("edit-button");
  editButton.addEventListener("click", () => {
    // oldTodoText = textElement.innerText;

    textElement.contentEditable = true;
    textElement.focus();
    editButton.style.display = "none";
    saveButton.style.display = "unset";
  });

  // add save button
  saveButton.innerHTML = "Save";
  saveButton.classList.add("save-button");
  saveButton.style.display = "none";
  saveButton.addEventListener("click", () => {
    // setting attributes
    textElement.contentEditable = false;
    editButton.style.display = "unset";
    saveButton.style.display = "none";
    updateTodoItems(newTodo);
    updateStoredTodos(todoItems);
  });

  newTodo.appendChild(saveButton);

  newTodo.appendChild(editButton);

  // add delete button
  deleteButton.innerHTML = "Delete";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => {
    removeStoredTodo(newTodo);
    newTodo.remove();
  });
  newTodo.appendChild(deleteButton);

  // append to the list
  todoList.appendChild(newTodo);
};

const loadSavedList = () => {
  while (todoList.firstChild) {
    todoList.removeChild(todoList.firstChild);
  }

  const todos = getStoredTodos(userKey);

  todos.forEach((todo) => {
    addToList(todo);
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

  const textInput = document.querySelector("input.new-todo");
  const todo = {
    text: textInput.value,
    isComplete: false,
    id: new Date(),
  };

  todoItems.push(todo);
  addToList(todo);
  updateStoredTodos(todoItems);

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
