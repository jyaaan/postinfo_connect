const { createStore, combineReducers } = require('redux');
const https = require('https');

const loadCSV = (state = {}, action) => {
  switch (action.type) {
    case 'UPLOAD_LEADS':
      console.log('uploading to endpoint');
      fetch('/upload-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          leads: action.leads,
          key:   state.key
        })
      });
      return state;
    case 'API_KEY_INPUT_CHANGED':
      state.key = action.key
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