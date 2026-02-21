import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJson, sendJson } from './helper.js';
import { AjaxCall } from './helper.js';
// DB :
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

// Refactor :
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // trick about conditionally to add property (by using [spread operator ... , and operator &&]) :
    ...(recipe.key && { key: recipe.key }),
  };
};

// load Recipe :
export const loadRecipe = async function (id) {
  try {
    // const res = await fetch(
    //   `${API_URL}/${id}`,
    //   // 'https://forkify-api.jonas.io/api/v2/recipes/664c8f193e7aa067e94e856b',
    // );
    // const data = await res.json();
    const data = await AjaxCall(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err} 💥💥💥💥💥`);
    throw err;
  }
};

// Load Search Results :
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AjaxCall(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥💥`);
    throw err;
  }
};

// Get Search Results Page (PAGINATION) :
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

// Update Servings (+ / -) :
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    let newQt = ing.quantity;
    newQt = (newQt * newServings) / state.recipe.servings;
    ing.quantity = newQt;
    // newQt = (oldQt * newServings) / oldServings // 2 * 8 / 4 = 4
  });
  state.recipe.servings = newServings;
};

// Storing the bookmarks in the local storage :
export const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// Implement add bookmark :
export const addBookmark = function (recipe) {
  // Add bookmark to bookamarks array in db :
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked :
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  // then store :
  persistBookmarks();
};

// Remove Bookmark from db and view :
export const removeBookmark = function (id) {
  // Delete bookemark :
  // i = index
  const i = state.bookmarks.findIndex(b => b.id === id);
  // splice (start, deleteCount) + bet3ml manipulate ll array
  // array.splice(start, deleteCount, item1, item2, ...) -- item1 = dol adding items (y3ni bet3ml add bardo)
  state.bookmarks.splice(i, 1);
  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  // then store 3la akher wad3 :
  persistBookmarks();
};

// da 3shan yegeb ely metkhzn :
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

// Upload Recipe
export const uploadRecipe = async function (newRecipe) {
  try {
    // convert mn Object l Array
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        // Destruching ll fields
        const [quantity, unit, description] = ingArr;
        // some condition about array length :
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format .',
          );
        if (!description)
          throw new Error('Description is required for each ingredient!');
        // yerg3lna objetc f el array :
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // el data ely hatro7 ll API :
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      ingredients,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
    };
    // Post data to API :
    const data = await AjaxCall(`${API_URL}?key=${KEY}`, recipe);
    // el recipe ely 3mlnlha upload 3shan tero7 ll db :
    state.recipe = createRecipeObject(data);

    // lw 3mlt bookmark l recipe hya el f API already msh enta ely 3amlha (msh hayb2a feha key l2na built-in asln f el API) f el object haytkhzn 3ady
    // LAKEN -- lw 3mlt bookmark l recipe enta ely 3amlha (upload - post : y3ni leha --key-- ) =>
    // lazm el object ely haytkhzn f el bookmarks yekon shayel el --key-- da m3ah
    // LEH ? 3shan lama tegy teft7 el bookmarks b3d kda w tedos 3la el recipe beta3tk el app yeftkre en de recipe SPECIAL -- ana ely 3amlha -- w yezhr el USER ICON ganbha
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
