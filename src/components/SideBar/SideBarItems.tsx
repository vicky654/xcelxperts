
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
    icon: any;
    link?: string;
    subMenu?: SubMenuItem[];
    visibility?: boolean; // Optional visibility of the main menu item
    permission?: string;
}

const menuItems: MenuItem[] = [
    {
        key: 'dashboard',
        title: 'Dashboard',
        icon: "apps",
        link: '/dashboard', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
    },
    // {
    //     key: 'DataEntry',
    //     title: 'Data Entry',
    //     icon: "apps",
    //     link: '/data-entry', // Single link for the Data Entry
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'workflow-list', // Permission associated with the dashboard
    // },
    {
        key: 'DataEntry',
        title: 'Data Entry',
        icon: "stats",
        link: '/data-entry', // Single link for the Data Entry
        visibility: false, // Example of setting visibility to false
        permission: 'workflow-list', // Permission associated with the dashboard
        subMenu: [
            { title: 'Data Entry', link: '/data-entry', permission: 'workflow-list', visibility: false },
            { title: 'Data Entry Stats', link: '/data-entry-stats', permission: 'workflow-list', visibility: false },
          
            // { title: 'Reports', link: '/manage-reports', permission: 'user-list', visibility: false },
            // { title: 'Fuel Competitors', link: '/manage-stations/fuel-competitors', permission: 'user-list', visibility: false },
        ],
    },
    {
        key: 'Manage',
        title: 'Manage',
        icon: "lead-management",
        link: '/manage-incomes', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'user-list', // Permission associated with the dashboard
        subMenu: [
            { title: 'Users', link: '/manage-users', permission: 'user-list', visibility: false },
            { title: 'Clients', link: '/manage-clients', permission: 'client-list', visibility: false },
            { title: 'Entities', link: '/manage-entities', permission: 'entity-list', visibility: false },
            { title: 'Credit User', link: '/manage-credit-users', permission: 'credituser-list', visibility: false },
            // { title: 'Data Entry', link: '/data-entry', permission: 'credituser-list', visibility: false },
            // { title: 'Reports', link: '/manage-reports', permission: 'user-list', visibility: false },
            // { title: 'Fuel Competitors', link: '/manage-stations/fuel-competitors', permission: 'user-list', visibility: false },
        ],
    },
    {
        key: 'Master ',
        title: 'Master ',
        icon: "handshake",
        link: '/manage-fuel-categories', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'card-list', // Permission associated with the dashboard
        subMenu: [
            { title: 'Cards', link: '/manage-cards', permission: 'card-list', visibility: false },
            
            { title: 'Fuel Categories', link: '/manage-fuel-categories', permission: 'fuel-category-list', visibility: false },
            { title: 'Fuel Sub Categories', link: '/manage-sub-categories', permission: 'fuel-subcategory-list', visibility: false },
            { title: 'Lubricant', link: '/manage-lubricants', permission: 'lubricant-list', visibility: false },
            { title: 'Extra Income', link: '/manage-incomes', permission: 'charges-list', visibility: false },
            { title: 'Expenses', link: '/manage-expenses', permission: 'deduction-list', visibility: false },
            { title: 'Suppliers', link: '/manage-suppliers', permission: 'supplier-list', visibility: false },
           
            { title: 'Bank', link: '/manage-banks', permission: 'bank-list', visibility: false },
          
            // { title: 'Data Entry', link: '/data-entry', permission: 'credituser-list', visibility: false },
            // { title: 'Reports', link: '/manage-reports', permission: 'user-list', visibility: false },
            // { title: 'Fuel Competitors', link: '/manage-stations/fuel-competitors', permission: 'user-list', visibility: false },
        ],
    },
  
    // {
    //     key: 'users',
    //     title: 'Users',
    //     icon: IconMenuUsers,
    //     link: '/manage-users', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },
    // {
    //     key: 'client',
    //     title: 'Clients',
    //     icon: IconUser,
    //     link: '/manage-clients', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },
    {
        key: 'Permissions',
        title: 'Permissions',
        icon: "dice-d6",
        link: '/manage-roles', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'role-list', // Permission associated with the dashboard
        subMenu: [
            { title: 'Roles', link: '/manage-roles', permission: 'role-list', visibility: false },
            { title: 'Addons', link: '/manage-addons', permission: 'addons-list', visibility: false },
            // { title: 'Fuel Competitors', link: '/manage-stations/fuel-competitors', permission: 'user-list', visibility: false },
        ],
    },
    // {
    //     key: 'roles',
    //     title: 'Roles',
    //     icon: IconUser,
    //     link: '/manage-roles', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },
    // {
    //     key: 'ManageAddons',
    //     title: 'Addons',
    //     icon: IconUser,
    //     link: '/manage-addons', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },

    // {
    //     key: 'entity',
    //     title: 'Entities',
    //     icon: IconMenuDashboard,
    //     link: '/manage-entities', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },
    {
        key: 'Stations',
        title: 'Stations',
        icon: "charging-station",
        link: '/manage-stations', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'station-list', // Permission associated with the dashboard
        subMenu: [
            { title: 'Stations', link: '/manage-stations', permission: 'station-list', visibility: false },
            { title: 'Station Bank', link: '/manage-stationbanks', permission: 'station-bank-create', visibility: false },
            { title: 'Tanks', link: '/manage-tanks', permission: 'tank-list', visibility: false },
            // { title: 'Pumps', link: '/manage-pumps', permission: 'pump-list', visibility: false },
            { title: 'Nozzles', link: '/manage-nozzles', permission: 'nozzle-list', visibility: false },
           // { title: 'Fuel Sale', link: '/manage-fuel-sale', permission: 'dashboard-view', visibility: false },
            { title: 'Fuel Sale', link: '/manage-fuel-sale', permission: 'fuel-price-update', visibility: false },
            // { title: 'Fuel Purchase', link: '/manage-fuel-purchase', permission: 'fuel-purchase-list', visibility: false },
            { title: 'Fuel Purchase', link: '/manage-fuel-purchase', permission: 'fuel-purchase-price', visibility: false },
            // { title: 'Fuel Competitors', link: '/manage-stations/fuel-competitors', permission: 'user-list', visibility: false },
        ],
    },
    {
        key: 'Reports',
        title: 'Reports',
        icon: "briefcase",
        link: '/manage-reports', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'report-generate', // Permission associated with the dashboard
    },
    // {
    //     key: 'PaidOuts',
    //     title: 'PaidOuts',
    //     icon: "briefcase",
    //     link: '/manage-incomes', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'report-generate', // Permission associated with the dashboard
    //     subMenu: [
    //      { title: 'Reports', link: '/manage-reports', permission: 'report-generate', visibility: false },
    //         // { title: 'Fuel Competitors', link: '/manage-stations/fuel-competitors', permission: 'user-list', visibility: false },
    //     ],
    // },
    // {
    //     key: 'Charges',
    //     title: 'Charges',
    //     icon: IconMenuDatatables,
    //     link: '/manage-incomes', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },
    // {
    //     key: 'deductions',
    //     title: 'Deductions',
    //     icon: IconMenuDatatables,
    //     link: '/manage-expenses', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },
    // {
    //     key: 'supplier',
    //     title: 'Suppliers',
    //     icon: IconMenuDatatables,
    //     link: '/manage-suppliers', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },
    {
        key: 'Logs',
        title: 'Logs',
        icon: "newspaper",
        link: '/ss', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'email-logs', // Permission associated with the dashboard
        subMenu: [
            { title: 'Email Logs', link: '/manage-emaillogs', permission: 'email-logs', visibility: false },
            { title: 'Activity Logs', link: '/manage-activity_logs', permission: 'activity-logs', visibility: false },
        ],
    },
  
    // {
    //     key: 'Reports',
    //     title: 'Reports',
    //     icon: IconMenuDatatables,
    //     link: '/manage-reports', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },
    // {
    //     key: 'Manage Workflow',
    //     title: 'Manage Workflow',
    //     icon: IconMenuDatatables,
    //     link: '/manage-stations', // Single link for the dashboard
    //     visibility: false, // Example of setting visibility to false
    //     permission: 'dashboard-view', // Permission associated with the dashboard
    // },
];

export default menuItems;
