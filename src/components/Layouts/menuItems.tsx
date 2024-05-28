
import IconMenuForms from '../Icon/Menu/IconMenuForms';
import IconMenuDatatables from '../Icon/Menu/IconMenuDatatables';

import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
export interface SubMenuItem {
    title: string;
    link: string;
    target?: string;
}

export interface MenuItem {
    key: string;
    title: string;
    icon: React.ElementType;
    link?: string;
    subMenu?: SubMenuItem[];
}


const menuItems: MenuItem[] = [
    {
        key: 'dashboard',
        title: 'Dashboard',
        icon: IconMenuDashboard,
        link: '/', // Single link for the dashboard
    },
    {
        key: 'chat',
        title: 'Chat',
        icon: IconMenuDashboard,
        link: '/apps/chat', // Single link for the dashboard
    },
    {
        key: 'apps',
        title: 'Apps',
        icon: IconMenuDashboard, // Update with the correct icon
        subMenu: [
            { title: 'Chat', link: '/apps/chat' },
            { title: 'Mailbox', link: '/apps/mailbox' },
            { title: 'To Do List', link: '/apps/todolist' },
            { title: 'Notes', link: '/apps/notes' },
            { title: 'Scrumboard', link: '/apps/scrumboard' },
            { title: 'Contacts', link: '/apps/contacts' },
        ],
    },
    {
        key: 'forms',
        title: 'Forms',
        icon: IconMenuForms,
        subMenu: [
            { title: 'Basic', link: '/forms/basic' },
            { title: 'Input Group', link: '/forms/input-group' },
            { title: 'Layouts', link: '/forms/layouts' },
            { title: 'Validation', link: '/forms/validation' },
            { title: 'Input Mask', link: '/forms/input-mask' },
            { title: 'Select2', link: '/forms/select2' },
            { title: 'Touchspin', link: '/forms/touchspin' },
            { title: 'Checkbox & Radio', link: '/forms/checkbox-radio' },
            { title: 'Switches', link: '/forms/switches' },
            { title: 'Wizards', link: '/forms/wizards' },
            { title: 'File Upload', link: '/forms/file-upload' },
            { title: 'Quill Editor', link: '/forms/quill-editor' },
            { title: 'Markdown Editor', link: '/forms/markdown-editor' },
            { title: 'Date & Range Picker', link: '/forms/date-picker' },
            { title: 'Clipboard', link: '/forms/clipboard' },
        ],
    },
    {
        key: 'tables',
        title: 'Tables',
        icon: IconMenuDatatables,
        subMenu: [
            { title: 'Tables', link: '/tables' },
         
        ],
    },

    {
        key: 'supports',
        title: 'Supports',
        icon: IconMenuDashboard,
        subMenu: [{ title: 'Documentation', link: 'https://vristo.sbthemes.com', target: '_blank' }],
    },
];


export default menuItems;
