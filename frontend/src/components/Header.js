import React from "react";
import { Link } from "react-router-dom"; // Dùng Link để điều hướng
import Ad from "../assets/Ad.svg";
import Grids from "../assets/Grids.svg";
import ArrowDown from "../assets/ArrowDown.svg";

class Header extends React.Component {
  state = {
    dropdownOpen: false,
  };

  handleLogout = () => {
    if (this.props.onLogout) {
      this.props.onLogout();
    }
  };

  toggleDropdown = () => {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  };

  render() {
    const { user } = this.props;
    const { dropdownOpen } = this.state;

    return (
      <>
        <div className="Main-header">
          <div className="Left-main-header">
            <img className="header-img" src={Ad} alt="logo" />
            <span className="front-desk">Little Hotelier | Front desk</span>
          </div>
          <div className="Right-main-header">
            <div className="apps-section">
              <img className="app-icon" src={Grids} alt="icon" />
              <span className="my-apps">My apps</span>
            </div>
            <div className="bb-section">
              <span className="bb-text">Little Hotelier B&B</span>
            </div>
            {user && (
              <div className="user-section">
                <span className="user-name" onClick={this.toggleDropdown}>
                  {user.full_name}
                  <img className="arrow-down" src={ArrowDown} alt="arrow down" />
                </span>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <button className="logout-button" onClick={this.handleLogout}>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="Main-menu">
          <ul className="list-section">
            <li className="mgr-18">
              <Link to="/calendar" className={this.props.currentPage === "Calendar" ? "active" : ""}>
                Calendar
              </Link>
            </li>
            <li className="mgr-18">
              <Link to="/reports" className={this.props.currentPage === "Reports" ? "active" : ""}>
                Reports
              </Link>
            </li>
            <li className="mgr-18">
              <Link to="/service" className={this.props.currentPage === "Service" ? "active" : ""}>
                Service
              </Link>
            </li>
          </ul>
        </div>
      </>
    );
  }
}

export default Header;
