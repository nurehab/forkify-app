import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 1) loading recipe
    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);

    // 2) rendering recipe
  } catch (err) {
    // alert(err);
    // console.error(err);
    recipeView.renderError();
  }
};

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
    resultsView.render(model.getSearchResultsPage(2));
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

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchRecipe);
  paginationView.addHandlerClick(controlPagination);
};
init();
// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
