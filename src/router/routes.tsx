import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Finance = lazy(() => import('../pages/Finance'));
const Crypto = lazy(() => import('../pages/Crypto'));
const Todolist = lazy(() => import('../pages/Apps/Todolist'));
const Mailbox = lazy(() => import('../pages/Apps/Mailbox'));
const Notes = lazy(() => import('../pages/Apps/Notes'));
const Contacts = lazy(() => import('../pages/Apps/Contacts'));
const Chat = lazy(() => import('../pages/Apps/Chat'));
const Scrumboard = lazy(() => import('../pages/Apps/Scrumboard'));
const Calendar = lazy(() => import('../pages/Apps/Calendar'));
const List = lazy(() => import('../pages/Apps/Invoice/List'));
const Preview = lazy(() => import('../pages/Apps/Invoice/Preview'));
const Add = lazy(() => import('../pages/Apps/Invoice/Add'));
const Edit = lazy(() => import('../pages/Apps/Invoice/Edit'));
const Tabs = lazy(() => import('../pages/Components/Tabs'));
const Accordians = lazy(() => import('../pages/Components/Accordians'));
const Modals = lazy(() => import('../pages/Components/Modals'));
const Cards = lazy(() => import('../pages/Components/Cards'));
const Carousel = lazy(() => import('../pages/Components/Carousel'));
const Countdown = lazy(() => import('../pages/Components/Countdown'));
const Counter = lazy(() => import('../pages/Components/Counter'));
const SweetAlert = lazy(() => import('../pages/Components/SweetAlert'));
const Timeline = lazy(() => import('../pages/Components/Timeline'));
const Notification = lazy(() => import('../pages/Components/Notification'));
const MediaObject = lazy(() => import('../pages/Components/MediaObject'));
const ListGroup = lazy(() => import('../pages/Components/ListGroup'));
const PricingTable = lazy(() => import('../pages/Components/PricingTable'));
const LightBox = lazy(() => import('../pages/Components/LightBox'));
const Alerts = lazy(() => import('../pages/Elements/Alerts'));
const Avatar = lazy(() => import('../pages/Elements/Avatar'));
const Badges = lazy(() => import('../pages/Elements/Badges'));
const Breadcrumbs = lazy(() => import('../pages/Elements/Breadcrumbs'));
const Buttons = lazy(() => import('../pages/Elements/Buttons'));
const Buttongroups = lazy(() => import('../pages/Elements/Buttongroups'));
const Colorlibrary = lazy(() => import('../pages/Elements/Colorlibrary'));
const DropdownPage = lazy(() => import('../pages/Elements/DropdownPage'));
const Infobox = lazy(() => import('../pages/Elements/Infobox'));
const Jumbotron = lazy(() => import('../pages/Elements/Jumbotron'));
const Loader = lazy(() => import('../pages/Elements/Loader'));
const Pagination = lazy(() => import('../pages/Elements/Pagination'));
const Popovers = lazy(() => import('../pages/Elements/Popovers'));
const Progressbar = lazy(() => import('../pages/Elements/Progressbar'));
const Search = lazy(() => import('../pages/Elements/Search'));
const Tooltip = lazy(() => import('../pages/Elements/Tooltip'));
const Treeview = lazy(() => import('../pages/Elements/Treeview'));
const Typography = lazy(() => import('../pages/Elements/Typography'));
const Widgets = lazy(() => import('../pages/Widgets'));
const FontIcons = lazy(() => import('../pages/FontIcons'));
const DragAndDrop = lazy(() => import('../pages/DragAndDrop'));
const Tables = lazy(() => import('../pages/Tables'));
const Basic = lazy(() => import('../pages/DataTables/Basic'));
const Advanced = lazy(() => import('../pages/DataTables/Advanced'));
const Skin = lazy(() => import('../pages/DataTables/Skin'));
const OrderSorting = lazy(() => import('../pages/DataTables/OrderSorting'));
const MultiColumn = lazy(() => import('../pages/DataTables/MultiColumn'));
const MultipleTables = lazy(() => import('../pages/DataTables/MultipleTables'));
const AltPagination = lazy(() => import('../pages/DataTables/AltPagination'));
const Checkbox = lazy(() => import('../pages/DataTables/Checkbox'));
const RangeSearch = lazy(() => import('../pages/DataTables/RangeSearch'));
const Export = lazy(() => import('../pages/DataTables/Export'));
const ColumnChooser = lazy(() => import('../pages/DataTables/ColumnChooser'));
const Profile = lazy(() => import('../pages/Users/Profile'));
const AccountSetting = lazy(() => import('../pages/Users/AccountSetting'));
const KnowledgeBase = lazy(() => import('../pages/Pages/KnowledgeBase'));
const ContactUsBoxed = lazy(() => import('../pages/Pages/ContactUsBoxed'));
const ContactUsCover = lazy(() => import('../pages/Pages/ContactUsCover'));
const Faq = lazy(() => import('../pages/Pages/Faq'));
const ComingSoonBoxed = lazy(() => import('../pages/Pages/ComingSoonBoxed'));
const ComingSoonCover = lazy(() => import('../pages/Pages/ComingSoonCover'));
const ERROR404 = lazy(() => import('../pages/Pages/Error404'));
const ERROR500 = lazy(() => import('../pages/Pages/Error500'));
const ERROR503 = lazy(() => import('../pages/Pages/Error503'));
const Maintenence = lazy(() => import('../pages/Pages/Maintenence'));
const LoginBoxed = lazy(() => import('../pages/Authentication/LoginBoxed'));
const RegisterBoxed = lazy(() => import('../pages/Authentication/RegisterBoxed'));
const UnlockBoxed = lazy(() => import('../pages/Authentication/UnlockBox'));
const RecoverIdBoxed = lazy(() => import('../pages/Authentication/RecoverIdBox'));
const LoginCover = lazy(() => import('../pages/Authentication/LoginCover'));
const RegisterCover = lazy(() => import('../pages/Authentication/RegisterCover'));
const RecoverIdCover = lazy(() => import('../pages/Authentication/RecoverIdCover'));
const UnlockCover = lazy(() => import('../pages/Authentication/UnlockCover'));
const About = lazy(() => import('../pages/About'));
const Error = lazy(() => import('../components/Error'));
const Charts = lazy(() => import('../pages/Charts'));
const FormBasic = lazy(() => import('../pages/Forms/Basic'));
const FormInputGroup = lazy(() => import('../pages/Forms/InputGroup'));
const FormLayouts = lazy(() => import('../pages/Forms/Layouts'));
const Validation = lazy(() => import('../pages/Forms/Validation'));
const InputMask = lazy(() => import('../pages/Forms/InputMask'));
const Select2 = lazy(() => import('../pages/Forms/Select2'));
const Touchspin = lazy(() => import('../pages/Forms/TouchSpin'));
const CheckBoxRadio = lazy(() => import('../pages/Forms/CheckboxRadio'));
const Switches = lazy(() => import('../pages/Forms/Switches'));
const Wizards = lazy(() => import('../pages/Forms/Wizards'));
const FileUploadPreview = lazy(() => import('../pages/Forms/FileUploadPreview'));
const QuillEditor = lazy(() => import('../pages/Forms/QuillEditor'));
const MarkDownEditor = lazy(() => import('../pages/Forms/MarkDownEditor'));
const DateRangePicker = lazy(() => import('../pages/Forms/DateRangePicker'));
const Clipboard = lazy(() => import('../pages/Forms/Clipboard'));



const routes = [
  // dashboard
  {
    path: '/',
    element: <Index />,
    permission: "view:dashboard",
    visibility: false,
  },
  // analytics page
  {
    path: '/analytics',
    element: <Analytics />,
    permission: "view:analytics",
    visibility: false,
  },
  // finance page
  {
    path: '/finance',
    element: <Finance />,
    permission: "view:finance",
    visibility: false,
  },
  // crypto page
  {
    path: '/crypto',
    element: <Crypto />,
    permission: "view:crypto",
    visibility: false,
  },
  {
    path: '/apps/todolist',
    element: <Todolist />,
    permission: "view:todolist",
    visibility: false,
  },
  {
    path: '/apps/notes',
    element: <Notes />,
    permission: "view:notes",
    visibility: false,
  },
  {
    path: '/apps/contacts',
    element: <Contacts />,
    permission: "view:contacts",
    visibility: false,
  },
  {
    path: '/apps/mailbox',
    element: <Mailbox />,
    permission: "view:mailbox",
    visibility: false,
  },
  {
    path: '/apps/invoice/list',
    element: <List />,
    permission: "view:invoice:list",
    visibility: false,
  },
  // Apps page
  {
    path: '/apps/chat',
    element: <Chat />,
    permission: "view:chat",
    visibility: false,
  },
  {
    path: '/apps/scrumboard',
    element: <Scrumboard />,
    permission: "view:scrumboard",
    visibility: false,
  },
  {
    path: '/apps/calendar',
    element: <Calendar />,
    permission: "view:calendar",
    visibility: false,
  },
  // preview page
  {
    path: '/apps/invoice/preview',
    element: <Preview />,
    permission: "view:invoice:preview",
    visibility: false,
  },
  {
    path: '/apps/invoice/add',
    element: <Add />,
    permission: "view:invoice:add",
    visibility: false,
  },
  {
    path: '/apps/invoice/edit',
    element: <Edit />,
    permission: "view:invoice:edit",
    visibility: false,
  },
  // components page
  {
    path: '/components/tabs',
    element: <Tabs />,
    permission: "view:tabs",
    visibility: false,
  },
  {
    path: '/components/accordions',
    element: <Accordians />,
    permission: "view:accordions",
    visibility: false,
  },
  {
    path: '/components/modals',
    element: <Modals />,
    permission: "view:modals",
    visibility: false,
  },
  {
    path: '/components/cards',
    element: <Cards />,
    permission: "view:cards",
    visibility: false,
  },
  {
    path: '/components/carousel',
    element: <Carousel />,
    permission: "view:carousel",
    visibility: false,
  },
  {
    path: '/components/countdown',
    element: <Countdown />,
    permission: "view:countdown",
    visibility: false,
  },
  {
    path: '/components/counter',
    element: <Counter />,
    permission: "view:counter",
    visibility: false,
  },
  {
    path: '/components/sweetalert',
    element: <SweetAlert />,
    permission: "view:sweetalert",
    visibility: false,
  },
  {
    path: '/components/timeline',
    element: <Timeline />,
    permission: "view:timeline",
    visibility: false,
  },
  {
    path: '/components/notifications',
    element: <Notification />,
    permission: "view:notification",
    visibility: false,
  },
  {
    path: '/components/media-object',
    element: <MediaObject />,
    permission: "view:media-object",
    visibility: false,
  },
  {
    path: '/components/list-group',
    element: <ListGroup />,
    permission: "view:list-group",
    visibility: false,
  },
  {
    path: '/components/pricing-table',
    element: <PricingTable />,
    permission: "view:pricing-table",
    visibility: false,
  },
  {
    path: '/components/lightbox',
    element: <LightBox />,
    permission: "view:lightbox",
    visibility: false,
  },
  // elements page
  {
    path: '/elements/alerts',
    element: <Alerts />,
    permission: "view:alerts",
    visibility: false,
  },
  {
    path: '/elements/avatar',
    element: <Avatar />,
    permission: "view:avatar",
    visibility: false,
  },
  {
    path: '/elements/badges',
    element: <Badges />,
    permission: "view:badges",
    visibility: false,
  },
  {
    path: '/elements/breadcrumbs',
    element: <Breadcrumbs />,
    permission: "view:breadcrumbs",
    visibility: false,
  },
  {
    path: '/elements/buttons',
    element: <Buttons />,
    permission: "view:buttons",
    visibility: false,
  },
  {
    path: '/elements/buttons-group',
    element: <Buttongroups />,
    permission: "view:buttons-group",
    visibility: false,
  },
  {
    path: '/elements/color-library',
    element: <Colorlibrary />,
    permission: "view:color-library",
    visibility: false,
  },
  {
    path: '/elements/dropdown',
    element: <DropdownPage />,
    permission: "view:dropdown",
    visibility: false,
  },
  {
    path: '/elements/infobox',
    element: <Infobox />,
    permission: "view:infobox",
    visibility: false,
  },
  {
    path: '/elements/jumbotron',
    element: <Jumbotron />,
    permission: "view:jumbotron",
    visibility: false,
  },
  {
    path: '/elements/loader',
    element: <Loader />,
    permission: "view:loader",
    visibility: false,
  },
  {
    path: '/elements/pagination',
    element: <Pagination />,
    permission: "view:pagination",
    visibility: false,
  },
  {
    path: '/elements/popovers',
    element: <Popovers />,
    permission: "view:popovers",
    visibility: false,
  },
  {
    path: '/elements/progress-bar',
    element: <Progressbar />,
    permission: "view:progress-bar",
    visibility: false,
  },
  {
    path: '/elements/search',
    element: <Search />,
    permission: "view:search",
    visibility: false,
  },
  {
    path: '/elements/tooltips',
    element: <Tooltip />,
    permission: "view:tooltips",
    visibility: false,
  },
  {
    path: '/elements/treeview',
    element: <Treeview />,
    permission: "view:treeview",
    visibility: false,
  },
  {
    path: '/elements/typography',
    element: <Typography />,
    permission: "view:typography",
    visibility: false,
  },

  // charts page
  {
    path: '/charts',
    element: <Charts />,
    permission: "view:charts",
    visibility: false,
  },
  // widgets page
  {
    path: '/widgets',
    element: <Widgets />,
    permission: "view:widgets",
    visibility: false,
  },
  //  font-icons page
  {
    path: '/font-icons',
    element: <FontIcons />,
    permission: "view:font-icons",
    visibility: false,
  },
  //  Drag And Drop page
  {
    path: '/dragndrop',
    element: <DragAndDrop />,
    permission: "view:dragndrop",
    visibility: false,
  },
  //  Tables page
  {
    path: '/tables',
    element: <Tables />,
    permission: "view:tables",
    visibility: false,
  },
  // Data Tables
  {
    path: '/datatables/basic',
    element: <Basic />,
    permission: "view:datatables:basic",
    visibility: false,
  },
  {
    path: '/datatables/advanced',
    element: <Advanced />,
    permission: "view:datatables:advanced",
    visibility: false,
  },
  {
    path: '/datatables/skin',
    element: <Skin />,
    permission: "view:datatables:skin",
    visibility: false,
  },
  {
    path: '/datatables/order-sorting',
    element: <OrderSorting />,
    permission: "view:datatables:order-sorting",
    visibility: false,
  },
  {
    path: '/datatables/multi-column',
    element: <MultiColumn />,
    permission: "view:datatables:multi-column",
    visibility: false,
  },
  {
    path: '/datatables/multiple-tables',
    element: <MultipleTables />,
    permission: "view:datatables:multiple-tables",
    visibility: false,
  },
  {
    path: '/datatables/alt-pagination',
    element: <AltPagination />,
    permission: "view:datatables:alt-pagination",
    visibility: false,
  },
  {
    path: '/datatables/checkbox',
    element: <Checkbox />,
    permission: "view:datatables:checkbox",
    visibility: false,
  },
  {
    path: '/datatables/range-search',
    element: <RangeSearch />,
    permission: "view:datatables:range-search",
    visibility: false,
  },
  {
    path: '/datatables/export',
    element: <Export />,
    permission: "view:datatables:export",
    visibility: false,
  },
  {
    path: '/datatables/column-chooser',
    element: <ColumnChooser />,
    permission: "view:datatables:column-chooser",
    visibility: false,
  },
  // Users page
  {
    path: '/users/profile',
    element: <Profile />,
    permission: "view:profile",
    visibility: false,
  },
  {
    path: '/users/user-account-settings',
    element: <AccountSetting />,
    permission: "view:account-setting",
    visibility: false,
  },
  // pages
  {
    path: '/pages/knowledge-base',
    element: <KnowledgeBase />,
    permission: "view:knowledge-base",
    visibility: false,
  },
  {
    path: '/pages/contact-us-boxed',
    element: <ContactUsBoxed />,
    permission: "view:contact-us-boxed",
    layout: 'blank',
    visibility: false,
  },
  {
    path: '/pages/contact-us-cover',
    element: <ContactUsCover />,
    permission: "view:contact-us-cover",
    layout: 'blank',
    visibility: false,
  },
  {
    path: '/pages/faq',
    element: <Faq />,
    permission: "view:faq",
    visibility: false,
  },
  {
    path: '/pages/coming-soon-boxed',
    element: <ComingSoonBoxed />,
    permission: "view:coming-soon-boxed",
    layout: 'blank',
    visibility: false,
  },
  {
    path: '/pages/coming-soon-cover',
    element: <ComingSoonCover />,
    permission: "view:coming-soon-cover",
    layout: 'blank',
    visibility: false,
  },
  {
    path: '/pages/error404',
    element: <ERROR404 />,
    permission: "view:error404",
    layout: 'blank',
    visibility: false,
  },
  {
    path: '/pages/error500',
    element: <ERROR500 />,
    permission: "view:error500",
    layout: 'blank',
    visibility: false,
  },
  {
    path: '/pages/error503',
    element: <ERROR503 />,
    permission: "view:error503",
    layout: 'blank',
    visibility: false,
  },
  {
    path: '/pages/maintenence',
    element: <Maintenence />,
    permission: "view:maintenance",
    layout: 'blank',
    visibility: false,
  },
  // Authentication
  {
    path: '/auth/boxed-signin',
    element: <LoginBoxed />,
    permission: "view:login-boxed",
    layout: 'blank',
    visibility: false,
  },
  {
    path: '/auth/boxed-signup',
    element: <RegisterBoxed />,
    permission: "view:register-boxed",
    layout: 'blank',
    visibility: false,
  },
  {
    path: '/auth/boxed-lockscreen',
    element: <UnlockBoxed />,
    permission: "view:unlock-boxed",
    layout: 'blank',
    visibility: false,
  },
  {
    path: '/auth/boxed-password-reset',
    element: <RecoverIdBoxed />,
    permission: "view:recover-id-boxed",
    layout: 'blank',
    visibility: false,
  },
  {
    path: '/auth/cover-login',
    element: <LoginCover />,
    permission: "view:login-cover",
    layout: 'blank',
    visibility: false,
  },
  {
    path: '/auth/cover-register',
    element: <RegisterCover />,
    permission: "view:register-cover",
    layout: 'blank',
    visibility: false,
  },
  {
    path: '/auth/cover-lockscreen',
    element: <UnlockCover />,
    permission: "view:unlock-cover",
    layout: 'blank',
    visibility: false,
  },
  {
    path: '/auth/cover-password-reset',
    element: <RecoverIdCover />,
    permission: "view:recover-id-cover",
    layout: 'blank',
    visibility: false,
  },
  // forms page
  {
    path: '/forms/basic',
    element: <FormBasic />,
    permission: "view:forms:basic",
    visibility: false,
  },
]


export { routes };
