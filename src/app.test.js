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
  const addButton = screen.getByText("Add");
  const inputText = "Take wife for a walk!";

  // act
  userEvent.type(input, inputText);
  userEvent.click(addButton);

  // assert
  const todoList = screen.getByTestId("todo-list");
  const todoTextElement = getByText(todoList, "Take wife for a walk!");
  expect(todoTextElement).toHaveTextContent(inputText);
});

test("should delete an item from todo List", () => {
  // setup
  const input = screen.getByPlaceholderText("Please enter todo here");
  const addButton = screen.getByText("Add");
  const inputText = "Todo to be deleted!";

  // act
  userEvent.type(input, inputText);
  userEvent.click(addButton);
  const todoList = screen.getByTestId("todo-list");
  const todoTextElement = getByText(todoList, "Todo to be deleted!");
  expect(todoList.childElementCount).toBe(2);

  const todoElement = todoTextElement.parentElement;
  const todoDeleteButton = getByText(todoElement, "Delete");
  userEvent.click(todoDeleteButton);

  // assert
  expect(todoList).not.toContainElement(todoElement);
  expect(todoList.childElementCount).toBe(1);
});
