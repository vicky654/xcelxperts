import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import noDataImage from '../../../assets/AuthImages/noDataFound.png'; // Import the image
import useErrorHandler from '../../../hooks/useHandleError';
import { setPageTitle } from '../../../store/themeConfigSlice';
import useToggleStatus from '../../../utils/ToggleStatus';
import useCustomDelete from '../../../utils/customDelete';
import CustomSwitch from '../../FormikFormTools/CustomSwitch';
import LoaderImg from '../../../utils/Loader';
import CustomPagination from '../../../utils/CustomPagination';
import withApiHandler from '../../../utils/withApiHandler';
import AddEditStationTankModal from './AddEditStationBank';

import * as Yup from 'yup';
import { IRootState } from '../../../store';
import CustomInput from '../../ManageStationTank/CustomInput';
import SearchBar from '../../../utils/SearchBar';
import IconX from '../../Icon/IconX';

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
    station: string;
    bank_name: string;
    account_no: string;
    station_code: string;
    station_address: string;
    storedKeyItems?: any;
    storedKeyName?: any;
}

const ManageStationTank: React.FC<ManageSiteProps> = ({ postData, getData, isLoading }) => {
    const [data, setData] = useState<RowData[]>([]);
    const dispatch = useDispatch();
    const handleApiError = useErrorHandler();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserData, setEditUserData] = useState<Partial<RowData> | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // Assuming userId is a string
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const navigate = useNavigate();
    const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
    const [showFilterOptions, setShowFilterOptions] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    let storedKeyItems = localStorage.getItem("stationTank") || '[]';
    let storedKeyName = "stationTank";

    const UserPermissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);

    const isAddPermissionAvailable = UserPermissions?.includes("station-bank-create");
    const isListPermissionAvailable = UserPermissions?.includes("station-bank-list");
    const isEditPermissionAvailable = UserPermissions?.includes("station-bank-edit");
    const isEditSettingPermissionAvailable = UserPermissions?.includes("station-bank-setting");
    const isDeletePermissionAvailable = UserPermissions?.includes("station-bank-delete");
    const isAssignAddPermissionAvailable = UserPermissions?.includes("station-bank-assign-permission");

    const anyPermissionAvailable = isEditPermissionAvailable || isDeletePermissionAvailable;




    useEffect(() => {
        const storedData = localStorage.getItem(storedKeyName);

        if (storedData) {
            handleApplyFilters(JSON.parse(storedData));
        }
        dispatch(setPageTitle('Alternative Pagination Table'));
    }, [dispatch, currentPage, searchTerm]);
    const handleSuccess = () => {
        handleApplyFilters(JSON.parse(storedKeyItems));
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        // Perform search logic here

    };

    const handleReset = () => {
        setSearchTerm('');
        // Perform reset logic here

    };
    const handlePageChange = (newPage: any) => {
        setCurrentPage(newPage);
    };


    const { toggleStatus } = useToggleStatus();
    const toggleActive = (row: RowData) => {
        const formData = new FormData();
        formData.append('id', row.id.toString());
        formData.append('status', (row.status === 1 ? 0 : 1).toString());
        toggleStatus(postData, '/station/bank/update-status', formData, handleSuccess);
    };
    const { customDelete } = useCustomDelete();

    const handleDelete = (id: any) => {
        const formData = new FormData();
        formData.append('id', id);
        customDelete(postData, 'station/delete', formData, handleSuccess);
    };

    const columns: any = [

        {
            name: 'Bank Name',
            selector: (row: RowData) => row.bank_name,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.bank_name}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Station Name',
            selector: (row: RowData) => row.station,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.station}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Account No',
            selector: (row: RowData) => row.account_no,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.account_no}</h6>
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
                            <div className="inline-flex">


                                {isEditPermissionAvailable && <>
                                    <Tippy content="Edit">
                                        <button type="button" onClick={() => openModal(row?.id)}>
                                            <i className="pencil-icon fi fi-rr-file-edit"></i>
                                        </button>
                                    </Tippy>

                                </>}
                                {isDeletePermissionAvailable && <>
                                    <Tippy content="Delete">
                                        <button onClick={() => handleDelete(row.id)} type="button">
                                            <i className="icon-setting delete-icon fi fi-rr-trash-xmark"></i>
                                        </button>
                                    </Tippy>
                                </>}

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
        setIsFilterModalOpen(false);
    };

    const handleFormSubmit = async (values: any) => {
        try {
            const formData = new FormData();

            formData.append('bank_id', values.bank_id);
            formData.append('account_no', values.account_no);
            formData.append('station_id', values.station_id);


            if (userId) {
                formData.append('id', userId);
            }

            const url = isEditMode && userId ? `/station/bank/update` : `/station/bank/create`;
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
    const handleApplyFilters = async (values: any) => {
        // Store the form values in local storage
        // localStorage.setItem("stationTank", JSON.stringify(values));
        try {
            // const response = await getData(`/station/bank/list?station_id=${values?.station_id}`);
            let apiUrl = `station/bank/list?station_id=${values?.station_id}&page=${currentPage}`;
            if (searchTerm) {
                apiUrl += `&search_keywords=${searchTerm}`;
            }

            setFilters(values)
            const response = await getData(apiUrl);
            if (response && response.data && response.data.data) {
                setData(response.data.data?.listing);
                setIsFilterModalOpen(false);
                setCurrentPage(response.data.data?.currentPage || 1);
                setLastPage(response.data.data?.lastPage || 1);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);

        }
    };
    const filterValues = async (values: any) => {
        console.log(values, "filterValues");
    };


    const validationSchemaForCustomInput = Yup.object({
        client_id: isNotClient
            ? Yup.string().required("Client is required")
            : Yup.mixed().notRequired(),
        entity_id: Yup.string().required("Entity is required"),
        station_id: Yup.string().required('Station is required'),
    });

    // const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // const closeModal = () => {
    //     setIsModalOpen(false);
    //     setIsFilterModalOpen(false);
    // }

    const [filters, setFilters] = useState<any>({
        client_id: localStorage.getItem('client_id') || '',
        company_id: localStorage.getItem('company_id') || '',
        site_id: localStorage.getItem('site_id') || '',
    });



    return (
        <>
            {isLoading && <LoaderImg />}
            <div className="flex  justify-start md:justify-between items-center flex-wrap">
                <ul className="flex space-x-2 rtl:space-x-reverse mb-2 md:mb-0">
                    <li>
                        <Link to="/dashboard" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Station Banks</span>
                    </li>
                </ul>
                {isAddPermissionAvailable && (
                    <button type="button" className="btn btn-dark" onClick={() => setIsModalOpen(true)}>
                        Add Station Bank
                    </button>
                )}


            </div>

            <AddEditStationTankModal
                getData={getData}
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleFormSubmit}
                isEditMode={isEditMode}
                userId={userId}
            />

            <div className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-1 mb-6">
                    {/* CustomInput Section */}
                    <div className="panel h-full hidden md:block">
                        <CustomInput
                            getData={getData}
                            isLoading={isLoading}
                            onApplyFilters={handleApplyFilters}
                            FilterValues={filterValues}
                            showClientInput={true}
                            showEntityInput={true}
                            showStationInput={true}
                            showStationValidation={true}
                            validationSchema={validationSchemaForCustomInput}
                            layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-1 gap-5"
                            isOpen={false}
                            onClose={closeModal}
                            showDateInput={false}
                            storedKeyName={storedKeyName}
                        />
                    </div>

                    {/* Button for Small Screens */}
                    <div className="md:hidden flex justify-end flex-col gap-4 flex-wrap">
                        {filters?.client_name || filters?.entity_name || filters?.station_name ? (
                            <>
                                <div className="badges-container flex flex-wrap items-center gap-2  text-white" >
                                    {filters?.client_id && (
                                        <div className="badge bg-blue-600 flex items-center gap-2 px-2 py-1 ">
                                            <span className="font-semibold">Client :</span> {filters?.client_name}
                                        </div>
                                    )}

                                    {filters?.entity_name && (
                                        <div className="badge bg-green-600 flex items-center gap-2 px-2 py-1 ">
                                            <span className="font-semibold">Entity : </span> {filters?.entity_name}
                                        </div>
                                    )}

                                    {filters?.station_name && (
                                        <div className="badge bg-red-600 flex items-center gap-2 px-2 py-1 ">
                                            <span className="font-semibold">Station :</span> {filters?.station_name}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            ''
                        )}
                    </div>



                    {/* Main Content */}
                    <div className="panel h-full xl:col-span-3">
                        <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5 spacebetween">
                            <h5 className="font-semibold text-lg dark:text-white-light">Station Banks</h5>
                            {showFilterOptions && (
                                <SearchBar
                                    onSearch={handleSearch}
                                    onReset={handleReset}
                                    hideReset={Boolean(searchTerm)}
                                    placeholder="Enter search term..."
                                />
                            )}
                            <div className="md:hidden flex">
                                <button type="button" className="btn btn-primary" onClick={() => setIsFilterModalOpen(true)}>
                                    Filter
                                </button>
                            </div>
                        </div>
                        {data?.length > 0 ? (
                            <div className="datatables">
                                <DataTable
                                    className="table-striped table-hover table-bordered table-compact"
                                    columns={columns}
                                    data={data}
                                    noHeader
                                    defaultSortAsc={false}
                                    striped={true}
                                    persistTableHead
                                    highlightOnHover
                                    responsive={true}
                                />
                                {lastPage > 1 && (
                                    <CustomPagination currentPage={currentPage} lastPage={lastPage} handlePageChange={handlePageChange} />
                                )}
                            </div>

                        ) : (
                            <img
                                src={noDataImage} // Use the imported image directly as the source
                                alt="no data found"
                                className="all-center-flex nodata-image"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Pagination */}


            {/* Modal for Filters on Small Screens */}
            {isFilterModalOpen && (
                <div className="modal fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white w-full max-w-md m-6">
                        <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                            <h5 className="text-lg font-bold">
                                Apply Filter
                            </h5>
                            <button onClick={closeModal} type="button" className="text-white-dark hover:text-dark">
                                <IconX />
                            </button>
                        </div>

                        <div className='p-6'>
                            <CustomInput
                                getData={getData}
                                smallScreen={true}
                                isLoading={isLoading}
                                onApplyFilters={handleApplyFilters}
                                FilterValues={filterValues}
                                showClientInput={true}
                                showEntityInput={true}
                                showStationInput={true}
                                showStationValidation={true}
                                validationSchema={validationSchemaForCustomInput}
                                layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-1 gap-5"
                                isOpen={isFilterModalOpen}
                                onClose={closeModal}
                                showDateInput={false}
                                storedKeyName={storedKeyName}
                            />
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default withApiHandler(ManageStationTank);
