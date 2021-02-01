import { screen, getByText } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import createApp from "./app";
// import userEvent from "@testing-library/user-event";

test("renders empty todo list when starts", () => {
  // setup
  const root = document.body;
  createApp(root);
  const todoList = screen.getByTestId("todo-list");
  // act
  // assert
  expect(todoList).toBeEmptyDOMElement();
});

test("shows new item in todo list when added", () => {
  // setup
  const input = screen.getByPlaceholderText("Please enter todo here");
  const addButton = screen.getByTestId("add-button");
  const inputText = "Take wife for a walk!";

  // act
  input.value = inputText;
  userEvent.click(addButton);
  // fireEvent.click(addButton);

  // assert
  const todoList = screen.getByTestId("todo-list");
  const todoTextElement = getByText(todoList, "Take wife for a walk!");
  expect(todoTextElement).toHaveTextContent(inputText);
});
