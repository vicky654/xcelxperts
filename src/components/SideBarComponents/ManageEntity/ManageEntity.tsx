import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import DataTable from 'react-data-table-component';
import LoaderImg from '../../../utils/Loader';
import { setPageTitle } from '../../../store/themeConfigSlice';
import withApiHandler from '../../../utils/withApiHandler';
import AddUserModals from './AddEditEntityModals';
import CustomSwitch from '../../FormikFormTools/CustomSwitch';
import useToggleStatus from '../../../utils/ToggleStatus';
import useCustomDelete from '../../../utils/customDelete';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrashLines from '../../Icon/IconTrashLines';
import IconPencil from '../../Icon/IconPencil';
import CustomPagination from '../../../utils/CustomPagination';
import ErrorHandler from '../../../hooks/useHandleError';
import noDataImage from '../../../assets/noDataFoundImage/noDataFound.jpg'; // Import the image
import AddEditEntityModals from './AddEditEntityModals';

interface ManageUserProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
}
interface RowData {
    id: string;
    entity_name: string;
    entity_code: string;
    entity_details: string;
    created_date: string;
    status: number;
    client_id: string;
}

const ManageUser: React.FC<ManageUserProps> = ({ postData, getData, isLoading }) => {
    useEffect(() => {
        dispatch(setPageTitle('Entities'));
    });
    const [data, setData] = useState<RowData[]>([]);
    const dispatch = useDispatch();
    const handleApiError = ErrorHandler();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserData, setEditUserData] = useState<Partial<RowData> | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // Assuming userId is a string
    const [clientId, setclientId] = useState<string | null>(null); // Assuming userId is a string
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const navigate = useNavigate();
    useEffect(() => {
        fetchData();
        // dispatch(setPageTitle('Alternative Pagination Table'));
    }, [dispatch, currentPage]);
    const handleSuccess = () => {
        fetchData();
    };

    const handlePageChange = (newPage: any) => {
        setCurrentPage(newPage);
    };

    const fetchData = async () => {
        try {
            const response = await getData(`/entity/list?page=${currentPage}`);
            if (response && response.data && response.data.data) {
                setData(response.data.data?.entities);
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
        toggleStatus(postData, '/entity/update-status', formData, handleSuccess);
    };
    const { customDelete } = useCustomDelete();

    const handleDelete = (id: any) => {
        const formData = new FormData();
        formData.append('id', id);
        customDelete(postData, 'entity/delete', formData, handleSuccess);
    };

    const isEditPermissionAvailable = true; // Placeholder for permission check
    const isDeletePermissionAvailable = true; // Placeholder for permission check
    const isAddonPermissionAvailable = true; // Placeholder for permission check

    const anyPermissionAvailable = isEditPermissionAvailable || isAddonPermissionAvailable || isDeletePermissionAvailable;

    const columns: any = [
        {
            name: 'Entity Name',
            selector: (row: RowData) => row.entity_name,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.entity_name}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Entity Code',
            selector: (row: RowData) => row.entity_code,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.entity_code}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Entity Details',
            selector: (row: RowData) => row.entity_details,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.entity_details}</h6>
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
                width: '10%',
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
                                    <button type="button" onClick={() => openModal(row.id, row.client_id)}>
                                        <i className="pencil-icon fi fi-rr-file-edit"></i>
                                    </button>
                                </Tippy>
                                <Tippy content="Delete">
                                    <button onClick={() => handleDelete(row.id)} type="button">
                                        <i className="icon-setting delete-icon fi fi-rr-trash-xmark"></i>
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
    const openModal = async (id: string, EditclientId: string) => {
        try {
            setIsModalOpen(true);
            setIsEditMode(true);
            setUserId(id);
            setclientId(EditclientId)

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

            formData.append('client_id', values.client_id);
            formData.append('entity_name', values.entity_name);
            formData.append('entity_code', values.entity_code);
            formData.append('address', values.address);
            formData.append('website', values.website);
            formData.append('entity_details', values.entity_details);
            formData.append('start_month', values.start_month);
            formData.append('end_month', values.end_month);
            if (userId) {
                formData.append('entity_id', userId);
            }
            // formData.append('id', values.user_id);
            const url = isEditMode && userId ? `/entity/update` : `/entity/create`;
            const response = await postData(url, formData);

            if (response) {
                handleSuccess();
                closeModal();
            } else {
                console.error('Form submission failed:', response.statusText);
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
                        <span>Entities</span>
                    </li>
                </ul>
                <button type="button" className="btn btn-dark gradient-blue-to-blue" onClick={() => setIsModalOpen(true)}>
                    Add Entity
                </button>
            </div>
            <AddEditEntityModals getData={getData} isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} isEditMode={isEditMode} userId={userId} clientId={clientId} />

            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Entities</h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        {/* <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} /> */}
                    </div>
                </div>
                {data?.length > 0 ? (
                    <>
                        <div className="datatables">
                            <DataTable
                                className="whitespace-nowrap table-striped table-hover table-bordered table-compact"
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

export default withApiHandler(ManageUser);
