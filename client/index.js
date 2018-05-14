const React = require('react');
const ReactDOM = require('react-dom');
const store = require('./store');
const Home = require('./home');
const FileLoader = require('./file_loader')

const render = () => {
  const state = store.getState();
  ReactDOM.render(
    <div className='ui container'>
      <Home />
      <FileLoader />
    </div>,
    document.querySelector('#container')
  );
}

store.subscribe(render);

render();