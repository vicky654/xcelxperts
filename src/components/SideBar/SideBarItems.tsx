import IconMenuForms from '../Icon/Menu/IconMenuForms';
import IconMenuDatatables from '../Icon/Menu/IconMenuDatatables';

import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
export interface SubMenuItem {
    title: string;
    link: string;
    target?: string;
    visibility?: boolean; // Optional visibility of the main menu item
    permission?: string;
}

export interface MenuItem {
    key: string;
    title: string;
    icon: React.ElementType;
    link?: string;
    subMenu?: SubMenuItem[];
    visibility?: boolean; // Optional visibility of the main menu item
    permission?: string;
}

const menuItems: MenuItem[] = [
    {
        key: 'dashboard',
        title: 'Dashboard',
        icon: IconMenuDashboard,
        link: '/', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
    },

    {
        key: 'users',
        title: 'Users',
        icon: IconMenuDashboard, // Update with the correct icon
        visibility: false, // Example of setting visibility to false
        permission: 'user-list', // Permission associated with the apps menu
        subMenu: [
            { title: 'Users', link: '/manage-users/user', permission: 'user-list', visibility: false },
            { title: 'Add User', link: '/apps/chat', permission: 'user-create', visibility: false },
        ],
    },
    {
        key: 'clients',
        title: 'Manage Clients',
        icon: IconMenuForms,
        visibility: false, // Example of setting visibility to false
        permission: 'client-list', // Permission associated with the forms menu
        subMenu: [
            { title: 'Manage Clients', link: '/forms/basic', permission: 'client-lists', visibility: false },
            { title: 'Add Clients', link: '/forms/input-group', permission: 'client-create', visibility: false },
        ],
    },
];

export default menuItems;
