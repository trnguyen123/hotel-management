import React from "react";
import "../Style/Footer.css";

const Footer = () => {
  const menuItems = [
    {
      title: "Reservations",
    },
    {
      title: "Inventory",
    },
    {
      title: "Setup",
    },
    {
      title: "Reports",
    },
    {
      title: "Documentation",
    },
    {
      title: "Contact us",
    },
    {
      title: "Choose language",
      submenu: [],
    },
  ];

  return (
    <footer className='main-footer'>
      <nav className='footer-nav'>
        <ul className='footer-menu'>
          {menuItems.map((item, index) => (
            <li key={index} className='menu-item'>
              {/* Menu chính */}
              <a href='#' className='main-link'>
                {item.title}
              </a>

              {/* Submenu - chỉ hiển thị nếu có submenu items */}
              {item.submenu && item.submenu.length > 0 && (
                <ul className='submenu'>
                  {item.submenu.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <a href={subItem.link}>{subItem.title}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
