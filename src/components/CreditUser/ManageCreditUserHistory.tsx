import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import 'tippy.js/dist/tippy.css';
import noDataImage from '../../assets/AuthImages/noDataFound.png'; // Import the image
import useErrorHandler from '../../hooks/useHandleError';
import LoaderImg from '../../utils/Loader';
import CustomPagination from '../../utils/CustomPagination';
import withApiHandler from '../../utils/withApiHandler';
import { IRootState } from '../../store';
import AddEditHistoryTankModal from './AddEditHistoryTankModal';
import { currency } from '../../utils/CommonData';
import MonthYearInput from '../../utils/MonthFilter';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
interface ManageSiteProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
}

interface RowData {
    id: string; // Change type from number to string
    name: string;
    phone: string;
    t_type: string;
    balance: string;
    debit: string;
    creator: string;
    credit: string;

    amount: string;
    notes: string;
    t_date: string;
    created_date: string;
    status: number;

}

interface RoleItem {
    id: number;
    client_name: string;
}

const ManageCreditUserHistory: React.FC<ManageSiteProps> = ({ postData, getData, isLoading }) => {
    const [data, setData] = useState<RowData[]>([]);
    const [stationdata, setStationData] = useState<RowData[]>([]);
    const [hirstoryData, sethirstoryData] = useState<any>([]);
    const dispatch = useDispatch();
    const handleApiError = useErrorHandler();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserData, setEditUserData] = useState<Partial<RowData> | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // Assuming userId is a string
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [showFilterOptions, setShowFilterOptions] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [date3, setDate3] = useState<[Date, Date] | []>([]);
    const [isdownloadpdf, setIsdownloadpdf] = useState(true);
    // Adjust the type of the parameter to match what Flatpickr sends


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

    const UserPermissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);

    const isAddPermissionAvailable = UserPermissions?.includes('credituser-update');
    const isEditPermissionAvailable = UserPermissions?.includes('credituser-history');
    const isDeletePermissionAvailable = UserPermissions?.includes('credituser-delete');
    const isAssignAddPermissionAvailable = UserPermissions?.includes('credituser-assign-permission');

    const { id } = useParams<{ id: string }>();
    // useEffect(() => {
    //     GetUserList(id)

    // }, [currentPage]);
    useEffect(() => {
        GetUserList(id)
        // dispatch(setPageTitle('Alternative Pagination Table'));
    }, [id, currentPage, searchTerm]);

    const handleSuccess = () => {
        GetUserList(id);
    };

    const handlePageChange = (newPage: any) => {
        setCurrentPage(newPage);
    };

    const columns: any = [
        {
            name: 'Creator',
            selector: (row: RowData) => row.creator,
            sortable: false,
            width: '15%',
            cell: (row: RowData) => (
                <div className="d-flex" style={{ cursor: 'default' }}>
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.creator}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Transaction Date',
            selector: (row: RowData) => row.t_date,
            sortable: false,
            width: '15%',
            cell: (row: RowData) => (
                <div className="d-flex" style={{ cursor: 'default' }}>
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.t_date}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Amount',
            selector: (row: RowData) => row.amount,
            sortable: false,
            width: '15%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{currency}{row.amount}

                        </h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Type',
            selector: (row: RowData) => row.amount,
            sortable: false,
            width: '15%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">

                        {row?.t_type === "Credit" && (<>
                            <span className="badge bg-primary my-auto  hover:top-0">{row?.t_type}</span>
                        </>)}
                        {row?.t_type === "Debit" && (<>
                            <span className="badge bg-danger my-auto  hover:top-0">{row?.t_type}</span>
                        </>)}



                    </div>
                </div>

            ),
        },




        {
            name: 'Notes',
            selector: (row: RowData) => row.notes,
            sortable: false,
            width: '25%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold py-2">{row.notes}</h6>
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
        // {
        //     name: 'Status',
        //     selector: (row: RowData) => row.status,
        //     sortable: false,
        //     width: '10%',
        //     cell: (row: RowData) => (
        //         <>
        //             {isEditPermissionAvailable && (
        //                 <>
        //                     <Tippy content={<div>Status</div>} placement="top">
        //                         {row.status === 1 || row.status === 0 ? <CustomSwitch checked={row.status === 1} onChange={() => toggleActive(row)} /> : <div className="pointer">Unknown</div>}
        //                     </Tippy>
        //                 </>
        //             )}
        //         </>
        //     ),
        // },
        // anyPermissionAvailable
        //     ? {
        //         name: 'Actions',
        //         selector: (row: RowData) => row.id,
        //         sortable: false,
        //         width: '10%',
        //         cell: (row: RowData) => (
        //             <span className="text-center">
        //                 <div className="flex items-center justify-center">
        //                     <div className="inline-flex">
        //                         {isEditPermissionAvailable && (
        //                             <>
        //                                 <Tippy content="Edit">
        //                                     <button type="button" onClick={() => openModal(row?.id)}>
        //                                         <i className="pencil-icon fi fi-rr-file-edit"></i>
        //                                     </button>
        //                                 </Tippy>
        //                             </>
        //                         )}
        //                         {isDeletePermissionAvailable && (
        //                             <>
        //                                 <Tippy content="Delete">
        //                                     <button onClick={() => handleDelete(row.id)} type="button">
        //                                         <i className="icon-setting delete-icon fi fi-rr-trash-xmark"></i>
        //                                     </button>
        //                                 </Tippy>
        //                             </>
        //                         )}
        //                         {isHistorySettingPermissionAvailable && (
        //                             <>
        //                                 <Tippy content="Delete">
        //                                     <button onClick={() => handleDelete(row.id)} type="button">
        //                                         <i className="fi fi-tr-rectangle-history-circle-plus"></i>
        //                                     </button>
        //                                 </Tippy>
        //                             </>
        //                         )}
        //                     </div>
        //                 </div>
        //             </span>
        //         ),
        //     }
        //     : null,
    ];



    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditUserData(null);
    };

    const handleFormSubmit = async (values: any) => {
        try {
            const formData = new FormData();

            formData.append('amount', values.amount);
            formData.append('notes', values.notes);
            formData.append('t_date', values.t_date);
            formData.append('station_id', values.station_id);


            if (id) {
                formData.append('credit_user_id', id);
            }

            const url = isEditMode && userId ? `/credit-user/add-credit` : `/credit-user/add-credit`;
            const response = await postData(url, formData);

            if (response) {
                handleSuccess();
                closeModal();
            }
        } catch (error) {
            handleApiError(error);
        }
    };




    const GetUserList = async (id: any, month?: string, year?: string) => {
        try {
            // Construct the base API URL
            let apiUrl = `/credit-user/history?credit_user_id=${id}&page=${currentPage}`;

            // Add search term if available
            if (searchTerm) {
                apiUrl += `&search_keywords=${searchTerm}`;
            }

            // Add month and year to the API URL if they are provided
            if (month && year) {
                apiUrl += `&drs_date=${year}-${month}-01`;
            }

            // Call the API with the constructed URL
            const response = await getData(apiUrl);

            if (response && response.data && response.data.data) {

                setData(response.data.data?.history?.listing);
                setStationData(response.data.data?.stations);
                setCurrentPage(response.data.data?.history?.currentPage || 1);
                setLastPage(response.data.data?.history?.lastPage || 1);
                sethirstoryData(response.data.data);
            } else {
                throw new Error("No data available in the response");
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");

    // Handle month and year change from the child
    const handleMonthYearChange = (month: string, year: string) => {


        if (month && year) {
            setSelectedMonth(month);
            setSelectedYear(year);
            GetUserList(id, month, year); // Fetch with both month and year
        } else if (!month) {
            setSelectedMonth(month);
            setSelectedYear(year);
            GetUserList(id); // Fetch with both month and year
        }
    };



    const handleDownloadPdf = async (

    ) => {
        try {
            // Fetch data from the API
            const response = await getData(
                `/credit-user/history-download?drs_date=${selectedYear}-${selectedMonth}-01&credit_user_id=${id}`
            );
            if (response && response.data?.data) {

                const pdfUrl = response.data?.data?.url;
                window.open(pdfUrl, '_blank', 'noopener noreferrer');
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            // Handle API errors
            handleApiError(error);
        }
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
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <Link to="/manage-credit-users" className="text-primary hover:underline">
                            Credit Users
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Credit Users History</span>
                    </li>
                </ul>

                {isAddPermissionAvailable && (
                    <button type="button" className="btn btn-dark  mt-2 md:mt-0" onClick={() => setIsModalOpen(true)}>
                        Add Credit
                    </button>
                )}
            </div>
            <AddEditHistoryTankModal getData={getData} isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} isEditMode={isEditMode} userId={userId} stationdata={stationdata} />

            <div className=" mt-6">
                <div className="panel h-full xl:col-span-3">
                    <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                        <h1 className="text-lg font-semibold   ">
                            {`Credit Users History ${hirstoryData?.name ? `( ${hirstoryData.name} ) ` : ""}`}

                            {selectedMonth &&
                                (<span onClick={() => handleDownloadPdf()}>
                                    <OverlayTrigger placement="top" overlay={<Tooltip className="custom-tooltip" >Download Report</Tooltip>}>
                                        <i style={{ fontSize: "20px", color: "red", cursor: "pointer" }} className="fi fi-tr-file-pdf"></i>
                                    </OverlayTrigger>
                                </span>)}
                        </h1>

                        <div className="flex flex-col md:flex-row md:items-center md:ml-auto mt-2 md:mt-0 gap-2">
                            {hirstoryData?.balance && (
                                <span className="badge bg-primary ltr:ml-0 rtl:mr-0 md:mx-3">
                                    Bal {currency}{hirstoryData?.balance}
                                </span>
                            )}
                            {hirstoryData?.credit && (
                                <span className="badge bg-success ltr:ml-0 rtl:mr-0 md:mx-3">
                                    Cr {currency}{hirstoryData?.credit}
                                </span>
                            )}
                            {hirstoryData?.debit && (
                                <span className="badge bg-danger ltr:ml-0 rtl:mr-0 md:mx-3">
                                    Db {currency}{hirstoryData?.debit}
                                </span>
                            )}

                            <MonthYearInput onChange={handleMonthYearChange} />

                            {/* Uncomment the following line if you want to include the search input */}
                            {/* <input type="text" className="form-input w-full md:w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} /> */}
                        </div>
                        {/* <div className="ltr:ml-auto rtl:mr-auto spacebetween" >
                            <div className='mt-1' style={{ marginRight: "10px" }}>
                                {hirstoryData?.balance && (<>
                                    <span className="Titlebadge bg-primary my-auto ltr:ml-3 rtl:mr-3 hover:top-0">Bal {currency}{hirstoryData?.balance} </span>
                                </>)}
                                {hirstoryData?.credit && (<>
                                    <span className="Titlebadge bg-success my-auto ltr:ml-3 rtl:mr-3 hover:top-0">Cr {currency}{hirstoryData?.credit}</span>
                                </>)}
                                {hirstoryData?.debit && (<>
                                    <span className="Titlebadge bg-danger my-auto ltr:ml-3 rtl:mr-3 hover:top-0">Dr {currency}{hirstoryData?.debit} </span>
                                </>)}
                            </div>
                            <MonthYearInput onChange={handleMonthYearChange} />



                        </div> */}
                    </div>
                    <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                        <h5 className="font-bold text-lg dark:text-white-light"> </h5>



                        <div className="ltr:ml-auto rtl:mr-auto spacebetween" >
                            {/* {showFilterOptions && (
                                <SearchBar
                                    onSearch={handleSearch}
                                    onReset={handleReset}
                                    hideReset={Boolean(searchTerm)}
                                    placeholder="Enter search term..."
                                />
                            )} */}
                            {/* <div className="mb-5">
                                <Flatpickr
                                    options={{
                                        mode: 'range',
                                        dateFormat: 'Y-m-d',
                                    }}
                                    value={date3}
                                    className="form-input"
                                    onChange={handleDateChange} // No type issues here
                                    placeholder='Date Range'

                                />


                                
                                <button
                                    type="button"
                                    onClick={clearDates}
                                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Clear Dates
                                </button>

                            </div> */}



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

            </div>
            {hirstoryData?.history?.listing?.length > 0 && lastPage > 1 && <CustomPagination currentPage={currentPage} lastPage={lastPage} handlePageChange={handlePageChange} />}
        </>
    );
};

export default withApiHandler(ManageCreditUserHistory);
