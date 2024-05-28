// permissionItems.ts

import { PerMenuItem } from './MenuPerComponent'; // Adjust the path as per your folder structure
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMenuDatatables from '../Icon/Menu/IconMenuDatatables';
import IconCaretDown from '../Icon/IconCaretDown';
export const permissionItems: PerMenuItem[] = [
    {
        key: 'dashboard',
        title: 'Dashboard',
        icon: IconMenuDashboard,
        permission: 'dashboard-view',
        visibility: false,
        link: '/', // Single link for the dashboard
    },
    {
        key: 'manageusers',
        title: 'Manage Users',
        icon: IconMenuDatatables,
        permission: 'user-list',
        visibility: true, // Example of setting visibility to true
        subMenu: [
            { title: 'Manage Users', link: '/users', permission: 'user-list', visibility: false },
            { title: 'Add User', link: '/users', permission: 'user-create', visibility: false }
        ],
    },
    {
        key: 'manageclient',
        title: 'Manage Clients',
        icon: IconMenuDatatables,
        permission: 'client-list',
        visibility: true, // Example of setting visibility to true
        subMenu: [
            { title: 'Manage Clients', link: '/users', permission: 'client-list', visibility: false },
            { title: 'Add Clients', link: '/users', permission: 'client-create', visibility: false }
        ],
    },
    // Add more menu items as needed
];
