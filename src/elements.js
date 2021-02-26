/* eslint-disable no-param-reassign */

export const createButton = ({ className, text }) => {
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

export const createHeader = () => document.createElement("header");

export const createForm = () => document.createElement("form");

export const createInput = ({ placeholder, className }) => {
  const el = document.createElement("input");
  el.type = "text";
  el.classList.add(className);
  el.placeholder = placeholder;
  return el;
};
const createOptionElement = (option) => {
  const el = document.createElement("option");
  el.value = option.toLowerCase();
  el.setAttribute("data-testid", el.value);
  el.innerHTML = option;
  return el;
};

export const createFilter = (options) => {
  const select = document.createElement("select");
  select.setAttribute("data-testid", "select");
  options.map(createOptionElement).forEach((option) => {
    select.appendChild(option);
  });

  return select;
};

export const createTodoList = (id) => {
  const el = document.createElement("ul");
  el.classList.add("list");
  el.setAttribute("data-testid", id);
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

export const createCompleteButton = (onClick) => {
  const el = createButton({ className: "complete", text: "Mark" });
  el.addEventListener("click", onClick);
  return el;
};

// TODO: extract event listener
export const createCommandButton = (textEl, saveTodoItem) => {
  const button = createButton({ className: "edit", text: "Edit" });
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

export const createDeleteButton = (onClick) => {
  const el = createButton({ className: "delete", text: "Delete" });
  el.addEventListener("click", onClick);
  return el;
};
