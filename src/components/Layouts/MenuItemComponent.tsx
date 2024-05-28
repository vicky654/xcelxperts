// MenuItemComponent.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { MenuItem } from './menuItems';
import IconCaretDown from '../Icon/IconCaretDown';
 // Adjust the path as necessary
 // Replace with actual path to your icon



const MenuItemComponent: React.FC<MenuItem> = ({ key, title, icon: Icon, link, subMenu }) => {
    const hasSubMenu = subMenu && subMenu.length > 0;

    return (
        <li className="menu nav-item relative" key={key}>
            {hasSubMenu ? (
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        <Icon className="shrink-0" />
                        <span className="px-1">{title}</span>
                    </div>
                    <div className="right_arrow">
                        <IconCaretDown />
                    </div>
                </button>
            ) : link ? (
                link.startsWith('http') ? (
                    <a href={link} className="nav-link" target="_blank" rel="noopener noreferrer">
                        <div className="flex items-center">
                            <Icon className="shrink-0" />
                            <span className="px-1">{title}</span>
                        </div>
                    </a>
                ) : (
                    <NavLink to={link} className="nav-link">
                        <div className="flex items-center">
                            <Icon className="shrink-0" />
                            <span className="px-1">{title}</span>
                        </div>
                    </NavLink>
                )
            ) : (
                <div className="nav-link">
                    <div className="flex items-center">
                        <Icon className="shrink-0" />
                        <span className="px-1">{title}</span>
                    </div>
                </div>
            )}

            {hasSubMenu && (
                <ul className="sub-menu">
                    {subMenu.map((item, index) => (
                        <li key={index}>
                            {item.target ? (
                                <a href={item.link} target={item.target} rel="noopener noreferrer">
                                    {item.title}
                                </a>
                            ) : (
                                <NavLink to={item.link}>{item.title}</NavLink>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

export default MenuItemComponent;

