import { screen } from "@testing-library/dom";
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
