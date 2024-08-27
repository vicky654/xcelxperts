import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import AppContext from '../../utils/Context/DashboardContext';
import { IRootState } from '../../store';
import LoaderImg from '../../utils/Loader';
import Tippy from '@tippyjs/react';
import { currency } from '../../utils/CommonData';
import ReactApexChart from 'react-apexcharts';
import VerticalProgressBarWithWave from '../../pages/Dashboard/VerticalProgressBarWithWave';
import withApiHandler from '../../utils/withApiHandler';
import noDataImage from '../../assets/AuthImages/noDataFound.png';
import NewDashboardFilterModal from './NewDashboardFilterModal';
import * as Yup from 'yup';
import useErrorHandler from '../../hooks/useHandleError';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import BasicPieChart from '../../pages/Dashboard/BasicPieChart';

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

    const handleApiError = useErrorHandler();

    let storedKeyName = "newDashboardFilters";

    const { sales_volume, setAppData, selectedClient, selectedEntity, selectedStation } = useContext(AppContext);

    const navigate = useNavigate();
    const IsClientLogin = useSelector((state: IRootState) => state.auth);
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


    const [filterData, setFilterData] = useState<any>(null);

    const callFetchFilterData = async (filters: FilterValues) => {
        const { client_id, entity_id, station_id } = filters;
        if (client_id) {
            try {
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

                    setFilterData(response.data.data);
                }
                // setData(response.data);
            } catch (error) {

            } finally {
            }
        }
    };


    const GetFuelStats = async (item: any) => {
        try {

            const response = await getData(`dashboard/station-stock?station_id=${item}`);



            if (response && response.data && response.data.data) {
                // Extract data from the response
                const { dates, stock_alert, station_name, station_image, last_dayend } = response.data?.data;

                // Update state with the fetched data
                setFuelStats({
                    dates,
                    stock_alert,
                    station_name,
                    station_image,
                    last_dayend
                });

            }
        } catch (error) {

        } finally {
        }
    };
    const { data, error } = useSelector((state: IRootState) => state?.data);
    const [modalOpen, setModalOpen] = useState(false);


    const dispatch = useDispatch();


    // useEffect(() => {
    //     const clientId = localStorage.getItem('client_id');
    //     const companyId = localStorage.getItem('entity_id');

    //     if (data?.applyFilter === false && !clientId && !companyId) {
    //         const initialFilters = {
    //             client_id: data?.superiorId || '',
    //             entity_id: data?.entity_id || filters.entity_id || '',
    //             station_id: filters.station_id || '',
    //         };
    //         setFilters(initialFilters);
    //         callFetchFilterData(initialFilters);
    //     }
    // }, [data?.applyFilter, data?.superiorId]);

    // useEffect(() => {
    //     const clientId = localStorage.getItem('client_id');
    //     const companyId = localStorage.getItem('entity_id');
    //     if (IsClientLogin?.isClient && !companyId) {

    //         const initialFilters = {
    //             client_id: clientId || '',
    //             entity_id: '',
    //             station_id: '',
    //         };
    //         setFilters(initialFilters);
    //         callFetchFilterData(initialFilters);
    //     }
    // }, [data?.applyFilter, data?.superiorId]);










    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;





    useEffect(() => {
        const storedData = localStorage.getItem(storedKeyName);

        if (storedData) {
            handleApplyFilters(JSON.parse(storedData));
        } else if (localStorage.getItem("superiorRole") === "Client") {
            const storedClientIdData = localStorage.getItem("superiorId");

            if (storedClientIdData) {
                const futurepriceLog = { client_id: storedClientIdData };
                localStorage.setItem(storedKeyName, JSON.stringify(futurepriceLog));
                handleApplyFilters(futurepriceLog);
            }
        }
    }, [dispatch, storedKeyName]); // Add any other dependencies needed here


    const handleResetFilters = async () => {
        localStorage.removeItem("newDashboardFilters");
        setFilters(null)
        setFilterData(null)
        setFuelStats({
            dates: [],
            stock_alert: {},
            station_name: '',
            station_image: '',
            last_dayend: ''
        })

        // if (IsClientLogin?.isClient) {

        //     setFilters({
        //         client_id: IsClientLogin?.superiorId || '',
        //         entity_id: '',
        //         station_id: '',
        //     });
        //     localStorage.removeItem('entity_id');
        //     localStorage.removeItem('station_id');
        //     localStorage.removeItem('testing');

        //     try {

        //         const queryParams = new URLSearchParams();

        //         if (IsClientLogin?.superiorId) queryParams.append('client_id', IsClientLogin?.superiorId);

        //         const queryString = queryParams.toString();
        //         const response = await getData(`dashboard/stats?${queryString}`);
        //         if (response && response.data && response.data.data) {
        //             setFilterData(response.data.data);
        //         }
        //     } catch (error) {

        //     }

        // } else {
        //     // Clear filters state
        //     setFilters({
        //         client_id: '',
        //         entity_id: '',
        //         station_id: '',
        //     });
        //     setFilterData(null);
        //     localStorage.removeItem('client_id');
        //     localStorage.removeItem('entity_id');
        //     localStorage.removeItem('station_id');
        //     localStorage.removeItem('testing');
        // }
    };



    const handleApplyFilters = async (values: any) => {

        setFilters(values);
        callFetchFilterData(values);
        if (values?.station_id) {
            GetFuelStats(values?.station_id)
        }
        setModalOpen(false);
    };


    // const handleApplyFilters = (values: FilterValues) => {
    // let clientId = values.client_id || IsClientLogin?.superiorId;
    // // Override client_id if the user is a client
    // if (IsClientLogin?.isClient) {
    //     clientId = IsClientLogin?.superiorId;
    // }
    // const updatedFilters = {
    //     client_id: clientId,
    //     entity_id: values.entity_id,
    //     station_id: values.station_id,
    // };
    // // Set the filters state with the updated values
    // setFilters(updatedFilters);
    // // Call callFetchFilterData with the updated filters
    // callFetchFilterData(updatedFilters);
    // // Update local storage
    // if (IsClientLogin?.isClient) {
    //     localStorage.setItem('client_id', IsClientLogin?.superiorId);
    // } else (
    //     localStorage.setItem('client_id', values.client_id))
    // localStorage.setItem('entity_id', values.entity_id);
    // localStorage.setItem('station_id', values.station_id);
    // // Close the modal
    // setModalOpen(false);
    // };

    //Revenue Chart
    const revenueChart: any = {

        series: filterData?.line_graph?.series,
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
            series: filterData?.line_graph?.colors,
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: 6,
                        fillColor: '#1B55E2',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: 5,
                        fillColor: '#E7515A',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            labels: filterData?.line_graph?.labels,
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
        if (filterData) {
            navigate('/dashboard/overview');
        }
    };




    const { dates } = fuelStats; // Extract dates from fuelStats
    const [selectedDate, setSelectedDate] = useState(dates[0]); // Initial state
    const [filteredStockAlerts, setFilteredStockAlerts] = useState<{ [key: string]: any[] }>({});


    const handleDateClick = (date: string) => {
        setSelectedDate(date);

        // Filter the stock_alert data based on the selected date
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


    return (
        <>
            {isLoading ? <LoaderImg /> : ''}

            <div>

                <div className='flex justify-between items-center flex-wrap'>
                    <div>
                        <h2 className='font-bold'>
                            Dashboard

                            {filterData?.basic_details?.day_end_date && (
                                <>
                                    ({filterData?.basic_details?.day_end_date})

                                    {filterData?.stock && (
                                        <OverlayTrigger
                                            placement="bottom"
                                            overlay={
                                                <Tooltip className='custom-tooltip' id="tooltip-amount">
                                                    You are able to see data till the last day end {filterData?.basic_details?.day_end_date}
                                                </Tooltip>
                                            }
                                        >
                                            <span><i className="fi fi-tr-comment-info c-head-icon"></i></span>
                                        </OverlayTrigger>
                                    )}
                                </>
                            )}

                            {!filterData?.basic_details?.client_name && `(${UserPermissions?.dates})`}





                        </h2>
                        <ul className="flex space-x-2 rtl:space-x-reverse my-1">
                            {/* <li>
                                <Link to="/dashboard" className="text-primary hover:underline">
                                    Dashboard
                                </Link>
                            </li>
                            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                                <span>Overview</span>
                            </li> */}

                        </ul>
                    </div>


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
                            Apply Filter
                        </button>

                        {filters?.client_id || filters?.entity_id || filters?.station_id ? (
                            <>
                                <button onClick={handleResetFilters}>
                                    <div className="grid place-content-center w-16 h-10 border border-white-dark/20 dark:border-[#191e3a] ">
                                        <Tippy content="Reset Filter">
                                            <span className="btn bg-danger btn-danger">
                                                <i className="fi fi-ts-filter-slash w-6 h-6"></i>
                                            </span>
                                        </Tippy>
                                    </div>
                                </button>
                            </>
                        ) : (
                            ''
                        )}


                    </div>
                </div>


                {/* //Graphs */}

                <div className="pt-5 ">

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 mb-6 text-white">
                        <div className={`panel updownDiv  firstbox ${filterData ? 'cursor-pointer' : ''}`} onClick={handleClickToOverView}>
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Volume
                                </div>
                            </div>
                            <div className="flex items-center ">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> ℓ{filterData?.sales_volume?.sales_volume} </div>

                            </div>

                            <div style={{
                                color: filterData?.sales_volume?.status == 'up'
                                    ? '#37a40a'  // Green for 'up'
                                    : filterData?.sales_volume?.status == 'down'
                                        ? 'red'  // Red for 'down'
                                        : '#000'  // Black for any other case
                            }}
                                className=" badge bg-white flex items-center font-semibold mt-5">
                                {filterData?.sales_volume?.status == 'up'
                                    ? <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i>
                                    : <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i>
                                }{filterData?.sales_volume?.percentage !== undefined ? (
                                    <span>Last Month {filterData.sales_volume.percentage}%</span>
                                ) : (
                                    <span>Last Month  </span>
                                )}</div>
                        </div>

                        {/* Sessions */}
                        <div className={`panel updownDiv secondbox ${filterData ? 'cursor-pointer' : ''}`} onClick={handleClickToOverView}>
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Value </div>
                            </div>
                            <div className="flex items-center">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {currency}{filterData?.sales_value?.sales_value} </div>
                                {/* <div className="badge bg-white/30"> {filterData?.sales_value?.percentage}%</div> */}
                            </div>
                            {/* <div className="flex items-center font-semibold mt-5">
                                {filterData?.sales_value?.status == 'up' ? <i className="fi fi-tr-chart-line-up"></i> : <i className="fi fi-tr-chart-arrow-down"></i>}
                                Last Month  {filterData?.sales_value?.percentage}
                            </div> */}


                            <div style={{
                                color: filterData?.sales_value?.status == 'up'
                                    ? '#37a40a'  // Green for 'up'
                                    : filterData?.sales_value?.status == 'down'
                                        ? 'red'  // Red for 'down'
                                        : '#000'  // Black for any other case
                            }}
                                className=" badge bg-white flex items-center font-semibold mt-5">
                                {filterData?.sales_value?.status == 'up'
                                    ? <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i>
                                    : <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i>
                                }{filterData?.sales_value?.percentage !== undefined ? (
                                    <span>Last Month {filterData?.sales_value?.percentage}%</span>
                                ) : (
                                    <span>Last Month  </span>
                                )}</div>
                        </div>

                        {/*  Time On-Site */}




                        <div className={`panel updownDiv thiredbox ${filterData ? 'cursor-pointer' : ''}`} onClick={handleClickToOverView}>
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Profit</div>
                            </div>
                            <div className="flex items-center">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {currency}{filterData?.profit?.profit} </div>

                            </div>

                            <div style={{
                                color: filterData?.profit?.status == 'up'
                                    ? '#37a40a'  // Green for 'up'
                                    : filterData?.profit?.status == 'down'
                                        ? 'red'  // Red for 'down'
                                        : '#000'  // Black for any other case
                            }}
                                className=" badge bg-white flex items-center font-semibold mt-5">
                                {filterData?.profit?.status == 'up'
                                    ? <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i>
                                    : <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i>
                                }{filterData?.profit?.percentage !== undefined ? (
                                    <span>Last Month {filterData.profit.percentage}%</span>
                                ) : (
                                    <span>Last Month  </span>
                                )}</div>
                        </div>

                        {/* //4TH Box */}

                        <div
                            className={`panel updownDiv secondbox ${filterData ? 'cursor-pointer' : ''}`}

                        >
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Stock Loss</div>
                            </div>

                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3 ">
                                {currency}{filterData?.stock?.value ?? ''}
                                {` (ℓ${filterData?.stock?.volume ?? ''})`}


                                {filterData?.stock ? <OverlayTrigger
                                    placement="bottom"
                                    overlay={<Tooltip className='custom-tooltip' id="tooltip-amount">   {filterData?.stock?.fuel?.map((fuel: any, index: any) => (
                                        <div key={index} className="flex items-center w-100 mb-2"> {/* w-1/2 makes each item take half the width */}
                                            <div className="text-sm ltr:mr-3 rtl:ml-3">
                                                {fuel.name.charAt(0).toUpperCase() + fuel.name.slice(1)} {currency}{fuel.value ?? ''}
                                                {` (ℓ${fuel.volume ?? ''})`}
                                            </div>
                                        </div>
                                    ))}</Tooltip>}
                                >
                                    <span><i className="fi fi-tr-comment-info c-head-icon"></i></span>
                                </OverlayTrigger> : ""}

                            </div>




                            <div style={{
                                color: filterData?.stock?.volume_status == 'up'
                                    ? '#37a40a'  // Green for 'up'
                                    : filterData?.stock?.volume_status == 'down'
                                        ? 'red'  // Red for 'down'
                                        : '#000'  // Black for any other case
                            }}
                                className=" badge bg-white flex items-center font-semibold mt-5">
                                {filterData?.stock?.volume_status == 'up'
                                    ? <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i>
                                    : <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i>
                                }



                                {filterData?.stock?.value_percentage !== undefined ? (
                                    <span>Last Month {filterData.stock.value_percentage}%</span>
                                ) : (
                                    <span>Last Month </span>
                                )}
                            </div>
                        </div>













                    </div>
                    <div className="grid xl:grid-cols-3  md:grid-cols-2 sm:grid-cols-1 gap-2 mb-6">
                        <div className="panel h-full xl:col-span-2 ">
                            <div className="flex items-center justify-between dark:text-white-light mb-5">
                                <h5 className="font-bold text-lg">Total Earnings</h5>
                            </div>

                            <div className="relative">
                                <div className="bg-white dark:bg-black  overflow-hidden">
                                    {!filterData?.line_graph?.series ? (
                                        <div className="flex justify-center items-center h-full p-4">
                                            <img
                                                src={noDataImage} // Use the imported image directly as the source
                                                alt="No data found"
                                                className="w-1/2 max-w-xs" // Adjust the width as needed
                                            />
                                        </div>
                                    ) : (
                                        <ReactApexChart series={filterData?.line_graph?.series} options={revenueChart?.options} type="area" height={325} />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="panel h-full xl:col-span-1 ">
                            <div className="flex items-center justify-between dark:text-white-light mb-5">
                                <h5 className="font-bold text-lg dark:text-white-light">Payments Overview</h5>
                            </div>

                            <div className="relative">
                                <div className="bg-white dark:bg-black  overflow-hidden">
                                    {!filterData?.pi_graph?.labels ? (
                                        <div className="flex justify-center items-center h-full p-4">
                                            <img
                                                src={noDataImage} // Use the imported image directly as the source
                                                alt="No data found"
                                                className="w-full max-w-xs" // Adjust the width as needed
                                            />
                                        </div>
                                    ) : (
                                        // <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} />

                                        <BasicPieChart data={filterData?.pi_graph} />

                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                    {
                        filters?.station_id ? <div className="grid xl:grid-cols-5  md:grid-cols-2 sm:grid-cols-1 gap-2 mb-6">

                            <div className="panel h-full  w-full">

                                <div className="flex items-center justify-between dark:text-white-light mb-5">
                                    <h5 className="font-bold text-lg">Forecasting</h5>

                                </div>
                                <div className="fuel-stats-buttons mt-4  col-span-4 displaycanter  w-full">
                                    <div className="buttons-container  w-full">
                                        {fuelStats?.dates && fuelStats.dates.length > 0 ? (
                                            fuelStats.dates.map((date, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleDateClick(date)}
                                                    className={`date-button  w-full btn mb-2 ${date === selectedDate ? 'btn-info' : 'btn-primary'}`}
                                                    style={{ borderBottom: '1px solid #ddd' }}

                                                >
                                                    {date}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="flex justify-center items-center h-full mt-10 p-4">
                                                <img
                                                    src={noDataImage} // Use the imported image directly as the source
                                                    alt="No data found"
                                                    className="w-full  max-w-xs" // Adjust the width as needed
                                                />
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>


                            <div className="panel h-full xl:col-span-4">
                                <div className="flex items-center justify-between dark:text-white-light mb-5">
                                    <h5 className="font-bold text-lg">Station: {fuelStats?.station_name} ({selectedDate})</h5>

                                </div>
                                <div className='spacebetween'>
                                    {/* <div className='displaycanter'> */}
                                    <div className="flex flex-wrap gap-2 col-span-9">

                                        {fuelStats?.dates && fuelStats.dates.length > 0 ? (
                                            Object.keys(filteredStockAlerts).map(tankName => (
                                                <div key={tankName} className="card border rounded-lg shadow-md mb-6 dark:bg-gray-800 dark:text-white">
                                                    {/* Card Header */}
                                                    <div className="card-header flex items-center justify-between p-4 border-b dark:border-gray-700">
                                                        <h3 className="text-lg font-bold">{tankName}</h3>
                                                    </div>

                                                    {/* Card Body */}
                                                    <div className="card-body p-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            {filteredStockAlerts[tankName]?.map((alert, index) => (
                                                                <div key={index} className="flex items-center gap-4 mb-6">
                                                                    <VerticalProgressBarWithWave
                                                                        percentage={parseFloat(alert?.fuel_left_percentage) || 0} // Convert percentage to number, default to 0 if not a number
                                                                        width={135}
                                                                        height={205}
                                                                        alert={alert}
                                                                        color="#ddd" // Use tank's bg color if desired
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
                                                    src={noDataImage} // Use the imported image directly as the source
                                                    alt="No data found"
                                                    className="w-full  max-w-xs" // Adjust the width as needed
                                                />
                                            </div>
                                        )}



                                    </div>

                                </div>
                            </div>




                        </div> : ""
                    }
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

export default withApiHandler(NewDashboard);