import { API_URL, RES_PER_PAGE } from './config.js';
import { getJson } from './helper.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};
export const loadRecipe = async function (id) {
  try {
    // const res = await fetch(
    //   `${API_URL}/${id}`,
    //   // 'https://forkify-api.jonas.io/api/v2/recipes/664c8f193e7aa067e94e856b',
    // );
    // const data = await res.json();
    const data = await getJson(`${API_URL}${id}`);
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err} 💥💥💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJson(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    let newQt = ing.quantity;
    newQt = (newQt * newServings) / state.recipe.servings;
    ing.quantity = newQt;
    // newQt = (oldQt * newServings) / oldServings // 2 * 8 / 4 = 4
  });
  state.recipe.servings = newServings;
};

// Storing the bookmarks in the local storage
export const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// Implement add bookmark :
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};
export const removeBookmark = function (id) {
  // Delete bookemark
  // i = index
  const i = state.bookmarks.findIndex(b => b.id === id);
  // splice (start, deleteCount) + bet3ml manipulate ll array
  // array.splice(start, deleteCount, item1, item2, ...) -- item1 = dol adding items (y3ni bet3ml add bardo)
  state.bookmarks.splice(i, 1);
  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
