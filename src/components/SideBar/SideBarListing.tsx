import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { MenuItem, SubMenuItem } from './SideBarItems';

interface Props extends MenuItem {
    itemKey: string;
    subMenu?: SubMenuItem[];
}

const MenuItemComponent: React.FC<Props> = ({ itemKey, title, icon: Icon, link, subMenu, permission }) => {
    const { data } = useSelector((state: IRootState) => state?.data);
    const hasSubMenuPermission = subMenu?.some((item) =>
        data?.permissions?.includes(item.permission)
    );
    const isVisible = permission
        ? data?.permissions?.includes(permission) || hasSubMenuPermission
        : true;

    const hasSubMenu = subMenu && subMenu.length > 0;

    if (!isVisible) {
        return null;
    }

    return (
        <li className="menu nav-item relative" key={itemKey}>
            {hasSubMenu ? (
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        <i className={`fi fi-rr-${Icon}`}></i>
                        <span className="px-1">{title}</span>
                    </div>
                    <div className="right_arrow">
                        <i className="c-fi-down-arrow m-0 fi fi-rr-angle-small-down"></i>
                    </div>
                </button>
            ) : link ? (
                link.startsWith('http') ? (
                    <a
                        href={link}
                        className={`nav-link ${!hasSubMenu ? 'ActionTab' : ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="flex items-center">
                            <i className={`fi fi-rr-${Icon}`}></i>
                            <span className="px-1">{title}</span>
                        </div>
                    </a>
                ) : (
                    <NavLink
                        to={link}
                        className={({ isActive }) =>
                            `${isActive ? 'nav-link active' : 'nav-link'} ${
                                isActive ? 'ActionTab' : ''
                            }`
                        }
                    >
                        <div className="flex items-center">
                            <i className={`fi fi-rr-${Icon}`}></i>
                            <span className="px-1">{title}</span>
                        </div>
                    </NavLink>
                )
            ) : (
                <div className={`nav-link ${!hasSubMenu ? 'ActionTab' : ''}`}
                
                >
                    <div className="flex items-center">
                        <i className={`fi fi-rr-${Icon}`}></i>
                        <span className="px-1">{title}</span>
                    </div>
                </div>
            )}

            {hasSubMenu && (
                <ul className="sub-menu">
                    {subMenu?.map((item, index) => {
                        const isVisibleSubMenu = data?.permissions?.includes(
                            item.permission || ''
                        );

                        if (!isVisibleSubMenu) {
                            return null;
                        }

                        return (
                            <li key={index}>
                                {item.target ? (
                                    <a
                                        href={item.link}
                                        target={item.target}
                                        rel="noopener noreferrer"
                                    >
                                        {item.title}
                                    </a>
                                ) : (
                                    <NavLink
                                        to={item.link}
                                        className={({ isActive }) =>
                                            `${isActive ? 'active' : ''} ${
                                                isActive
                                                    ? 'ActionTab'
                                                    : ''
                                            }`
                                        }
                                    >
                                        {item.title}
                                    </NavLink>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </li>
    );
};

export default MenuItemComponent;
