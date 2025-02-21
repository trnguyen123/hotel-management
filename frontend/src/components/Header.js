import React from "react";
import Ad from "../assets/Ad.svg";
import Icon from "../assets/Icon.svg";
import Head from "../Style/Head.css";
import Family from "./Family";
import Queen from "./Queen";
import Standard from "./Standard";
import Footer from "./Footer";
import Login from "./Login";

class Header extends React.Component {
  render() {
    return (
      <>
        <div className='Main-header'>
          <div className='Left-main-header'>
            <img className='header-img' src={Ad} alt='logo' />
            <span className='front-desk'>Little Hotelier | Front desk</span>
          </div>
          <div className='Right-main-header'>
            <div className='apps-section'>
              <img className='app-icon' src={Icon} alt='icon' />
              <span className='my-apps'>My apps</span>
            </div>
            <div className='bb-section'>
              <span className='bb-text'>Little Hotelier B&B</span>
            </div>
            <div className='profile-icon'>icon</div>
          </div>
        </div>
        <div className='Main-menu'>
          <ul className='list-section'>
            <li className='mgr-18'>Calendar</li>
            <li className='mgr-18'>Reservations</li>
            <li className='mgr-18'>Inventory</li>
            <li className='mgr-18'>Guests</li>
            <li className='mgr-18'>Reports</li>
            <li className='mgr-18'>Setup</li>
          </ul>
        </div>
      </>
    );
  }
}

export default Header;
