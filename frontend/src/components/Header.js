import React from "react";
import Ad from "../assets/Ad.svg";
import Head from "../Style/Head.css";
import Grids from "../assets/Grids.svg";
import Users from "../assets/Users.svg";

class Header extends React.Component {
  handlePageChange = (pageName) => {
    if (this.props.onChangePage) {
      this.props.onChangePage(pageName);
    }
  };
  
  navigateToLogin = () => {
    if (this.props.onChangePage) {
      this.props.onChangePage('Login');
    }
  };

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
              <img className='app-icon' src={Grids} alt='icon' />
              <span className='my-apps'>My apps</span>
            </div>
            <div className='bb-section'>
              <span className='bb-text'>Little Hotelier B&B</span>
            </div>
            <img 
              className='user-icon' 
              src={Users} 
              alt='icon' 
              onClick={this.navigateToLogin}
              style={{cursor: 'pointer'}}
            />
          </div>
        </div>
        <div className='Main-menu'>
          <ul className='list-section'>
            <li className={`mgr-18 ${this.props.currentPage === 'Calendar' ? 'active' : ''}`}>
              <a href="#" onClick={(e) => { e.preventDefault(); this.handlePageChange('Calendar'); }}>
                Calendar
              </a>
            </li>
            <li className={`mgr-18 ${this.props.currentPage === 'Reports' ? 'active' : ''}`}>
              <a href="#" onClick={(e) => { e.preventDefault(); this.handlePageChange('Reports'); }}>
                Reports
              </a>
            </li>
            <li className={`mgr-18 ${this.props.currentPage === 'Service' ? 'active' : ''}`}>
              <a href="#" onClick={(e) => { e.preventDefault(); this.handlePageChange('Service'); }}>
                Service
              </a>
            </li>
          </ul>
        </div>
      </>
    );  
  }
}

export default Header;