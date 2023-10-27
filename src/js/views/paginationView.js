import View from './View.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');


  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function(e) {
      const button = e.target.closest('.btn--inline');
      if (!button) return;
      const goToPage = +button.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPage = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    // page 1, and there are other pages
    if (curPage === 1 && numPage > 1) {
      return this._btn_next(curPage);
    }

    // Last page
    if (curPage === numPage && numPage > 1) {
      return this._btn_prev(curPage);
    }
    // Other page
    if (curPage < numPage) {
      return this._btn_prev(curPage) + this._btn_next(curPage);
    }
    // page 1, and there are No other pages
    return '';
  }

  _btn_prev(curPage) {
    return `<button data-goto='${curPage - 1}' class='btn--inline pagination__btn--prev'>
        <svg class='search__icon'>
          <use href='${icons}#icon-arrow-left'></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>`;
  }

  _btn_next(curPage) {
    return `<button data-goto='${curPage + 1}' class='btn--inline pagination__btn--next'>
        <span>Page ${curPage + 1}</span>
        <svg class='search__icon'>
          <use href='${icons}#icon-arrow-right'></use>
        </svg>
      </button>`;
  }
}

export default new PaginationView();