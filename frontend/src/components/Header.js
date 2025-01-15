import React from "react";
import Ad from "../assets/Ad.svg";
import Icon from "../assets/Icon.svg";
import Head from "../Style/Head.css";

class Header extends React.Component {
  render() {
    return (
      <>
        <div className='Main-header'>
          <div className='Left-section'>
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
        <div>
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
          </ul>
        </div>
      </>
    );
  }
}

export default Header;
