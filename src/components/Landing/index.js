import React from 'react';
import './index.css'
import g4g from '../../assets/goods4goods.png';
import g4s from '../../assets/goods4services.png';
import s4s from '../../assets/services4services.png';

const LandingPage = () =>
  <div>  
    <div className="navBarSpace">
      <h3 className="style Md">WELCOME TO THE</h3>
      <h1 className="style Lg">BARTR COMMUNITY</h1>
      <h5 className="style Sm">A Place To Exchange Goods & Services</h5>
    </div>
    <div className="thirdHolder">
      <div className="third left">
        <h4>Goods for Goods</h4>
        <img className="image" src={g4g} alt="goodsForGoods.png"></img>
      </div>
      <div className="third middle">
        <h4>Goods For Services</h4>
        <img className="image" src={g4s} alt="goodsForServices.png"></img>
      </div>
      <div className="third right">
        <h4>Services For Services</h4>
        <img className="image" src={s4s} alt="servicesForServices.png"></img>
      </div>
    </div>
  </div>
    
export default LandingPage;
