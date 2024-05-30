import { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactApexChart from 'react-apexcharts';
import { Tab } from '@headlessui/react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '../../../components/Dropdown';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconHorizontalDots from '../../../components/Icon/IconHorizontalDots';
import IconDollarSign from '../../../components/Icon/IconDollarSign';
import IconInbox from '../../../components/Icon/IconInbox';
import IconTag from '../../../components/Icon/IconTag';
import IconCreditCard from '../../../components/Icon/IconCreditCard';
import IconShoppingCart from '../../../components/Icon/IconShoppingCart';
import IconArrowLeft from '../../../components/Icon/IconArrowLeft';
import IconCashBanknotes from '../../../components/Icon/IconCashBanknotes';
import IconUser from '../../../components/Icon/IconUser';
import IconNetflix from '../../../components/Icon/IconNetflix';
import IconBolt from '../../../components/Icon/IconBolt';
import IconCaretDown from '../../../components/Icon/IconCaretDown';
import IconPlus from '../../../components/Icon/IconPlus';
import IconMultipleForwardRight from '../../../components/Icon/IconMultipleForwardRight';
import withApiHandler from '../../../utils/withApiHandler';
import useHandleError from '../../../hooks/useHandleError';
import { fetchStoreData } from '../../../store/dataSlice';
import useApiErrorHandler from '../../../hooks/useHandleError';
import LoaderImg from '../../../utils/Loader';
import IconEye from '../../../components/Icon/IconEye';
import IconRefresh from '../../../components/Icon/IconRefresh';
import { Badge } from 'react-bootstrap';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { IRootState } from '../../../store';
import DashboardFilterModal from '../DashboardFilterModal';
import IconInfoCircle from '../../../components/Icon/IconInfoCircle';
import IconCircleCheck from '../../../components/Icon/IconCircleCheck';
import moment from 'moment';


interface FilterValues {
    client_id: string;
    company_id: string;
    site_id: string;
}

interface lastfueldeliverystats {
    date: string;
    fuel: string;
    value: string;
    id: string;
}

interface DashboardStationPageProps {
    isLoading: boolean; // Define the type of the loading prop
    fetchedData: any; // Define the type of the fetchedData prop
    getData: (url: string, id?: string, params?: any) => Promise<any>;
    detailsData: any[];
    isSitePermissionAvailable: boolean;
    handleNavigateToNextPage: (item: any) => void;
}


const DashboardStationPage: React.FC<DashboardStationPageProps> = ({ isLoading, fetchedData, getData }) => {
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
    const [fuelLastDeliveryData, setFuelLastDeliveryData] = useState<any>([]);
    const [shopSaleData, setShopSaleData] = useState<any>([]);
    const [gradesData, setGradesData] = useState<any>(null);
    const { id } = useParams();




    const callFetchFilterData = async (filters: FilterValues) => {
        try {
            const { client_id, company_id, site_id } = filters;
            const queryParams = new URLSearchParams();

            if (client_id) queryParams.append('client_id', client_id);
            if (company_id) queryParams.append('company_id', company_id);
            if (id) queryParams.append('site_id', id);

            const queryString = queryParams.toString();
            const response = await getData(`dashboard/get-site-details?${queryString}`);
            if (response && response.data && response.data.data) {
                setFuelLastDeliveryData(response.data.data)
            }
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
            if (id) queryParams.append('site_id', id);

            const queryString = queryParams.toString();
            const response = await getData(`dashboard/get-site-stats?${queryString}`);
            if (response && response.data && response.data.data) {
                setDetailsData(response.data.data?.sites)
            }
            // setData(response.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
        }
    };
    const callFetchDetailsDataa = async (filters: FilterValues) => {
        try {
            const { client_id, company_id, site_id } = filters;
            const queryParams = new URLSearchParams();

            if (client_id) queryParams.append('client_id', client_id);
            if (company_id) queryParams.append('company_id', company_id);
            if (id) queryParams.append('site_id', id);

            const queryString = queryParams.toString();
            const response = await getData(`dashboard/get-site-shop-details?${queryString}`);
            if (response && response.data && response.data.data) {
                setShopSaleData(response.data.data?.shop_sales)
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
        }
    };
    const callFetchDetailsDataaa = async (filters: FilterValues) => {
        try {
            const { client_id, company_id, site_id } = filters;
            const queryParams = new URLSearchParams();

            // if (client_id) queryParams.append('client_id', client_id);
            // if (company_id) queryParams.append('company_id', company_id);
            if (id) queryParams.append('site_id', id);

            const queryString = queryParams.toString();
            const response = await getData(`dashboard/get-site-fuel-performance?${queryString}`);
            if (response && response.data && response.data.data) {
                setGradesData(response.data.data)

            }
            // setData(response.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
        }
    };


    console.log(gradesData, "gradesData");





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
            callFetchDetailsDataa(filters);
            callFetchDetailsDataaa(filters);
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


    console.log(filterData, "filterData");




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
                        seriesDashboardStationPage: 0,
                        dataPointDashboardStationPage: 6,
                        fillColor: '#1B55E2',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesDashboardStationPage: 1,
                        dataPointDashboardStationPage: 5,
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
        console.log(item);

        if (isSitePermissionAvailable) {
            navigate(`/dashboard/station/${item?.id}`)
        }
    }

    // '#5c1ac3', '#ffbb44', '#00ab55'
    const dataaa = [
        {
            label: "Fuel Volume (ℓ)",
            data: [
                "9099.34",
                "9822.27",
                "10266.13",
                "8581.31",
                "6871.31",
                "10085.63",
                "10390.68"
            ],
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "#5c1ac3",
            type: "bar",
            yAxisID: "y1"
        },
        {
            label: "Gross Margin (ppl)",
            data: [
                14.89,
                15.31,
                16.61,
                14.99,
                18.3,
                14.63,
                14.73
            ],
            borderColor: "rgba(154, 62, 251, 1)",
            backgroundColor: "#ffbb44",
            type: "line",
            yAxisID: "y"
        },
        {
            label: "Shop Sales (£)",
            data: [
                "2098.76",
                "2162.56",
                "2785.84",
                "2253.1",
                "2384.85",
                "2835.73",
                "2825.12"
            ],
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "#00ab55",
            type: "bar",
            yAxisID: "y1"
        }
    ];


    // uniqueVisitorSeriesOptions
    const uniqueVisitorSeries: any = {
        // series: [
        //     {
        //         name: 'Direct',
        //         type: 'bar',
        //         data: [58, 44, 55, 57, 56, 61, 58, 63, 60, 66, 56, 63],
        //     },
        //     {
        //         name: 'Organic',
        //         type: 'bar',
        //         data: [91, 76, 85, 101, 98, 87, 105, 91, 114, 94, 66, 70],
        //     },
        //     {
        //         name: 'Sales',
        //         type: 'line',
        //         data: [28, 40, 36, 52, 38, 60, 38, 52, 36, 40, 30, 50],
        //     },
        // ],
        // series: fuelLastDeliveryData?.performance_reporting?.datasets?.map((dataset: any) => ({
        series: dataaa?.map((dataset: any) => ({
            name: dataset?.label || 'Direct', // Adjust based on the actual property of your dataset
            type: dataset?.type,
            data: dataset?.data || [58, 44, 55, 57, 56, 61, 58, 63, 60, 66, 56, 63], // Adjust based on the actual property of your dataset
        })),




        options: {
            chart: {
                height: 360,
                type: 'line', // General type as 'line' to enable line features
            },
            stroke: {
                width: [0, 2, 0], // Width of each series: [bar, line, bar]
                curve: 'smooth',
            },
            dataLabels: {
                enabled: false,
            },
            colors: dataaa.map(item => item.borderColor),
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 8,
                },
            },
            xaxis: {
                categories: fuelLastDeliveryData?.performance_reporting?.labels,
            },
            yaxis: [
                {
                    title: {
                        text: 'Fuel Volume (ℓ) & Shop Sales (£)',
                    },
                    opposite: false, // Line chart values on the right side
                },
                {
                    title: {
                        text: 'Gross Margin (ppl)',
                    },
                    opposite: true, // Bar chart values on the left side
                },
            ],
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: function (y: any) {
                        if (typeof y !== "undefined") {
                            return y.toFixed(2);
                        }
                        return y;
                    }
                }
            },
            grid: {
                borderColor: '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },
        },


        // options: {
        //     chart: {
        //         height: 360,
        //         type: 'line',
        //         fontFamily: 'Nunito, sans-serif',
        //         toolbar: {
        //             show: false,
        //         },
        //     },
        //     dataLabels: {
        //         enabled: false, // Disable data labels
        //     },
        //     stroke: {
        //         width: [0, 0, 2],
        //         curve: 'smooth',
        //     },
        //     colors: ['#5c1ac3', '#ffbb44', '#00ab55'],
        //     plotOptions: {
        //         bar: {
        //             horizontal: false,
        //             columnWidth: '55%',
        //             borderRadius: 8,
        //             borderRadiusApplication: 'end',
        //         },
        //     },
        //     legend: {
        //         position: 'bottom',
        //         horizontalAlign: 'center',
        //         fontSize: '14px',
        //         itemMargin: {
        //             horizontal: 8,
        //             vertical: 8,
        //         },
        //     },
        //     grid: {
        //         borderColor: isDark ? '#191e3a' : '#e0e6ed',
        //         padding: {
        //             left: 20,
        //             right: 20,
        //         },
        //         xaxis: {
        //             lines: {
        //                 show: false,
        //             },
        //         },
        //     },
        //     xaxis: {
        //         // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        //         categories: fuelLastDeliveryData?.performance_reporting?.labels,
        //         axisBorder: {
        //             show: true,
        //             color: isDark ? '#3b3f5c' : '#e0e6ed',
        //         },
        //     },
        //     yaxis: {
        //         tickAmount: 6,
        //         opposite: isRtl ? true : false,
        //         labels: {
        //             offsetX: isRtl ? -10 : 0,
        //         },
        //     },
        //     fill: {
        //         type: 'gradient',
        //         gradient: {
        //             shade: isDark ? 'dark' : 'light',
        //             type: 'vertical',
        //             shadeIntensity: 0.3,
        //             inverseColors: false,
        //             opacityFrom: 1,
        //             opacityTo: 0.8,
        //             stops: [0, 100],
        //         },
        //     },
        //     tooltip: {
        //         shared: true, // Share the tooltip for all series
        //         intersect: false, // Show tooltip when hovering between points
        //         x: {
        //             show: true,
        //             format: 'MMM', // Show month in tooltip
        //         },
        //         y: {
        //             formatter: (val: number) => `${val}`, // Format the value in tooltip
        //         },
        //         marker: {
        //             show: true,
        //         },
        //     },
        // },
    };





    return (
        <>
            {isLoading ? <LoaderImg /> : ""}
            <div>
                <div className='flex justify-between items-center'>
                    <ul className="flex space-x-2 rtl:space-x-reverse">
                        <li>
                            <Link to="/" className="text-primary hover:underline">
                                Dashboard
                            </Link>
                        </li>
                        <li className="before:content-['/']  rtl:before:ml-2">
                        </li>
                        <li>
                            <Link to="/dashboard/overview"
                                className=" text-primary hover:underline"
                            >
                                Overview
                            </Link>
                        </li>
                        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                            <span>Station</span>
                        </li>
                    </ul>
                </div>

                <div className="pt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 text-white">
                        <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400" >
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Volume</div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> ℓ{filterData?.gross_volume?.total_volume} </div>
                                <div className="badge bg-white/30">{filterData?.gross_volume?.status === "up" ? "+" : "-"} {filterData?.gross_volume?.percentage}% </div>
                            </div>
                            <div className="flex items-center font-semibold mt-5">
                                <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                Last Month  ℓ{filterData?.gross_volume?.gross_volume}
                            </div>
                        </div>

                        {/* Sessions */}
                        <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Profit </div>

                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> ₹{filterData?.gross_profit?.gross_profit} </div>
                                <div className="badge bg-white/30"> {filterData?.gross_profit?.percentage}%</div>
                            </div>
                            <div className="flex items-center font-semibold mt-5">
                                <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                Gross    Margin  {filterData?.gross_profit?.status === "up" ? "+" : "-"}  {filterData?.gross_profit?.gross_margin}
                            </div>
                        </div>

                        {/*  Time On-Site */}
                        <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Gross Margin</div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">  ℓ{filterData?.gross_margin_?.gross_margin} </div>
                                <div className="badge bg-white/30">{filterData?.gross_margin_?.status === "up" ? "+" : "-"} {filterData?.gross_margin_?.percentage}% </div>
                            </div>
                            <div className="flex items-center font-semibold mt-5">
                                <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                PPL  ℓ{filterData?.gross_margin_?.is_ppl}
                            </div>
                        </div>

                        {/* Bounce Rate */}
                        <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
                            <div className="flex justify-between">
                                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Shop Sales</div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">  ℓ{filterData?.shop_sales?.shop_sales}  </div>
                                <div className="badge bg-white/30">{filterData?.shop_sales?.status === "up" ? "+" : "-"} {filterData?.shop_sales?.percentage}% </div>
                            </div>
                            <div className="flex items-center font-semibold mt-5">
                                <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                                PPL  ℓ{filterData?.shop_sales?.shop_margin}
                            </div>
                        </div>
                    </div>



                </div>

                <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 mt-6" >
                    <div
                        // className="grid gap-6 xl:grid-flow-row"
                        className="panel h-full p-0 lg:col-span-2"
                    >
                        {/*  Previous Statement  */}
                        <div className="panel overflow-hidden">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-bold">Fuel Last Delivery Statement</div>
                                    <div className="text-success">
                                        Delivered on {fuelLastDeliveryData?.last_fuel_delivery_stats?.last_day && moment(fuelLastDeliveryData.last_fuel_delivery_stats.last_day).isValid() && (
                                            moment(fuelLastDeliveryData.last_fuel_delivery_stats.last_day).format("MMMM DD, YYYY")
                                        )}
                                    </div>

                                </div>
                            </div>
                            <div className="relative mt-10">
                                <div className="absolute -bottom-12 ltr:-right-12 rtl:-left-12 w-24 h-24">
                                    <IconCircleCheck className="text-success opacity-20 w-full h-full" />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                                    {fuelLastDeliveryData?.last_fuel_delivery_stats?.data?.map((fuel: lastfueldeliverystats) => (
                                        <>
                                            <div key={fuel?.id}>
                                                <div className="text-primary">{fuel?.fuel}</div>
                                                <div className="mt-2 font-semibold text-2xl">{fuel?.value}</div>
                                            </div>
                                        </>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=" h-full p-0 lg:col-span-2 flex flex-row">
                        <Tab.Group>
                            <div className="flex flex-row w-full gap-6 ">
                                <div className="flex-shrink-0 w-40 bg-gray-100 dark:bg-gray-900 border rounded-lg py-6 ">
                                    <Tab.List className="text-center font-semibold">
                                        {gradesData?.map((fuelData: any, index: number) => (
                                            <Tab as={Fragment} key={index}>
                                                {({ selected }) => (
                                                    <button
                                                        className={`${selected ? 'text-secondary !outline-none before:!h-[80%]' : ''}
                                                before:inline-block relative -mb-[1px] block border-white-light p-3.5 py-4 before:absolute before:bottom-0 before:top-0 before:m-auto before:h-0 before:w-[1px] before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:h-[80%] ltr:border-r ltr:before:-right-[1px] rtl:border-l rtl:before:-left-[1px] dark:border-[#191e3a]`}
                                                        style={{
                                                            width: '100%',
                                                            display: 'flex',
                                                            textAlign: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        {fuelData?.fuel}
                                                    </button>
                                                )}
                                            </Tab>
                                        ))}
                                    </Tab.List>
                                </div>
                                <div className="flex-grow">
                                    <Tab.Panels>
                                        {gradesData?.map((fuelData: any, index: number) => (
                                            <Tab.Panel key={index}>
                                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                                    <div className="rounded-lg border p-6 shadow-md bg-white dark:bg-gray-800">
                                                        <h4 className="mb-4 text-2xl font-semibold">{fuelData?.fuel}</h4>
                                                        <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4 mb-4">
                                                            <div>
                                                                <h6 className="font-semibold">Fuel Volume</h6>
                                                                <p className='text-lg'> {fuelData?.fuel_volume}</p>
                                                            </div>
                                                            <div>
                                                                <h6 className="font-semibold">Fuel Value</h6>
                                                                <p className='text-lg'>{fuelData?.fuel_value}</p>
                                                            </div>
                                                            <div>
                                                                <h6 className="font-semibold">Gross Profit</h6>
                                                                <p className='text-lg'>{fuelData?.gross_profit}</p>
                                                            </div>
                                                            <div>
                                                                <h6 className="font-semibold">Gross Margin</h6>
                                                                <p className='text-lg'> {fuelData?.gross_margin}</p>
                                                            </div>
                                                            <div>
                                                                <h6 className="font-semibold">Total Transactions</h6>
                                                                <p className='text-lg'> {fuelData?.total_transaction}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="rounded-lg border p-6 shadow-md bg-white dark:bg-gray-800 col-span-3 c-grades-height">
                                                        <h4 className="mb-4 text-2xl font-semibold">Card Details</h4>

                                                        <div className='grid  gap-4 mb-4 lg:grid-cols-2 md:grid-cols-1'>
                                                            {fuelData?.cards?.map((card: any, cardIndex: number) => (
                                                                <div key={cardIndex}
                                                                >
                                                                    <div>
                                                                        <div className="flex items-center mb-4">
                                                                            <img
                                                                                className="w-10 h-10 rounded-full object-cover"
                                                                                src={card?.image}
                                                                                alt={card?.name}
                                                                            />
                                                                            <h5 className="ml-4 font-semibold text-lg">{card?.card_name}</h5>
                                                                        </div>


                                                                        <div>
                                                                            <p>Transactions:
                                                                                <span className='ml-2 text-lg'>
                                                                                    {card?.total_transactions}
                                                                                </span>
                                                                            </p>
                                                                            <p>Fuel Sale Value:
                                                                                <span className='ml-2 text-lg'>
                                                                                    {card?.total_fuel_sale_value}
                                                                                </span>
                                                                            </p>
                                                                            <p>Fuel Sale Volume:
                                                                                <span className='ml-2 text-lg'>
                                                                                    {card?.total_fuel_sale_volume}
                                                                                </span>
                                                                            </p>
                                                                        </div>

                                                                        <hr className=' mt-4' />
                                                                    </div>

                                                                </div>
                                                            ))}
                                                        </div>

                                                    </div>
                                                </div>
                                            </Tab.Panel>
                                        ))}
                                    </Tab.Panels>
                                </div>
                            </div>
                        </Tab.Group>
                    </div>


                    <div className="panel h-full p-0 lg:col-span-2">
                        <div className="flex items-start justify-between dark:text-white-light mb-5 p-5 border-b  border-white-light dark:border-[#1b2e4b]">
                            <h5 className="font-semibold text-lg ">Unique Visitors</h5>
                        </div>
                        {fuelLastDeliveryData?.performance_reporting && (<>
                            <ReactApexChart options={uniqueVisitorSeries.options} series={uniqueVisitorSeries.series} type="bar" height={360} className="overflow-hidden" />
                        </>)}
                    </div>


                    {/*  Shop Sales  */}
                    <div className="panel h-full lg:col-span-2 cshop-sale-height">
                        <div className="mb-5 text-lg font-bold">
                            <div className="flex items-center justify-between mb-5">

                                <h5 className="font-semibold text-lg dark:text-white-light">Shop Sales</h5>
                            </div>

                        </div>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">Name</th>
                                        <th >Gross Sales</th>
                                        <th >Net Sales</th>
                                        <th className="text-center">Total Transaction</th>
                                        <th className="text-center ltr:rounded-r-md rtl:rounded-l-md">Profit</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {shopSaleData?.map((shop: any) => (
                                        <tr key={shop.id}>
                                            <td className="whitespace-nowrap">{shop?.name}</td>
                                            <td className="whitespace-nowrap">{shop?.gross_sales}</td>
                                            <td className="whitespace-nowrap">{shop?.nett_sales}</td>
                                            <td className="text-center">{shop?.total_transactions}</td>
                                            <td className="text-center">
                                                <span className="badge bg-success/20 text-success rounded-full hover:top-0">{shop?.profit}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>


            </div >
        </>
    );
};

export default withApiHandler(DashboardStationPage);