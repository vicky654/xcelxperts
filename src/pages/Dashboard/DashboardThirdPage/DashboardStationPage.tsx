import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactApexChart from 'react-apexcharts';
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


interface FilterValues {
    client_id: string;
    company_id: string;
    site_id: string;
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
                setDetailsData(response.data.data?.sites)
            }
            // setData(response.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
        }
    };


    console.log(detailsData, "detailsData");





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

    // uniqueVisitorSeriesOptions
    const uniqueVisitorSeries: any = {
        series: [
            {
                name: 'Direct',
                type: 'bar',
                data: [58, 44, 55, 57, 56, 61, 58, 63, 60, 66, 56, 63],
            },
            {
                name: 'Organic',
                type: 'bar',
                data: [91, 76, 85, 101, 98, 87, 105, 91, 114, 94, 66, 70],
            },
            {
                name: 'Sales',
                type: 'line',
                data: [28, 40, 36, 52, 38, 60, 38, 52, 36, 40, 30, 50],
            },
        ],
        options: {
            chart: {
                height: 360,
                type: 'line',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false, // Disable data labels
            },
            stroke: {
                width: [0, 0, 2],
                curve: 'smooth',
            },
            colors: ['#5c1ac3', '#ffbb44', '#00ab55'],
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 8,
                    borderRadiusApplication: 'end',
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
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                axisBorder: {
                    show: true,
                    color: isDark ? '#3b3f5c' : '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: isDark ? 'dark' : 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                shared: true, // Share the tooltip for all series
                intersect: false, // Show tooltip when hovering between points
                x: {
                    show: true,
                    format: 'MMM', // Show month in tooltip
                },
                y: {
                    formatter: (val: number) => `${val}`, // Format the value in tooltip
                },
                marker: {
                    show: true,
                },
            },
        },
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
                        <li>
                            <Link to="/" className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-primary hover:underline">
                                Overview
                            </Link>
                        </li>
                        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                            <span>Station</span>
                        </li>
                    </ul>


                </div>

                <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 mt-6" >
                    <div className="grid gap-6 xl:grid-flow-row">
                        {/*  Previous Statement  */}
                        <div className="panel overflow-hidden">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-bold">Previous Statement</div>
                                    <div className="text-success"> Paid on June 27, 2022 </div>
                                </div>
                            </div>
                            <div className="relative mt-10">
                                <div className="absolute -bottom-12 ltr:-right-12 rtl:-left-12 w-24 h-24">
                                    <IconCircleCheck className="text-success opacity-20 w-full h-full" />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div>
                                        <div className="text-primary">Card Limit</div>
                                        <div className="mt-2 font-semibold text-2xl">$50,000.00</div>
                                    </div>
                                    <div>
                                        <div className="text-primary">Spent</div>
                                        <div className="mt-2 font-semibold text-2xl">$15,000.00</div>
                                    </div>
                                    <div>
                                        <div className="text-primary">Minimum</div>
                                        <div className="mt-2 font-semibold text-2xl">$2,500.00</div>
                                    </div>
                                    <div>
                                        <div className="text-primary">Minimum</div>
                                        <div className="mt-2 font-semibold text-2xl">$2,500.00</div>
                                    </div>
                                    <div>
                                        <div className="text-primary">Minimum</div>
                                        <div className="mt-2 font-semibold text-2xl">$2,500.00</div>
                                    </div>
                                    <div>
                                        <div className="text-primary">Minimum</div>
                                        <div className="mt-2 font-semibold text-2xl">$2,500.00</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="panel h-full p-0 lg:col-span-2">
                        <div className="flex items-start justify-between dark:text-white-light mb-5 p-5 border-b  border-white-light dark:border-[#1b2e4b]">
                            <h5 className="font-semibold text-lg ">Unique Visitors</h5>
                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 5]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="hover:text-primary"
                                    button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                                >
                                    <ul>
                                        <li>
                                            <button type="button">View</button>
                                        </li>
                                        <li>
                                            <button type="button">Update</button>
                                        </li>
                                        <li>
                                            <button type="button">Delete</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>

                        <ReactApexChart options={uniqueVisitorSeries.options} series={uniqueVisitorSeries.series} type="bar" height={360} className="overflow-hidden" />
                    </div>

                    {/* Shop Sales */}
                    <div className="panel h-full w-full">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Shop Sales</h5>
                        </div>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">Name</th>
                                        <th>GROSS SALES</th>
                                        <th>NET SALES</th>
                                        <th>PROFIT</th>
                                        <th>TRANSACTION </th>
                                        <th className="ltr:rounded-r-md rtl:rounded-l-md">DETAILS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                        <td className="min-w-[150px] text-black dark:text-white">
                                            <div className="flex items-center">
                                                <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src="/assets/images/profile-6.jpeg" alt="avatar" />
                                                <span className="whitespace-nowrap">Luke Ivory</span>
                                            </div>
                                        </td>
                                        <td className="text-primary">Headphone</td>
                                        <td>
                                            <Link to="/apps/invoice/preview">#46894</Link>
                                        </td>
                                        <td>$56.07</td>
                                        <td>$56.07</td>
                                        <td>
                                            <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Paid</span>
                                        </td>
                                    </tr>
                                    <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                        <td className="text-black dark:text-white">
                                            <div className="flex items-center">
                                                <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src="/assets/images/profile-7.jpeg" alt="avatar" />
                                                <span className="whitespace-nowrap">Andy King</span>
                                            </div>
                                        </td>
                                        <td className="text-info">Nike Sport</td>
                                        <td>
                                            <Link to="/apps/invoice/preview">#76894</Link>
                                        </td>
                                        <td>$126.04</td>
                                        <td>$126.04</td>
                                        <td>
                                            <span className="badge bg-secondary shadow-md dark:group-hover:bg-transparent">Shipped</span>
                                        </td>
                                    </tr>
                                    <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                        <td className="text-black dark:text-white">
                                            <div className="flex items-center">
                                                <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src="/assets/images/profile-8.jpeg" alt="avatar" />
                                                <span className="whitespace-nowrap">Laurie Fox</span>
                                            </div>
                                        </td>
                                        <td className="text-warning">Sunglasses</td>
                                        <td>
                                            <Link to="/apps/invoice/preview">#66894</Link>
                                        </td>
                                        <td>$56.07</td>
                                        <td>$56.07</td>
                                        <td>
                                            <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Paid</span>
                                        </td>
                                    </tr>
                                    <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                        <td className="text-black dark:text-white">
                                            <div className="flex items-center">
                                                <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src="/assets/images/profile-9.jpeg" alt="avatar" />
                                                <span className="whitespace-nowrap">Ryan Collins</span>
                                            </div>
                                        </td>
                                        <td className="text-danger">Sport</td>
                                        <td>
                                            <Link to="/apps/invoice/preview">#75844</Link>
                                        </td>
                                        <td>$110.00</td>
                                        <td>$110.00</td>
                                        <td>
                                            <span className="badge bg-secondary shadow-md dark:group-hover:bg-transparent">Shipped</span>
                                        </td>
                                    </tr>
                                    <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                        <td className="text-black dark:text-white">
                                            <div className="flex items-center">
                                                <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src="/assets/images/profile-10.jpeg" alt="avatar" />
                                                <span className="whitespace-nowrap">Irene Collins</span>
                                            </div>
                                        </td>
                                        <td className="text-secondary">Speakers</td>
                                        <td>
                                            <Link to="/apps/invoice/preview">#46894</Link>
                                        </td>
                                        <td>$56.07</td>
                                        <td>$56.07</td>
                                        <td>
                                            <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Paid</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/*  Recent Transactions  */}
                    <div className="panel">
                        <div className="mb-5 text-lg font-bold">Recent Transactions</div>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">ID</th>
                                        <th>DATE</th>
                                        <th>NAME</th>
                                        <th>AMOUNT</th>
                                        <th className="text-center ltr:rounded-r-md rtl:rounded-l-md">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="font-semibold">#01</td>
                                        <td className="whitespace-nowrap">Oct 08, 2021</td>
                                        <td className="whitespace-nowrap">Eric Page</td>
                                        <td>$1,358.75</td>
                                        <td className="text-center">
                                            <span className="badge bg-success/20 text-success rounded-full hover:top-0">Completed</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">#02</td>
                                        <td className="whitespace-nowrap">Dec 18, 2021</td>
                                        <td className="whitespace-nowrap">Nita Parr</td>
                                        <td>-$1,042.82</td>
                                        <td className="text-center">
                                            <span className="badge bg-info/20 text-info rounded-full hover:top-0">In Process</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">#03</td>
                                        <td className="whitespace-nowrap">Dec 25, 2021</td>
                                        <td className="whitespace-nowrap">Carl Bell</td>
                                        <td>$1,828.16</td>
                                        <td className="text-center">
                                            <span className="badge bg-danger/20 text-danger rounded-full hover:top-0">Pending</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">#04</td>
                                        <td className="whitespace-nowrap">Nov 29, 2021</td>
                                        <td className="whitespace-nowrap">Dan Hart</td>
                                        <td>$1,647.55</td>
                                        <td className="text-center">
                                            <span className="badge bg-success/20 text-success rounded-full hover:top-0">Completed</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">#05</td>
                                        <td className="whitespace-nowrap">Nov 24, 2021</td>
                                        <td className="whitespace-nowrap">Jake Ross</td>
                                        <td>$927.43</td>
                                        <td className="text-center">
                                            <span className="badge bg-success/20 text-success rounded-full hover:top-0">Completed</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">#06</td>
                                        <td className="whitespace-nowrap">Jan 26, 2022</td>
                                        <td className="whitespace-nowrap">Anna Bell</td>
                                        <td>$250.00</td>
                                        <td className="text-center">
                                            <span className="badge bg-info/20 text-info rounded-full hover:top-0">In Process</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
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


                    <div className="grid lg:grid-cols-1 grid-cols-1 gap-6">
                        <div className="panel h-full w-full">
                            <div className="flex items-center justify-between mb-5">
                                <h5 className="font-semibold text-lg dark:text-white-light">Recent Orders</h5>
                            </div>
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th className="ltr:rounded-l-md rtl:rounded-r-md">Stations</th>
                                            <th>Gross Volume</th>
                                            <th>Fuel Sales</th>
                                            <th>Gross Profit</th>
                                            <th>Gross Margin</th>
                                            <th>Shop Sales</th>
                                            <th className="ltr:rounded-r-md rtl:rounded-l-md">Shop Profit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detailsData?.map((item: any) => (
                                            <tr key={item?.id} className={`text-white-dark hover:text-black dark:hover:text-white-light/90 group ${isSitePermissionAvailable ? "cursor-pointer" : ""}`}>
                                                <td className="min-w-[150px] text-black dark:text-white">
                                                    {isSitePermissionAvailable ? (<>
                                                        <div
                                                            onClick={() => handleNavigateToNextPage(item)}
                                                            className="flex items-center">
                                                            <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src={item?.image} alt={item?.name} />
                                                            <span className="whitespace-nowrap">{item?.name}</span>
                                                        </div>
                                                    </>) : (<>
                                                        <div className="flex items-center">
                                                            <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src={item?.image} alt={item?.name} />
                                                            <span className="whitespace-nowrap">{item?.name}</span>
                                                        </div>
                                                    </>)}
                                                </td>
                                                <td className="dashboard-child-tdata">
                                                    <div className="d-flex align-items-center h-100 ">
                                                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                                                            <h6 className="mb-0 fs-14 fw-semibold ">
                                                                ℓ{item.fuel_volume?.gross_volume}
                                                            </h6>

                                                            <p
                                                                className={`me-1 ${item.fuel_volume?.status === "up"
                                                                    ? "text-success"
                                                                    : "text-danger"
                                                                    }`}
                                                                data-tip={`${item?.fuel_volume?.percentage}%`}
                                                            >
                                                                {item?.fuel_volume?.status === "up" ? (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                                        <span className="text-success">
                                                                            {item?.fuel_volume?.percentage}%
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                                        <span className="text-danger">
                                                                            {item?.fuel_volume?.percentage}%
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="dashboard-child-tdata">

                                                    <div className="d-flex">
                                                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                                                            <h6 className="mb-0 fs-14 fw-semibold">
                                                                £{item?.fuel_sales?.gross_value}
                                                            </h6>
                                                            <p
                                                                className={`me-1 ${item?.fuel_sales?.status === "up"
                                                                    ? "text-success"
                                                                    : "text-danger"
                                                                    }`}
                                                                data-tip={`${item?.fuel_sales?.percentage}%`}
                                                            >
                                                                {item?.fuel_sales?.status === "up" ? (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                                        <span className="text-success">
                                                                            {item?.fuel_sales?.percentage}%
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                                        <span className="text-danger">
                                                                            {item?.fuel_sales?.percentage}%
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="dashboard-child-tdata">

                                                    <div className="d-flex">
                                                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                                                            <h6 className="mb-0 fs-14 fw-semibold">
                                                                £{item?.gross_profit?.gross_profit}
                                                            </h6>
                                                            <p
                                                                className={`me-1 ${item?.gross_profit?.status === "up"
                                                                    ? "text-success"
                                                                    : "text-danger"
                                                                    }`}
                                                                data-tip={`${item?.gross_profit?.percentage}%`}
                                                            >
                                                                {item?.gross_profit?.status === "up" ? (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                                        <span className="text-success">
                                                                            {item?.gross_profit?.percentage}%
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                                        <span className="text-danger">
                                                                            {item?.gross_profit?.percentage}%
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="dashboard-child-tdata">

                                                    <div className="d-flex">
                                                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                                                            <h6 className="mb-0 fs-14 fw-semibold">
                                                                {item?.gross_margin?.gross_margin} ppl{""}  {item?.gross_margin?.is_ppl == 1 ? (

                                                                    <Tippy content={`${item?.gross_margin?.ppl_msg}%`} >
                                                                        <button type="button" className=' relative top-3'>
                                                                            <IconInfoCircle fill={true} className="w-4 h-4" />
                                                                        </button>
                                                                    </Tippy>

                                                                ) : (
                                                                    ""
                                                                )}
                                                            </h6>
                                                            <p
                                                                className={`me-1 ${item?.gross_margin?.status === "up"
                                                                    ? "text-success"
                                                                    : "text-danger"
                                                                    }`}
                                                                data-tip={`${item?.gross_margin?.percentage}%`}
                                                            >
                                                                {item?.gross_margin?.status === "up" ? (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                                        <span className="text-success">
                                                                            {item?.gross_margin?.percentage}%
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                                        <span className="text-danger">
                                                                            {item?.gross_margin?.percentage}%
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="dashboard-child-tdata">

                                                    <div className="d-flex">
                                                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                                                            <h6 className="mb-0 fs-14 fw-semibold">
                                                                £
                                                                {/* {item?.shop_sales?.shop_sales} */}

                                                                {item?.shop_sales?.shop_sales ? parseFloat(item?.shop_sales?.shop_sales)?.toLocaleString() : ""}
                                                            </h6>
                                                            <p
                                                                className={`me-1 ${item?.shop_sales?.status === "up"
                                                                    ? "text-success"
                                                                    : "text-danger"
                                                                    }`}
                                                                data-tip={`${item?.shop_sales?.percentage}%`}
                                                            >
                                                                {item?.shop_sales?.status === "up" ? (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                                        <span className="text-success">
                                                                            {item?.shop_sales?.percentage}%
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                                        <span className="text-danger">
                                                                            {item?.shop_sales?.percentage}%
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="dashboard-child-tdata">

                                                    <div className="d-flex">
                                                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                                                            <h6 className="mb-0 fs-14 fw-semibold">
                                                                £
                                                                {item?.shop_profit?.shop_profit ? parseFloat(item?.shop_profit?.shop_profit)?.toLocaleString() : "0.00"}
                                                                {/* {item?.shop_profit?.shop_profit || "0.00"} */}
                                                            </h6>
                                                            <p
                                                                className={`me-1 ${item?.shop_profit?.status === "up"
                                                                    ? "text-success"
                                                                    : "text-danger"
                                                                    }`}
                                                                data-tip={`${item?.shop_profit?.percentage}%`}
                                                            >
                                                                {item?.shop_profit?.status === "up" ? (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                                        <span className="text-success">
                                                                            {item?.shop_profit?.percentage}%
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                                        <span className="text-danger">
                                                                            {item?.shop_profit?.percentage}%
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        </div>


                    </div>
                </div>
            </div >
        </>
    );
};

export default withApiHandler(DashboardStationPage);