
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
        link: '/', // Single link for the dashboard
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
        icon: "apps",
        link: '/data-entry', // Single link for the Data Entry
        visibility: false, // Example of setting visibility to false
        permission: 'workflow-list', // Permission associated with the dashboard
        subMenu: [
            { title: 'DataEntry', link: '/data-entry', permission: 'workflow-list', visibility: false },
            { title: 'DataEntry Stats', link: '/data-entry-stats', permission: 'workflow-list', visibility: false },
          
            // { title: 'Reports', link: '/manage-reports/reports', permission: 'user-list', visibility: false },
            // { title: 'Fuel Competitors', link: '/manage-stations/fuel-competitors', permission: 'user-list', visibility: false },
        ],
    },
    {
        key: 'Manage',
        title: 'Manage',
        icon: "lead-management",
        link: '/manage-charges/charges', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'user-list', // Permission associated with the dashboard
        subMenu: [
            { title: 'Users', link: '/manage-users/user', permission: 'user-list', visibility: false },
            { title: 'Clients', link: '/manage-clients/client', permission: 'client-list', visibility: false },
            { title: 'Entities', link: '/manage-entities/entity', permission: 'entity-list', visibility: false },
            { title: 'Credit User', link: '/manage-users/credit-users', permission: 'credituser-list', visibility: false },
            // { title: 'Data Entry', link: '/data-entry', permission: 'credituser-list', visibility: false },
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
        icon: "dice-d6",
        link: '/manage-roles/roles', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
        subMenu: [
            { title: 'Roles', link: '/manage-roles/roles', permission: 'role-list', visibility: false },
            { title: 'Addons', link: '/manage-addons/addons', permission: 'addons-list', visibility: false },
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
        icon: "charging-station",
        link: '/manage-stations/station', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'station-list', // Permission associated with the dashboard
        subMenu: [
            { title: 'Stations', link: '/manage-stations/station', permission: 'station-list', visibility: false },
            { title: 'Station Bank', link: '/manage-bank/bank', permission: 'station-bank-create', visibility: false },
            { title: 'Tanks', link: '/manage-stations/tank', permission: 'tank-list', visibility: false },
            { title: 'Pumps', link: '/manage-stations/pump', permission: 'pump-list', visibility: false },
            { title: 'Nozzles', link: '/manage-stations/nozzle', permission: 'nozzle-list', visibility: false },
            { title: 'Suppliers', link: '/manage-supplier/supplier', permission: 'supplier-list', visibility: false },
            // { title: 'Fuel Sale', link: '/manage-stations/fuel-sale', permission: 'dashboard-view', visibility: false },
            { title: 'Fuel Sale', link: '/manage-stations/fuel-sale', permission: 'fuel-price-update', visibility: false },
            // { title: 'Fuel Purchase', link: '/manage-stations/fuel-purchase', permission: 'fuel-purchase-list', visibility: false },
            { title: 'Fuel Purchase', link: '/manage-stations/fuel-purchase', permission: 'fuel-purchase-price', visibility: false },
            // { title: 'Fuel Competitors', link: '/manage-stations/fuel-competitors', permission: 'user-list', visibility: false },
        ],
    },
    {
        key: 'PaidOuts',
        title: 'PaidOuts',
        icon: "briefcase",
        link: '/manage-charges/charges', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'dashboard-view', // Permission associated with the dashboard
        subMenu: [
            { title: 'Charges', link: '/manage-charges/charges', permission: 'charges-list', visibility: false },
            { title: 'Deductions', link: '/manage-deductions/deductions', permission: 'deduction-list', visibility: false },
            { title: 'Cards', link: '/manage-cards/cards', permission: 'card-list', visibility: false },
            { title: 'Reports', link: '/manage-reports/reports', permission: 'report-generate', visibility: false },
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
        icon: "newspaper",
        link: '/ss', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'email-logs', // Permission associated with the dashboard
        subMenu: [
            { title: 'Email Logs', link: '/manage-logs/emaillogs', permission: 'email-logs', visibility: false },
            { title: 'Activity Logs', link: '/manage-logs/activity_logs', permission: 'activity-logs', visibility: false },
        ],
    },
    {
        key: 'Others',
        title: 'Others',
        icon: "lead-management",
        link: '/manage-categories/fuelcategories', // Single link for the dashboard
        visibility: false, // Example of setting visibility to false
        permission: 'user-list', // Permission associated with the dashboard
        subMenu: [
            { title: 'Fuel Categories', link: '/manage-categories/fuelcategories', permission: 'user-list', visibility: false },
            { title: 'Fuel Sub Categories', link: '/manage-others/fuelsubcategories', permission: 'user-list', visibility: false },
            { title: 'Bank', link: '/manage-others/bank', permission: 'bank-list', visibility: false },
            { title: 'Lubricant', link: '/manage-others/lubricant', permission: 'lubricant-list', visibility: false },
         
            // { title: 'Data Entry', link: '/data-entry', permission: 'credituser-list', visibility: false },
            // { title: 'Reports', link: '/manage-reports/reports', permission: 'user-list', visibility: false },
            // { title: 'Fuel Competitors', link: '/manage-stations/fuel-competitors', permission: 'user-list', visibility: false },
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
