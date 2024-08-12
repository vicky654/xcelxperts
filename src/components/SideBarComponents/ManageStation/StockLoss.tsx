import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import LoaderImg from '../../../utils/Loader';
import { setPageTitle } from '../../../store/themeConfigSlice';
import withApiHandler from '../../../utils/withApiHandler';
import useToggleStatus from '../../../utils/ToggleStatus';
import useCustomDelete from '../../../utils/customDelete';
import 'tippy.js/dist/tippy.css';
import CustomPagination from '../../../utils/CustomPagination';
import ErrorHandler from '../../../hooks/useHandleError';
import noDataImage from '../../../assets/AuthImages/noDataFound.png'; // Import the image
import { IRootState } from '../../../store';
import Dropdown from '../../Dropdown';
import IconHorizontalDots from '../../Icon/IconHorizontalDots';
import SearchBar from '../../../utils/SearchBar';
import AddEditStockLoss from './AddEditStockLoss';

interface ManageSiteProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    // onSubmit: (values: any, formik: any) => Promise<void>;
}

interface RowData {
    id: string; // Change type from number to string
    full_name: string;
    fuels: string;
    creator: string;
    role: string;
    addons: string;
    created_date: string;
    value: number;
    station_status: number;
    name: string;
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
    const [Stationname, setStation_name] = useState<string >("");
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

    const { id } = useParams();
    const fetchData = async () => {
        try {
            // const response = await getData(`/station/list?page=${currentPage}`);
            let apiUrl = `/station/config-stock-loss/list?station_id=${id}&page=${currentPage}`;
            if (searchTerm) {
                apiUrl += `&search_keywords=${searchTerm}`;
            }
            const response = await getData(apiUrl);

            if (response && response.data && response.data.data) {
                setData(response.data?.data?.listing);
                setStation_name(response.data?.data?.station_name);
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
        customDelete(postData, 'station/config-stock-loss/delete', formData, handleSuccess);
    };

    const UserPermissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);


    // "skipdate-create",
    // "skipdate-delete",
    // "skipdate-edit",
    // "skipdate-list",

    const isAddPermissionAvailable = UserPermissions?.includes("stockloss-create");
    const isEditPermissionAvailable = UserPermissions?.includes("stockloss-edit");
    const isEditSettingPermissionAvailable = UserPermissions?.includes("stockloss-setting");
    const isSkipPermissionAvailable = UserPermissions?.includes("skipdate-list");
    const isDeletePermissionAvailable = UserPermissions?.includes("stockloss-delete");
    const isAssignAddPermissionAvailable = UserPermissions?.includes("stockloss-assign-permission");
    const AssignMannagerPermissionAvailable = UserPermissions?.includes("stockloss-assign-manager");

    const anyPermissionAvailable = isEditPermissionAvailable || isDeletePermissionAvailable || isAssignAddPermissionAvailable || AssignMannagerPermissionAvailable;

    const columns: any = [
        {
            name: ' Name',
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
            name: 'Fuels',
            selector: (row: RowData) => row.fuels,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.fuels}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Value',
            selector: (row: RowData) => row.value,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.value}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Creator',
            selector: (row: RowData) => row.creator,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.creator}</h6>
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

                                            <li>
                                                {isEditPermissionAvailable && (

                                                    <button type="button" onClick={() => openModal(row?.id)}>
                                                        <i className="pencil-icon fi fi-rr-file-edit"></i>Edit
                                                    </button>

                                                )}
                                            </li>
                                            <li>
                                                {isDeletePermissionAvailable && (

                                                    <button onClick={() => handleDelete(row.id)} type="button">
                                                        <i className="icon-setting delete-icon fi fi-rr-trash-xmark"></i>
                                                        Delete
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
            formData.append('name', values.name);
            formData.append('value', values.max_amount);
            formData.append('station_id', values.station_id);
            const skipDates = values?.selectedStations || [];

            if (skipDates.length === 0) {

                return; // Early exit if skip_date is empty
            }



            // Convert skipDates to the desired format and append to formData
            skipDates.forEach((selectedItem: any, index: any) => {
                formData.append(`fuels[${index}]`, selectedItem.value);
            });

        

            if (userId) {
                formData.append('id', userId);
            }

            const url = isEditMode && userId ? `/station/config-stock-loss/update` : `/station/config-stock-loss/create`;
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
                    <li >
                        <Link to="/manage-stations" className=" before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-primary hover:underline">
                            Manage  Stations
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Stock Loss Configuration</span>
                    </li>

                </ul>

                {isAddPermissionAvailable && <>
                    <button type="button" className="btn btn-dark " onClick={() => setIsModalOpen(true)}>
                        Add Stock Loss Configuration
                    </button>

                </>}
            </div>
            <AddEditStockLoss getData={getData} isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} isEditMode={isEditMode} userId={userId} 

            station={id}

            />

            <div className="panel mt-6">


                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5 spacebetween">
                    <h5 className="font-semibold text-lg dark:text-white-light">{Stationname} Stock Loss Configuration</h5>
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
