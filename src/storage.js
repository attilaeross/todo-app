const storageKey = (userName) => `${userName}Todos`;

export const getStoredTodos = (userName) => {
  if (localStorage.getItem(storageKey(userName)) === null) {
    return [];
  }
  return JSON.parse(localStorage.getItem(storageKey(userName)));
};

export const persist = (todoItems, userName) => {
  localStorage.setItem(storageKey(userName), JSON.stringify(todoItems));
};
