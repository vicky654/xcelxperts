import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import LoaderImg from '../../utils/Loader';
import DashboardFilterModal from '../../pages/Dashboard/DashboardFilterModal';
import { currency } from '../../utils/CommonData';
import withApiHandler from '../../utils/withApiHandler';
import noDataImage from '../../assets/AuthImages/noDataFound.png';
import { fetchStoreData } from '../../store/dataSlice';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import NewDashboardFilterModal from './NewDashboardFilterModal';
import IconX from '../Icon/IconX';
import * as Yup from 'yup';

interface FilterValues {
    client_id: string;
    entity_id: string;
    station_id: string;
}

interface DashboardOverviewProps {
    isLoading: boolean; // Define the type of the loading prop
    fetchedData: any; // Define the type of the fetchedData prop
    getData: (url: string, id?: string, params?: any) => Promise<any>;
    detailsData?: any;
    isSitePermissionAvailable?: string;
    handleNavigateToNextPage?: any;
    // handleNavigateToNextPage: (item: any) => void;
}



const NewDashboardChild: React.FC<DashboardOverviewProps> = ({ isLoading, fetchedData, getData }) => {

    const navigate = useNavigate();
    let storedKeyName = "newDashboardFilters";
    const [filters, setFilters] = useState<any>({
        client_id: '',
        entity_id: '',
        station_id: ''
    });
    const [filterData, setFilterData] = useState<any>(null);
    const [detailsData, setDetailsData] = useState<any>([]);
    const [secondApiResponse, setsecondApiResponse] = useState<any>([]);

    const IsClientLogin = useSelector((state: IRootState) => state.auth);
    const callFetchFilterData = async (filters: FilterValues) => {
        try {
            console.log(filters, "callFetchFilterData");

            const { client_id, entity_id, station_id } = filters;
            const queryParams = new URLSearchParams();

            if (client_id) queryParams.append('client_id', client_id);
            if (entity_id) queryParams.append('entity_id', entity_id);
            if (station_id) queryParams.append('station_id', station_id);

            const queryString = queryParams.toString();
            const response = await getData(`dashboard/stats?${queryString}`);
            if (response && response.data && response.data.data) {
                setFilterData(response.data.data)
            }
            // setData(response.data);
        } catch (error) {

        } finally {
        }
    };

    const callFetchDetailsData = async (filters: FilterValues) => {
        try {
            const { client_id, entity_id, station_id } = filters;
            const queryParams = new URLSearchParams();

            if (client_id) queryParams.append('client_id', client_id);
            if (entity_id) queryParams.append('entity_id', entity_id);
            if (station_id) queryParams.append('station_id', station_id);

            const queryString = queryParams.toString();
            const response = await getData(`dashboard/get-details?${queryString}`);
            if (response && response.data && response.data.data) {

                setsecondApiResponse(response.data.data)

                setDetailsData(response.data.data?.station)
            }
            // setData(response.data);
        } catch (error) {

        } finally {
        }
    };

    // Using useSelector to extract the data from the Redux store
    const { data, error } = useSelector((state: IRootState) => state?.data);
    const [modalOpen, setModalOpen] = useState(false);
    const isSitePermissionAvailable = data?.permissions?.includes(
        "dashboard-site-detail"
    );




    const dispatch = useDispatch();


    useEffect(() => {
        const storedData = localStorage.getItem(storedKeyName);
        if (storedData) {
            // setstationData(JSON.parse(storedData));
            handleApplyFilters(JSON.parse(storedData));
        }
    }, [dispatch]);



    // useEffect(() => {
    //     // Check if client_id and entity_id are present in local storage
    //     const clientId = localStorage.getItem('client_id');
    //     const companyId = localStorage.getItem('entity_id');

    //     if (IsClientLogin?.isClient) {
    //         callFetchFilterData(filters);
    //         callFetchDetailsData(filters);
    //     } else if (clientId && companyId) {
    //         callFetchFilterData(filters);
    //         callFetchDetailsData(filters);
    //     }
    // }, [filters]);




    // const handleApplyFilters = (values: FilterValues) => {

    //     const updatedFilters = {
    //         client_id: values.client_id,
    //         entity_id: values.entity_id,
    //         station_id: values.station_id
    //     };

    //     setFilters(updatedFilters);

    //     localStorage.setItem('client_id', values.client_id);
    //     localStorage.setItem('entity_id', values.entity_id);
    //     localStorage.setItem('station_id', values.station_id);
    //     // Close the modal
    //     setModalOpen(false);
    // };


    const handleApplyFilters = async (values: any) => {

        setFilters(values);
        callFetchFilterData(values);
        callFetchDetailsData(values)
        setModalOpen(false);
    };







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

    };

    const handleNavigateToNextPage = (item: any) => {

        // Store the current month in localStorage
        storeCurrentMonth();

        const clientId = localStorage.getItem('client_id');
        const companyId = localStorage.getItem('entity_id');
        const currentMonth = getCurrentMonth(); // Get the current month to include in filters

        // Create the updated filters object
        const updatedFilterss = {
            client_id: clientId,
            entity_id: companyId,
            station_id: item?.id,
            
        
            start_month: currentMonth // Include the current month in the filters
        };


        localStorage.setItem('Dashboard_Stats_values', JSON.stringify(updatedFilterss));

        if (!isSitePermissionAvailable) {
            navigate(`/data-entry-stats/${item?.id}`);
        }
    };


    const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");

    const validationSchemaForCustomInput = Yup.object({
        client_id: isNotClient
            ? Yup.string().required("Client is required")
            : Yup.mixed().notRequired(),
        entity_id: Yup.string().required("Entity is required"),
    });


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

                        {filters?.client_id || filters?.entity_id || filters?.station_id ? (
                            <>
                                <div className="badges-container flex flex-wrap items-center gap-2 px-4   text-white" style={{ background: "#ddd" }}>
                                    {filters?.client_id && (
                                        <div className="badge bg-blue-600 flex items-center gap-2 px-2 py-1 ">
                                            <span className="font-semibold">Client :</span> {filters?.client_name ? filters?.client_name : <>
                                                {data?.full_name}
                                            </>}
                                        </div>
                                    )}

                                    {filters?.entity_id && filters?.entity_name && (
                                        <div className="badge bg-green-600 flex items-center gap-2 px-2 py-1 ">
                                            <span className="font-semibold">Entity : </span> {filters?.entity_name}
                                        </div>
                                    )}

                                    {filters?.station_id && filters?.station_name && (
                                        <div className="badge bg-red-600 flex items-center gap-2 px-2 py-1 ">
                                            <span className="font-semibold">Station :</span> {filters?.station_name}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            ''
                        )}

                        <button onClick={() => setModalOpen(true)} type="button" className="btn btn-dark ">
                            Filter
                        </button>

                        {/* {modalOpen && (<>
                            <DashboardFilterModal isOpen={modalOpen} onClose={() => setModalOpen(false)}
                                onApplyFilters={handleApplyFilters} // Pass the handler to the modal
                            />
                        </>)} */}
                    </div>
                </div>

                <div className="pt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 mb-6 text-white">
                        <div className={`panel updownDiv  firstbox ${secondApiResponse ? 'cursor-pointer' : ''}`} >
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Volume
                                </div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> ℓ {secondApiResponse?.sales_volume?.sales_volume} </div>

                            </div>

                            <div style={{ color: secondApiResponse?.sales_volume?.status === 'up' ? "#37a40a" : "red" }}
                                className=" badge bg-white flex items-center font-semibold mt-5">
                                {secondApiResponse?.sales_volume?.status === 'up'
                                    ? <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i>
                                    : <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i>
                                }{secondApiResponse?.sales_volume?.percentage !== undefined ? (
                                    <span>Last Month {filterData?.sales_volume?.percentage}%</span>
                                ) : (
                                    <span>Last Month  </span>
                                )}</div>
                        </div>

                        {/* Sessions */}
                        <div className={`panel updownDiv secondbox ${secondApiResponse ? 'cursor-pointer' : ''}`} >
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Value </div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {currency} {secondApiResponse?.sales_value?.sales_value} </div>
                            </div>

                            <div style={{ color: secondApiResponse?.sales_value?.status === 'up' ? "#37a40a" : "red" }}
                                className=" badge bg-white flex items-center font-semibold mt-5">
                                {secondApiResponse?.sales_value?.status === 'up'
                                    ? <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i>
                                    : <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i>
                                }{secondApiResponse?.sales_value?.percentage !== undefined ? (
                                    <span>Last Month {filterData?.sales_value?.percentage}%</span>
                                ) : (
                                    <span>Last Month  </span>
                                )}</div>
                        </div>

                        {/*  Time On-Site */}
                        <div className={`panel updownDiv thiredbox ${secondApiResponse ? 'cursor-pointer' : ''}`} >
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Profit</div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {currency} {secondApiResponse?.profit?.profit} </div>

                            </div>


                            <div style={{ color: secondApiResponse?.profit?.status === 'up' ? "#37a40a" : "red" }}
                                className=" badge bg-white flex items-center font-semibold mt-5">
                                {secondApiResponse?.profit?.status === 'up'
                                    ? <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i>
                                    : <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i>
                                }{secondApiResponse?.profit?.percentage !== undefined ? (
                                    <span>Last Month {filterData?.profit?.percentage}%</span>
                                ) : (
                                    <span>Last Month  </span>
                                )}</div>
                        </div>

                        {/* 4th Card */}
                        <div
                            className={`panel updownDiv secondbox ${secondApiResponse ? 'cursor-pointer' : ''}`}
                        >
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Stock Loss</div>
                            </div>

                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                                {currency}{secondApiResponse?.stock?.value ?? ''}
                                {` (ℓ${secondApiResponse?.stock?.volume ?? ''})`}
                                {filterData?.stock ? <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip className='custom-tooltip' id="tooltip-amount">   {secondApiResponse?.stock?.fuel?.map((fuel: any, index: any) => (
                                        <div key={index} className="flex items-center w-100 mb-2"> {/* w-1/2 makes each item take half the width */}
                                            <div className="text-sm ltr:mr-3 rtl:ml-3">
                                                {fuel.name.charAt(0).toUpperCase() + fuel.name.slice(1)} {currency}{fuel.value ?? ''}
                                                {` (ℓ${fuel.volume ?? ''})`}
                                            </div>
                                        </div>
                                    ))}</Tooltip>}
                                >
                                    <span><i className="fi fi-tr-comment-info"></i></span>
                                </OverlayTrigger> : ""}
                            </div>

                            <div style={{ color: secondApiResponse?.stock?.status === 'up' ? "#37a40a" : "red" }}
                                className=" badge bg-white flex items-center font-semibold mt-5">
                                {secondApiResponse?.stock?.status === 'up'
                                    ? <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i>
                                    : <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i>
                                }{secondApiResponse?.stock?.value_percentage !== undefined ? (
                                    <span>Last Month {filterData?.stock?.value_percentage}%</span>
                                ) : (
                                    <span>Last Month  </span>
                                )}</div>
                        </div>



                    </div>


                    {secondApiResponse?.stations?.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                                {secondApiResponse?.stations?.map((item: any) => (
                                    <div
                                        key={item?.name}
                                        className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-black dark:text-white group ${isSitePermissionAvailable ? "cursor-pointer" : ""
                                            }`}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => !isSitePermissionAvailable && handleNavigateToNextPage(item)}
                                    >

                                        <div className="flex items-center mb-4">
                                            <img
                                                className="w-10 h-10 rounded-full object-cover"
                                                src={item?.image}
                                                alt={item?.name}
                                            />
                                            <h5 className="ml-4 font-semibold">{item?.name}</h5>
                                        </div>

                                        {item?.fuels_stats.map((stats: any, index: any) => (
                                            <div key={index}>
                                                <div className="grid grid-cols-2 gap-4 my-3">

                                                    <div>
                                                        <h6 className="font-semibold">Gross Volume</h6>
                                                        <p className="text-lg">
                                                            ℓ{stats?.sales_volume?.sales_volume}
                                                            <span
                                                                className={`ml-2 ${stats?.sales_volume?.status === "up"
                                                                    ? "text-green-500"
                                                                    : "text-red-500"
                                                                    }`}
                                                            >
                                                                {stats?.sales_volume?.status === "up" ? (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-up"></i>{" "}
                                                                        {stats?.sales_volume?.percentage}%
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-down"></i>{" "}
                                                                        {stats?.sales_volume?.percentage}%
                                                                    </>
                                                                )}
                                                            </span>
                                                        </p>
                                                    </div>


                                                    <div>
                                                        <h6 className="font-semibold">Gross Value</h6>
                                                        <p className="text-lg">
                                                            {currency} {stats?.sales_value.sales_value}
                                                            <span
                                                                className={`ml-2 ${stats?.sales_value.status === "up"
                                                                    ? "text-green-500"
                                                                    : "text-red-500"
                                                                    }`}
                                                            >
                                                                {stats?.sales_value.status === "up" ? (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-up"></i>{" "}
                                                                        {stats?.sales_value.percentage}%
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-down"></i>{" "}
                                                                        {stats?.sales_value.percentage}%
                                                                    </>
                                                                )}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <hr />

                                                <div className="grid grid-cols-2 gap-4 my-3">

                                                    <div>
                                                        <h6 className="font-semibold"> Gross Profit</h6>
                                                        <p className="text-lg">
                                                            {currency} {stats?.profit?.profit}
                                                            <span
                                                                className={`ml-2 ${stats?.profit?.status === "up"
                                                                    ? "text-green-500"
                                                                    : "text-red-500"
                                                                    }`}
                                                            >
                                                                {stats?.profit?.status === "up" ? (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-up"></i>{" "}
                                                                        {stats?.profit?.percentage}%
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-down"></i>{" "}
                                                                        {stats?.profit?.percentage}%
                                                                    </>
                                                                )}
                                                            </span>
                                                        </p>
                                                    </div>


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
                                    <h5 className="font-bold text-lg dark:text-white-light">Stations</h5>
                                </div>
                                <img
                                    src={noDataImage}
                                    alt="no data found"
                                    className="all-center-flex nodata-image"
                                />
                            </div>

                        </>
                    )}



                </div>
            </div >


            {modalOpen && (
                <div className='p-6'>
                    <NewDashboardFilterModal
                        getData={getData}
                        isLoading={isLoading}
                        onApplyFilters={handleApplyFilters}
                        showClientInput={true}  // or false
                        showEntityInput={true}  // or false
                        showStationInput={true} // or false
                        showStationValidation={false} // or false
                        showDateValidation={true} // or false
                        validationSchema={validationSchemaForCustomInput}
                        layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5"
                        showDateInput={false}
                        // storedKeyItems={storedKeyItems}
                        storedKeyName={storedKeyName}
                        smallScreen={true}
                        isOpen={modalOpen}
                        onClose={() => setModalOpen(false)}
                    />
                </div>
            )}

        </>
    );
};

const enhanceDashboardOverview = NewDashboardChild

export default withApiHandler(enhanceDashboardOverview);