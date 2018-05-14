const React = require('react');
const store = require('./store');
const Dropdown = require('semantic-ui-react').Dropdown;
const Button = require('semantic-ui-react').Button;
const Input = require('semantic-ui-react').Input;
const csv = require('csvtojson');

const handleFile = event => {
  var data = null;
  var file = event.target.files[0];
  var reader = new FileReader();

  reader.readAsText(file);
  reader.onload = function (loadEvent) {
    var csvData = loadEvent.target.result;
    csv()
    .fromString(csvData)
    .on('end_parsed', leads => {
      console.log(leads);
      alert('attempting to import ' + leads.length + ' leads.');
      const key = store.getState().key;
      store.dispatch({
        type: 'UPLOAD_LEADS',
        leads: leads,
        key: key
      });
    })
    reader.onerror = function () {
      alert('Unable to read' + ' ' + file.fileName);
    }
  }
}

const handleChange = event => {
  store.dispatch({
    type: 'API_KEY_INPUT_CHANGED',
    key: event.target.value
  });
};

const getKey = leads => {

}

const FileLoader = props => {
  return (
    <div className='ui eight column centered row'>
      <div className='ui action input'>
        <input
          type='text'
          placeholder='API Key'
          onChange={handleChange}>
        </input>

      </div>
      <div>
        <legend>Upload your leads</legend>
        <input type="file"
          name="File Upload"
          id="csv-upload"
          accept=".csv"
          onChange={handleFile} />
      </div>
    </div>
  )
}

module.exports = FileLoader;