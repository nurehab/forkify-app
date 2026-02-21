import * as model from './model.js';
import { CLOSE_WINDOW_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

// Publisher - Subscriber pattern :
// Subscriber :
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();
    // 0) Update results view to MARKHILIGHT selected search result ;)
    resultsView.update(model.getSearchResultsPage());
    // 1) Update the bookmarks view
    bookmarksView.update(model.state.bookmarks);
    // 2) loading recipe
    await model.loadRecipe(id);
    // 3) rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // alert(err);
    // console.error(err);
    recipeView.renderError();
  }
};

// Publisher - Subscriber pattern :
// Subscriber :
const controlSearchRecipe = async function () {
  try {
    resultsView.renderSpinner();
    // 1- Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2- Load search results
    await model.loadSearchResults(query);
    // 3- Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    // 4- render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};
// Publisher - Subscriber pattern :
// Subscriber :
const controlPagination = function (goToPage) {
  // 1- Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2- render NEW pagination buttons
  paginationView.render(model.state.search);
};

// Publisher - Subscriber pattern :
// Subscriber :
// update servings:
const controlServings = function (n) {
  // update the number of recipe servings (in state y3ni gowa el model)
  model.updateServings(n);
  // update the recipe view (view bardo)
  // recipeView.render(model.state.recipe);
  // update text + attributes HTML without re render the entire view
  recipeView.update(model.state.recipe);
};

// Publisher - Subscriber pattern :
// Subscriber :
const controlAddBookmark = function () {
  // 1- Add || Remove -- Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  // 2- Update recipe view
  recipeView.update(model.state.recipe);

  // 3- Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// Publisher - Subscriber pattern :
// Subscriber :
const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Uplaod new Recipe :
const controlAddRecipe = async function (newRecipe) {
  try {
    // Display loading spinner :
    addRecipeView.renderSpinner();

    // Upload the new Recipe :
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render Recipe :
    recipeView.render(model.state.recipe);

    // Success Message :
    addRecipeView.renderMessage();

    // Render Bookmark view :
    bookmarksView.render(model.state.bookmarks);

    // Change id in the URL :
    window.history.pushState(null, '', `${model.state.recipe.id}`);
    // Automaically going back to the last page :
    // window.history.back()

    // Closing Window :
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, CLOSE_WINDOW_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchRecipe);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerBookmark(controlBookmark);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
