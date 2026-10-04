import View from "./View.js";

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

class DetailView extends View {
  _parentElement = document.querySelector(".detail");
  _errorMessage = "That listing could not be found.";

  // The parent is an <aside>, not a <ul>, so override View's <li> error markup.
  renderError(message = this._errorMessage) {
    this._clear();
    this._parentElement.insertAdjacentHTML(
      "afterbegin",
      `<p class="error">${message}</p>`,
    );
  }

  // Delegation: the inputs are re-created on every render,
  // so the listener lives on the stable parent (.detail).
  addOccupantsHandler(handler) {
    this._parentElement.addEventListener("input", (e) => {
      if (e.target.id === "occupants-demo") handler(e.target.value);
    });
  }

  addTransportHandler(handler) {
    this._parentElement.addEventListener("input", (e) => {
      if (e.target.id === "transport-demo") handler(e.target.checked);
    });
  }

  // Redraw only the breakdown so the inputs keep focus while typing.
  updateBreakdown(data) {
    const breakdown = this._parentElement.querySelector(".breakdown");
    if (!breakdown) return;
    breakdown.innerHTML = this._generateBreakdownMarkup(data);
  }

  _generateBreakdownMarkup({ cost, error }) {
    if (error) return `<p class="error">${error}</p>`;

    const { rentPerHead, utilitiesPerHead, transportPerHead, totalPerHead } =
      cost;

    return `
      <p class="breakdown__line">
        <span>Rent</span><span>${peso.format(rentPerHead)}</span>
      </p>
      <p class="breakdown__line">
        <span>Utilities</span><span>${peso.format(utilitiesPerHead)}</span>
      </p>
      <p class="breakdown__line">
        <span>Transport</span><span>${peso.format(transportPerHead)}</span>
      </p>
      <p class="breakdown__total">
        <span>Per person</span><span>${peso.format(totalPerHead)}</span>
      </p>
    `;
  }

  // data = { listing, occupants, includeTransport, cost, error }
  _generateMarkup = () => {
    const { listing, occupants, includeTransport } = this._data;
    const { name, barangay, monthlyRent, maxOccupants } = listing;

    return `
      <h2 class="detail__name">${name}</h2>
      <p class="detail__where">${barangay} &middot; ${peso.format(monthlyRent)} / month</p>

      <fieldset class="splitter">
        <legend class="splitter__legend">Split the cost</legend>

        <div class="splitter__row">
          <label for="occupants-demo">Sharing with</label>
          <input
            class="field__input"
            type="number"
            id="occupants-demo"
            min="1"
            max="${maxOccupants}"
            value="${occupants}"
          />
        </div>

        <div class="splitter__row">
          <label for="transport-demo">Include daily fare</label>
          <input type="checkbox" id="transport-demo" ${includeTransport ? "checked" : ""} />
        </div>
      </fieldset>

      <div class="breakdown">
        ${this._generateBreakdownMarkup(this._data)}
      </div>
    `;
  };
}

export default new DetailView();