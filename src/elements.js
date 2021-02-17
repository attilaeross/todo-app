/* eslint-disable no-param-reassign */

export const createButton = (className, text) => {
  const el = document.createElement("button");
  el.classList.add(className);
  el.innerHTML = text;
  return el;
};

export const createHeading = ({ size, className, text }) => {
  const el = document.createElement(size);
  el.classList.add(className);
  el.innerHTML = text;
  return el;
};

export const createHeader = () => {
  const el = document.createElement("header");
  return el;
};

export const createForm = () => document.createElement("form");

export const createInput = (placeholderText) => {
  const el = document.createElement("input");
  el.type = "text";
  el.classList.add("new-todo");
  el.placeholder = placeholderText;
  return el;
};
/**
 * rename input data to something more meaningful
 * input data - array
 * create options using map instead of foreach: input data --> option element
 * add options to select
 * remove duplication - toLowerCase();
 */
export const createFilterElement = () => {
  const select = document.createElement("select");
  select.setAttribute("data-testid", "select");
  // TODO: extract input Data - pass it as parameter
  const inputData = "All,Completed,Outstanding";
  inputData.split(",").forEach((item) => {
    const option = document.createElement("option");
    option.value = item.toLowerCase();
    option.setAttribute("data-testid", item.toLowerCase());
    option.innerHTML = item;
    select.appendChild(option);
  });
  return select;
};

// data-testid to be function argument
export const createTodoList = () => {
  const el = document.createElement("ul");
  el.classList.add("list");
  el.setAttribute("data-testid", "todo-list");
  return el;
};

export const createTodoElement = (id) => {
  const el = document.createElement("li");
  el.classList.add("todo");
  el.setAttribute("id", id);
  return el;
};

export const createTextElement = (text) => {
  const el = document.createElement("input");
  el.type = "text";
  el.disabled = true;
  el.classList.add("todo-text");
  el.value = text;
  return el;
};

// name to be a function argument
// consider using createButton to remove duplication
export const createCompleteButton = (onClick) => {
  const el = document.createElement("button");
  el.innerHTML = "Mark";
  el.classList.add("complete");
  el.addEventListener("click", onClick);
  return el;
};

// consider using createButton to remove duplication
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

// consider using createButton to remove duplication
export const createDeleteButton = (todoEl, removeTodoItem) => {
  const el = document.createElement("button");
  el.innerHTML = "Delete";
  el.classList.add("delete");
  el.addEventListener("click", () => {
    removeTodoItem();
    todoEl.remove();
  });
  return el;
};
