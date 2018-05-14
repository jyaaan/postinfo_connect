const { createStore, combineReducers } = require('redux');
const https = require('https');

const loadCSV = (state = {}, action) => {
  switch (action.type) {
    case 'UPLOAD_LEADS':
      fetch('/preload-prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: action.leads })
      });
      return state;
    default:
      return state;
  }
}

const reducer = combineReducers({
  loadCSV
});

const store = createStore(reducer);

module.exports = store;