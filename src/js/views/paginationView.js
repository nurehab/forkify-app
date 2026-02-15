import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  // Publisher - Subscriber pattern :
  // publisher :
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      // Data Attributes :
      const { goToPage } = btn.dataset;
      // generate THE PUBLISHER :
      handler(+goToPage);
    });
  }
  _generateMarkup() {
    const currentPage = this._data.page;
    const numsOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage,
    );
    // page 1, and there are other pages
    if (currentPage === 1 && numsOfPages > 1) {
      return `
        <button data-go-to-page="${currentPage + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }
    // last page
    if (currentPage === numsOfPages && numsOfPages > 1) {
      return `
        <button data-go-to-page="${currentPage - 1}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
      `;
    }
    //other page
    if (currentPage < numsOfPages) {
      return `
        <button data-go-to-page="${currentPage - 1}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
        <button data-go-to-page="${currentPage + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }
    // page 1, and there are NO other pages
    return '';
  }
}

export default new PaginationView();
