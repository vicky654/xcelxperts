import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import LoaderImg from '../../utils/Loader';
import { currency } from '../../utils/CommonData';
import withApiHandler from '../../utils/withApiHandler';
import noDataImage from '../../assets/AuthImages/noDataFound.png';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import NewDashboardFilterModal from './NewDashboardFilterModal';
import * as Yup from 'yup';
import { FormatNumberCommon } from '../CommonFunctions';
import CommonDashCard from './CommonDashCard';

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
    let storedKeyName = "stationTank";
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

                setsecondApiResponse(response.data?.data)
                setFilterData(response.data?.data)
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
            handleApplyFilters(JSON.parse(storedData));
        }
    }, [dispatch]);

    const handleApplyFilters = async (values: any) => {

        setFilters(values);

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
        // Get the stored data from local storage
        const storedDataString = localStorage.getItem("stationTank");

        if (storedDataString) {
            // Parse the stored JSON data
            let storedData: any = JSON.parse(storedDataString);

            // Update the station_name and station_id with new values from item
            storedData.site_name = item?.name;
            storedData.station_name = item?.name;
            storedData.station_id = item?.id;

            // Check if start_month is empty, if so, set it to the current month
            if (!storedData?.start_month) {
                const currentMonth = new Date()?.toISOString().slice(0, 7); // Format YYYY-MM
                storedData.start_month = currentMonth;
            }

            // Update the local storage with the modified data
            localStorage.setItem("stationTank", JSON.stringify(storedData));


            if (!isSitePermissionAvailable) {
                navigate(`/data-entry-stats/${item?.id}`);
            }
        } else {
            console.error("No data found in local storage for key 'stationTank'");
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
                    <div>
                        <h2 className='font-bold'>
                            Dashboard Overview {filterData?.day_end_date && (
                                <>
                                    ({filterData?.day_end_date})

                                    {filterData?.day_end_date && (
                                        <OverlayTrigger
                                            placement="bottom"
                                            overlay={
                                                <Tooltip className='custom-tooltip' id="tooltip-amount">
                                                    You are able to see data till the last day end {filterData?.day_end_date}
                                                </Tooltip>
                                            }
                                        >
                                            <span><i className="fi fi-sr-comment-info "></i></span>
                                        </OverlayTrigger>
                                    )}
                                </>
                            )}





                        </h2>
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
                    </div>


                    <div className=' flex gap-4 flex-wrap'>

                        {filters?.client_id || filters?.entity_id || filters?.station_id ? (
                            <>
                                <div className="badges-container flex flex-wrap items-center gap-2 px-4   text-white" style={{ background: "#ddd" }}>
                                    {filters?.client_id && (
                                        <div className="badge bg-blue-600 flex items-center gap-2 px-2 py-1 ">
                                            <span className="font-semibold">Client :</span>
                                            {filters?.client_name ? filters?.client_name : <>
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


                    </div>
                </div>

                <div className="pt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 mb-6 text-white">

                        <CommonDashCard
                            data={filterData}
                            title={"Gross Volume (Fuel)"}
                            headingValue={filterData?.sales_volume?.sales_volume}
                            subHeadingData={filterData?.sales_volume}
                            boxNumberClass={"firstbox"}
                        />


                        <CommonDashCard
                            data={filterData}
                            title={"Gross Value (Fuel)"}
                            headingValue={filterData?.sales_value?.sales_value}
                            subHeadingData={filterData?.sales_volume}
                            boxNumberClass={"secondbox"}
                        />
                        <div
                            className={`panel updownDiv secondbox ${secondApiResponse ? 'cursor-pointer' : ''}`}
                        >
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Value (Lubes)</div>
                            </div>

                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                                {currency}

                                {FormatNumberCommon(secondApiResponse?.lubes_value?.lubes_value ?? '')}
                                {/* {` (ℓ${FormatNumberCommon(secondApiResponse?.lubes_value?.volume ?? '')})`} */}


                            </div>

                            <div style={{
                                color: secondApiResponse?.lubes_value?.status === 'up'
                                    ? "#37a40a"  // Color if status is 'up'
                                    : secondApiResponse?.lubes_value?.status === 'down'
                                        ? "red"      // Color if status is 'down'
                                        : "#000"     // Fallback color if status is neither 'up' nor 'down'
                            }}
                                className=" badge w-1/3 bg-white flex items-center font-semibold mt-5">
                                {secondApiResponse?.lubes_value?.status && (
                                    secondApiResponse?.lubes_value?.status == 'up'
                                        ? <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i>
                                        : secondApiResponse?.lubes_value?.status === 'down'
                                            ? <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i>
                                            : null
                                )}
                                {secondApiResponse?.lubes_value?.percentage !== undefined ? (
                                    <span>Last Month {filterData?.lubes_value?.percentage}%</span>
                                ) : (
                                    <span>Last Month  </span>
                                )}</div>
                        </div>

                        <CommonDashCard
                            data={filterData}
                            // onClick={() => void}
                            title={"Gross Profit (Lubes+Fuel)"}
                            headingValue={filterData?.profit?.profit}
                            subHeadingData={filterData?.profit}
                            boxNumberClass={"thirdbox"}
                        />








                        {/* 4th Card */}




                    </div>


                    {filterData?.stations?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                            {filterData?.stations?.map((item: any) => (
                                <div
                                    key={item.id}
                                    className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-black dark:text-white group ${isSitePermissionAvailable ? "cursor-pointer" : ""}`}
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

                                    <div>
                                        <div className="grid grid-cols-2 gap-4 my-3">
                                            <div>
                                                <h6 className="font-semibold">Gross Volume (Fuel)</h6>
                                                <p className="text-lg">
                                                    ℓ{FormatNumberCommon(item?.sales_volume.sales_volume)}
                                                    <span
                                                        className={`ml-2 ${item?.sales_volume.status === "up" ? "text-green-500" : "text-red-500"}`}
                                                    >
                                                        {item?.sales_volume.status === "up" ? (
                                                            <>
                                                                <i className="fa fa-chevron-circle-up"></i>{" "}
                                                                {item?.sales_volume.percentage}%
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fa fa-chevron-circle-down"></i>{" "}
                                                                {item?.sales_volume.percentage}%
                                                            </>
                                                        )}
                                                    </span>
                                                </p>
                                            </div>

                                            <div>
                                                <h6 className="font-semibold">Gross Value (Fuel)</h6>
                                                <p className="text-lg">
                                                    {currency}{FormatNumberCommon(item?.sales_value.sales_value)}
                                                    <span
                                                        className={`ml-2 ${item?.sales_value.status === "up" ? "text-green-500" : "text-red-500"}`}
                                                    >
                                                        {item?.sales_value.status === "up" ? (
                                                            <>
                                                                <i className="fa fa-chevron-circle-up"></i>{" "}
                                                                {item?.sales_value.percentage}%
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fa fa-chevron-circle-down"></i>{" "}
                                                                {item?.sales_value.percentage}%
                                                            </>
                                                        )}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <hr />

                                        <div className="grid grid-cols-2 gap-4 my-3">
                                            <div>
                                                <h6 className="font-semibold">Gross Value  (Lubes) </h6>
                                                <p className="text-lg">
                                                    {currency}{FormatNumberCommon(item?.lubes_value?.lubes_value || '0')}
                                                    <span
                                                        className={`ml-2 ${item?.lubes_value?.status === "up" ? "text-green-500" : "text-red-500"}`}
                                                    >
                                                        {item?.lubes_value?.status === "up" ? (
                                                            <>
                                                                <i className="fa fa-chevron-circle-up"></i>{" "}
                                                                {item?.lubes_value?.percentage}%
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fa fa-chevron-circle-down"></i>{" "}
                                                                {item?.lubes_value?.percentage}%
                                                            </>
                                                        )}
                                                    </span>
                                                </p>
                                            </div>


                                            <div>
                                                <h6 className="font-semibold">Gross Profit  (Lubes + Fuel)</h6>
                                                <p className="text-lg">
                                                    {currency}{FormatNumberCommon(item?.profit.profit)}
                                                    <span
                                                        className={`ml-2 ${item?.profit.status === "up" ? "text-green-500" : "text-red-500"}`}
                                                    >
                                                        {item?.profit.status === "up" ? (
                                                            <>
                                                                <i className="fa fa-chevron-circle-up"></i>{" "}
                                                                {item?.profit.percentage}%
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fa fa-chevron-circle-down"></i>{" "}
                                                                {item?.profit.percentage}%
                                                            </>
                                                        )}
                                                    </span>
                                                </p>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='panel'>
                            <div className="flex items-center mb-5">
                                <h5 className="font-bold text-lg dark:text-white-light">Stations</h5>
                            </div>
                            <img
                                src={noDataImage}
                                alt="no data found"
                                className="all-center-flex nodata-image"
                            />
                        </div>
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