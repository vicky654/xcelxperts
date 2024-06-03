import IconMenuDatatables from '../Icon/Menu/IconMenuDatatables';

import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMenuUsers from '../Icon/Menu/IconMenuUsers';
import IconUser from '../Icon/IconUser';
import IconMenuApps from '../Icon/Menu/IconMenuApps';
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
        icon: IconMenuApps,
        link: '/', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
    },
    {
        key: 'users',
        title: 'Users',
        icon: IconMenuUsers,
        link: '/manage-users/user', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
    },
    {
        key: 'client',
        title: 'Clients',
        icon: IconUser,
        link: '/manage-clients/client', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
    },

    {
        key: 'entity',
        title: 'Entities',
        icon: IconMenuDashboard,
        link: '/manage-entities/entity', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
    },
    {
        key: 'Stations',
        title: 'Stations',
        icon: IconMenuDatatables,
        link: '/manage-stations/station', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
        subMenu: [
            { title: 'Tank', link: '/manage-stations/tank', permission: 'user-list', visibility: false },
        ],
    },
    {
        key: 'Charges',
        title: 'Charges',
        icon: IconMenuDatatables,
        link: '/manage-charges/charges', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
    },
    {
        key: 'deductions',
        title: 'Deductions',
        icon: IconMenuDatatables,
        link: '/manage-deductions/deductions', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
    },
    {
        key: 'supplier',
        title: 'Supplier',
        icon: IconMenuDatatables,
        link: '/manage-supplier/supplier', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
    },
    // {
    //     key: 'Manage Workflow',
    //     title: 'Manage Workflow',
    //     icon: IconMenuDatatables,
    //     link: '/manage-stations/station', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },
];

export default menuItems;
