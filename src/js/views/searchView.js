class searchView {
  #parentEl = document.querySelector('.search');
  getQuery() {
    // get search query
    const query = this.#parentEl.querySelector('.search__field').value;
    // clear input field
    this.#clearInput();
    // el note de?search=fElkorasea
    return query;
  }

  #clearInput() {
    return (this.#parentEl.querySelector('.search__field').value = '');
  }
  addHandlerSearch(handler) {
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new searchView();
