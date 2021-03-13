import {
  screen,
  getByText,
  getByDisplayValue,
  queryByDisplayValue,
} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import createApp from "./app";

const setup = () => {
  const root = document.body;
  createApp(root);
};

const tearDown = () => {
  document.body.innerHTML = "";
  localStorage.clear();
};

beforeEach(() => {
  setup();
});

afterEach(() => {
  tearDown();
});

const addTodo = (todoList, text, completed) => {
  const input = screen.getByPlaceholderText("Please enter todo here");
  const addButton = screen.getByText("Add");

  userEvent.type(input, text);
  userEvent.click(addButton);

  if (completed === true) {
    const completeButton = getByText(todoList, "Mark");
    userEvent.click(completeButton);
  }
};

const setUser = (userName = "Attila") => {
  const userInput = screen.getByPlaceholderText("Please enter username");
  const setUserButton = screen.getByText("Set User");

  userEvent.type(userInput, userName);
  userEvent.click(setUserButton);
};

test("does not allow to enter / add new todo until user is not set", () => {
  // assert
  expect(screen.getByPlaceholderText("Please enter todo here")).toBeDisabled();
  expect(screen.getByText("Add")).toBeDisabled();
});

test("renders empty todo list when user logs in", () => {
  // setup
  // act
  setUser();
  const todoList = screen.getByTestId("todo-list");
  // assert
  expect(todoList).toBeEmptyDOMElement();
});

test("shows new item in todo list for user when added", () => {
  // act
  setUser();
  const todoList = screen.getByTestId("todo-list");
  addTodo(todoList, "Take wife for a walk!");

  // assert
  expect(
    getByDisplayValue(todoList, "Take wife for a walk!")
  ).toBeInTheDocument();
});

test("removes an item from todo list when user clicks Delete button", () => {
  // setup
  setUser();
  const todoList = screen.getByTestId("todo-list");
  addTodo(todoList, "Take wife for a walk!");

  // act
  const deleteButton = getByText(todoList, "Delete");
  userEvent.click(deleteButton);

  // assert
  expect(
    queryByDisplayValue(todoList, "Take wife for a walk!")
  ).not.toBeInTheDocument();
});

test("marks an item as completed when user clicks Complete button", () => {
  // setup
  setUser();
  const todoList = screen.getByTestId("todo-list");
  addTodo(todoList, "Take wife for a walk!");

  // act
  const completeButton = getByText(todoList, "Mark");
  userEvent.click(completeButton);

  // assert
  const textElement = getByDisplayValue(todoList, "Take wife for a walk!");
  expect(textElement).toHaveClass("completed");
});

test("allows user to edit todo item", () => {
  // setup
  setUser();
  const todoList = screen.getByTestId("todo-list");
  addTodo(todoList, "Take wife for a walk!");

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

test("shows all todos by default for user", () => {
  // setup
  setUser();
  const todoList = screen.getByTestId("todo-list");
  addTodo(todoList, "Take wife for a walk!");
  const completeButton = getByText(todoList, "Mark");
  userEvent.click(completeButton);
  addTodo(todoList, "Take dog for a walk!");

  // act

  // assert
  expect(screen.getByTestId("all").selected).toBe(true);
  expect(queryByDisplayValue(todoList, "Take wife for a walk!")).toBeVisible();
  expect(queryByDisplayValue(todoList, "Take dog for a walk!")).toBeVisible();
});

test("shows only completed todos when filter is set to Completed", () => {
  // setup
  setUser();
  const todoList = screen.getByTestId("todo-list");
  addTodo(todoList, "Take wife for a walk!");
  const completeButton = getByText(todoList, "Mark");
  userEvent.click(completeButton);
  addTodo(todoList, "Take dog for a walk!");

  // act
  userEvent.selectOptions(
    screen.getByTestId("select"),
    screen.getByText("Completed")
  );

  // assert
  expect(screen.getByTestId("completed").selected).toBe(true);

  expect(queryByDisplayValue(todoList, "Take wife for a walk!")).toBeVisible();
  expect(
    queryByDisplayValue(todoList, "Take dog for a walk!")
  ).not.toBeVisible();
});

test("shows outstanding todos when filter is set to Outstanding", () => {
  // setup
  setUser();
  const todoList = screen.getByTestId("todo-list");
  addTodo(todoList, "Take wife for a walk!", true);
  addTodo(todoList, "Take dog for a walk!");

  // act
  userEvent.selectOptions(
    screen.getByTestId("select"),
    screen.getByText("Outstanding")
  );

  // assert
  expect(screen.getByTestId("outstanding").selected).toBe(true);

  expect(
    queryByDisplayValue(todoList, "Take wife for a walk!")
  ).not.toBeVisible();
  expect(queryByDisplayValue(todoList, "Take dog for a walk!")).toBeVisible();
});

test("renders empty todo list when changing to a new user", () => {
  // setup
  setUser();
  const todoList = screen.getByTestId("todo-list");
  addTodo(todoList, "Take wife for a walk!", true);
  addTodo(todoList, "Take dog for a walk!");

  // act
  setUser("Marton");

  // assert
  expect(todoList).toBeEmptyDOMElement();
});

test("renders todo list for existing user", () => {
  // setup
  setUser("A");
  const todoList = screen.getByTestId("todo-list");
  addTodo(todoList, "Todo 1 for user A", true);
  addTodo(todoList, "Todo 2 for user A");

  // act
  setUser("B");
  expect(todoList).toBeEmptyDOMElement();

  setUser("A");

  // assert
  expect(queryByDisplayValue(todoList, "Todo 1 for user A")).toBeVisible();
  expect(queryByDisplayValue(todoList, "Todo 2 for user A")).toBeVisible();
});
