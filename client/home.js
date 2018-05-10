const React = require('react');
const store = require('./store');
const async = require('async');

const Home = props => {
  return (
    <div className='ui eight column centered row'>
      <h3>Welcome to...</h3>
      <img className='ui large image centered column' src={'images/logo_main.png'} />
    </div>
  )
}

module.exports = Home;