/* eslint-disable no-param-reassign */

export const createBtn = (className, innerText) => {
  const button = document.createElement("button");
  button.classList.add(className);
  button.innerHTML = innerText;
  return button;
};

export const createHeading = (headingSize, className, innerText) => {
  const heading = document.createElement(headingSize);
  heading.classList.add(className);
  heading.innerHTML = innerText;
  return heading;
};

export const createHeader = () => {
  const header = document.createElement("header");
  const headingOne = createHeading("h1", "header", "Todo App");
  header.appendChild(headingOne);
  return header;
};

export const createForm = () => {
  const form = document.createElement("form");
  return form;
};

export const createInput = () => {
  const inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.classList.add("new-todo");
  inputElement.placeholder = "Please enter todo here";
  return inputElement;
};

export const createFilterElement = () => {
  const selectEl = document.createElement("select");
  selectEl.setAttribute("data-testid", "select");
  let option;
  const inputData = "All,Completed,Outstanding";
  inputData.split(",").forEach((item) => {
    option = document.createElement("option");
    option.value = item.toLowerCase();
    option.setAttribute("data-testid", item.toLowerCase());
    option.innerHTML = item;
    selectEl.appendChild(option);
  });
  return selectEl;
};

export const createTodoList = () => {
  const ulEl = document.createElement("ul");
  ulEl.classList.add("list");
  ulEl.setAttribute("data-testid", "todo-list");
  return ulEl;
};

export const createTodoEl = (id) => {
  const li = document.createElement("li");
  li.classList.add("todo");
  li.setAttribute("id", id);
  return li;
};

export const createTextEl = (text) => {
  const textEl = document.createElement("input");
  textEl.type = "text";
  textEl.disabled = true;
  textEl.classList.add("todo-text");
  textEl.value = text;
  return textEl;
};

export const createCompleteButton = (onClick) => {
  const button = document.createElement("button");
  button.innerHTML = "Mark";
  button.classList.add("complete");
  button.addEventListener("click", onClick);
  return button;
};

export const createCommandButton = (textEl, saveTodoItem) => {
  const button = document.createElement("button");
  button.innerHTML = "Edit";
  button.classList.add("edit");
  button.addEventListener("click", () => {
    if (button.innerHTML === "Edit") {
      textEl.disabled = false;
      textEl.focus();
      button.innerHTML = "Save";
      button.classList.remove("edit");
      button.classList.add("save");
    } else {
      textEl.disabled = true;
      saveTodoItem();
      button.innerHTML = "Edit";
      button.classList.remove("save");
      button.classList.add("edit");
    }
  });
  return button;
};

export const createDeleteButton = (todoEl, removeTodoItem) => {
  const button = document.createElement("button");
  button.innerHTML = "Delete";
  button.classList.add("delete");
  button.addEventListener("click", () => {
    removeTodoItem();
    todoEl.remove();
  });
  return button;
};
