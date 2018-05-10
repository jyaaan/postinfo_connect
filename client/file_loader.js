const React = require('react');
const store = require('./store');
const Dropdown = require('semantic-ui-react').Dropdown;
const Button = require('semantic-ui-react').Button;
const Input = require('semantic-ui-react').Input;

const handleFile = event => {
  var data = null;
  var file = event.target.files[0];
  var reader = new FileReader();
  var usernames = [];

  reader.readAsText(file);
  reader.onload = function (loadEvent) {
    var csvData = loadEvent.target.result;
    var testArray = csvData.split('\n');
    testArray.splice(-1, 1);
    var latestArray = testArray.map(arr => {
      return arr.replace('\r', '');
    })
    // if (data && data.length > 0) {
    //   alert('Imported' + ' ' + data.length + ' ' + 'rows.');
    //   console.log(data);
    // }
    // reader.onerror = function () {
    //   alert('Unable to read' + ' ' + file.fileName);
    // }
    store.dispatch({
      type: 'ENRICH_CSV',
      users: testArray
    })
    // store.dispatch({
    //   type: 'UPLOAD_PROSPECTS',
    //   prospects: latestArray,
    //   primaryUsername: store.getState().usernameInput
    // });
  }
}

const FileLoader = props => {
  return (
  <div>
    <legend>Upload your CSV File</legend>
    <input type="file"
      name="File Upload"
      id="csv-upload"
      accept=".csv"
      onChange={handleFile} />
  </div>
  )
}