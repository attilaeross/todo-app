/* eslint-disable no-param-reassign */

import {
  createButton,
  createCommandButton,
  createCompleteButton,
  createDeleteButton,
  createFilter,
  createForm,
  createHeader,
  createHeading,
  createInput,
  createTextElement,
  createTodoElement,
  createTodoList,
  // eslint-disable-next-line
} from "./elements.js";

export default function createApp(rootElement) {
  const userInput = createInput({
    placeholder: "Please enter username",
    className: "user-input",
  });
  rootElement.appendChild(userInput);

  // TODO: rename setUserBtn --> setUserButton
  const setUserBtn = createButton({
    className: "change-user",
    text: "Set User",
  });
  rootElement.appendChild(setUserBtn);

  const heading = createHeading({
    size: "h1",
    className: "header",
    text: "Todo App",
  });

  const header = createHeader();
  header.appendChild(heading);
  rootElement.appendChild(header);

  const form = createForm();

  const inputElement = createInput({
    placeholder: "Please enter todo here",
    className: "new-todo",
  });
  inputElement.disabled = true;
  form.appendChild(inputElement);

  const addButton = createButton({ className: "add", text: "Add" });
  addButton.disabled = true;
  form.appendChild(addButton);

  const selectElement = createFilter(["All", "Completed", "Outstanding"]);
  form.appendChild(selectElement);

  rootElement.appendChild(form);

  const listHeader = createHeading({
    size: "h2",
    className: "list-header",
    text: "",
  });
  rootElement.appendChild(listHeader);

  const todoList = createTodoList("todo-list");
  rootElement.appendChild(todoList);

  let todoItems = [];
  let userName;

  // TODO: extract all local storage related functions
  // TODO: pass in username as parameter
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
    const todoEl = createTodoElement(todoItem.id);

    const textElement = createTextElement(todoItem.text);
    todoEl.appendChild(textElement);

    // TODO: replace .toggle with .add
    if (todoItem.isComplete === true) {
      todoEl.classList.toggle("completed");
      textElement.classList.toggle("completed");
    }

    // TODO: pass in onClick handler rather than textElement and saveTodoItem
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

    const onDeleteButtonClick = () => {
      remove(todoItem);
      persist(todoItems);
      todoEl.remove();
    };

    const deleteButton = createDeleteButton(onDeleteButtonClick);
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

  const restoreUserTodos = () => {
    todoItems = getStoredTodos();
    removeAllTodoElements();
    renderAll(todoItems);
  };

  const setUser = () => {
    // TODO: move to setUserBtn event listener
    userName = document.querySelector("input.user-input").value;
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

  selectElement.addEventListener("change", (event) => {
    const todos = todoList.childNodes;
    const { value: filter } = event.target;
    // TODO: destructure style and classList in function argument
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

  setUserBtn.addEventListener("click", () => {
    setUser();
    listHeader.innerHTML = `Todo list for ${userName}`;
    addButton.disabled = false;
    inputElement.disabled = false;
    restoreUserTodos();
    document.querySelector("input.user-input").value = "";
  });

  // TODO: remove destroy
  const destroy = () => {
    document.removeEventListener("DOMContentLoaded", setUser);
  };

  return destroy;
}
