// Getting Elements - selectors

const addButton = document.querySelector("button.add");
const todoList = document.querySelector("ul.list");
const filterOption = document.querySelector("select.filter");
const changeUserButton = document.querySelector("button.change-user");
const listHeader = document.querySelector("h2.list-header");

// global variables
let userKey;
let todoItems = [];

// TODO we identify a todo item by its text prop, what happens if multiple todo items have the same text?
let oldTodoText;

// Functions

const storageKey = () => `${userKey}Todos`;

const getStoredTodos = () => {
  if (localStorage.getItem(storageKey()) === null) {
    return [];
  }
  return JSON.parse(localStorage.getItem(storageKey()));
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

  // Add Todo text element
  const textElement = document.createElement("p");
  textElement.classList.add("todo-text");
  textElement.innerHTML = todo.text;
  newTodo.appendChild(textElement);

  // check mark button
  const completedButton = document.createElement("button");
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

  // edit button
  const editButton = document.createElement("button");
  editButton.innerHTML = "Edit";
  editButton.classList.add("edit-button");

  // save button
  const saveButton = document.createElement("button");
  saveButton.innerHTML = "Save";
  saveButton.classList.add("save-button");
  saveButton.style.display = "none";
  newTodo.appendChild(saveButton);

  // TODO this can be turned into a simple assignment removing the conditional
  if (todo.isComplete === true) {
    editButton.disabled = true;
  }
  newTodo.appendChild(editButton);

  // delete button
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Delete";
  deleteButton.classList.add("delete-button");
  newTodo.appendChild(deleteButton);

  // append to the list
  todoList.appendChild(newTodo);
};

const loadSavedList = () => {
  // TODO: why do we need a `while` loop when we go through all the child nodes
  // of the `ul` with `forEach` and invoke `remove` on all of them?
  while (todoList.childElementCount > 0) {
    todoList.childNodes.forEach((node) => {
      node.remove();
    });
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

const updateStoredTodos = (todos) => {
  localStorage.setItem(storageKey(), JSON.stringify(todos));
};

// TODO the parameter `todo` is actually a DOM element, rename it to reflect that
const removeStoredTodo = (todo) => {
  const todos = getStoredTodos();

  const todoText = todo.childNodes[0].innerText;
  // TODO extra mile: try removing the todo item using `.filter()`
  // this is to use a "functional programming" approach as opposed to mutation of the existing array
  todos.splice(todos.indexOf(todoText), 1);

  updateStoredTodos(todos);
};

const changeTodoMarkLocalStorage = (todo) => {
  const todos = getStoredTodos();
  const todoText = todo.childNodes[0].innerText;
  // TODO we only intend to change the isComplete flag on a single todo item
  // how else could this be done?
  // is there another Array.prototype method we could use instead of .filter and .forEach?
  todos
    .filter(({ text }) => text === todoText)
    .forEach((t) => {
      // eslint-disable-next-line no-param-reassign
      t.isComplete = !t.isComplete;
    });

  updateStoredTodos(todos);
};

// TODO does this function need to run every time the todoList DOM element receives a click?
const updateTodoTextLocalStorage = (oldText, newText) => {
  const todos = getStoredTodos();
  // TODO use different Array.prototype method instead of .filter and .foreach
  todos
    .filter((todo) => todo.text === oldTodoText)
    .forEach((todo) => {
      // eslint-disable-next-line no-param-reassign
      todo.text = newText;
    });

  updateStoredTodos(todos);
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
todoList.addEventListener("click", (event) => {
  // TODO do we assume that in ALL cases when a descendant element of todoList receives a click
  // its parent will be 100% a todo DOM element?
  // what happens if we change the DOM structure
  const item = event.target;
  //item = document.querySelector(`#${event.target.parentElement.id}`)

  // getting the elements out what i need to manipulate in this function
  const todoElement = item.parentElement;
  const textElement = todoElement.childNodes[0];
  const saveButton = todoElement.childNodes[2];
  const editButton = todoElement.childNodes[3];

  // TODO all buttons should have their own click handlers, rather than one click handler
  // on the main todoList DOM element

  // set/mark Todo DONE / UNDONE
  // if (item.classList[0] === "complete-button") {
  //   todoElement.classList.toggle("complete");

  //   // TODO remove duplication, simplify steps
  //   if (todoElement.classList.contains("complete")) {
  //     todoElement.isComplete = true;
  //     editButton.disabled = true;
  //     changeTodoMarkLocalStorage(todoElement);
  //   } else {
  //     todoElement.isComplete = false;
  //     editButton.disabled = false;
  //     changeTodoMarkLocalStorage(todoElement);
  //   }
  // }

  // TODO which would be better? having a single button where we change its text Edit <-> Save
  // or two buttons which have their dedicated DOM element and their own functionality?

  // TODO it'd be better to have a CSS query collecting only the buttons
  // which are inside the todoList element, rather than all the buttons
  // in the whole of the document

  // EDIT
  if (item.classList[0] === "edit-button") {
    oldTodoText = textElement.innerText;

    textElement.contentEditable = true;
    textElement.focus();
    editButton.style.display = "none";
    saveButton.style.display = "unset";

    // disable all buttons (except Save) until user saves the todo text
    const buttons = document.getElementsByTagName("button");

    // TODO extract to function
    buttons.forEach((button) => {
      if (button.classList == "save-button") {
        // eslint-disable-next-line no-param-reassign
        button.disabled = true;
      }
    });
  }

  // SAVE
  if (item.classList[0] === "save-button") {
    //setting attributes
    textElement.contentEditable = false;
    editButton.style.display = "unset";
    saveButton.style.display = "none";

    const newTodoText = todoElement.innerText;

    // enable all buttons after user saved the todo text
    const buttons = document.getElementsByTagName("button");

    buttons.forEach((button) => {
      // eslint-disable-next-line no-param-reassign
      button.disabled = false;
    });
    updateTodoTextLocalStorage(oldTodoText, newTodoText);
  }

  // Delete Todo
  if (item.classList[0] === "delete-button") {
    removeStoredTodo(todoElement);
    todoElement.remove();
  }
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
