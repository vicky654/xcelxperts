import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import ReactApexChart from 'react-apexcharts';
import { setPageTitle } from '../store/themeConfigSlice';
import withApiHandler from '../utils/withApiHandler';
import DashboardFilterModal from './Dashboard/DashboardFilterModal';
import LoaderImg from '../utils/Loader';
import IconRefresh from '../components/Icon/IconRefresh';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import showMessage from '../hooks/showMessage';
import VerticalProgressBarWithWave from './Dashboard/VerticalProgressBarWithWave';

import noDataImage from '../../src/assets/AuthImages/noDataFound.png';
import { currency } from '../utils/CommonData';
interface FilterValues {
    client_id: string;
    company_id: string;
    site_id: string;
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


const Index: React.FC<IndexProps> = ({ isLoading, fetchedData, getData }) => {
    useEffect(() => {
        dispatch(setPageTitle('Sales Admin'));
    });
    const navigate = useNavigate();
    const [fuelStats, setFuelStats] = useState<FuelStatsData>({
        dates: [],
        stock_alert: {},
        station_name: '',
        station_image: '',
        last_dayend: ''
    });
    const [filters, setFilters] = useState({
        client_id: localStorage.getItem('client_id') || '',
        company_id: localStorage.getItem('company_id') || '',
        site_id: localStorage.getItem('site_id') || '',
    });
    const [filterData, setFilterData] = useState<any>(null);

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
                setFilterData(response.data.data);
            }
            // setData(response.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
        }
    };


    const GetFuelStats = async (item: any) => {
        try {
            // dashboard/station-stock?station_id=Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09

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

                console.log(response.data, "columnIndex");
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
        }
    };
    const { data, error } = useSelector((state: IRootState) => state?.data);
    const [modalOpen, setModalOpen] = useState(false);


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Sales Admin'));
    });

    useEffect(() => {
        const clientId = localStorage.getItem('client_id');
        const companyId = localStorage.getItem('company_id');

        if (data?.applyFilter === false && !clientId && !companyId) {
            const initialFilters = {
                client_id: data?.superiorId || '',
                company_id: data?.company_id || filters.company_id || '',
                site_id: filters.site_id || '',
            };
            setFilters(initialFilters);
            callFetchFilterData(initialFilters);
        }
    }, [data?.applyFilter, data?.superiorId]);

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [loading] = useState(false);

    useEffect(() => {
        // Check if client_id and company_id are present in local storage
        const clientId = localStorage.getItem('client_id');
        const companyId = localStorage.getItem('company_id');

        if (clientId && companyId) {
            // Fetch data only if both client_id and company_id are present
            callFetchFilterData(filters);
        }
        if (clientId && companyId && filters?.site_id) {
            // Fetch data only if both client_id and company_id are present
            GetFuelStats(filters?.site_id);
        }
    }, [filters]);

    const handleResetFilters = () => {
        // Clear filters state
        setFilters({
            client_id: '',
            company_id: '',
            site_id: '',
        });
        setFilterData(null);
        // Remove items from local storage
        localStorage.removeItem('client_id');
        localStorage.removeItem('company_id');
        localStorage.removeItem('site_id');
        localStorage.removeItem('testing');
        // Dispatch action to set applyFilter to false
    };

    const handleApplyFilters = (values: FilterValues) => {
        const updatedFilters = {
            client_id: values.client_id,
            company_id: values.company_id,
            site_id: values.site_id,
        };
        // Set the filters state with the updated values
        setFilters(updatedFilters);
        // Call callFetchFilterData with the updated filters
        callFetchFilterData(updatedFilters);
        // Update local storage
        localStorage.setItem('client_id', values.client_id);
        localStorage.setItem('company_id', values.company_id);
        localStorage.setItem('site_id', values.site_id);
        // Close the modal
        setModalOpen(false);
    };

    //Revenue Chart
    const revenueChart: any = {
        // series: [
        //     {
        //         name: 'Fuel Volume',
        //         data: [12000, 13000, 12500, 14000, 13500, 14500, 15000, 15500, 16000, 16500, 17000, 17500], // Dummy data
        //     },
        //     {
        //         name: 'Gross Margin',
        //         data: [8000, 8500, 8200, 8700, 8300, 8900, 9000, 9200, 9500, 9800, 10000, 10200], // Dummy data
        //     },
        //     {
        //         name: 'Shop Sale',
        //         data: [5000, 5500, 5200, 5700, 5300, 5900, 6000, 6200, 6500, 6800, 7000, 7200], // Dummy data
        //     },
        // ],
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
                    formatter: (value: number) => {
                        return value / 1000 + 'K';
                    },
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

    //Sales By Category
    const salesByCategory: any = {
        // series: [985, 737, 270],
        series: filterData?.pi_graph?.series,
        options: {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            // colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
            colors: filterData?.pi_graph?.colors,
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                },
                            },
                        },
                    },
                },
            },
            // labels: ['Volume', 'Gross Margin', 'Others'],
            labels: filterData?.pi_graph?.labels,
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        },
    };



    const handleClickToOverView = () => {
        if (filterData) {
            navigate('/dashboard/overview');
        }
    };

    // const Badgeee = ({ label, value, color, Icon }) => (
    //     <div className={`badge ${color} flex items-center gap-2 px-2 py-1 rounded shadow hover:shadow-md transition-shadow duration-200`} data-tip={label}>
    //         {/* <Icon className="text-lg" /> */}
    //         {/* <IconUser /> */}
    //         <span className="font-semibold">{label}:</span> {value}

    //     </div>
    // );
    const handleSuccessClick = () => {
        showMessage('Operation was successful!', 'success');
    };

    const handleErrorClick = () => {
        showMessage('Error: Something went wrong.', 'error');
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

        console.log('Filtered stock alerts:', filteredStockAlerts);
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
 


    return (
        <>
            {isLoading ? <LoaderImg /> : ''}
            <div>
                {/* <button onClick={handleSuccessClick}>Show Success Alert</button>
      <button onClick={handleErrorClick}>Show Error Alert</button> */}
            </div>
            <div>
                <div className="flex justify-between items-center">
                    <ul className="flex space-x-2 rtl:space-x-reverse">
                        <li>

                        </li>
                    </ul>

                    <div className=" flex gap-4 flex-wrap">
                        {/* {filters?.client_id || filters?.company_id || filters?.site_id ? (
                            <div className="badges-container flex flex-wrap items-center gap-2 px-4 py-1 bg-info rounded-lg text-white shadow-md">
                                {filters?.client_id && (
                                    <Badgeee label="Client Name" value={filters?.client_id} color="bg-blue-600"
                                    // Icon={<i className="fa fa-user" aria-hidden="true"></i>}
                                    />
                                )}
                                {filters?.company_id && (
                                    <Badgeee label="Entity Name" value={filters.company_id} color="bg-green-600" Icon={<i className="fa fa-building" aria-hidden="true"></i>} />
                                )}
                                {filters?.site_id && (
                                    <Badgeee label="Station Name" value={filters.site_id} color="bg-red-600" Icon={<i className="fas fa-map-marker-alt    "></i>} />
                                )}
                            </div>
                        ) : null} */}

                        {filters?.client_id || filters?.company_id || filters?.site_id ? (
                            <>
                                <div className="badges-container flex flex-wrap items-center gap-2 px-4   text-white" style={{ background: "#ddd" }}>
                                    {filters?.client_id && (
                                        <div className="badge bg-blue-600 flex items-center gap-2 px-2 py-1 ">
                                            <span className="font-semibold">Client :</span> {filterData?.basic_details?.client_name}
                                        </div>
                                    )}

                                    {filters?.company_id && (
                                        <div className="badge bg-green-600 flex items-center gap-2 px-2 py-1 ">
                                            <span className="font-semibold">Entity : </span> {filterData?.basic_details?.entity_name}
                                        </div>
                                    )}

                                    {filters?.site_id && (
                                        <div className="badge bg-red-600 flex items-center gap-2 px-2 py-1 ">
                                            <span className="font-semibold">Station :</span> {filterData?.basic_details?.station_name}
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

                        {filters?.client_id || filters?.company_id || filters?.site_id ? (
                            <>
                                <button onClick={handleResetFilters}>
                                    <div className="grid place-content-center w-16 h-10 border border-white-dark/20 dark:border-[#191e3a] ">
                                        <Tippy content="Reset Filter">
                                            <span className="btn bg-danger btn-danger">
                                                <IconRefresh className="w-6 h-6" />
                                            </span>
                                        </Tippy>
                                    </div>
                                </button>
                            </>
                        ) : (
                            ''
                        )}

                        {modalOpen && (
                            <>
                                <DashboardFilterModal
                                    isOpen={modalOpen}
                                    onClose={() => setModalOpen(false)}
                                    onApplyFilters={handleApplyFilters} // Pass the handler to the modal
                                />
                            </>
                        )}
                    </div>
                </div>


           
                <div className="pt-5 ">

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6 text-white">
                        <div className={`panel  firstbox ${filterData ? 'cursor-pointer' : ''}`} onClick={handleClickToOverView}>
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Volume
                                </div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> ℓ{filterData?.sales_volume?.sales_volume} </div>
                                <div className="badge bg-white/30">
                                    {filterData?.gross_volume?.status === 'up' ? '+' : ''} {filterData?.sales_volume?.percentage}%{' '}
                                </div>
                            </div>
                            <div className="flex items-center font-semibold mt-5">
                                {filterData?.gross_volume?.status === 'up' ? <i className="fi fi-tr-chart-line-up"></i> : <i className="fi fi-tr-chart-arrow-down"></i>}
                                Last Month {filterData?.sales_volume?.percentage}
                            </div>
                        </div>

                        {/* Sessions */}
                        <div className={`panel secondbox ${filterData ? 'cursor-pointer' : ''}`} onClick={handleClickToOverView}>
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Value </div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> ₹{filterData?.sales_value?.sales_value} </div>
                                <div className="badge bg-white/30"> {filterData?.sales_value?.percentage}%</div>
                            </div>
                            <div className="flex items-center font-semibold mt-5">
                                {filterData?.sales_value?.status === 'up' ? <i className="fi fi-tr-chart-line-up"></i> : <i className="fi fi-tr-chart-arrow-down"></i>}
                                Last Month {filterData?.sales_value?.status === 'up' ? '+' : ''} {filterData?.sales_value?.percentage}
                            </div>
                        </div>

                        {/*  Time On-Site */}
                        <div className={`panel thiredbox ${filterData ? 'cursor-pointer' : ''}`} onClick={handleClickToOverView}>
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Profit</div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {currency}{filterData?.profit?.profit} </div>
                                <div className="badge bg-white/30"> {filterData?.profit?.percentage}%</div>
                            </div>
                            <div className="flex items-center font-semibold mt-5">
                                {filterData?.profit?.status === 'up' ? <i className="fi fi-tr-chart-line-up"></i> : <i className="fi fi-tr-chart-arrow-down"></i>}
                               
                               
                                Last Month{filterData?.profit?.percentage}
                            </div>
                        </div>

                        {/* Bounce Rate */}
                        {/* <div className={`panel  forthbox ${filterData ? 'cursor-pointer' : ''}`} onClick={handleClickToOverView}>
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Shop Sales</div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> ℓ{filterData?.shop_sales?.shop_sales} </div>
                                <div className="badge bg-white/30">
                                    {filterData?.shop_sales?.status === 'up' ? '+' : ''} {filterData?.shop_sales?.percentage}%{' '}
                                </div>
                            </div>
                            <div className="flex items-center font-semibold mt-5">
                                <IconTrendingUp className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                PPL ℓ{filterData?.shop_sales?.shop_margin}
                            </div>
                        </div> */}
                    </div>
                    <div className="grid xl:grid-cols-3  md:grid-cols-2 sm:grid-cols-1 gap-6 mb-6">
                        <div className="panel h-full xl:col-span-2 ">
                            <div className="flex items-center justify-between dark:text-white-light mb-5">
                                <h5 className="font-semibold text-lg">Revenue</h5>
                                {/* <div className="dropdown">
                                    <Dropdown
                                        offset={[0, 1]}
                                        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                        button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                                    >
                                        <ul>
                                            <li>
                                                <button type="button">Weekly</button>
                                            </li>
                                            <li>
                                                <button type="button">Monthly</button>
                                            </li>
                                            <li>
                                                <button type="button">Yearly</button>
                                            </li>
                                        </ul>
                                    </Dropdown>
                                </div> */}
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

                        <div className="panel h-full">
                            <div className="flex items-center mb-5">
                                <h5 className="font-semibold text-lg dark:text-white-light">Sales By Category</h5>
                            </div>
                            <div>
                                <div className="bg-white dark:bg-black  overflow-hidden">
                                    {!filterData?.pi_graph?.labels ? (
                                       <div className="flex justify-center items-center h-full p-4">
                                       <img
                                           src={noDataImage} // Use the imported image directly as the source
                                           alt="No data found"
                                           className="w-1/2 max-w-xs" // Adjust the width as needed
                                       />
                                   </div>
                                    ) : (
                                        <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        filters?.site_id ? <div className="grid grid-cols-12 gap-6 mb-6">
                            <div className="col-span-2 w-full">
                                <div className="panel h-full  w-full">
                                    <div className="flex items-center justify-between dark:text-white-light mb-5  w-full">
                                        <h5 className="font-semibold text-lg">Forecasting  </h5>

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
                                                <div className="flex justify-center items-center h-full p-4">
                                                    <img
                                                        src={noDataImage} // Use the imported image directly as the source
                                                        alt="No data found"
                                                        className="w-1/2 max-w-xs" // Adjust the width as needed
                                                    />
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-10">
                                <div className="panel h-full">
                                    <div className="flex items-center justify-between dark:text-white-light mb-5">
                                        <h5 className="font-semibold text-lg">Station: {fuelStats?.station_name} ({selectedDate})</h5>
                                        {/* <div className="selected-date">
                                            <p>Selected Date: {selectedDate}</p>
                                        </div> */}
                                    </div>
                                    <div className='spacebetween'>
                                        {/* <div className='displaycanter'> */}
                                        <div className="flex flex-wrap gap-6 col-span-8">

                                            {fuelStats?.dates && fuelStats.dates.length > 0 ? (
                                                Object.keys(filteredStockAlerts).map(tankName => (
                                                    <div key={tankName} className="card border rounded-lg shadow-md mb-6 dark:bg-gray-800 dark:text-white">
                                                        {/* Card Header */}
                                                        <div className="card-header flex items-center justify-between p-4 border-b dark:border-gray-700">
                                                            <h3 className="text-lg font-bold">{tankName}</h3>
                                                        </div>

                                                        {/* Card Body */}
                                                        <div className="card-body p-4">
                                                            <div className="flex flex-wrap gap-6">
                                                                {filteredStockAlerts[tankName]?.map((alert, index) => (
                                                                    <div key={index} className="flex items-center gap-4 mb-6">
                                                                        <VerticalProgressBarWithWave
                                                                            percentage={parseFloat(alert?.fuel_left_percentage) || 0} // Convert percentage to number, default to 0 if not a number
                                                                            width={200}
                                                                            height={350}
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
                                                        className="w-1/2 max-w-xs" // Adjust the width as needed
                                                    />
                                                </div>
                                            )}



                                        </div>

                                    </div>
                                </div>
                            </div>



                        </div> : ""
                    }




                    {/* <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "50px" }}>

                        <VerticalProgressBarWithWave
                            percentage={75}
                            width={60}
                            height={350}
                            color="#ddd"
                        />
                        <VerticalProgressBarWithWave
                            percentage={50}
                            width={60}
                            height={350}
                            color="#ddd "
                        />
                        <VerticalProgressBarWithWave
                            percentage={90}
                            width={60}
                            height={350}
                            color="#ddd"
                        />
                    </div> */}
                </div>
            </div >
        </>
    );
};

export default withApiHandler(Index);
