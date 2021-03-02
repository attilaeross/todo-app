/* eslint-disable no-param-reassign */
import { storageKey, getStoredTodos } from "./storage";

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
} from "./elements";

export default function createApp(rootElement) {
  const userInput = createInput({
    placeholder: "Please enter username",
    className: "user-input",
  });
  rootElement.appendChild(userInput);

  const setUserButton = createButton({
    className: "change-user",
    text: "Set User",
  });
  rootElement.appendChild(setUserButton);

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

  const persist = (todoItem) => {
    localStorage.setItem(storageKey(userName), JSON.stringify(todoItem));
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

    if (todoItem.isComplete === true) {
      todoEl.classList.add("completed");
      textElement.classList.add("completed");
    }

    const saveTodoItem = () => {
      update(todoItem, todoEl);
      persist(todoItems);
    };

    const onCommandButtonClick = (event) => {
      const button = event.target;
      if (button.innerHTML === "Edit") {
        textElement.disabled = false;
        textElement.focus();
        button.innerHTML = "Save";
        button.classList.remove("edit");
        button.classList.add("save");
      } else {
        textElement.disabled = true;
        saveTodoItem();
        button.innerHTML = "Edit";
        button.classList.remove("save");
        button.classList.add("edit");
      }
    };

    const editButton = createCommandButton(onCommandButtonClick);
    todoEl.appendChild(editButton);

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
    todoItems = getStoredTodos(userName);
    removeAllTodoElements();
    renderAll(todoItems);
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
    todos.forEach(({ style, classList }) => {
      const completed = classList.contains("completed");
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

  setUserButton.addEventListener("click", () => {
    userName = document.querySelector("input.user-input").value;
    listHeader.innerHTML = `Todo list for ${userName}`;
    addButton.disabled = false;
    inputElement.disabled = false;
    restoreUserTodos();
    document.querySelector("input.user-input").value = "";
  });
}
