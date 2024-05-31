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
        icon: IconMenuDashboard,
        link: '/manage-users/user', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
    },
    {
        key: 'client',
        title: 'Client',
        icon: IconMenuDashboard,
        link: '/manage-clients/client', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
    },
    {
        key: 'entity',
        title: 'Entity',
        icon: IconMenuDashboard,
        link: '/manage-entity/entity', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
    },
    {
        key: 'Sites',
        title: 'Sites',
        icon: IconMenuDashboard,
        link: '/manage-sites/site', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
    },

];

export default menuItems;
