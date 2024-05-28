import React from 'react';
import { NavLink } from 'react-router-dom';
import IconCaretDown from '../Icon/IconCaretDown';
// Assuming you have this icon

export interface SubPerMenuItem {
    title: string;
    link: string;
    target?: string;
    permission?: string; // Permission associated with the submenu item
    visibility?: boolean; // Optional visibility of the submenu item
}

export interface PerMenuItem {
    key: string;
    permission: string;
    title: string;
    icon: React.ElementType;
    link?: string;
    subMenu?: SubPerMenuItem[];
    visibility?: boolean; // Optional visibility of the main menu item
}

interface MenuPerComponentProps {
    menuItem: PerMenuItem;
    isPermissionAvailable: (permission: string) => boolean;
}

const MenuPerComponent: React.FC<MenuPerComponentProps> = ({ menuItem, isPermissionAvailable }) => {
    const { key, title, icon: Icon, link, subMenu } = menuItem;
    const hasSubMenu = subMenu && subMenu.length > 0;

    // Check if the current menu item or any of its sub-items should be visible based on permissions
    const isVisible = (permission?: string, visibility?: boolean) => {
        if (!permission) {
            return true; // If no permission is defined, always show the item
        }
        return isPermissionAvailable(permission) && (visibility !== false);
    };

    return isVisible(menuItem.permission, menuItem.visibility) ? (
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
                    {subMenu!.map((item, index) => (
                        isVisible(item.permission, item.visibility) && (
                            <li key={index}>
                                {item.target ? (
                                    <a href={item.link} target={item.target} rel="noopener noreferrer">
                                        {item.title}
                                    </a>
                                ) : (
                                    <NavLink to={item.link}>{item.title}</NavLink>
                                )}
                            </li>
                        )
                    ))}
                </ul>
            )}
        </li>
    ) : null;
};

export default MenuPerComponent;
