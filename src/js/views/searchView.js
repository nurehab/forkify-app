class SearchView {
  _parentElement = document.querySelector('.search');
  getQuery() {
    // get search query
    const query = this._parentElement.querySelector('.search__field').value;
    // clear input field
    this._clearInput();
    // el note de?search=fElkorasea
    return query;
  }

  _clearInput() {
    return (this._parentElement.querySelector('.search__field').value = '');
  }
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
