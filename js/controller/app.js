import * as model from "../model/model.js";
import searchView from "../views/SearchView.js";
import resultsView from "../views/ResultsView.js";
import detailView from "../views/DetailView.js";

// HELPER: bundle everything DetailView needs into ONE object.
// The model can throw on bad input, so the controller catches it
// and passes the message along as data.
const detailData = (listing) => {
  const { occupants, includeTransport } = model.state;
  try {
    return {
      listing,
      occupants,
      includeTransport,
      cost: model.calculateCostPerHead(listing, occupants, includeTransport),
    };
  } catch (err) {
    return { listing, occupants, includeTransport, error: err.message };
  }
};

// CONTROLLERS

const resultsController = () => {
  searchView.renderCount(model.state.filtered.length);
  resultsView.render(model.state.filtered);
  resultsView.markSelected(model.state.selectedId); // render wiped the highlight
};

const selectController = (id) => {
  model.setSelectedId(id);

  const listing = model.getSelectedListing();
  if (!listing) return; // guard

  model.setOccupants(listing.maxOccupants);

  resultsView.markSelected(id);
  detailView.render(detailData(listing));
};

const occupantsController = (value) => {
  model.setOccupants(value);

  const listing = model.getSelectedListing();
  if (!listing) return;

  detailView.updateBreakdown(detailData(listing));
};

const transportController = (checked) => {
  model.setIncludeTransport(checked);

  const listing = model.getSelectedListing();
  if (!listing) return;

  detailView.updateBreakdown(detailData(listing));
};

const searchController = (term) => {
  model.setSearchTerm(term);
  resultsController();
};

const maxRentController = (value) => {
  model.setMaxRent(value);
  resultsController();
};

const init = () => {
  searchView.addSearchHandler(searchController);
  searchView.addMaxRentHandler(maxRentController);
  searchView.addFormHandler();
  resultsView.addSelectHandler(selectController);
  detailView.addOccupantsHandler(occupantsController);
  detailView.addTransportHandler(transportController);

  resultsController(); // first render
};

init();