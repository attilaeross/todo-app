/* eslint-disable no-param-reassign */
// Getting Elements - selectors

/**
 * TODO:
 * - create all elements dynamically from JS
 * - leave only a single <div id="root"/> in html
 * - wrap all the functionality in this module in a single function e.g. "createApp(root)"
 * - add a new dev.js module where we can use the new `createApp()` function
 * - call `createApp()` with the root DOM node
 *
 * In the test file we will be able to import the same `createApp()` function
 * to create our application then find elements and interact with it.
 * */

export default function createApp(rootElement) {
  const createBtn = (className, innerText) => {
    const button = document.createElement("button");
    button.classList.add(className);
    button.innerHTML = innerText;
    return button;
  };

  const createHeading = (headingSize, className, innerText) => {
    const heading = document.createElement(headingSize);
    heading.classList.add(className);
    heading.innerHTML = innerText;
    return heading;
  };

  const createHeader = () => {
    const header = document.createElement("header");
    const headingOne = createHeading("h1", "header", "Todo App");
    header.appendChild(headingOne);
    return header;
  };

  const createForm = () => {
    const form = document.createElement("form");
    return form;
  };

  const createInput = () => {
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.classList.add("new-todo");
    inputElement.placeholder = "Please enter todo here";
    return inputElement;
  };

  const createFilterElement = () => {
    const selectEl = document.createElement("select");
    let option;
    const inputData = "All,completed,Outstanding";
    inputData.split(",").forEach((item) => {
      option = document.createElement("option");
      option.value = item.toLowerCase();
      option.innerHTML = item;
      selectEl.appendChild(option);
    });
    return selectEl;
  };

  const createTodoList = () => {
    const ulEl = document.createElement("ul");
    ulEl.classList.add("list");
    ulEl.setAttribute("data-testid", "todo-list");
    return ulEl;
  };

  const changeUserBtn = createBtn("change-user", "Change User");
  rootElement.appendChild(changeUserBtn);

  const header = createHeader();
  rootElement.appendChild(header);

  const form = createForm();

  const inputElement = createInput();
  form.appendChild(inputElement);

  const addButton = createBtn("add", "Add");
  addButton.setAttribute("data-testid", "add-button");
  form.appendChild(addButton);

  const filterOption = createFilterElement();
  form.appendChild(filterOption);

  rootElement.appendChild(form);

  const listHeader = createHeading("h2", "list-header", "To Do List for");
  rootElement.appendChild(listHeader);

  const todoList = createTodoList();
  rootElement.appendChild(todoList);

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
    p.setAttribute("data-testid", "text-element");
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

  changeUserBtn.addEventListener("click", setUser);

  document.addEventListener("DOMContentLoaded", setUser);
}
