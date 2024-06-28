import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import LoaderImg from '../../../utils/Loader';
import { setPageTitle } from '../../../store/themeConfigSlice';
import withApiHandler from '../../../utils/withApiHandler';
import CustomSwitch from '../../FormikFormTools/CustomSwitch';
import useToggleStatus from '../../../utils/ToggleStatus';
import useCustomDelete from '../../../utils/customDelete';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import CustomPagination from '../../../utils/CustomPagination';
import ErrorHandler from '../../../hooks/useHandleError';
import AddClientModal from './AddClientModal';
import noDataImage from '../../../assets/noDataFoundImage/noDataFound.png'; // Import the image
import showMessage from '../../../hooks/showMessage';
import { fetchStoreData } from '../../../store/dataSlice';
import { IRootState } from '../../../store';
import UserAddonModal from '../ManageUser/UserAddonModal';
import Dropdown from '../../Dropdown';
import IconHorizontalDots from '../../Icon/IconHorizontalDots';

interface ManageUserProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    // onSubmit: (values: any, formik: any) => Promise<void>;
}

interface RowData {
    id: string;
    full_name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    client_code: string;
    addons: string;
    created_date: string;
    status: number;
}

const ManageClient: React.FC<ManageUserProps> = ({ postData, getData, isLoading }) => {
    const [data, setData] = useState<RowData[]>([]);
    const dispatch = useDispatch();
    const handleApiError = ErrorHandler();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserData, setEditUserData] = useState<Partial<RowData> | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // Assuming userId is a string
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const navigate = useNavigate();
    const [isUserAddonModalOpen, setIsUserAddonModalOpen] = useState(false);

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
            const response = await getData(`/client/list?page=${currentPage}`);
            if (response && response.data && response.data.data) {
                setData(response.data.data?.clients);
                setCurrentPage(response.data.data?.currentPage || 1);
                setLastPage(response.data.data?.lastPage || 1);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
            // console.error('API error:', error);
        }
    };
    const { toggleStatus } = useToggleStatus();
    const toggleActive = (row: RowData) => {
        const formData = new FormData();
        formData.append('id', row.id.toString());
        formData.append('status', (row.status === 1 ? 0 : 1).toString());
        toggleStatus(postData, '/client/update-status', formData, handleSuccess);
    };
    const { customDelete } = useCustomDelete();

    const handleDelete = (id: any) => {
        const formData = new FormData();
        formData.append('id', id);
        customDelete(postData, 'client/delete', formData, handleSuccess);
    };
    const handleClientLogin = async (id: any) => {
        try {
            const response = await getData(`/account-login/${id}`);
            if (response && response.data && response.data.data) {

                localStorage.setItem('token', response.data.data?.access_token);
                localStorage.setItem('superiorId', response.data.data?.superiorId);
                localStorage.setItem('superiorRole', response.data.data?.superiorRole);
                localStorage.setItem('role', response.data.data?.role);
                localStorage.setItem('auto_logout', response.data.data?.auto_logout);
                localStorage.setItem('authToken', response.data.data?.token);
                const actionResult = await dispatch<any>(fetchStoreData());
                showMessage('Login Successfully');
                navigate('/');
                if (response.data.data?.is_verified === true) {
                    navigate('/');
                } else if (response.data.data?.is_verified === false) {
                    navigate('/validateOtp');
                }
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
            // console.error('API error:', error);
        }
    };
    const UserPermissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);


    const isAssignAddPermissionAvailable = UserPermissions?.includes('client-assign-permission');
    const isEditPermissionAvailable = UserPermissions?.includes('client-edit');
    const isDeletePermissionAvailable = UserPermissions?.includes('client-delete');

    const anyPermissionAvailable = isEditPermissionAvailable || isAssignAddPermissionAvailable || isDeletePermissionAvailable;
    const openUserAddonModal = (id: string) => {
        setIsUserAddonModalOpen(true);
        setUserId(id);
    };

    const closeUserAddonModal = () => {
        setIsUserAddonModalOpen(false);
    };
    const columns: any = [
        // Other columns
        {
            name: 'Client Name',
            selector: (row: RowData) => row.full_name,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{`${row.full_name}`}</h6>
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
            name: 'Email',
            selector: (row: RowData) => row.email,
            sortable: false,
            width: '15%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{`${row.email}`}</h6>
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
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{`${row.created_date}`}</h6>
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
                <Tippy content={<div>Status</div>} placement="top">
                    {row.status === 1 || row.status === 0 ? (
                        <CustomSwitch checked={row.status === 1} onChange={() => toggleActive(row)} />
                    ) : (
                        <div className="pointer" onClick={() => toggleActive(row)}>
                            Unknown
                        </div>
                    )}
                </Tippy>
            ),
        },
        anyPermissionAvailable
            ? {
                name: 'Actions',
                selector: (row: RowData) => row.id,
                sortable: false,
                width: '20%',
                cell: (row: RowData) => (
                    <span className="text-center">
                        <div className="flex items-center justify-center">
                            {/* <div className="inline-flex">
                                  <button type="button" onClick={() => openModal(row?.id)}>
                                      <i className="pencil-icon fi fi-rr-file-edit"></i>
                                  </button>

                                  <button onClick={() => handleDelete(row.id)} type="button">
                                      <i className="icon-setting delete-icon fi fi-rr-trash-xmark"></i>
                                  </button>

                                  {isAssignAddPermissionAvailable && (
                                      <button onClick={() => openUserAddonModal(row?.id)} type="button">
                                          <i className="fi fi-rr-user-add"></i>
                                      </button>
                                  )}

                                  <button onClick={() => navigate(`/manage-clients/assignreports/${row.id}`)} type="button">
                                      <i className="fi fi-rr-assign"></i>
                                  </button>

                                  <button onClick={() => handleClientLogin(row.id)} type="button">
                                      <i className="fi fi-rr-sign-in-alt"></i>
                             
                                  </button>
                              </div> */}
                            <div className="dropdown">
                                <Dropdown button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}>
                                    <ul>
                                        {isEditPermissionAvailable && (<>


                                            <li>
                                                <button type="button" onClick={() => openModal(row?.id)}>
                                                    <i className="pencil-icon fi fi-rr-file-edit"></i> Edit
                                                </button>

                                            </li>
                                        </>)}
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
                                                    <i className="fi fi-rr-user-add"></i> Assign Addon
                                                </button>
                                            )}
                                        </li>
                                        <li>
                                            <button onClick={() => handleClientLogin(row.id)} type="button">
                                                <i className="fi fi-rr-sign-in-alt"></i> Client Login
                                                {/* <div className="grid place-content-center w-10 h-10 border border-white-dark/20 dark:border-[#191e3a] rounded-md">
                                        </div> */}
                                            </button>
                                        </li>

                                        {isAssignAddPermissionAvailable && (<>
                                            <li>
                                                <button onClick={() => navigate(`/manage-clients/assignreports/${row.id}`)} type="button">
                                                    <i className="fi fi-rr-assign"></i> Assign Client Reports
                                                </button>
                                            </li>
                                        </>)}

                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                    </span >
                ),
            }
            : null,
    ];

    // client/detail?id=${selectedRowId}
    const openModal = async (id: string) => {
        try {
            setIsModalOpen(true);
            setIsEditMode(true);
            setUserId(id);
            // const response = await getData(`/client/detail?id=${id}`)`);
            // const response = await getData(`/client/detail?id=${id}`);
            // if (response && response.data) {
            //     setUserId(id)
            //     setEditUserData(response.data);
            // }
        } catch (error) {
            console.error('Error fetching client details:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditUserData(null);
    };

    const handleFormSubmit = async (values: any) => {
        try {
            const formData = new FormData();

            formData.append('first_name', values.first_name);
            formData.append('last_name', values.last_name);
            formData.append('client_code', values.client_code);
            formData.append('email', values.email);

            formData.append('phone_number', values.phone_number);
            formData.append('address', values.address);
            if (values.password) {
                formData.append('password', values.password);
            }
            if (userId) {
                formData.append('id', userId);
            }

            const url = isEditMode && userId ? `/client/update` : `/client/create`;

            const isSuccess = await postData(url, formData);
            if (isSuccess) {
                handleSuccess();
                closeModal();
            }
        } catch (error) {
            handleApiError(error);
        }
    };
    const SubmitAddon = async (values: any) => {
        try {
            const formData = new FormData();
            formData.append('id', userId ?? '');
            values.addons.forEach((addon: any, index: any) => {
                if (addon.checked) {
                    formData.append(`addons[${index}]`, addon.id);
                }
            });
            const postDataUrl = '/addon/assign';

            const isSuccess = await postData(postDataUrl, formData);
            if (isSuccess) {
                fetchData();
            }
        } catch (error) {
            handleApiError(error);
        }
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
                        <span>Clients</span>
                    </li>
                </ul>
                <button type="button" className="btn btn-dark " onClick={() => setIsModalOpen(true)}>
                    Add Client
                </button>
            </div>
            <AddClientModal getData={getData} isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} isEditMode={isEditMode} userId={userId} />
            <UserAddonModal getData={getData} isOpen={isUserAddonModalOpen} onClose={closeUserAddonModal} onSubmit={SubmitAddon} userId={userId} />

            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light"> Clients</h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        {/* <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} /> */}
                    </div>
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
                    <>
                        <img
                            src={noDataImage} // Use the imported image directly as the source
                            alt="no data found"
                            className="all-center-flex nodata-image"
                        />
                    </>
                )}
            </div>
            {data?.length > 0 && lastPage > 1 && <CustomPagination currentPage={currentPage} lastPage={lastPage} handlePageChange={handlePageChange} />}
        </>
    );
};

export default withApiHandler(ManageClient);
