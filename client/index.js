const React = require('react');
const ReactDOM = require('react-dom');
const store = require('./store');
const Home = require('./home');

const render = () => {
  const state = store.getState();
  ReactDOM.render(
    <div className='ui container'>
      <Home />
    </div>,
    document.querySelector('#container')
  );
}

store.subscribe(render);

render();