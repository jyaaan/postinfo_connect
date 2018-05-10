const React = require('react');
const store = require('./store');
const async = require('async');

const Home = props => {
  return (
    <div className='ui eight column centered row'>
      <img className='ui large image centered column' src={'/images/logo_main.png'} />
    </div>
  )
}