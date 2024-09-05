import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import AppContext from '../../utils/Context/DashboardContext';
import { IRootState } from '../../store';
import LoaderImg from '../../utils/Loader';
import Tippy from '@tippyjs/react';
import { capacity, currency } from '../../utils/CommonData';
import ReactApexChart from 'react-apexcharts';
import VerticalProgressBarWithWave from '../../pages/Dashboard/VerticalProgressBarWithWave';
import withApiHandler from '../../utils/withApiHandler';
import noDataImage from '../../assets/AuthImages/noDataFound.png';
import NewDashboardFilterModal from './NewDashboardFilterModal';
import * as Yup from 'yup';
import useErrorHandler from '../../hooks/useHandleError';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import BasicPieChart from '../../pages/Dashboard/BasicPieChart';
import { FormatNumberCommon } from '../CommonFunctions';
import CommonDashCard from './CommonDashCard';
import EarningModal from './EarningModal';
import DashboardHeader from './DashboardHeader';

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

    let storedKeyName = "stationTank";

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

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const reduxData = useSelector((state: IRootState) => state?.data?.data);

    const storedData = localStorage.getItem(storedKeyName);


    useEffect(() => {

        if (storedData) {
            handleApplyFilters(JSON.parse(storedData));
        } else if (localStorage.getItem("superiorRole") === "Client") {
            const storedClientIdData = localStorage.getItem("superiorId");

            if (storedClientIdData) {
                fetchCompanyList(storedClientIdData)

            }
        }

    }, [dispatch, storedKeyName, reduxData]); // Add any other dependencies needed here


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
        setFilterData(null)
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
        callFetchFilterData(values);
        if (values?.station_id) {
            GetFuelStats(values?.station_id)
        }
        setModalOpen(false);
    };

    //Revenue Chart
    const revenueChart: any = {

        series: filterData?.fuel_stock_stats?.series,
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
            series: filterData?.fuel_stock_stats?.colors,
           
            labels: filterData?.fuel_stock_stats?.labels,
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
        if (storedData && UserPermissions?.permissions?.includes('dashboard-details')) {
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
            {isLoading ? <LoaderImg /> : ''}
            <>
                <div className="position-fixed top-50 end-0 translate-middle-y">
                    <button
                        className=" btn btn-primary custom-tooltip-button"
                        color='primary'
                        aria-label='Edit'
                        onClick={OpenEarningModal}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >

                        {currency} {" "}
                        {isHovered && (
                            <span style={{border:"0px "}} className=" ms-2 button-text button-icon" > Total Earnings</span>
                        )}
                    </button>
                </div>
                <EarningModal onClose={CloseEarningModal} getData={getData} isOpen={ShowEarningModal} data={filterData} Date={filterData?.basic_details?.day_end_date} />

                <DashboardHeader
                    filterData={filterData}
                    UserPermissions={UserPermissions}
                    filters={filters}
                    data={data}
                    setModalOpen={setModalOpen}
                    handleResetFilters={handleResetFilters}
                />


                {/* //Graphs */}

                <div className="pt-5 ">

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 mb-6 text-white">

                        <CommonDashCard
                            data={filterData}
                            onClick={handleClickToOverView}
                            title={"Gross Volume"}
                            headingValue={filterData?.sales_volume?.sales_volume}
                            subHeadingData={filterData?.sales_volume}
                            boxNumberClass={"firstbox"}
                        />


                        <CommonDashCard
                            data={filterData}
                            onClick={handleClickToOverView}
                            title={"Gross Value"}
                            headingValue={filterData?.sales_value?.sales_value}
                            subHeadingData={filterData?.sales_volume}
                            boxNumberClass={"secondbox"}
                        />


                        <CommonDashCard
                            data={filterData}
                            onClick={handleClickToOverView}
                            title={"Gross Profit"}
                            headingValue={filterData?.profit?.profit}
                            subHeadingData={filterData?.profit}
                            boxNumberClass={"thirdbox"}
                        />


                        <div
                            className={`panel updownDiv secondbox ${filterData ? 'cursor-pointer' : ''}`}

                        >
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Stock Loss</div>
                            </div>

                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3 ">
                                {currency}
                                {FormatNumberCommon(filterData?.stock?.value ?? '')}


                                {` (ℓ${FormatNumberCommon(filterData?.stock?.volume ?? '')} )`}


                                {filterData?.stock ? <OverlayTrigger
                                    placement="bottom"
                                    overlay={<Tooltip className='custom-tooltip' id="tooltip-amount">   {filterData?.stock?.fuel?.map((fuel: any, index: any) => (
                                        <div key={index} className="flex items-center w-100 mb-2"> {/* w-1/2 makes each item take half the width */}
                                            <div className="text-sm ltr:mr-3 rtl:ml-3">
                                                {fuel.name.charAt(0).toUpperCase() + fuel.name.slice(1)} {currency}
                                                {FormatNumberCommon(fuel.value ?? '')}

                                                {`(ℓ${FormatNumberCommon(fuel.volume ?? '')} )`}
                                            </div>
                                        </div>
                                    ))}</Tooltip>}
                                >
                                    <span><i className="fi fi-sr-comment-info "></i></span>
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
                                <h5 className="font-bold text-lg">Fuel Variances {filterData?.basic_details?.day_end_date ? `(${filterData.basic_details.day_end_date})` : ""}</h5>
                            </div>

                            <div className="relative">
                                <div className="bg-white dark:bg-black  overflow-hidden">
                                    {!filterData?.fuel_stock_stats ? (
                                        <div className="flex justify-center items-center h-full p-4">
                                            <img
                                                src={noDataImage} // Use the imported image directly as the source
                                                alt="No data found"
                                                className="w-1/2 max-w-xs" // Adjust the width as needed
                                            />
                                        </div>
                                    ) : (
                                        <ReactApexChart series={filterData?.fuel_stock_stats?.series} options={revenueChart?.options} type="area" height={325} />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="panel h-full xl:col-span-1 ">
                            <div className="flex items-center justify-between dark:text-white-light mb-5">
                                <h5 className="font-bold text-lg dark:text-white-light"> Accumulated Fuel Variances  {filterData?.basic_details?.day_end_date ? `(${filterData.basic_details.day_end_date})` : ""}
                                </h5>
                            </div>

                            <div className="relative">
                                <div className="bg-white dark:bg-black  overflow-hidden">
                                    {filterData?.fuel_stock?.length > 0 ? (
                                        <table>
                                            <thead>
                                                <tr className='bg-gray-200'>
                                                    <th>Fuel Name</th>
                                                    <th>Variance</th>
                                                    <th>Testing</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filterData?.fuel_stock.map((fuel: any, index: any) => (
                                                    <tr className='hover:bg-gray-100' key={index}>
                                                        <td>{fuel?.fuel_name}</td>
                                                        <td>{capacity} {fuel?.variance}</td>
                                                        <td>{capacity}{fuel?.testing}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <>
                                            <div className="flex justify-center items-center h-full p-4">
                                                <img
                                                    src={noDataImage} // Use the imported image directly as the source
                                                    alt="No data found"
                                                    className="w-full max-w-xs" // Adjust the width as needed
                                                />
                                            </div>
                                            {/* <BasicPieChart data={filterData?.pi_graph} /> */}
                                        </>
                                    )}

                                </div>
                            </div>

                        </div>
                    </div>

                    {
                        filters?.station_id ?

                            <div className="grid xl:grid-cols-7  md:grid-cols-4 sm:grid-cols-1 gap-2 mb-6">

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
                                                        style={{height: '250px', width: '250px'}}
                                                        className="w-full  max-w-xs" // Adjust the width as needed
                                                    />
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>


                                <div className="panel h-full xl:col-span-6 md:col-span-3 sm:grid-cols-1 ">
                                    <div className="flex items-center justify-between dark:text-white-light mb-5">
                                        <h5 className="font-bold text-lg">Station: {fuelStats?.station_name} ({selectedDate})</h5>

                                    </div>
                                    <div className='spacebetween'>
                                        <div className="flex flex-wrap gap-2 col-span-9 justify-center">

                                            {fuelStats?.dates && fuelStats.dates.length > 0 ? (
                                                Object.keys(filteredStockAlerts).map(tankName => (
                                                    <div key={tankName} className="card border rounded-lg shadow-md mb-6 dark:bg-gray-800 dark:text-white">
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
            </ >


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