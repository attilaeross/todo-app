import { screen, getByText, queryByText } from "@testing-library/dom";
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
  expect(queryByText(todoList, "Take wife for a walk!")).toBeInTheDocument();
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
    queryByText(todoList, "Take wife for a walk!")
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
  const textElement = queryByText(todoList, "Take wife for a walk!");
  expect(textElement).toHaveClass("completed");
});

/**
 * - add new todo
 * - find edit button
 * - click edit button
 * - edit text of todo
 * - click save button
 * - result : new todo in list / old not present
 * - save button disappears / edit button shows
 */
test.todo("allows user to edit todo item");
