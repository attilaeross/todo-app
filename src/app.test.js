import { screen, getByText, queryByText } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import createApp from "./app";

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

  // act
  userEvent.type(input, "Take wife for a walk!");
  userEvent.click(addButton);

  // assert
  const todoList = screen.getByTestId("todo-list");
  expect(queryByText(todoList, "Take wife for a walk!")).toBeInTheDocument();
});

test("removes an item from todo List when user clicks Delete button", () => {
  // setup

  // act
  const todoList = screen.getByTestId("todo-list");
  const deleteButton = getByText(todoList, "Delete");
  userEvent.click(deleteButton);

  // assert
  expect(
    queryByText(todoList, "Take wife for a walk!")
  ).not.toBeInTheDocument();
});
