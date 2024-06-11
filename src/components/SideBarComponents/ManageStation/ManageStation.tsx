import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import DataTable from 'react-data-table-component';
import LoaderImg from '../../../utils/Loader';
import { setPageTitle } from '../../../store/themeConfigSlice';
import withApiHandler from '../../../utils/withApiHandler';
import CustomSwitch from '../../FormikFormTools/CustomSwitch';
import useToggleStatus from '../../../utils/ToggleStatus';
import useCustomDelete from '../../../utils/customDelete';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrashLines from '../../Icon/IconTrashLines';
import IconPencil from '../../Icon/IconPencil';
import CustomPagination from '../../../utils/CustomPagination';
import ErrorHandler from '../../../hooks/useHandleError';
import AddEditStationModal from './AddEditStationModal';
import noDataImage from '../../../assets/noDataFoundImage/noDataFound.jpg'; // Import the image

interface ManageSiteProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    // onSubmit: (values: any, formik: any) => Promise<void>;
}

interface RowData {
    id: string; // Change type from number to string
    full_name: string;
    role: string;
    addons: string;
    created_date: string;
    status: number;
    station_status: number;
    station_name: string;
    station_code: string;
    station_address: string;
}

const ManageStation: React.FC<ManageSiteProps> = ({ postData, getData, isLoading }) => {
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
            const response = await getData(`/station/list?page=${currentPage}`);
            if (response && response.data && response.data.data) {
                setData(response.data.data?.stations);
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
        formData.append('station_status', (row.station_status === 1 ? 0 : 1).toString());
        toggleStatus(postData, '/station/update-status', formData, handleSuccess);
    };
    const { customDelete } = useCustomDelete();

    const handleDelete = (id: any) => {
        const formData = new FormData();
        formData.append('id', id);
        customDelete(postData, 'station/delete', formData, handleSuccess);
    };

    const isEditPermissionAvailable = true; // Placeholder for permission check
    const isDeletePermissionAvailable = true; // Placeholder for permission check
    const isAddonPermissionAvailable = true; // Placeholder for permission check

    const anyPermissionAvailable = isEditPermissionAvailable || isAddonPermissionAvailable || isDeletePermissionAvailable;

    const columns: any = [
        {
            name: 'Station Name',
            selector: (row: RowData) => row.station_name,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.station_name}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Station Code',
            selector: (row: RowData) => row.station_code,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.station_code}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Station Address',
            selector: (row: RowData) => row.station_address,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.station_address}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Created Date',
            selector: (row: RowData) => row.created_date,
            sortable: false,
            width: '20%',
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
            selector: (row: RowData) => row.station_status,
            sortable: false,
            width: '10%',
            cell: (row: RowData) => (
                <Tippy content={<div>Status</div>} placement="top">
                    {row.station_status === 1 || row.station_status === 0 ? (
                        <CustomSwitch checked={row.station_status === 1} onChange={() => toggleActive(row)} />
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
                name: 'Action',
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
                                    <button type="button" onClick={() => openModal(row?.id)}>
                                        <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                    </button>
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
    // station/detail?id=${selectedRowId}
    const openModal = async (id: string) => {
        try {
            setIsModalOpen(true);
            setIsEditMode(true);
            setUserId(id);
            // const response = await getData(`/station/detail?id=${id}`)`);
            // const response = await getData(`/station/detail?id=${id}`);
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

            formData.append('client_id', values.client_id);
            formData.append('entity_id', values.entity_id);
            formData.append('data_import_type_id', values.data_import_type_id);
            formData.append('security_amount', values.security_amount);
            formData.append('start_date', values.start_date);
            formData.append('station_address', values.station_address);
            formData.append('station_code', values.station_code);
            formData.append('station_display_name', values.station_display_name);
            formData.append('station_name', values.station_name);
            formData.append('station_status', values.station_status);
            formData.append('supplier_id', values.supplier_id);
            if (userId) {
                formData.append('id', userId);
            }

            const url = isEditMode && userId ? `/station/update` : `/station/create`;
            const response = await postData(url, formData);

            if (response && response.status_code == 200) {

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
                        <span>Stations</span>
                    </li>
                </ul>

                <button type="button" className="btn btn-dark" onClick={() => setIsModalOpen(true)}>
                    Add Station
                </button>
            </div>
            <AddEditStationModal getData={getData} isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} isEditMode={isEditMode} userId={userId} />

            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light"> Stations</h5>
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

export default withApiHandler(ManageStation);
