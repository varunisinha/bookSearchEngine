export const getSavedBookBasedOnIds = () => {
  const save_book_Id = localStorage.getItem('savedBooks')
    ? JSON.parse(localStorage.getItem('savedBooks'))
    : [];

  return save_book_Id;
};

export const saveBookBasedOnIds = (bookIdArr) => {
  if (bookIdArr.length) {
    localStorage.setItem('savedBooks', JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem('savedBooks');
  }
};

export const deleteBookBasedOnId = (bookId) => {
  const save_book_Id = localStorage.getItem('savedBooks')
    ? JSON.parse(localStorage.getItem('savedBooks'))
    : null;

  if (!save_book_Id) {
    return false;
  }

  const updatedsavedBookBasedOnId = save_book_Id?.filter((savedBookId) => savedBookId !== bookId);
  localStorage.setItem('savedBooks', JSON.stringify(updatedsavedBookBasedOnId));

  return true;
};
