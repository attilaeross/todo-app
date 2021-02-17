/* eslint-disable no-param-reassign */

import {
  createButton,
  createCommandButton,
  createCompleteButton,
  createDeleteButton,
  createFilterElement,
  createForm,
  createHeader,
  createHeading,
  createInput,
  createTextElement,
  createTodoElement,
  createTodoList,
} from "./elements";

export default function createApp(rootElement) {
  const changeUserBtn = createButton("change-user", "Change User");
  rootElement.appendChild(changeUserBtn);

  const heading = createHeading({
    size: "h1",
    className: "header",
    text: "Todo App",
  });

  const header = createHeader();
  header.appendChild(heading);
  rootElement.appendChild(header);

  const form = createForm();

  const inputElement = createInput("Please enter todo here");
  form.appendChild(inputElement);

  const addButton = createButton({ className: "add", text: "Add" });
  form.appendChild(addButton);

  const selectOptions = ["All", "Completed", "Outstanding"];
  const filterOption = createFilterElement(selectOptions);
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
    const todoEl = createTodoElement(todoItem.id);

    const textElement = createTextElement(todoItem.text);
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
