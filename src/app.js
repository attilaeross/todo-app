/* eslint-disable no-param-reassign */
// Getting Elements - selectors

import {
  createBtn,
  createCommandButton,
  createCompleteButton,
  createDeleteButton,
  createFilterElement,
  createForm,
  createHeader,
  createHeading,
  createInput,
  createTextEl,
  createTodoEl,
  createTodoList,
} from "./elements";

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
  const changeUserBtn = createBtn("change-user", "Change User");
  rootElement.appendChild(changeUserBtn);

  const header = createHeader();
  rootElement.appendChild(header);

  const form = createForm();

  const inputElement = createInput();
  form.appendChild(inputElement);

  const addButton = createBtn("add", "Add");
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
    todoItem.text = todoEl.childNodes[0].value;
    todoItem.isComplete = todoEl.classList.contains("completed");
  };

  const render = (todoItem) => {
    const todoEl = createTodoEl(todoItem.id);

    const textElement = createTextEl(todoItem.text);
    todoEl.appendChild(textElement);

    if (todoItem.isComplete === true) {
      todoEl.classList.toggle("completed");
      textElement.classList.toggle("completed");
    }

    const editButton = createCommandButton(textElement, () => {
      update(todoItem, todoEl);
      persist(todoItems);
    });
    todoEl.appendChild(editButton);

    const saveTodoItem = () => {
      update(todoItem, todoEl);
      persist(todoItems);
    };

    const onCompleteButtonClick = () => {
      todoEl.classList.toggle("completed");
      textElement.classList.toggle("completed");
      editButton.disabled = todoEl.classList.contains("completed");
      saveTodoItem();
    };

    const completeButton = createCompleteButton(onCompleteButtonClick);
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

  const destroy = () => {
    document.removeEventListener("DOMContentLoaded", setUser);
  };

  return destroy;
}
