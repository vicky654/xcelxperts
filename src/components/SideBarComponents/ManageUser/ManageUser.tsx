import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import LoaderImg from '../../../utils/Loader';
import useApiErrorHandler from '../../../hooks/useHandleError';
import { setPageTitle } from '../../../store/themeConfigSlice';
import withApiHandler from '../../../utils/withApiHandler';
import AddUserModals from './AddUserModals';
import CustomSwitch from '../../FormikFormTools/CustomSwitch';
import useToggleStatus from '../../../utils/ToggleStatus';
import useCustomDelete from '../../../utils/customDelete';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrashLines from '../../Icon/IconTrashLines';
import IconPencil from '../../Icon/IconPencil';
import CustomPagination from '../../../utils/CustomPagination';

interface ManageUserProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    onSubmit: (values: any, formik: any) => Promise<void>;
}

interface RowData {
    id: string; // Change type from number to string
    full_name: string;
    role: string;
    addons: string;
    created_date: string;
    status: number;
}

const ManageUser: React.FC<ManageUserProps> = ({ postData, getData, isLoading }) => {
    const [data, setData] = useState<RowData[]>([]);

    const dispatch = useDispatch();
    const handleApiError = useApiErrorHandler();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserData, setEditUserData] = useState<Partial<RowData> | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // Assuming userId is a string
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const navigate = useNavigate();
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
            const response = await getData(`/user/list?page=${currentPage}`);
            if (response && response.data && response.data.data) {
                setData(response.data.data?.users);
                setCurrentPage(response.data.data?.currentPage || 1)
                setLastPage(response.data.data?.lastPage || 1)
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
            console.error('API error:', error);
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

    const isEditPermissionAvailable = true; // Placeholder for permission check
    const isDeletePermissionAvailable = true; // Placeholder for permission check
    const isAddonPermissionAvailable = true; // Placeholder for permission check

    const anyPermissionAvailable = isEditPermissionAvailable || isAddonPermissionAvailable || isDeletePermissionAvailable;

    const columns: any = [
        {
            name: 'Full Name',
            selector: (row: RowData) => row.full_name,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
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
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.role}</h6>
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
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
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
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
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
                <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
                    {row.status === 1 || row.status === 0 ? (
                        <CustomSwitch checked={row.status === 1} onChange={() => toggleActive(row)} />
                    ) : (
                        <div className="pointer" onClick={() => toggleActive(row)}>
                            Unknown
                        </div>
                    )}
                </OverlayTrigger>
            ),
        },
        anyPermissionAvailable
            ? {
                name: 'Action',
                selector: (row: RowData) => row.id,
                sortable: false,
                width: '20%',
                cell: (row: RowData) => (
                    <span className="text-center">
                        <div className="flex items-center justify-center">
                            <div className="inline-flex">
                                {/* <div className="dropdown">
                                      <Dropdown
                                          btnClassName="btn btn-success dropdown-toggle"
                                          button={
                                              <>
                                                  Action
                                                  <span>
                                                      <IconCaretDown className="ltr:ml-1 rtl:mr-1 inline-block" />
                                                  </span>
                                              </>
                                          }
                                      >
                                          <ul className="!min-w-[170px]">
                                              <li>
                                                  <button type="button">Edit</button>
                                              </li>
                                              <li>
                                                  <button type="button" onClick={() => handleDelete(row.id)}>
                                                      Delete
                                                  </button>
                                              </li>
                                          </ul>
                                      </Dropdown>
                                  </div> */}

                                <Tippy content="Edit">
                                    <>
                                        <button type="button" onClick={() => openModal(row?.id)}>
                                            <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                        </button>
                                    </>
                                </Tippy>
                                <Tippy content="Delete">
                                    <button onClick={() => handleDelete(row.id)} type="button">
                                        <IconTrashLines />
                                    </button>
                                </Tippy>
                            </div>
                        </div>
                    </span>
                ),
            }
            : null,
    ];
    // user/detail?id=${selectedRowId}
    const openModal = async (id: string) => {
        try {
            setIsModalOpen(true);
            setIsEditMode(true);
            setUserId(id);
            // const response = await getData(`/user/detail?id=${id}`)`);
            // const response = await getData(`/user/detail?id=${id}`);
            // if (response && response.data) {
            //     setUserId(id)
            //     setEditUserData(response.data);
            // }
        } catch (error) {
            console.error('Error fetching user details:', error);
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
            console.log(values, 'values');
            formData.append('first_name', values.first_name);
            formData.append('last_name', values.last_name);
            formData.append('role_id', values.role);
            formData.append('email', values.email);
            formData.append('phone_number', values.phone_number);
            if (values.phone_number) {

                formData.append('password', values.password);
            }
            if (userId) {
                formData.append('id', userId);
            }
            // formData.append('id', values.user_id);

            const url = isEditMode && userId ? `/user/update` : `/user/add`;
            const response = await postData(url, formData);

            if (response && response.status_code == 200) {
                console.log(response, 'status_code');
                console.log(response.status_code == 200, 'status_code');
                // fetchData()
                handleSuccess();
                closeModal();
            } else {
                console.error('Form submission failed:', response.statusText);
            }
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    return (
        <>
            {isLoading && <LoaderImg />}
            <div className="flex justify-between items-center">
                <ol className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4">
                        <span>Manage User</span>
                    </li>
                </ol>
                <button type="button" className="btn btn-dark" onClick={() => setIsModalOpen(true)}>
                    Add User
                </button>
            </div>
            <AddUserModals getData={getData} isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} isEditMode={isEditMode} userId={userId} />

            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Manage User</h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        {/* <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} /> */}
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        columns={columns}
                        data={data}
                        noHeader
                        // defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        persistTableHead
                        // pagination
                        // paginationPerPage={20}
                        highlightOnHover
                        // searchable={true}
                        responsive={true}
                    />
                </div>
            </div>
            {data?.length > 0 && lastPage > 1 && (
                <CustomPagination currentPage={currentPage} lastPage={lastPage} handlePageChange={handlePageChange} />
            )}
        </>
    );
};

export default withApiHandler(ManageUser);
