import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import AppContext from '../../utils/Context/DashboardContext';
import { IRootState } from '../../store';
import { capacity, currency } from '../../utils/CommonData';
import ReactApexChart from 'react-apexcharts';
import VerticalProgressBarWithWave from '../../pages/Dashboard/VerticalProgressBarWithWave';
import withApiHandler from '../../utils/withApiHandler';
import noDataImage from '../../assets/AuthImages/noDataFound.png';
import NewDashboardFilterModal from './NewDashboardFilterModal';
import * as Yup from 'yup';
import useErrorHandler from '../../hooks/useHandleError';
import { Col } from 'react-bootstrap';
import { FormatNumberCommon } from '../CommonFunctions';
import CommonDashCard from './CommonDashCard';
import EarningModal from './EarningModal';
import DashboardHeader from './DashboardHeader';
import { useFormik } from 'formik';
import SmallLoader from '../../utils/SmallLoader';
import StockLoss from '../SideBarComponents/ManageStation/StockLoss';
import DashboardStockLoss from './DashboardStockLoss';

interface FilterValues {
    client_id: any;
    entity_id: any;
    station_id: any;
}

interface IndexProps {
    isLoading: boolean; // Define the type of the loading prop
    fetchedData: any; // Define the type of the fetchedData prop
    getData: (url: string, id?: string, params?: any) => Promise<any>;
}
interface FuelStatsData {
    dates: string[];
    stock_alert: Record<string, any[]>;
    station_name: string;
    station_image: string;
    last_dayend: string;
}

// Initialize the state with an empty object


const NewDashboard: React.FC<IndexProps> = ({ isLoading, fetchedData, getData }) => {
    useEffect(() => {
        dispatch(setPageTitle('Sales Admin'));
    });
    const formik = useFormik({
        initialValues: {
            toggle: false, // Initial state for toggle switch
        },
        onSubmit: (values) => {
            console.log("Form Values: ", values);
        },
    });

    const handleApiError = useErrorHandler();
    let storedKeyName = "stationTank";
    const { setAppData, } = useContext(AppContext);

    const navigate = useNavigate();
    const [fuelStats, setFuelStats] = useState<FuelStatsData>({
        dates: [],
        stock_alert: {},
        station_name: '',
        station_image: '',
        last_dayend: ''
    });
    const [filters, setFilters] = useState<any>({
        client_id: '',
        entity_id: '',
        station_id: '',
    });

    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const openAddUserModal = () => {
        setIsAddUserModalOpen(true); // Open the modal if siteid exists


    };
    const closeAddUserModal = () => {
        setIsAddUserModalOpen(false); // Open the modal if siteid exists


    };
    const [GraphData, setGraphData] = useState<any>(null);
    const [DashfilterData, setDashfilterData] = useState<any>(null);
    const [dashboardLoading, setDashboardLoading] = useState<boolean>(false);
    const [dashboarGraphdLoading, setDashboarGraphdLoading] = useState<boolean>(false);
    const [stationStockLoading, setStationStockLoading] = useState<boolean>(false);
    const [toggle, setToggle] = useState(false);

    const handleToggleChange = (event: any) => {
        // Update the toggle and send the correct value to GetDashboardGraphStats
        const newToggleValue = !toggle; // Get the new value after toggle
        setToggle(newToggleValue); // Update local state

        // Update Formik state
        formik.setFieldValue('toggle', newToggleValue);

        // Decide which data to send based on the new toggle value
        const dataToSend = newToggleValue ? 'tested_fuel' : 'variance';

        if (storedData && isDashFuelStatsPermissionAvailable) {
            const updatedData = { ...JSON.parse(storedData), f_type: dataToSend };
            GetDashboardGraphStats(updatedData, newToggleValue); // Fetch with updated f_type
        }

    };
    const GetDashboardStats = async (filters: FilterValues) => {
        const { client_id, entity_id, station_id } = filters;
        if (client_id) {
            try {
                setDashboardLoading(true);  // Start loading for dashboard
                const queryParams = new URLSearchParams();
                if (client_id) queryParams.append('client_id', client_id);
                if (entity_id) queryParams.append('entity_id', entity_id);
                if (station_id) queryParams.append('station_id', station_id);

                const queryString = queryParams.toString();
                const response = await getData(`dashboard/stats?${queryString}`);
                if (response && response.data && response.data.data) {
                    setAppData({
                        sales_volume: response.data?.data?.sales_volume,
                        sales_value: response.data?.data?.sales_value,
                        profit: response.data?.data?.profit,
                        stock: response.data?.data?.stock,
                        line_graph: response.data?.data?.line_graph,
                        pi_graph: response.data?.data?.pi_graph,
                        basic_details: response.data?.data?.basic_details,
                    });
                    setDashfilterData(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard stats", error);
            } finally {
                setDashboardLoading(false); // Stop loading after fetching
            }
        }
    };
    const GetDashboardGraphStats = async (filters: FilterValues, newToggleValue: boolean) => {
        const { client_id, entity_id, station_id } = filters;
        if (client_id) {
            try {
                setDashboarGraphdLoading(true);  // Start loading for dashboard
                const queryParams = new URLSearchParams();
                if (client_id) queryParams.append('client_id', client_id);
                if (entity_id) queryParams.append('entity_id', entity_id);
                if (station_id) queryParams.append('station_id', station_id);
                queryParams.append('f_type', newToggleValue ? 'tested_fuel' : 'variance');


                const queryString = queryParams.toString();
                const response = await getData(`dashboard/fuel-stats?${queryString}`);
                if (response && response.data && response.data.data) {
                    setGraphData(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard stats", error);
            } finally {
                setDashboarGraphdLoading(false); // Stop loading after fetching
            }
        }
    };


    const GetStationStock = async (stationId: string) => {
        try {
            setStationStockLoading(true); // Start loading for station stock
            const response = await getData(`dashboard/fuel-forecasting?station_id=${stationId}`);
            if (response && response.data && response.data.data) {
                const { dates, stock_alert, station_name, station_image, last_dayend } = response.data?.data;
                setFuelStats({
                    dates,
                    stock_alert,
                    station_name,
                    station_image,
                    last_dayend,
                });
            }
        } catch (error) {
            console.error("Error fetching station stock", error);
        } finally {
            setStationStockLoading(false); // Stop loading after fetching
        }
    };





    const { data, error } = useSelector((state: IRootState) => state?.data);
    const [modalOpen, setModalOpen] = useState(false);


    const dispatch = useDispatch();

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const reduxData = useSelector((state: IRootState) => state?.data?.data);
    const storedData = localStorage.getItem(storedKeyName);


    useEffect(() => {

        if (storedData && reduxData?.role) {
            handleApplyFilters(JSON.parse(storedData));
        } else if (localStorage.getItem("superiorRole") === "Client" && reduxData?.role) {
            const storedClientIdData = localStorage.getItem("superiorId");
            if (storedClientIdData) {
                fetchCompanyList(storedClientIdData)

            }
        }

    }, [dispatch, storedKeyName, reduxData,]); // Add any other dependencies needed here


    const fetchCompanyList = async (clientId: string) => {
        try {
            const response = await getData(`getEntities?client_id=${clientId}`);
            const storedClientIdData = localStorage.getItem("superiorId");
            const futurepriceLog = {
                client_id: storedClientIdData,
                client_name: reduxData?.full_name,
                "companies": response.data.data,
            };

            handleApplyFilters(futurepriceLog);

            localStorage.setItem(storedKeyName, JSON.stringify(futurepriceLog));
        } catch (error) {
            handleApiError(error);
        }
    };





    const handleResetFilters = async () => {
        localStorage.removeItem("stationTank");
        setFilters(null)
        setGraphData(null)
        setDashfilterData(null)
        setFuelStats({
            dates: [],
            stock_alert: {},
            station_name: '',
            station_image: '',
            last_dayend: ''
        })
    };



    const handleApplyFilters = async (values: any) => {

        setFilters(values);
        if (isDashViewPermissionAvailable) {
            GetDashboardStats(values);
        }
        if (isDashFuelStatsPermissionAvailable) {
            GetDashboardGraphStats(values, toggle);
        }
        if (values?.station_id && isForecastingPermissionAvailable) {
            GetStationStock(values?.station_id)
        }
        setModalOpen(false);
    };

    //Revenue Chart
    const revenueChart: any = {

        series: GraphData?.fuel_stock_stats?.series,
        options: {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            // colors: isDark ? ['#2196F3', '#E7515A', '#FF9800'] : ['#1B55E2', '#E7515A', '#FF9800'],
            series: GraphData?.fuel_stock_stats?.colors,

            labels: GraphData?.fuel_stock_stats?.labels,
            // labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    // formatter: (value: number) => {
                    //     return value / 1000 + 'K';
                    // },
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191E3A' : '#E0E6ED',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                yaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
        },
    };





    const handleClickToOverView = () => {
        if (storedData && isDashDetailPermissionAvailable) {
            const parsedStoredData = JSON.parse(storedData);
            if (parsedStoredData?.entity_id && filters?.entity_id) {
                navigate('/dashboard/overview');
            } else {
                setModalOpen(true);
            }
        }
    };




    const { dates } = fuelStats; // Extract dates from fuelStats
    const [selectedDate, setSelectedDate] = useState(dates[0]); // Initial state
    const [filteredStockAlerts, setFilteredStockAlerts] = useState<{ [key: string]: any[] }>({});



    const Permissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);

    const isAddPermissionAvailable = Permissions?.includes('user-create');
    const isTotalRevenuePermissionAvailable = Permissions?.includes('dashboard-revenue-stats');
    const isStockLossPermissionAvailable = Permissions?.includes('dashboard-stock-loss');
    const isForecastingPermissionAvailable = Permissions?.includes('dashboard-forecasting');
    const isDashFuelStatsPermissionAvailable = Permissions?.includes('dashboard-fuel-stats');
    const isDashDetailPermissionAvailable = Permissions?.includes('dashboard-details');
    const isDashViewPermissionAvailable = Permissions?.includes('dashboard-details');

    const handleDateClick = (date: string) => {
        setSelectedDate(date);
        const filteredStockAlerts = Object.keys(fuelStats?.stock_alert).reduce((acc, tankName) => {
            acc[tankName] = fuelStats?.stock_alert[tankName].filter((item: any) => item.date === date);
            return acc;
        }, {} as { [key: string]: any[] });


        setFilteredStockAlerts(filteredStockAlerts);

        // Optionally, you can update the state or handle the filtered data as needed
    };
    useEffect(() => {
        if (fuelStats?.dates?.length > 0) {
            const defaultDate = fuelStats?.dates[0]; // Select the first date by default
            setSelectedDate(defaultDate);
            handleDateClick(defaultDate);
        }
        console.clear()
    }, [fuelStats]);

    // const { sales_volume, sales_value, profit } = useContext(AppContext);


    const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");

    const validationSchemaForCustomInput = Yup.object({
        client_id: isNotClient
            ? Yup.string().required("Client is required")
            : Yup.mixed().notRequired(),
        entity_id: Yup.string().required("Entity is required"),
    });
    const UserPermissions = useSelector((state: IRootState) => state?.data?.data || []);
    const [isHovered, setIsHovered] = useState(false);


    const [ShowEarningModal, setShowEarningModal] = useState(false);
    const CloseEarningModal = () => {
        setShowEarningModal(false);
    };

    const OpenEarningModal = () => {
        setShowEarningModal(true);

    };








    return (
        <>
            {/* {isLoading ? <LoaderImg /> : ''} */}
            <>

                {(!dashboardLoading && isTotalRevenuePermissionAvailable) ?
                    <>
                        <div className="position-fixed top-50 end-0 translate-middle-y">
                            <button
                                className=" btn btn-primary custom-tooltip-button"
                                style={{ border: "none" }}
                                aria-label='Edit'
                                onClick={OpenEarningModal}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >

                                {currency} {" "}
                                {isHovered && (
                                    <button className=" ms-2  button-icon" > Total Revenue</button>
                                )}
                            </button>
                        </div>
                        <EarningModal onClose={CloseEarningModal} getData={getData} isOpen={ShowEarningModal} data={DashfilterData} Date={DashfilterData?.day_end_date} />

                    </>


                    : ""

                }

                <DashboardHeader
                    DashfilterData={DashfilterData}
                    UserPermissions={UserPermissions}
                    filters={filters}
                    data={data}
                    setModalOpen={setModalOpen}
                    handleResetFilters={handleResetFilters}
                />


                {/* //Graphs */}

                <div className="pt-5 ">

                    {!dashboardLoading ? <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 mb-6 text-white">

                        <CommonDashCard
                            data={DashfilterData}
                            onClick={handleClickToOverView}
                            title={"Gross Volume (Fuel)"}
                            headingValue={DashfilterData?.sales_volume?.sales_volume}
                            subHeadingData={DashfilterData?.sales_volume}
                            boxNumberClass={"firstbox"}
                            firstScreen={true}
                        />


                        <CommonDashCard
                            data={DashfilterData}
                            onClick={handleClickToOverView}
                            title={"Gross Value (Fuel)"}
                            headingValue={DashfilterData?.sales_value?.sales_value}
                            subHeadingData={DashfilterData?.sales_volume}
                            boxNumberClass={"secondbox"}
                            firstScreen={true}
                        />

                        <div
                            className={`panel updownDiv secondbox ${DashfilterData ? 'cursor-pointer' : ''}`}
                        >
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Value (Lubes) </div>
                            </div>

                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3 ">
                                {currency}
                                {FormatNumberCommon(DashfilterData?.lubes_value?.lubes_value ?? '')}


                                {/* {` (ℓ${FormatNumberCommon(DashfilterData?.lubes_value
                                    ?.volume ?? '')} )`} */}

                            </div>




                            {/* <div style={{
                                color: DashfilterData?.lubes_value
                                    ?.status == 'UP'
                                    ? '#37a40a'  // Green for 'UP'
                                    : DashfilterData?.lubes_value
                                        ?.status == 'DOWN'
                                        ? 'red'  // Red for 'DOWN'
                                        : '#000'  // Black for any other case
                            }}
                                className=" badge w-1/2 bg-white flex items-center font-semibold mt-5">
                                {DashfilterData?.lubes_value
                                    ?.status == 'UP'
                                    ? <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i>
                                    : <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i>
                                }



                                {DashfilterData?.lubes_value
                                    ?.percentage !== undefined ? (
                                    <span>Last Month {DashfilterData.lubes_value
                                        .percentage}%</span>
                                ) : (
                                    <span>Last Month </span>
                                )}
                            </div> */}
                            <div style={{
                                color: DashfilterData?.lubes_value?.status === 'UP'
                                    ? "#37a40a"  // Color if status is 'UP'
                                    : DashfilterData?.lubes_value?.status === 'DOWN'
                                        ? "red"      // Color if status is 'DOWN'
                                        : "#000"     // Fallback color if status is neither 'UP' nor 'DOWN'
                            }}
                                className=" badge w-1/3 bg-white flex items-center font-semibold mt-5">
                                {DashfilterData?.lubes_value?.status && (
                                    DashfilterData?.lubes_value?.status == 'UP'
                                        ? <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i>
                                        : DashfilterData?.lubes_value?.status === 'DOWN'
                                            ? <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i>
                                            : null
                                )}
                                <br />
                                {DashfilterData?.lubes_value?.percentage !== undefined ? (
                                    <span>Last Month <br /> {DashfilterData?.lubes_value?.percentage}%</span>
                                ) : (
                                    <span>Last Month  </span>
                                )}</div>
                        </div>
                        <CommonDashCard
                            data={DashfilterData}
                            onClick={handleClickToOverView}
                            title={"Gross Profit (Lubes+Fuel)"}
                            headingValue={DashfilterData?.profit?.profit}
                            subHeadingData={DashfilterData?.profit}
                            boxNumberClass={"thirdbox"}
                            firstScreen={true}
                        />




                    </div> : <>
                        <div className='flexcenter' style={{ minHeight: "200px", background: "#fff", marginBottom: "20px" }}>
                            <SmallLoader />
                        </div>
                    </>}




                    {isDashFuelStatsPermissionAvailable && (<>
                        <div className="grid xl:grid-cols-3  md:grid-cols-2 sm:grid-cols-1 gap-2 mb-6">
                            <div className="panel h-full xl:col-span-2 ">
                                <div className="flex items-center justify-between dark:text-white-light mb-5">
                                    <h5 className="font-bold text-lg">{toggle ? 'Tested Fuel' : 'Fuel Variances'}  {GraphData?.day_end_date ? `(${GraphData.day_end_date})` : ""}</h5>
                                    {
                                        GraphData?.fuel_stock_stats?.series ? <div className=' flex items-end text-end'>
                                            <Col lg={12} md={12}>
                                                <div className="mt-2 sm:grid-cols-1 flexcenter">
                                                    <span className="font-bold mr-2">Fuel Variance</span>

                                                    {/* Toggle Switch */}
                                                    <label style={{ cursor: "pointer" }} className="w-12 h-6 relative">
                                                        <input
                                                            type="checkbox"
                                                            className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                            checked={toggle}
                                                            onChange={handleToggleChange}
                                                        />
                                                        <span className={`outline_checkbox block h-full rounded-full transition-all duration-300 ${toggle ? 'bg-primary border-primary' : 'bg-primary border-primary'}`}>
                                                            <span className={`absolute bottom-1 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${toggle ? 'bg-white left-7' : 'bg-white left-1'}`}>
                                                            </span>
                                                        </span>
                                                    </label>

                                                    <span className="font-bold ms-2">Tested Fuel</span>
                                                </div>
                                            </Col>
                                        </div> : ""
                                    }
                                </div>

                                <div className="relative" style={{ minHeight: "350px" }}>
                                    <div className="bg-white dark:bg-black  overflow-hidden">
                                        {!dashboarGraphdLoading ? (
                                            !GraphData?.fuel_stock_stats ? (
                                                <div className="flex justify-center items-center h-full p-4">
                                                    <img
                                                        src={noDataImage}
                                                        alt="No data found"
                                                        className="w-1/2 max-w-xs"
                                                    />
                                                </div>
                                            ) : (
                                                <ReactApexChart
                                                    series={GraphData.fuel_stock_stats.series}
                                                    options={revenueChart?.options}
                                                    type="area"
                                                    height={325}
                                                />
                                            )
                                        ) : (
                                            <SmallLoader />
                                        )}
                                    </div>
                                </div>

                            </div>
                            {/* {isAddPermissionAvailable && (
                            <button type="button" className="btn btn-dark" onClick={openAddUserModal}>
                                Add User
                            </button>
                        )} */}

                            <div className="panel h-full xl:col-span-1 ">

                                <div className="flex items-center justify-between dark:text-white-light mb-5">
                                    <h5 className="font-bold text-lg dark:text-white-light"> Accumulated Fuel Variances  {GraphData?.day_end_date ? `(${GraphData.day_end_date})` : ""}
                                    </h5>
                                    {filters?.entity_id && isStockLossPermissionAvailable && (<button className='btn btn-primary' onClick={openAddUserModal}> Stock Loss</button>)}
                                </div>

                                <div className="relative" style={{ minHeight: "350px" }}>
                                    <div className="bg-white dark:bg-black  overflow-hidden">

                                        {!dashboarGraphdLoading ? (
                                            !GraphData?.fuel_stock_stats ? (
                                                <div className="flex justify-center items-center h-full p-4">
                                                    <img
                                                        src={noDataImage}
                                                        alt="No data found"
                                                        className="w-1/2 max-w-xs"
                                                    />
                                                </div>
                                            ) : (
                                                <table>
                                                    <thead>
                                                        <tr className='bg-gray-200'>
                                                            <th>Fuel Name</th>
                                                            <th>Testing</th>
                                                            <th>Variance</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {GraphData?.fuel_stock.map((fuel: any, index: any) => (
                                                            <tr className='hover:bg-gray-100' key={index}>
                                                                <td>{fuel?.fuel_name || 'No fuel name'}</td>
                                                                <td>{capacity} {fuel?.testing ?? 0}</td>
                                                                <td>{capacity} {fuel?.variance ?? 0}</td>
                                                            </tr>

                                                        ))}
                                                    </tbody>
                                                </table>
                                            )
                                        ) : (
                                            <SmallLoader />
                                        )}



                                    </div>
                                </div>

                            </div>
                        </div>
                    </>)}



                    {filters?.station_id && isForecastingPermissionAvailable && (
                        !stationStockLoading ? (
                            <div className="grid xl:grid-cols-7 md:grid-cols-4 sm:grid-cols-1 gap-2 mb-6">
                                {/* Forecasting Panel */}
                                <div className="panel h-full w-full">
                                    <div className="flex items-center justify-between dark:text-white-light mb-5">
                                        <h5 className="font-bold text-lg">Forecasting</h5>
                                    </div>

                                    <div className="fuel-stats-buttons mt-4 col-span-4 displaycanter w-full">
                                        <div className="buttons-container w-full">
                                            {fuelStats?.dates && fuelStats.dates.length > 0 ? (
                                                fuelStats.dates.map((date, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleDateClick(date)}
                                                        className={`date-button w-full btn mb-2 ${date === selectedDate ? 'btn-info' : 'btn-primary'}`}
                                                        style={{ borderBottom: '1px solid #ddd' }}
                                                    >
                                                        {date}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="flex justify-center items-center h-full mt-10 p-4">
                                                    <img
                                                        src={noDataImage}
                                                        alt="No data found"
                                                        style={{ height: '250px', width: '250px' }}
                                                        className="w-full max-w-xs"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Station Panel */}
                                <div className="panel h-full xl:col-span-6 md:col-span-3 sm:grid-cols-1">
                                    <div className="flex items-center justify-between dark:text-white-light mb-5">
                                        <h5 className="font-bold text-lg">Station: {fuelStats?.station_name} ({selectedDate})</h5>
                                    </div>

                                    <div className="spacebetween">
                                        <div className="flex flex-wrap gap-2 col-span-9 justify-center">
                                            {fuelStats?.dates && fuelStats.dates.length > 0 ? (
                                                Object.keys(filteredStockAlerts).map((tankName) => (
                                                    <div
                                                        key={tankName}
                                                        className="card border rounded-lg shadow-md mb-6 dark:bg-gray-800 dark:text-white"
                                                    >
                                                        <div className="card-header flex items-center justify-between p-4 border-b dark:border-gray-700">
                                                            <h3 className="text-lg font-bold">{tankName}</h3>
                                                        </div>

                                                        <div className="card-body p-2">
                                                            <div className="flex flex-wrap gap-2">
                                                                {filteredStockAlerts[tankName]?.map((alert, index) => (
                                                                    <div key={index} className="flex items-center gap-4 mb-6">
                                                                        <VerticalProgressBarWithWave
                                                                            percentage={parseFloat(alert?.fuel_left_percentage) || 0} // Convert percentage to number, default to 0 if not a number
                                                                            width={135}
                                                                            height={205}
                                                                            alert={alert}
                                                                            color="#ddd"
                                                                            data-tip
                                                                            data-for={`tooltip-${tankName}-${index}`} // Unique tooltip ID
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex justify-center items-center h-full p-4">
                                                    <img
                                                        src={noDataImage}
                                                        alt="No data found"
                                                        className="w-full max-w-xs"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid xl:grid-cols-7 md:grid-cols-4 sm:grid-cols-1 gap-2 mb-6">
                                {/* Forecasting Panel */}
                                <div className="panel h-full w-full">
                                    <div className="flex items-center justify-between dark:text-white-light mb-5">
                                        <h5 className="font-bold text-lg">Forecasting</h5>
                                    </div>

                                    <div className="fuel-stats-buttons mt-4 col-span-4 displaycanter w-full">
                                        <div style={{ minHeight: "300px" }} className="flexcenter">
                                            <div className="flex flex-wrap gap-2 col-span-9 justify-center">
                                                <div className='flexcenter'>   <SmallLoader /></div>


                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Station Panel */}
                                <div className="panel h-full xl:col-span-6 md:col-span-3 sm:grid-cols-1">
                                    <div className="flex items-center justify-between dark:text-white-light mb-5">
                                        <h5 className="font-bold text-lg">Station: {fuelStats?.station_name} ({selectedDate})</h5>
                                    </div>

                                    <div style={{ minHeight: "300px" }} className="flexcenter">
                                        <div className="flex flex-wrap gap-2 col-span-9 justify-center">
                                            <div className='flexcenter'>   <SmallLoader /></div>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </ >

            <DashboardStockLoss getData={getData} isOpen={isAddUserModalOpen} onClose={closeAddUserModal} userId={userId} />

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

export default withApiHandler(NewDashboard);