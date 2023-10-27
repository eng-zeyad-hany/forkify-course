import icons from 'url:../../img/icons.svg'; // parcel 2 add the url: to any type of asset
export default class View {
  _data;
  /*
  * Render received object to the dom
  * @param {Object | Object[]} data The data to render (e.g recipe)
  * @param {boolean} [render=true] If false, create markup string instead of rendering to the dom
  * @returns {undefined | string} A markup string if render is true, undefined if render is false
  * @this {Object} View instance
  * @author myName
  * @todo Finish implementation
   */
  render(data,render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // Update Changed TEXT
      if (!newEl.isEqualNode(curEl)
        && newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Update Changed Attribute
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(
          attr => curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    const markup = `
     <div class='spinner'>
        <svg>
          <use href='${icons}#icon-loader'></use>
        </svg>
     </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class='error'>
          <div>
            <svg>
              <use href='${icons}#icon-alert-triangle'></use>
            </svg>
          </div>
          <p>${message}</p>
    </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class='message'>
          <div>
            <svg>
              <use href='${icons}#icon-smile'></use>
            </svg>
          </div>
          <p>${message}</p>
    </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}