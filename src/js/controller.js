import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

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
    console.log(resultsView);
    // 1- Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2- Load search results
    await model.loadSearchResults(query);
    // 3- Render results
    console.log(model.state.search.results);
    resultsView.render(model.state.search.results);
  } catch (err) {
    console.error(err);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchRecipe);
};
init();
// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
