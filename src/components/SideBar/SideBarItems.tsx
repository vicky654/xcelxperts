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
        key: 'Manage',
        title: 'Manage',
        icon: IconMenuDatatables,
        link: '/manage-charges/charges', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
        subMenu: [
            { title: 'Users', link: '/manage-users/user', permission: 'user-list', visibility: false },
            { title: 'Clients', link: '/manage-clients/client', permission: 'user-list', visibility: false },
            { title: 'Entities', link: '/manage-entities/entity', permission: 'user-list', visibility: false },
            // { title: 'Reports', link: '/manage-reports/reports', permission: 'user-list', visibility: false },
         // { title: 'Fuel Competitors', link: '/manage-stations/fuel-competitors', permission: 'user-list', visibility: false },
        ],
    },
    // {
    //     key: 'users',
    //     title: 'Users',
    //     icon: IconMenuUsers,
    //     link: '/manage-users/user', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },
    // {
    //     key: 'client',
    //     title: 'Clients',
    //     icon: IconUser,
    //     link: '/manage-clients/client', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },
    {
        key: 'Permissions',
        title: 'Permissions',
        icon: IconMenuDatatables,
        link: '/manage-roles/roles', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
        subMenu: [
            { title: 'Roles', link: '/manage-roles/roles', permission: 'user-list', visibility: false },
            { title: 'Addons', link: '/manage-addons/addons', permission: 'user-list', visibility: false },
         // { title: 'Fuel Competitors', link: '/manage-stations/fuel-competitors', permission: 'user-list', visibility: false },
        ],
    },
    // {
    //     key: 'roles',
    //     title: 'Roles',
    //     icon: IconUser,
    //     link: '/manage-roles/roles', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },
    // {
    //     key: 'ManageAddons',
    //     title: 'Addons',
    //     icon: IconUser,
    //     link: '/manage-addons/addons', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },

    // {
    //     key: 'entity',
    //     title: 'Entities',
    //     icon: IconMenuDashboard,
    //     link: '/manage-entities/entity', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },
    {
        key: 'Stations',
        title: 'Stations',
        icon: IconMenuDatatables,
        link: '/manage-stations/station', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
        subMenu: [
            { title: 'Stations', link: '/manage-stations/station', permission: 'user-list', visibility: false },
            { title: 'Tanks', link: '/manage-stations/tank', permission: 'user-list', visibility: false },
            { title: 'Nozzles', link: '/manage-stations/nozzle', permission: 'user-list', visibility: false },
            { title: 'Pumps', link: '/manage-stations/pump', permission: 'user-list', visibility: false },
            { title: 'Fuel Sale', link: '/manage-stations/fuel-sale', permission: 'user-list', visibility: false },
            { title: 'Fuel Purchase', link: '/manage-stations/fuel-purchase', permission: 'user-list', visibility: false },
            // { title: 'Fuel Competitors', link: '/manage-stations/fuel-competitors', permission: 'user-list', visibility: false },
        ],
    },
    {
        key: 'PaidOuts',
        title: 'PaidOuts',
        icon: IconMenuDatatables,
        link: '/manage-charges/charges', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
        subMenu: [
            { title: 'Charges', link: '/manage-charges/charges', permission: 'user-list', visibility: false },
            { title: 'Deductions', link: '/manage-deductions/deductions', permission: 'user-list', visibility: false },
            { title: 'Suppliers', link: '/manage-supplier/supplier', permission: 'user-list', visibility: false },
            { title: 'Reports', link: '/manage-reports/reports', permission: 'user-list', visibility: false },
         // { title: 'Fuel Competitors', link: '/manage-stations/fuel-competitors', permission: 'user-list', visibility: false },
        ],
    },
    // {
    //     key: 'Charges',
    //     title: 'Charges',
    //     icon: IconMenuDatatables,
    //     link: '/manage-charges/charges', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },
    // {
    //     key: 'deductions',
    //     title: 'Deductions',
    //     icon: IconMenuDatatables,
    //     link: '/manage-deductions/deductions', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },
    // {
    //     key: 'supplier',
    //     title: 'Suppliers',
    //     icon: IconMenuDatatables,
    //     link: '/manage-supplier/supplier', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },
    {
        key: 'Logs',
        title: 'Logs',
        icon: IconMenuDatatables,
        link: '/manage-logs/logs', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
        subMenu: [
            { title: 'Email Logs', link: '/manage-logs/emaillogs', permission: 'user-list', visibility: false },
            { title: 'Activity Logs', link: '/manage-logs/activity_logs', permission: 'user-list', visibility: false },
        ],
    },
    // {
    //     key: 'Reports',
    //     title: 'Reports',
    //     icon: IconMenuDatatables,
    //     link: '/manage-reports/reports', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },
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
