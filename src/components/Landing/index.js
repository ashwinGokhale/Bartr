import React from 'react';
import './styleIndex.css';
import logo from './bartrLogo.png';

const LandingPage = () =>
<div class="navBar">
  <img class="logo" src={logo} alt="Bartr"></img>
  <div class="buttonsGroup">
    <button class="navButton">Log In</button>
    <button class="navButton">Register</button>
    <button class="navButton">About</button>
    <button class="navButton">Support</button>
  </div>
</div>

export default LandingPage;
