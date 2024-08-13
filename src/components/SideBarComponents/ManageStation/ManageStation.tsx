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
import AddEditStationModal from './AddEditStationModal';
import noDataImage from '../../../assets/AuthImages/noDataFound.png'; // Import the image
import { IRootState } from '../../../store';
import Dropdown from '../../Dropdown';
import IconHorizontalDots from '../../Icon/IconHorizontalDots';
import SearchBar from '../../../utils/SearchBar';

interface ManageSiteProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    // onSubmit: (values: any, formik: any) => Promise<void>;
}

interface RowData {
    id: string; // Change type from number to string
    full_name: string;
    client_name: string;
    entity_name: string;
    role: string;
    addons: string;
    created_date: string;
    status: number;
    station_status: number;
    station_name: string;
    station_code: string;
    station_address: string;
    supplier_code: string;
    logo: string;
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
    const [showFilterOptions, setShowFilterOptions] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    // useEffect(() => {
    //     fetchData();

    // }, [searchTerm, currentPage]);
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        // Perform search logic here

    };

    const handleReset = () => {
        setSearchTerm('');
        // Perform reset logic here

    };
    useEffect(() => {
        fetchData();
        dispatch(setPageTitle('Alternative Pagination Table'));
    }, [dispatch, currentPage, searchTerm]);
    const handleSuccess = () => {
        fetchData();
    };

    const handlePageChange = (newPage: any) => {
        setCurrentPage(newPage);
    };


    const fetchData = async () => {
        try {
            // const response = await getData(`/station/list?page=${currentPage}`);
            let apiUrl = `/station/list?page=${currentPage}`;
            if (searchTerm) {
                apiUrl += `&search_keywords=${searchTerm}`;
            }
            const response = await getData(apiUrl);

            if (response && response.data && response.data.data) {
                setData(response.data.data?.stations);
                setCurrentPage(response.data.data?.currentPage || 1);
                setLastPage(response.data.data?.lastPage || 1);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
            //   handleApiError(error);
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
    const handleNavigateStationSetting = (id: any) => {
        const formData = new FormData();
        formData.append('id', id);
        navigate(`/manage-stations/setting/${id}`)
    };
    const handleNavigateStationSkipDate = (id: any) => {
        const formData = new FormData();
        formData.append('id', id);
        navigate(`/manage-stations/skipdate/${id}`)
    };
    const NavigateToAssignMannager = (id: any) => {

        navigate(`/manage-stations/mannagers/${id}`)
    };
    const NavigateToStockLoss = (id: any) => {

        navigate(`/manage-stock-loss/${id}`)
    };

    const UserPermissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);


    // "skipdate-create",
    // "skipdate-delete",
    // "skipdate-edit",
    // "skipdate-list",

    const isAddPermissionAvailable = UserPermissions?.includes("station-create");
    const isEditPermissionAvailable = UserPermissions?.includes("station-edit");
    const isEditSettingPermissionAvailable = UserPermissions?.includes("station-setting");
    const isSkipPermissionAvailable = UserPermissions?.includes("skipdate-list");
    const isDeletePermissionAvailable = UserPermissions?.includes("station-delete");
    const isAssignAddPermissionAvailable = UserPermissions?.includes("station-assign-permission");
    const AssignMannagerPermissionAvailable = UserPermissions?.includes("station-assign-manager");
    const IsstocklossPermissionAvailable = UserPermissions?.includes("stockloss-list");
    const IsBankPermissionAvailable = UserPermissions?.includes("station-bank-list");
    const IsTankPermissionAvailable = UserPermissions?.includes("tank-list");
    const IsNozzlePermissionAvailable = UserPermissions?.includes("nozzle-list");

    const anyPermissionAvailable = isEditPermissionAvailable 
    || isDeletePermissionAvailable ||
     isAssignAddPermissionAvailable || 
     IsBankPermissionAvailable || 
     IsTankPermissionAvailable || 
     IsNozzlePermissionAvailable || 
     AssignMannagerPermissionAvailable;

    const columns: any = [
        {
            name: 'Station Name',
            selector: (row: RowData) => row.station_name,
            sortable: false,
            width: '10%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.station_name}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Client Name',
            selector: (row: RowData) => row.client_name,
            sortable: false,
            width: '10%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.client_name}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Entity Name',
            selector: (row: RowData) => row.entity_name,
            sortable: false,
            width: '10%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.entity_name}</h6>
                    </div>
                </div>
            ),
        },

        {
            name: 'Station Logo',
            selector: (row: RowData) => row.supplier_code,
            sortable: false,
            width: '10%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className="mt-0 mt-sm-2 d-block">
                        {/* Assuming row.logo contains the URL of the image */}
                        <img style={{ width: "60px", height: "40px" }} src={row.logo} alt="Logo" className="img-fluid" />
                        {/* If you want to display the URL as text */}
                        {/* <h6 className="mb-0 fs-14 fw-semibold">{row.logo}</h6> */}
                    </div>
                </div>
            ),
        },

        {
            name: 'Station Code',
            selector: (row: RowData) => row.station_code,
            sortable: false,
            width: '10%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.station_code}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Station Address',
            selector: (row: RowData) => row.station_address,
            sortable: false,
            width: '15%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.station_address}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Created Date',
            selector: (row: RowData) => row.created_date,
            sortable: false,
            width: '10%',
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
            selector: (row: RowData) => row.station_status,
            sortable: false,
            width: '10%',
            cell: (row: RowData) => (

                <>
                    {isEditPermissionAvailable && (

                        <Tippy content={<div>Status</div>} placement="top">
                            {row.station_status === 1 || row.station_status === 0 ? (
                                <CustomSwitch checked={row.station_status === 1} onChange={() => toggleActive(row)} />
                            ) : (
                                <div className="pointer" onClick={() => toggleActive(row)}>
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
                            <div className="inline-flex">

                                <div className="dropdown">
                                    <Dropdown button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}>
                                        <ul>
{/* //edit */}
                                            <li>
                                                {isEditPermissionAvailable && (

                                                    <button type="button" onClick={() => openModal(row?.id)}>
                                                        <i className="pencil-icon fi fi-rr-file-edit"></i>Edit
                                                    </button>

                                                )}
                                            </li>
                                                       {/* //Station Settings */}
                                                       <li>
                                                {isEditSettingPermissionAvailable && (
                                                    <button onClick={() => handleNavigateStationSetting(row.id)} type="button">
                                                        <i className="fi fi-rr-settings"></i> Station Settings
                                                    </button>



                                                )}
                                            </li>
                                            {/* //Assign Mannager */}
                                            
                                            <li>
                                                {AssignMannagerPermissionAvailable && (

                                                    <button onClick={() => NavigateToAssignMannager(row.id)} type="button">
                                                        <i className="fi fi-tr-lead-management"></i>Assign Mannager
                                                    </button>



                                                )}
                                            </li>
                                                     {/* //Banks */}
                                                     <li>
                                                {IsBankPermissionAvailable && (
                                                    <button  onClick={() => navigate(`/manage-stationbanks/${row.id}`)} type="button">
                                                        <i className="fi fi-tr-bank"></i> Banks
                                                    </button>)}
                                            </li>
                                               {/* //Tanks */}
                                               <li>
                                                {IsTankPermissionAvailable && (
                                                    <button  onClick={() => navigate(`/manage-tanks/${row.id}`)} type="button">
                                                        <i className="fi fi-ts-tank-water"></i> Tanks
                                                    </button>)}
                                            </li>
                                                  {/* //Nozzles */}
                                                  <li>
                                                {IsNozzlePermissionAvailable && (
                                                    <button  onClick={() => navigate(`/manage-nozzles/${row.id}`)} type="button">
                                                        <i className="fi fi-ts-gas-pump-slash"></i> Nozzles
                                                    </button>)}
                                            </li>
                                            {/* //Delete */}
                                            <li>
                                                {isDeletePermissionAvailable && (

                                                    <button onClick={() => handleDelete(row.id)} type="button">
                                                        <i className="icon-setting delete-icon fi fi-rr-trash-xmark"></i>
                                                        Delete
                                                    </button>

                                                )}
                                            </li>
                                       
                                                  
                                          
                                        
                                             {/* //Skip Date */}
                                            <li>
                                                {isSkipPermissionAvailable && (

                                                    <button onClick={() => handleNavigateStationSkipDate(row.id)} type="button">
                                                        <i className="fi fi-tr-calendar-clock"></i>Skip Date
                                                    </button>



                                                )}
                                            </li>    
                                             
                                         

                                        </ul>
                                    </Dropdown>
                                </div>


                        


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

            formData.append('show_summary', values.show_summary);
            formData.append('client_id', values.client_id);
            formData.append('entity_id', values.entity_id);
            formData.append('data_import_type_id', values.data_import_type_id);
            formData.append('security_amount', values.security_amount);
            formData.append('start_date', values.start_date);
            formData.append('station_address', values.station_address);
            formData.append('station_code', values.station_code);
            formData.append('station_display_name', values.station_display_name);
            formData.append('station_name', values.station_name);
            formData.append('supplier_id', values.supplier_id);
            formData.append('station_name', values.station_name);
            formData.append('supplier_id', values.supplier_id);
            if (values.file) {
                formData.append('logo', values.file);
            }
            formData.append('contact_person', values.contact_person);
            formData.append('consider_fuel_sale', values.consider_fuel_sale);

            if (userId) {
                formData.append('id', userId);
            }

            const url = isEditMode && userId ? `/station/update` : `/station/create`;
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
                        <Link to="/dashboard" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Stations</span>
                    </li>
                </ul>

                {isAddPermissionAvailable && <>
                    <button type="button" className="btn btn-dark " onClick={() => setIsModalOpen(true)}>
                        Add Station
                    </button>

                </>}
            </div>
            <AddEditStationModal getData={getData} isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} isEditMode={isEditMode} userId={userId}

            />

            <div className="panel mt-6">


                <div className="flex md:items-center md:flex-row flex-col mb-5  spacebetween">
                    <h5 className="font-bold text-lg dark:text-white-light">Stations</h5>
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
