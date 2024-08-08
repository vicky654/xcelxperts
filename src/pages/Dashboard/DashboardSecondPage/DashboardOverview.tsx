import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import withApiHandler from '../../../utils/withApiHandler';
import { fetchStoreData } from '../../../store/dataSlice';
import LoaderImg from '../../../utils/Loader';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { IRootState } from '../../../store';
import DashboardFilterModal from '../DashboardFilterModal';
import IconInfoCircle from '../../../components/Icon/IconInfoCircle';
import noDataImage from '../../../assets/AuthImages/noDataFound.png'; // Import the image
import { currency } from '../../../utils/CommonData';



interface FilterValues {
    client_id: string;
    company_id: string;
    site_id: string;
}

interface DashboardOverviewProps {
    isLoading: boolean; // Define the type of the loading prop
    fetchedData: any; // Define the type of the fetchedData prop
    getData: (url: string, id?: string, params?: any) => Promise<any>;
    detailsData: any;
    isSitePermissionAvailable: string;
    handleNavigateToNextPage?: any;
    // handleNavigateToNextPage: (item: any) => void;
}



const DashboardOverview: React.FC<DashboardOverviewProps> = ({ isLoading, fetchedData, getData }) => {

    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        client_id: localStorage.getItem('client_id') || '',
        company_id: localStorage.getItem('company_id') || '',
        site_id: localStorage.getItem('site_id') || ''
    });
    const [filterData, setFilterData] = useState<any>(null);
    const [detailsData, setDetailsData] = useState<any>([]);
    const [secondApiResponse, setsecondApiResponse] = useState<any>([]);


    const callFetchFilterData = async (filters: FilterValues) => {
        try {
            const { client_id, company_id, site_id } = filters;
            const queryParams = new URLSearchParams();

            if (client_id) queryParams.append('client_id', client_id);
            if (company_id) queryParams.append('entity_id', company_id);
            if (site_id) queryParams.append('station_id', site_id);

            const queryString = queryParams.toString();
            const response = await getData(`dashboard/stats?${queryString}`);
            if (response && response.data && response.data.data) {
                setFilterData(response.data.data)
            }
            // setData(response.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
        }
    };
    const callFetchDetailsData = async (filters: FilterValues) => {
        try {
            const { client_id, company_id, site_id } = filters;
            const queryParams = new URLSearchParams();

            if (client_id) queryParams.append('client_id', client_id);
            if (company_id) queryParams.append('entity_id', company_id);
            if (site_id) queryParams.append('station_id', site_id);

            const queryString = queryParams.toString();
            const response = await getData(`dashboard/get-details?${queryString}`);
            if (response && response.data && response.data.data) {

                setsecondApiResponse(response.data.data)

                setDetailsData(response.data.data?.station)
            }
            // setData(response.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
        }
    };

    // Using useSelector to extract the data from the Redux store
    const { data, error } = useSelector((state: IRootState) => state?.data);
    const [modalOpen, setModalOpen] = useState(false);
    const isSitePermissionAvailable = data?.permissions?.includes(
        "dashboard-site-detail"
    );

    useEffect(() => {
        dispatch(fetchStoreData() as any);
    }, [])


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Sales Admin'));
    });
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;



    useEffect(() => {
        // Check if client_id and company_id are present in local storage
        const clientId = localStorage.getItem('client_id');
        const companyId = localStorage.getItem('company_id');

        if (clientId && companyId) {
            // Fetch data only if both client_id and company_id are present
            callFetchFilterData(filters);
            callFetchDetailsData(filters);
        }
    }, [filters]);

    const handleResetFilters = () => {
        // Clear filters state
        setFilters({
            client_id: '',
            company_id: '',
            site_id: ''
        });
        setFilterData(null);
        // Remove items from local storage
        localStorage.removeItem('client_id');
        localStorage.removeItem('company_id');
        localStorage.removeItem('site_id');
        // Dispatch action to set applyFilter to false
    };
    const handleApplyFilters = (values: FilterValues) => {

        const updatedFilters = {
            client_id: values.client_id,
            company_id: values.company_id,
            site_id: values.site_id
        };
        // Set the filters state with the updated values
        setFilters(updatedFilters);
        // Call callFetchFilterData with the updated filters
        // callFetchFilterData(updatedFilters);
        // callFetchDetailsData(updatedFilters);
        // Update local storage
        localStorage.setItem('client_id', values.client_id);
        localStorage.setItem('company_id', values.company_id);
        localStorage.setItem('site_id', values.site_id);
        // Close the modal
        setModalOpen(false);
    };






    // const handleNavigateToNextPage = (item: any) => {
    //     if (!isSitePermissionAvailable) {
    //         navigate(`/dashboard/station/${item?.id}`)
    //     }
    // }
    // Function to get the current month in "YYYY-MM" format
    const getCurrentMonth = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() returns month index (0-11), so add 1 and pad with zero if needed

        return `${year}-${month}`;
    };

    // Function to store the current month in localStorage
    const storeCurrentMonth = () => {
        const currentMonth = getCurrentMonth();
        localStorage.setItem('start_month', currentMonth);
        console.log(`Current month stored: ${currentMonth}`);
    };

    const handleNavigateToNextPage = (item: any) => {
        console.log(item, "item");
        // Store the current month in localStorage
        storeCurrentMonth();

        const clientId = localStorage.getItem('client_id');
        const companyId = localStorage.getItem('company_id');
        const currentMonth = getCurrentMonth(); // Get the current month to include in filters

        // Create the updated filters object
        const updatedFilterss = {
            client_id: clientId,
            company_id: companyId,
            site_id: item.id,
            start_month: currentMonth // Include the current month in the filters
        };

        // Store the updated filters object in localStorage
        localStorage.setItem('Dashboard_Stats_values', JSON.stringify(updatedFilterss));

        if (!isSitePermissionAvailable) {
            navigate(`/data-entry-stats/${item?.id}`);
        }
    };

    console.log(secondApiResponse, "site_id");
    console.log(secondApiResponse?.stations, "secondApiResponse?.stations")
    return (
        <>
            {isLoading ? <LoaderImg /> : ""}
            <div>
                <div className='flex justify-between items-center flex-wrap'>
                    <ul className="flex space-x-2 rtl:space-x-reverse my-2">
                        <li>
                            <Link to="/dashboard" className="text-primary hover:underline">
                                Dashboard
                            </Link>
                        </li>
                        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                            <span>Overview</span>
                        </li>
                    </ul>

                    <div className=' flex gap-4 flex-wrap'>

                        {filters?.client_id || filters?.company_id || filters?.site_id ? (
                            <>
                                <div className="badges-container flex flex-wrap items-center gap-2 px-4   text-white" style={{ background: "#ddd" }}>
                                    {filters?.client_id && (
                                        <div className="badge bg-blue-600 flex items-center gap-2 px-2 py-1 ">
                                            <span className="font-semibold">Client : </span> {secondApiResponse?.basic_details?.client_name}
                                        </div>
                                    )}

                                    {filters?.company_id && (
                                        <div className="badge bg-green-600 flex items-center gap-2 px-2 py-1 ">
                                            <span className="font-semibold">Entity : </span> {secondApiResponse?.basic_details?.entity_name}
                                        </div>
                                    )}

                                    {filters?.site_id && (
                                        <div className="badge bg-red-600 flex items-center gap-2 px-2 py-1 ">
                                            <span className="font-semibold">Station : </span> {secondApiResponse?.basic_details?.station_name}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            ''
                        )}

                        <button onClick={() => setModalOpen(true)} type="button" className="btn btn-dark ">
                            Apply Filter
                        </button>

                        {modalOpen && (<>
                            <DashboardFilterModal isOpen={modalOpen} onClose={() => setModalOpen(false)}
                                onApplyFilters={handleApplyFilters} // Pass the handler to the modal
                            />
                        </>)}
                    </div>
                </div>

                <div className="pt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 mb-6 text-white">
                        <div className={`panel  firstbox ${secondApiResponse ? 'cursor-pointer' : ''}`} >
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Volume
                                </div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> ℓ {secondApiResponse?.sales_volume?.sales_volume} </div>
                                <div className="badge bg-white/30">
                                    {secondApiResponse?.gross_volume?.status === 'up' ? '+' : ''} {secondApiResponse?.sales_volume?.percentage}%{' '}
                                </div>
                            </div>
                            <div className="flex items-center font-semibold mt-5">
                                {secondApiResponse?.sales_volume?.status === 'up' ? <i className="fi fi-tr-chart-line-up"></i> : <i className="fi fi-tr-chart-arrow-down"></i>}
                                Last Month {secondApiResponse?.sales_volume?.percentage}
                            </div>
                        </div>

                        {/* Sessions */}
                        <div className={`panel secondbox ${secondApiResponse ? 'cursor-pointer' : ''}`} >
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Value </div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {currency} {secondApiResponse?.sales_value?.sales_value} </div>
                                <div className="badge bg-white/30"> {secondApiResponse?.sales_value?.percentage}%</div>
                            </div>
                            <div className="flex items-center font-semibold mt-5">
                                {secondApiResponse?.sales_value?.status === 'up' ? <i className="fi fi-tr-chart-line-up"></i> : <i className="fi fi-tr-chart-arrow-down"></i>}
                                Last Month {secondApiResponse?.sales_value?.status === 'up' ? '+' : ''} {secondApiResponse?.sales_value?.percentage}
                            </div>
                        </div>

                        {/*  Time On-Site */}
                        <div className={`panel thiredbox ${secondApiResponse ? 'cursor-pointer' : ''}`} >
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Profit</div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {currency} {secondApiResponse?.profit?.profit} </div>
                                <div className="badge bg-white/30"> {secondApiResponse?.profit?.percentage}%</div>
                            </div>
                            <div className="flex items-center font-semibold mt-5">
                                {secondApiResponse?.profit?.status === 'up' ? <i className="fi fi-tr-chart-line-up"></i> : <i className="fi fi-tr-chart-arrow-down"></i>}
                                Last Month{secondApiResponse?.profit?.percentage}
                            </div>
                        </div>

                        {/* 4th Card */}
                        <div className={`panel thiredbox ${secondApiResponse ? 'cursor-pointer' : ''}`} >
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Stock</div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">{currency} {secondApiResponse?.stock?.value} </div>
                                <div className="badge bg-white/30"> {secondApiResponse?.stock?.percentage}%</div>
                            </div>
                            <div className="flex items-center font-semibold mt-5">
                                {secondApiResponse?.stock?.status === 'up' ? <i className="fi fi-tr-chart-line-up"></i> : <i className="fi fi-tr-chart-arrow-down"></i>}
                                Last Month {secondApiResponse?.stock?.percentage}
                            </div>
                        </div>



                    </div>
    

                    {secondApiResponse?.stations?.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                                {secondApiResponse?.stations?.map((item: any) => (
                                    <div
                                        key={item?.station_id}
                                        className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-black dark:text-white group ${isSitePermissionAvailable ? "cursor-pointer" : ""
                                            }`}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => !isSitePermissionAvailable && handleNavigateToNextPage(item)}
                                    >
                                        {/* Header with Image and Name */}
                                        <div className="flex items-center mb-4">
                                            <img
                                                className="w-10 h-10 rounded-full object-cover"
                                                src={item?.image}
                                                alt={item?.name}
                                            />
                                            <h5 className="ml-4 font-semibold">{item?.name}</h5>
                                        </div>

                                        {/* Fuel Stats */}
                                        {item?.fuels_stats.map((stats: any, index: any) => (
                                            <div key={index}>
                                                <div className="grid grid-cols-2 gap-4 my-3">
                                                    {/* Sales Volume */}
                                                    <div>
                                                        <h6 className="font-semibold">Gross Volume</h6>
                                                        <p className="text-lg">
                                                            ℓ{stats.sales_volume.sales_volume}
                                                            <span
                                                                className={`ml-2 ${stats.sales_volume.status === "up"
                                                                    ? "text-green-500"
                                                                    : "text-red-500"
                                                                    }`}
                                                            >
                                                                {stats.sales_volume.status === "up" ? (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-up"></i>{" "}
                                                                        {stats.sales_volume.percentage}%
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-down"></i>{" "}
                                                                        {stats.sales_volume.percentage}%
                                                                    </>
                                                                )}
                                                            </span>
                                                        </p>
                                                    </div>

                                                    {/* Sales Value */}
                                                    <div>
                                                        <h6 className="font-semibold">Gross Value</h6>
                                                        <p className="text-lg">
                                                            {currency} {stats.sales_value.sales_value}
                                                            <span
                                                                className={`ml-2 ${stats.sales_value.status === "up"
                                                                    ? "text-green-500"
                                                                    : "text-red-500"
                                                                    }`}
                                                            >
                                                                {stats.sales_value.status === "up" ? (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-up"></i>{" "}
                                                                        {stats.sales_value.percentage}%
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-down"></i>{" "}
                                                                        {stats.sales_value.percentage}%
                                                                    </>
                                                                )}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <hr />

                                                <div className="grid grid-cols-2 gap-4 my-3">
                                                    {/* Profit */}
                                                    <div>
                                                        <h6 className="font-semibold"> Gross Profit</h6>
                                                        <p className="text-lg">
                                                            {currency} {stats.profit.profit}
                                                            <span
                                                                className={`ml-2 ${stats.profit.status === "up"
                                                                    ? "text-green-500"
                                                                    : "text-red-500"
                                                                    }`}
                                                            >
                                                                {stats.profit.status === "up" ? (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-up"></i>{" "}
                                                                        {stats.profit.percentage}%
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-down"></i>{" "}
                                                                        {stats.profit.percentage}%
                                                                    </>
                                                                )}
                                                            </span>
                                                        </p>
                                                    </div>

                                                    {/* Stock */}
                                                    <div>
                                                        <h6 className="font-semibold">Stock Loss</h6>
                                                        <p className="text-lg">
                                                        {currency} {stats?.stock?.value}

                                                            <span
                                                                className={`ml-2 ${stats?.stock?.status === "up"
                                                                    ? "text-green-500"
                                                                    : "text-red-500"
                                                                    }`}
                                                            >
                                                                {stats?.stock?.status === "up" ? (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-up"></i>{" "}
                                                                        {stats?.stock?.percentage}%
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-down"></i>{" "}
                                                                        {stats?.stock?.percentage}%
                                                                    </>
                                                                )}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <hr />

                                          

                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className=' panel'>
                                <div className="flex items-center mb-5">
                                    <h5 className="font-semibold text-lg dark:text-white-light">Stations</h5>
                                </div>
                                <img
                                    src={noDataImage} // Use the imported image directly as the source
                                    alt="no data found"
                                    className="all-center-flex nodata-image"
                                />
                            </div>

                        </>
                    )}



                </div>
            </div >
        </>
    );
};

const enhanceDashboardOverview = DashboardOverview

export default withApiHandler(enhanceDashboardOverview);

// {
//     "basic_details": {
//         "station_name": "Test Station",
//         "client_name": "Test Client",
//         "entity_name": "Test Company"
//     },
//     "sales_volume": {
//         "sales_volume": 10,
//         "status": "up",
//         "percentage": 10.1
//     },
//     "sales_value": {
//         "sales_value": 100,
//         "status": "up",
//         "percentage": 10.1
//     },
//     "profit": {
//         "profit": 10,
//         "status": "up",
//         "percentage": 10.1
//     },
//     "line_graph": {
//         "labels": [
//             "Jun 2024",
//             "Jul 2024"
//         ],
//         "datasets": [
//             {
//                 "label": "Fuel Volume (ℓ)",
//                 "data": [
//                     1600,
//                     0
//                 ],
//                 "borderColor": "rgba(255, 99, 132, 1)",
//                 "backgroundColor": "rgba(255, 99, 132, 0.5)",
//                 "type": "line",
//                 "yAxisID": "y1"
//             },
//             {
//                 "label": "Fuel Value ({currency} )",
//                 "data": [
//                     152105,
//                     0
//                 ],
//                 "borderColor": "rgba(54, 162, 235, 1)",
//                 "backgroundColor": "rgba(54, 162, 235, 0.5)",
//                 "type": "bar",
//                 "yAxisID": "y"
//             },
//             {
//                 "label": "Profit ({currency} )",
//                 "data": [
//                     "0.00",
//                     "0.00"
//                 ],
//                 "borderColor": "rgba(154, 62, 251, 1)",
//                 "backgroundColor": "rgba(154, 62, 251, 0.5)",
//                 "type": "line",
//                 "yAxisID": "y1"
//             }
//         ]
//     },
//     "pi_graph": {
//         "sales_volume": 1600,
//         "sales_value": 152105,
//         "profit": 0
//     }
// }