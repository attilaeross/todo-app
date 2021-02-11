import {
  screen,
  getByText,
  getByDisplayValue,
  queryByDisplayValue,
} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import createApp from "./app";

let destroyApp;

const setup = () => {
  const root = document.body;
  destroyApp = createApp(root);
};

const tearDown = () => {
  document.body.innerHTML = "";
  destroyApp();
};

beforeEach(() => {
  setup();
});

afterEach(() => {
  tearDown();
});

const addTodo = (text) => {
  const input = screen.getByPlaceholderText("Please enter todo here");
  const addButton = screen.getByText("Add");

  // act
  userEvent.type(input, text);
  userEvent.click(addButton);
};

test("renders empty todo list when starts", () => {
  // setup
  const todoList = screen.getByTestId("todo-list");
  // act
  // assert
  expect(todoList).toBeEmptyDOMElement();
});

test("shows new item in todo list when added", () => {
  // act
  addTodo("Take wife for a walk!");

  // assert
  const todoList = screen.getByTestId("todo-list");
  expect(
    getByDisplayValue(todoList, "Take wife for a walk!")
  ).toBeInTheDocument();
});

test("removes an item from todo List when user clicks Delete button", () => {
  // setup
  addTodo("Take wife for a walk!");

  // act
  const todoList = screen.getByTestId("todo-list");
  const deleteButton = getByText(todoList, "Delete");
  userEvent.click(deleteButton);

  // assert
  expect(
    queryByDisplayValue(todoList, "Take wife for a walk!")
  ).not.toBeInTheDocument();
});

test("marks an item as completed when user clicks Complete button", () => {
  // setup
  addTodo("Take wife for a walk!");

  // act
  const todoList = screen.getByTestId("todo-list");
  const completeButton = getByText(todoList, "Mark");
  userEvent.click(completeButton);

  // assert
  const textElement = getByDisplayValue(todoList, "Take wife for a walk!");
  expect(textElement).toHaveClass("completed");
});

test("allows user to edit todo item", () => {
  // setup
  addTodo("Take wife for a walk!");
  const todoList = screen.getByTestId("todo-list");

  // act

  const editButton = getByText(todoList, "Edit");
  userEvent.click(editButton);

  const textElement = queryByDisplayValue(todoList, "Take wife for a walk!");
  textElement.setSelectionRange(0, textElement.value.length);
  userEvent.type(textElement, "Take dog for a walk!");

  const saveButton = getByText(todoList, "Save");
  userEvent.click(saveButton);

  // assert
  expect(
    queryByDisplayValue(todoList, "Take wife for a walk!")
  ).not.toBeInTheDocument();
  expect(
    queryByDisplayValue(todoList, "Take dog for a walk!")
  ).toBeInTheDocument();
});
