import * as model from './model.js';
import recipeView from './views/recipeView.js'; // in this import Class => object
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import paginationView from './views/paginationView.js';
import { MODEL_CLOSE_SEC } from './config.js';
// ====
import 'core-js/stable'; // polyfilling everything else
import 'regenerator-runtime/runtime.js';

// https://forkify-api.herokuapp.com/v2

/*if (module.hot) {
  module.hot.accept();
}*/


const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // use the object to retrieve the data
    bookmarksView.update(model.state.bookmarks);

    recipeView.renderSpinner();
    // Update the search results
    resultsView.update(model.getSearchResultPage());
    // load bookmarks from local storage or api
    //============================
    await model.loadRecipe(id);
    //============================
    // 2) rendering recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function() {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);
    // 3) render the search results in List

    resultsView.render(model.getSearchResultPage());
    // 4) render the pagination buttons
    paginationView.render(model.state.search);

  } catch (error) {
    resultsView.renderError(error);
  }
};

const controlPagination = function(goToPage) {
  // 3) render the search results in List
  resultsView.render(model.getSearchResultPage(goToPage));
  // 4) render the pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function(newServings) {
  model.updateServings(newServings);
  // 2) rendering recipe
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function() {
  // control to add/remove the bookmarked recipe
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  bookmarksView.render(model.state.bookmarks);
  // update the view after add it to bookmarked to change the icons

  recipeView.update(model.state.recipe);
};
const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
  try{
    // render the spinner of the loading recipe while git it from api
    addRecipeView.renderSpinner()
    // upload the recipe to the fork-ify api
    await model.uploadRecipe(newRecipe);
    // render recipe
    recipeView.render(model.state.recipe);
    // render the message of success
    addRecipeView.renderMessage();
    // render the bookmark in the bookmark list
    bookmarksView.render(model.state.bookmarks)
    // but correct id in the url using history API
    window.history.pushState(null,'',`#${model.state.recipe.id}`);


    // close window after 2.5 sec
    setTimeout(function() {
      addRecipeView._toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);

  }catch (error) {
    addRecipeView.renderError(error);
  }
}

const newFeature = function() {
  console.log("hello world");
}
const init = function() {
  //In a pub-sub system,
  //publishers are responsible for creating and sending messages,
  //while subscribers register their interest
  // in receiving messages on a particular topic or channel.

  // controlRecipes function is subscriber function that wants to react
  // addHandlerRender function is publisher function that knows when to react
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};

init();