import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import LoaderImg from '../../../utils/Loader';
import { setPageTitle } from '../../../store/themeConfigSlice';
import withApiHandler from '../../../utils/withApiHandler';
import AddUserModals from './AddUserModals';
import CustomSwitch from '../../FormikFormTools/CustomSwitch';
import useToggleStatus from '../../../utils/ToggleStatus';
import useCustomDelete from '../../../utils/customDelete';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import CustomPagination from '../../../utils/CustomPagination';
import ErrorHandler from '../../../hooks/useHandleError';
import noDataImage from '../../../assets/AuthImages/noDataFound.png'; // Import the image
import { IRootState } from '../../../store';
import UserAddonModal from './UserAddonModal';
import Dropdown from '../../Dropdown';
import IconHorizontalDots from '../../Icon/IconHorizontalDots';
import SearchBar from '../../../utils/SearchBar';

interface ManageUserProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
}

interface RowData {
    id: string;
    email: string;
    full_name: string;
    role: string;
    addons: string;
    created_date: string;
    status: number;
}

const ManageUser: React.FC<ManageUserProps> = ({ postData, getData, isLoading }) => {
    const [data, setData] = useState<RowData[]>([]);
    const dispatch = useDispatch();
    const handleApiError = ErrorHandler();
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isUserAddonModalOpen, setIsUserAddonModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserData, setEditUserData] = useState<Partial<RowData> | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const UserPermissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);

    const isAddPermissionAvailable = UserPermissions?.includes('user-create');
    const isListPermissionAvailable = UserPermissions?.includes('user-list');
    const isEditPermissionAvailable = UserPermissions?.includes('user-edit');
    const isDeletePermissionAvailable = UserPermissions?.includes('user-delete');
    const isAssignAddPermissionAvailable = UserPermissions?.includes('addons-assign');

    const anyPermissionAvailable = isEditPermissionAvailable || isDeletePermissionAvailable || isAssignAddPermissionAvailable;

    useEffect(() => {
        fetchData();
        dispatch(setPageTitle('Alternative Pagination Table'));
    }, [dispatch, currentPage]);

    const handleSuccess = () => {
        fetchData();
    };

    const handlePageChange = (newPage: any) => {
        setCurrentPage(newPage);
    };

    const fetchData = async () => {
        try {

            let apiUrl = `/user/list?page=${currentPage}`;
            if (searchTerm) {
                apiUrl += `&search_keywords=${searchTerm}`;
            }
            const response = await getData(apiUrl);

            // const response = await getData(`/user/list?page=${currentPage}`);
            if (response && response.data && response.data.data) {
                setData(response.data.data?.users);
                setCurrentPage(response.data.data?.currentPage || 1);
                setLastPage(response.data.data?.lastPage || 1);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const { toggleStatus } = useToggleStatus();
    const toggleActive = (row: RowData) => {
        const formData = new FormData();
        formData.append('id', row.id.toString());
        formData.append('status', (row.status === 1 ? 0 : 1).toString());
        toggleStatus(postData, '/user/update-status', formData, handleSuccess);
    };

    const { customDelete } = useCustomDelete();
    const handleDelete = (id: any) => {
        const formData = new FormData();
        formData.append('id', id);
        customDelete(postData, 'user/delete', formData, handleSuccess);
    };

    const columns: any[] = [
        {
            name: 'User Name',
            selector: (row: RowData) => row.full_name,
            sortable: false,
            width: '15%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.full_name}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Role',
            selector: (row: RowData) => row.role,
            sortable: false,
            width: '15%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.role}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Email',
            selector: (row: RowData) => row.email,
            sortable: false,
            width: '15%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.email}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Addons',
            selector: (row: RowData) => row.addons,
            sortable: false,
            width: '15%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.addons}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Created Date',
            selector: (row: RowData) => row.created_date,
            sortable: false,
            width: '15%',
            cell: (row: RowData) => (
                <div className="d-flex" style={{ cursor: 'default' }}>
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Status',
            selector: (row: RowData) => row.status,
            sortable: false,
            width: '15%',
            cell: (row: RowData) => (

                <>

                    {isEditPermissionAvailable && (

                        <Tippy content={<div>Status</div>} placement="top">
                            {row.status === 1 || row.status === 0 ? (
                                <CustomSwitch checked={row.status === 1} onChange={() => toggleActive(row)} />
                            ) : (
                                <div className="pointer" >
                                    Unknown
                                </div>
                            )}
                        </Tippy>

                    )}

                </>

            ),
        },
        anyPermissionAvailable
            ? {
                name: 'Actions',
                selector: (row: RowData) => row.id,
                sortable: false,
                width: '10%',
                cell: (row: RowData) => (
                    <span className="text-center">
                        <div className="flex items-center justify-center">

                            <div className="dropdown">
                                <Dropdown button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}>
                                    <ul>

                                        <li>
                                            {isEditPermissionAvailable && (

                                                <button type="button" onClick={() => openEditModal(row?.id)}>
                                                    <i className="setting-icon fi fi-rr-file-edit "></i> Edit
                                                </button>

                                            )}
                                        </li>
                                        <li>
                                            {isDeletePermissionAvailable && (

                                                <button onClick={() => handleDelete(row.id)} type="button">
                                                    <i className="icon-setting delete-icon fi fi-rr-trash-xmark"></i> Delete
                                                </button>

                                            )}
                                        </li>
                                        <li>
                                            {isAssignAddPermissionAvailable && (

                                                <button onClick={() => openUserAddonModal(row?.id)} type="button">
                                                    <i className="fi fi-rr-user-add"></i>  Assign Addon
                                                </button>

                                            )}
                                        </li>

                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                    </span>
                ),
            }
            : null,
    ].filter(Boolean); // Filter out any null values from the columns array

    const openAddUserModal = () => {
        setIsAddUserModalOpen(true);
        setIsEditMode(false);
        setEditUserData(null);
    };

    const openEditModal = async (id: string) => {
        setIsAddUserModalOpen(true);
        setIsEditMode(true);
        setUserId(id);
    };

    const closeAddUserModal = () => {
        setIsAddUserModalOpen(false);
        setIsEditMode(false);
        setEditUserData(null);
    };

    const openUserAddonModal = (id: string) => {
        setIsUserAddonModalOpen(true);
        setUserId(id);
    };

    const closeUserAddonModal = () => {
        setIsUserAddonModalOpen(false);
    };

    const handleFormSubmit = async (values: any) => {
        try {
            const formData = new FormData();

            formData.append('first_name', values.first_name);
            formData.append('last_name', values.last_name);
            formData.append('role_id', values.role);
            formData.append('email', values.email);
            formData.append('phone_number', values.phone_number);
            if (values.password) {
                formData.append('password', values.password);
            }
            if (userId) {
                formData.append('id', userId);
            }

            const url = isEditMode && userId ? `/user/update` : `/user/create`;
            const isSuccess = await postData(url, formData);
            if (isSuccess) {
                handleSuccess();
                closeAddUserModal();
            }
        } catch (error) {
            handleApiError(error);
        }
    };
    const navigate = useNavigate();
    const SubmitAddon = async (values: any) => {
        try {
            const formData = new FormData();
            formData.append('id', userId ?? '');

            values.addons.forEach((addon: any, index: any) => {
                if (addon.checked) {
                    formData.append(`addons[${index}]`, addon.id);
                }
            });

            const postDataUrl = "/addon/assign";

            const isSuccess = await postData(postDataUrl, formData);
            if (isSuccess) {
                fetchData();
            }
        } catch (error) {
            handleApiError(error);
        }
    };
    const [showFilterOptions, setShowFilterOptions] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        fetchData();

    }, [searchTerm, currentPage]);
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        // Perform search logic here
       
    };

    const handleReset = () => {
        setSearchTerm('');
        // Perform reset logic here
        
    };

    return (
        <>
            {isLoading && <LoaderImg />}
            <div className="flex justify-between items-center">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Users</span>
                    </li>
                </ul>
                {isAddPermissionAvailable && (
                    <button type="button" className="btn btn-dark" onClick={openAddUserModal}>
                        Add User
                    </button>
                )}
            </div>

            <AddUserModals getData={getData} isOpen={isAddUserModalOpen} onClose={closeAddUserModal} onSubmit={handleFormSubmit} isEditMode={isEditMode} userId={userId} />
            <UserAddonModal getData={getData} isOpen={isUserAddonModalOpen} onClose={closeUserAddonModal} onSubmit={SubmitAddon} userId={userId} />
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5 spacebetween">
                    <h5 className="font-semibold text-lg dark:text-white-light">Users</h5>
                    {showFilterOptions && (
                        <SearchBar
                            onSearch={handleSearch}
                            onReset={handleReset}
                            hideReset={Boolean(searchTerm)}
                            placeholder="Enter search term..."
                        />
                    )}
                </div>
             
                {data?.length > 0 ? (
                    <>
                        <div className="datatables">
                            <DataTable
                                className=" table-striped table-hover table-bordered table-compact"
                                columns={columns}
                                data={data}
                                noHeader
                                defaultSortAsc={false}
                                striped={true}
                                persistTableHead
                                highlightOnHover
                                responsive={true}
                            />
                        </div>
                    </>

                ) : (
                    <div className="all-center-flex">
                        <img src={noDataImage} alt="No data found" className="nodata-image" />
                    </div>
                )}
            </div>

            {data?.length > 0 && lastPage > 1 && <CustomPagination currentPage={currentPage} lastPage={lastPage} handlePageChange={handlePageChange} />}
        </>
    );
};

export default withApiHandler(ManageUser);
