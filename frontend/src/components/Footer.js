import React from 'react';
import '../Style/Footer.css';

const Footer = () => {
  const menuItems = [
    {
      title: 'Reservations',
      submenu: [
        { title: 'Overview', link: '#' },
        { title: 'Calendar', link: '#' }
      ]
    },
    {
      title: 'Inventory',
      submenu: [
        { title: 'Rates and availability', link: '#' },
        { title: 'Inclusions', link: '#' }
      ]
    },
    {
      title: 'Setup',
      submenu: [
        { title: 'Property', link: '#' },
        { title: 'Room types', link: '#' },
        { title: 'Extras', link: '#' },
        { title: 'Promotions', link: '#' }
      ]
    },
    {
      title: 'Reports',
      submenu: [
        { title: 'Summary', link: '#' }
      ]
    },
    {
      title: 'Documentation',
      submenu: [
        { title: 'Terms and conditions', link: '#' }
      ]
    },
    {
      title: 'Contact us',
      submenu: [
        { title: 'Support', link: '#' }
      ]
    },
    {
      title: 'Choose language',
      submenu: []
    }
  ];

  return (
    <footer className="main-footer">
      <nav className="footer-nav">
        <ul className="footer-menu">
          {menuItems.map((item, index) => (
            <li key={index} className="menu-item">
              {/* Menu chính */}
              <a href="#" className="main-link">{item.title}</a>
              
              {/* Submenu - chỉ hiển thị nếu có submenu items */}
              {item.submenu && item.submenu.length > 0 && (
                <ul className="submenu">
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
