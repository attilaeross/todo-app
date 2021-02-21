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

const logInUser = (userName) => {
  const userInput = screen.getByPlaceholderText("Please enter username");
  const setUserButton = screen.getByText("Set User");

  userEvent.type(userInput, userName);
  userEvent.click(setUserButton);
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
  const todoList = screen.getByTestId("todo-list");
  addTodo(todoList, "Take wife for a walk!");

  // assert
  expect(
    getByDisplayValue(todoList, "Take wife for a walk!")
  ).toBeInTheDocument();
});

test("removes an item from todo List when user clicks Delete button", () => {
  // setup
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

test("shows all todos by default", () => {
  // setup
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

test("shows completed todos when filter is set to Completed", () => {
  // setup
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

test("renders todo list for existing user", () => {
  // setup
  logInUser("Attila");
  const todoList = screen.getByTestId("todo-list");
  addTodo(todoList, "Take wife for a walk!", true);
  addTodo(todoList, "Take dog for a walk!");

  // local assertion
  expect(queryByDisplayValue(todoList, "Take wife for a walk!")).toBeVisible();
  expect(queryByDisplayValue(todoList, "Take dog for a walk!")).toBeVisible();

  // act
  logInUser("Adrian");

  // local assert
  expect(
    queryByDisplayValue(todoList, "Take wife for a walk!")
  ).not.toBeInTheDocument();
  expect(
    queryByDisplayValue(todoList, "Take dog for a walk!")
  ).not.toBeInTheDocument();

  logInUser("Attila");

  // assert
  expect(queryByDisplayValue(todoList, "Take wife for a walk!")).toBeVisible();
  expect(queryByDisplayValue(todoList, "Take dog for a walk!")).toBeVisible();
});
