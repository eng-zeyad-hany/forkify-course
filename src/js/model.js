import { API_URL, KEY, RES_PER_PAGE } from './config.js';
import { AJAX }from './helpers.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE
  },
  bookmarks: []

};

const createRecipeObject = function(data) {
  let { recipe } = data.data;
  return  {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && {key: recipe.key})
  };
}

export const loadRecipe = async function(id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data)
    state.recipe.bookmarked = state.bookmarks.some(bookmark => bookmark.id === id);
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function(query) {
  try {

    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(res => {
      return {
        id: res.id,
        title: res.title,
        publisher: res.publisher,
        image: res.image_url,
        ...(res.key && {key: res.key}),
      };
    });
    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

export const getSearchResultPage = function(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage; // 9 because the slice is end with (end - 1)
  return state.search.results.slice(start, end);
};

export const updateServings = function(newServing) {
  state.recipe.ingredients.forEach(
    ing => {
      // update the old serving with the new serving
      ing.quantity = ing.quantity * newServing / state.recipe.servings;
    }
  );
  state.recipe.servings = newServing;
};
const persistBookmark = function() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function(recipe) {
  //add Bookmark
  state.bookmarks.push(recipe);
  //mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmark();
};

export const deleteBookmark = function(id) {
  // remove the bookmark
  const index = state.bookmarks.findIndex(bookmarksArray => bookmarksArray.id === id);
  state.bookmarks.splice(index, 1);
  if (state.recipe.id === id) {
    state.recipe.bookmarked = false;
  }
  persistBookmark();
};


const init = function() {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
export const uploadRecipe = async function(newRecipe) {
  try{
    const ingredients = Object.entries(newRecipe).filter(entry =>
      entry[0].startsWith('ingredient') && entry[1] !== ''
    ).map(ing => {
      const ingArr = ing[1].replaceAll(' ', '').split(',');
      const [quantity, unit,description] = ingArr;
      if (ingArr.length !== 3) {
        throw new Error("wrong ingredient format please use correct format quantity,unit,description");
      }
      return {quantity: quantity ? +quantity : null,unit,description};
    });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data)
    addBookmark(state.recipe)
  }catch (error) {
    throw error;
  }
};

// delete the bookmarks from localStorage
// const clearBookmarks = function() {
//   localStorage.clear('bookmarks');
// }



