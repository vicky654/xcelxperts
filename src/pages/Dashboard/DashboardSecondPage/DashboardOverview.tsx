import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import withApiHandler from '../../../utils/withApiHandler';
import useHandleError from '../../../hooks/useHandleError';
import { fetchStoreData } from '../../../store/dataSlice';
import useApiErrorHandler from '../../../hooks/useHandleError';
import LoaderImg from '../../../utils/Loader';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { IRootState } from '../../../store';
import DashboardFilterModal from '../DashboardFilterModal';
import IconInfoCircle from '../../../components/Icon/IconInfoCircle';
import noDataImage from '../../../assets/AuthImages/noDataFound.png'; // Import the image
import IconTrendingUp from '../../../components/Icon/IconTrendingUp';



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

interface detailsData {
    // Define the structure of fetchedData here
    // For example:
    name: string;
    value: number;
}


const DashboardOverview: React.FC<DashboardOverviewProps> = ({ isLoading, fetchedData, getData }) => {
    const handleError = useHandleError();
    const navigate = useNavigate();
    const handleApiError = useApiErrorHandler(); // Use the hook here
    const [filters, setFilters] = useState({
        client_id: localStorage.getItem('client_id') || '',
        company_id: localStorage.getItem('company_id') || '',
        site_id: localStorage.getItem('site_id') || ''
    });
    const [filterData, setFilterData] = useState<any>(null);
    const [detailsData, setDetailsData] = useState<any>([]);
    const [search, setSearch] = useState<string>('');

    const callFetchFilterData = async (filters: FilterValues) => {
        try {
            const { client_id, company_id, site_id } = filters;
            const queryParams = new URLSearchParams();

            if (client_id) queryParams.append('client_id', client_id);
            if (company_id) queryParams.append('company_id', company_id);
            if (site_id) queryParams.append('site_id', site_id);

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
            if (company_id) queryParams.append('company_id', company_id);
            if (site_id) queryParams.append('site_id', site_id);

            const queryString = queryParams.toString();
            const response = await getData(`dashboard/get-details?${queryString}`);
            if (response && response.data && response.data.data) {
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

    const [loading] = useState(false);


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




    //Revenue Chart
    const revenueChart: any = {
        series: [
            {
                name: 'Fuel Volume',
                data: [12000, 13000, 12500, 14000, 13500, 14500, 15000, 15500, 16000, 16500, 17000, 17500], // Dummy data
            },
            {
                name: 'Gross Margin',
                data: [8000, 8500, 8200, 8700, 8300, 8900, 9000, 9200, 9500, 9800, 10000, 10200], // Dummy data
            },
            {
                name: 'Shop Sale',
                data: [5000, 5500, 5200, 5700, 5300, 5900, 6000, 6200, 6500, 6800, 7000, 7200], // Dummy data
            },
        ],
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
            colors: isDark ? ['#2196F3', '#E7515A', '#FF9800'] : ['#1B55E2', '#E7515A', '#FF9800'],
            markers: {
                discrete: [
                    {
                        seriesDashboardOverview: 0,
                        dataPointDashboardOverview: 6,
                        fillColor: '#1B55E2',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesDashboardOverview: 1,
                        dataPointDashboardOverview: 5,
                        fillColor: '#E7515A',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
        series: [985, 737, 270],
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
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
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
            labels: ['Apparel', 'Sports', 'Others'],
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

    //Daily Sales
    const dailySales: any = {
        series: [
            {
                name: 'Sales',
                data: [44, 55, 41, 67, 22, 43, 21],
            },
            {
                name: 'Last Week',
                data: [13, 23, 20, 8, 13, 27, 33],
            },
        ],
        options: {
            chart: {
                height: 160,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
                stacked: true,
                stackType: '100%',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            colors: ['#e2a03f', '#e0e6ed'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0,
                        },
                    },
                },
            ],
            xaxis: {
                labels: {
                    show: false,
                },
                categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
            },
            yaxis: {
                show: false,
            },
            fill: {
                opacity: 1,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '25%',
                },
            },
            legend: {
                show: false,
            },
            grid: {
                show: false,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 10,
                    right: -20,
                    bottom: -20,
                    left: -20,
                },
            },
        },
    };

    //Total Orders
    const totalOrders: any = {
        series: [
            {
                name: 'Sales',
                data: [28, 40, 36, 52, 38, 60, 38, 52, 36, 40],
            },
        ],
        options: {
            chart: {
                height: 290,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: isDark ? ['#00ab55'] : ['#00ab55'],
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            yaxis: {
                min: 0,
                show: false,
            },
            grid: {
                padding: {
                    top: 125,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            fill: {
                opacity: 1,
                type: 'gradient',
                gradient: {
                    type: 'vertical',
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: 0.3,
                    opacityTo: 0.05,
                    stops: [100, 100],
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
            },
        },
    };


    const handleNavigateToNextPage = (item: any) => {
        if (!isSitePermissionAvailable) {
            navigate(`/dashboard/station/${item?.id}`)
        }
    }



    return (
        <>
            {isLoading ? <LoaderImg /> : ""}
            <div>
                <div className='flex justify-between items-center flex-wrap'>
                    <ul className="flex space-x-2 rtl:space-x-reverse my-2">
                        <li>
                            <Link to="/" className="text-primary hover:underline">
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
                                            <span className="font-semibold">Client </span> {filters.client_id}
                                        </div>
                                    )}

                                    {filters?.company_id && (
                                        <div className="badge bg-green-600 flex items-center gap-2 px-2 py-1 ">
                                            <span className="font-semibold">Entity </span> {filters.company_id}
                                        </div>
                                    )}

                                    {filters?.site_id && (
                                        <div className="badge bg-red-600 flex items-center gap-2 px-2 py-1 ">
                                            <span className="font-semibold">Station </span> {filters.site_id}
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 text-white">
                        <div className={`panel  firstbox ${filterData ? 'cursor-pointer' : ''}`} >
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Volume</div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> ℓ{filterData?.gross_volume?.total_volume} </div>
                                <div className="badge bg-white/30">
                                    {filterData?.gross_volume?.status === 'up' ? '+' : '-'} {filterData?.gross_volume?.percentage}%{' '}
                                </div>
                            </div>
                            <div className="flex items-center font-semibold mt-5">
                                <IconTrendingUp className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                Last Month ℓ{filterData?.gross_volume?.gross_volume}
                            </div>
                        </div>

                        {/* Sessions */}
                        <div className={`panel secondbox ${filterData ? 'cursor-pointer' : ''}`} >
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Profit </div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> ₹{filterData?.gross_profit?.gross_profit} </div>
                                <div className="badge bg-white/30"> {filterData?.gross_profit?.percentage}%</div>
                            </div>
                            <div className="flex items-center font-semibold mt-5">
                                <IconTrendingUp className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                Gross Margin {filterData?.gross_profit?.status === 'up' ? '+' : '-'} {filterData?.gross_profit?.gross_margin}
                            </div>
                        </div>

                        {/*  Time On-Site */}
                        <div className={`panel thiredbox ${filterData ? 'cursor-pointer' : ''}`} >
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Margin</div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> ℓ{filterData?.gross_margin_?.gross_margin} </div>
                                <div className="badge bg-white/30">
                                    {filterData?.gross_margin_?.status === 'up' ? '+' : '-'} {filterData?.gross_margin_?.percentage}%{' '}
                                </div>
                            </div>
                            <div className="flex items-center font-semibold mt-5">
                                <IconTrendingUp className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                PPL ℓ{filterData?.gross_margin_?.is_ppl}
                            </div>
                        </div>

                        {/* Bounce Rate */}
                        <div className={`panel forthbox ${filterData ? 'cursor-pointer' : ''}`} >
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Shop Sales</div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> ℓ{filterData?.shop_sales?.shop_sales} </div>
                                <div className="badge bg-white/30">
                                    {filterData?.shop_sales?.status === 'up' ? '+' : '-'} {filterData?.shop_sales?.percentage}%{' '}
                                </div>
                            </div>
                            <div className="flex items-center font-semibold mt-5">
                                <IconTrendingUp className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                PPL ℓ{filterData?.shop_sales?.shop_margin}
                            </div>
                        </div>
                    </div>


                    {detailsData?.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {detailsData?.map((item: any) => (
                                    <div
                                        key={item?.id}
                                        className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-black dark:text-white group ${isSitePermissionAvailable ? "cursor-pointer" : ""
                                            }`}
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

                                        <div className="grid grid-cols-2 gap-4 my-3">
                                            <div>
                                                <h6 className="font-semibold">Gross Volume</h6>
                                                <p className="text-lg">
                                                    ℓ{item.fuel_volume?.gross_volume}
                                                    <span
                                                        className={`ml-2 ${item.fuel_volume?.status === "up" ? "text-green-500" : "text-red-500"
                                                            }`}
                                                    >
                                                        {item?.fuel_volume?.status === "up" ? (
                                                            <>
                                                                <i className="fa fa-chevron-circle-up"></i> {item?.fuel_volume?.percentage}%
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fa fa-chevron-circle-down"></i> {item?.fuel_volume?.percentage}%
                                                            </>
                                                        )}
                                                    </span>
                                                </p>
                                            </div>

                                            <div>
                                                <h6 className="font-semibold">Fuel Sales</h6>
                                                <p className="text-lg">
                                                    ₹{item?.fuel_sales?.gross_value}
                                                    <span
                                                        className={`ml-2 ${item?.fuel_sales?.status === "up" ? "text-green-500" : "text-red-500"
                                                            }`}
                                                    >
                                                        {item?.fuel_sales?.status === "up" ? (
                                                            <>
                                                                <i className="fa fa-chevron-circle-up"></i> {item?.fuel_sales?.percentage}%
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fa fa-chevron-circle-down"></i> {item?.fuel_sales?.percentage}%
                                                            </>
                                                        )}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <hr />

                                        <div className="grid grid-cols-2 gap-4 my-3">
                                            <div>
                                                <h6 className="font-semibold">Gross Profit</h6>
                                                <p className="text-lg">
                                                    ₹{item?.gross_profit?.gross_profit}
                                                    <span
                                                        className={`ml-2 ${item?.gross_profit?.status === "up" ? "text-green-500" : "text-red-500"
                                                            }`}
                                                    >
                                                        {item?.gross_profit?.status === "up" ? (
                                                            <>
                                                                <i className="fa fa-chevron-circle-up"></i> {item?.gross_profit?.percentage}%
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fa fa-chevron-circle-down"></i> {item?.gross_profit?.percentage}%
                                                            </>
                                                        )}
                                                    </span>
                                                </p>
                                            </div>

                                            <div>
                                                <h6 className="font-semibold">Gross Margin</h6>
                                                <p className="text-lg">
                                                    {item?.gross_margin?.gross_margin} ppl
                                                    {item?.gross_margin?.is_ppl == 1 && (
                                                        <Tippy content={`${item?.gross_margin?.ppl_msg}%`}>
                                                            <button type="button" className="ml-2">
                                                                <IconInfoCircle fill={true} className="w-4 h-4" />
                                                            </button>
                                                        </Tippy>
                                                    )}
                                                    <span
                                                        className={`ml-2 ${item?.gross_margin?.status === "up" ? "text-green-500" : "text-red-500"
                                                            }`}
                                                    >
                                                        {item?.gross_margin?.status === "up" ? (
                                                            <>
                                                                <i className="fa fa-chevron-circle-up"></i> {item?.gross_margin?.percentage}%
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fa fa-chevron-circle-down"></i> {item?.gross_margin?.percentage}%
                                                            </>
                                                        )}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <hr />

                                        <div className="grid grid-cols-2 gap-4 my-3">
                                            <div>
                                                <h6 className="font-semibold">Shop Sales</h6>
                                                <p className="text-lg">
                                                    ₹{item?.shop_sales?.shop_sales ? parseFloat(item?.shop_sales?.shop_sales)?.toLocaleString() : ""}
                                                    <span
                                                        className={`ml-2 ${item?.shop_sales?.status === "up" ? "text-green-500" : "text-red-500"
                                                            }`}
                                                    >
                                                        {item?.shop_sales?.status === "up" ? (
                                                            <>
                                                                <i className="fa fa-chevron-circle-up"></i> {item?.shop_sales?.percentage}%
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fa fa-chevron-circle-down"></i> {item?.shop_sales?.percentage}%
                                                            </>
                                                        )}
                                                    </span>
                                                </p>
                                            </div>

                                            <div>
                                                <h6 className="font-semibold">Shop Profit</h6>
                                                <p className="text-lg">
                                                    ₹{item?.shop_profit?.shop_profit ? parseFloat(item?.shop_profit?.shop_profit)?.toLocaleString() : "0.00"}
                                                    <span
                                                        className={`ml-2 ${item?.shop_profit?.status === "up" ? "text-green-500" : "text-red-500"
                                                            }`}
                                                    >
                                                        {item?.shop_profit?.status === "up" ? (
                                                            <>
                                                                <i className="fa fa-chevron-circle-up"></i> {item?.shop_profit?.percentage}%
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fa fa-chevron-circle-down"></i> {item?.shop_profit?.percentage}%
                                                            </>
                                                        )}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
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
