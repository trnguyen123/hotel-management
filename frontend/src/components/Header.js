import React from "react";
import Ad from "../assets/Ad.svg";
import Head from "../Style/Head.css";
import Grids from "../assets/Grids.svg";
import Users from "../assets/Users.svg";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <>
      <div className='Main-header'>
        <div className='Left-main-header'>
          <img className='header-img' src={Ad} alt='logo' />
          <span className='front-desk'>Little Hotelier | Front desk</span>
        </div>
        <div className='Right-main-header'>
          <div className='apps-section'>
            <img className='app-icon' src={Grids} alt='icon' />
            <span className='my-apps'>My apps</span>
          </div>
          <div className='bb-section'>
            <span className='bb-text'>Little Hotelier B&B</span>
          </div>
          <img className='user-icon' src={Users} alt='icon' />
        </div>
      </div>
      <div className='Main-menu'>
        <ul className='list-section'>
          <nav>
            <NavLink
              to='/'
              className={({ isActive }) =>
                `mgr-18 rooms ${isActive ? "active" : ""}`
              }
            >
              Rooms
            </NavLink>
            <NavLink
              to='/reports'
              className={({ isActive }) =>
                `mgr-18 reports ${isActive ? "active" : ""}`
              }
            >
              Reports
            </NavLink>
            <NavLink
              to='/service'
              className={({ isActive }) =>
                `mgr-18 service ${isActive ? "active" : ""}`
              }
            >
              Service
            </NavLink>
          </nav>
        </ul>
      </div>
    </>
  );
};

export default Header;
