import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import useErrorHandler from '../../../../hooks/useHandleError';
import { IRootState } from '../../../../store';
import useToggleStatus from '../../../../utils/ToggleStatus';
import useCustomDelete from '../../../../utils/customDelete';
import CustomSwitch from '../../../FormikFormTools/CustomSwitch';
import AddEditStationEmployeeModal from './AddEditStationEmployeeModal';
import SearchBar from '../../../../utils/SearchBar';
import LoaderImg from '../../../../utils/Loader';
import CustomPagination from '../../../../utils/CustomPagination';
import withApiHandler from '../../../../utils/withApiHandler';
import noDataImage from '../../../../assets/AuthImages/noDataFound.png'; // Import the image
import Dropdown from '../../../Dropdown';
import IconHorizontalDots from '../../../Icon/IconHorizontalDots';
import AddUserSalary from '../../ManageUser/AddUserSalary';

interface ManageSiteProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    // onSubmit: (values: any, formik: any) => Promise<void>;
}

interface RowData {
    phone: any;
    shift: any;
    name: any;
    prev_balance: any;
    id: any;
    status: any;
    created_date: any;

}

const ManageStationEmployee: React.FC<ManageSiteProps> = ({ postData, getData, isLoading }) => {
    const [data, setData] = useState<RowData[]>([]);
    const handleApiError = useErrorHandler();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserData, setEditUserData] = useState<Partial<RowData> | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // Assuming userId is a string
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [stationname, setstationname] = useState("");
    const [isUserSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
    let storedKeyItems = localStorage.getItem("stationTank") || '[]';


    const UserPermissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);

    const isAddPermissionAvailable = UserPermissions?.includes("employee-create");
    const isListPermissionAvailable = UserPermissions?.includes("employee-list");
    const isEditPermissionAvailable = UserPermissions?.includes("employee-edit");
    const isEmployeeHistoryPermissionAvailable = UserPermissions?.includes("employee-history");
    const isDeletePermissionAvailable = UserPermissions?.includes("employee-delete");

    const anyPermissionAvailable = isEditPermissionAvailable || isDeletePermissionAvailable || isEmployeeHistoryPermissionAvailable;

    const [showFilterOptions,] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (id) {
            handleApplyFilters(id);
        }
    }, [searchTerm, currentPage, id]);


    const handleSuccess = () => {
        handleApplyFilters(JSON.parse(storedKeyItems));
    };


    const handlePageChange = (newPage: any) => {
        setCurrentPage(newPage);
    };


    const { toggleStatus } = useToggleStatus();
    const toggleActive = (row: RowData) => {
        const formData = new FormData();
        formData.append('id', row.id.toString());
        formData.append('status', (row.status === 1 ? 0 : 1).toString());
        toggleStatus(postData, '/station/employee/update-status', formData, handleSuccess);
    };

    const { customDelete } = useCustomDelete();
    const handleDelete = (row: any) => {
        const formData = new FormData();
        formData.append('id', row?.id);
        customDelete(postData, 'station/employee/delete', formData, handleSuccess);
    };

    const columns: any = [

        {
            name: 'Employee Name',
            selector: (row: RowData) => row.name,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Phone Number',
            selector: (row: RowData) => row.phone,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.phone}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Shift',
            selector: (row: RowData) => row.shift,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.shift}</h6>
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
            width: '10%',
            cell: (row: RowData) => (
                <>
                    {isEditPermissionAvailable && <>
                        <Tippy content={<div>Status</div>} placement="top">
                            {row.status === 1 || row.status === 0 ? (
                                <CustomSwitch checked={row.status === 1} onChange={() => toggleActive(row)} />
                            ) : (
                                <div className="pointer" >
                                    Unknown
                                </div>
                            )}
                        </Tippy>
                    </>}
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



                                        {isEditPermissionAvailable && (
                                            <li>
                                                <button type="button" onClick={() => openModal(row?.id)}>
                                                    <i className="pencil-icon fi fi-rr-file-edit"></i>Edit
                                                </button>
                                            </li>
                                        )}


                                        {isDeletePermissionAvailable && (
                                            <li>
                                                <button onClick={() => handleDelete(row)} type="button">
                                                    <i className="icon-setting delete-icon fi fi-rr-trash-xmark"></i> Delete
                                                </button>
                                            </li>
                                        )}
                                        {isListPermissionAvailable && (
                                            <li>
                                                <button onClick={() => navigate(`/manage-employees-history/${row.id}`)}  type="button">
                                                    <i className="fi fi fi-rr-circle-user"></i>Employee History
                                                </button>
                                            </li>
                                        )}
                                              <li>
                                            {isAddPermissionAvailable && (
                                                <button onClick={() => openUserSalaryModal(row?.id)} type="button">
                                                    <i className="fi fi-rr-money mt-2"></i>  Salary
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
    ];
    // station/detail?id=${selectedRowId}
    const openModal = async (id: string) => {
        try {
            setIsModalOpen(true);
            setIsEditMode(true);
            setUserId(id);

        } catch (error) {
            handleApiError(error);
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
            formData.append('name', values.name);
            formData.append('station_id', values.station_id);
            formData.append('phone', values.phone);
            formData.append('prev_balance', values.prev_balance);
            formData.append('shift', values.shift);

            if (userId) {
                formData.append('id', userId);
            }

            const url = isEditMode && userId ? `/station/employee/update` : `/station/employee/create`;
            const response = await postData(url, formData);

            if (response) {


                handleSuccess();
                closeModal();
            }
        } catch (error) {
            handleApiError(error);
        }
    };
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        // Perform search logic here

    };

    const handleReset = () => {
        setSearchTerm('');
        // Perform reset logic here

    };
    const handleApplyFilters = async (values: any) => {
        try {

            let apiUrl = `/station/employee/list?station_id=${id}&page=${currentPage}`;
            if (searchTerm) {
                apiUrl += `&search_keywords=${searchTerm}`;
            }
            const response = await getData(apiUrl);
            if (response && response.data && response.data.data) {
                setstationname(response.data.data?.station_name)
                setData(response.data.data?.employees);
                setCurrentPage(response.data.data?.currentPage || 1);
                setLastPage(response.data.data?.lastPage || 1);

            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);

        }
    };
    const openUserSalaryModal = (id: string) => {
        setIsSalaryModalOpen(true);
        setUserId(id);
    };

    const closeUserSalaryModal = () => {
        setIsSalaryModalOpen(false);
    };



    return (
        <>
            {isLoading && <LoaderImg />}
            <div className="flex justify-between items-center flex-wrap">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/dashboard" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to={`/manage-stations`} className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-primary hover:underline">
                            Manage Stations
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Station Employee </span>
                    </li>
                </ul>
                {isAddPermissionAvailable && <>
                    <button type="button" className="btn btn-dark mt-2 md:mt-0" onClick={() => setIsModalOpen(true)}>
                        Add Station Employee
                    </button>
                </>}

            </div>
            <AddEditStationEmployeeModal getData={getData} isOpen={isModalOpen} onClose={closeModal} station_id={id} onSubmit={handleFormSubmit} isEditMode={isEditMode} userId={userId} />
            <AddUserSalary getData={getData} postData={postData}  isOpen={isUserSalaryModalOpen} onClose={closeUserSalaryModal}   userId={userId} />
           
            <div className=" mt-6">
                <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-1 mb-6'>





                    <div className='panel h-full xl:col-span-3'>


                        <div className="flex md:items-center md:flex-row flex-col mb-5 gap-2 spacebetween">
                            <h5 className="font-bold text-lg dark:text-white-light">
                                Station Employee {stationname && `(${stationname})`}
                            </h5>

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
                                    {lastPage > 1 && <CustomPagination currentPage={currentPage} lastPage={lastPage} handlePageChange={handlePageChange} />}
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

                </div>

            </div>

        </>
    );
};

export default withApiHandler(ManageStationEmployee);
