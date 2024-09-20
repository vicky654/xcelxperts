import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'tippy.js/dist/tippy.css';
import useErrorHandler from '../../hooks/useHandleError';
import LoaderImg from '../../utils/Loader';
import withApiHandler from '../../utils/withApiHandler';
import CustomInput from './CustomInput';
import * as Yup from 'yup';
import noDataImage from '../../assets/AuthImages/noDataFound.png';
import { capacity, currency } from '../../utils/CommonData';
import CollapsibleItem from '../../utils/CollapsibleItem';
import StatsBarChart from './StatsBarChart';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import IconX from '../Icon/IconX';
import PieChart from './PieChart';
import { IRootState } from '../../store';
import StatsCard from './StatsCard';
import { FormatNumberCommon } from '../CommonFunctions';
interface ManageSiteProps {
  isLoading: boolean;
  getData: (url: string) => Promise<any>;
  postData: (url: string, body: any) => Promise<any>;
}
interface LanguageContentInterface {
  [key: string]: Record<string, any>;
}
interface CardData {
  id: string;
  name: string;
  bgColor: string;
}
interface TabData {
  ownerProfit: any;
  currentDates: string;
  labels: string[];
  data: string[];
  currentMonth: string;
  ownerCurrentLabel: string;
  currentMonthProfit: string;
  prevMonthProfit: string;
  profit_total: string;
  profitSymbol: string;
  ownerCurrentMonth: string;
  ownerPrevLabel: string;
  ownerPrevMonth: string;
  prevLabel: string;
  prevMonth: string;
  profit: string;
  amountProfit: string;
  symbol: string;
  ownerSymbol: string;
  digitalCurrentMonth: string;
  digitalProfit: string;
  digitalSymbol: string;
  digitalPrevMonth: string;
  total: string;
  currentLabel: string;

  listing: {
    credit_received: string;
    id: string;
    date: string;
    fuel_sales: string;
    charges: string;
    credit_sales: string;
    deductions: string;
    credit_card: string;
    total_sales: string;
    cash_deposited: string;
    variance: string;
    owner_collection: string;
    previous_variance: string;
    amount: string;
    balance: string;
  }[];

  prev_data?: any;
  current_data?: any;



}
interface ApexData {
  name: string;
  data: number[];
  type: string;
  color: string;
}

const DataEntryStatsComponent: React.FC<ManageSiteProps> = ({ postData, getData, isLoading }) => {
  const [selectedTab, setSelectedTab] = useState<string>('Fuel Sales');
  const [subData, setSubData] = useState<any[]>([]);
  const [subPreviousData, setSubPreviousData] = useState<any[]>([]);
  const ReduxData: any = useSelector((state: IRootState) => state?.data?.data);
  const [tabData, setTabData] = useState<TabData>({
    labels: [],
    data: [],
    total: '0.00',
    amountProfit: '0.00',
    currentMonth: '0.00',
    prevLabel: '0.00',
    currentMonthProfit: '0.00',
    profitSymbol: '0.00',
    profit_total: '0.00',
    prevMonthProfit: '0.00',
    ownerSymbol: '0.00',
    digitalPrevMonth: '0.00',
    digitalCurrentMonth: '0.00',
    digitalSymbol: '0.00',
    digitalProfit: '0.00',
    currentLabel: '0.00',
    ownerCurrentLabel: '0.00',
    ownerCurrentMonth: '0.00',
    ownerPrevLabel: '0.00',
    ownerPrevMonth: '0.00',
    currentDates: 'none',
    prevMonth: '0.00',
    profit: '0.00',
    symbol: '0.00',
    ownerProfit: '0.00',
    listing: [],
    current_data: {},
  });
  const dispatch = useDispatch();
  const handleApiError = useErrorHandler();
  const [stationId, setStationId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [considerNozzle, setConsiderNozzle] = useState<boolean | null>(null);
  const isNotClient = localStorage.getItem("superiorRole") !== "Client";
  const storedKeyName = "stationTank";

  const { id } = useParams();

  useEffect(() => {
    const storedData: any = localStorage.getItem(storedKeyName);
    if (storedData) {

      let parshedStoredData = JSON.parse(storedData)

      if (parshedStoredData?.station_id) {
        handleApplyFilters(JSON.parse(storedData));
      } else {
        setIsFilterModalOpen(true)
      }


    } else {
      setIsFilterModalOpen(true)
    }

    console.clear()
  }, [dispatch]);


  const staticTabs = [
    'Fuel Sales',
    'Fuel Delivery',
    'Tested Fuel',
    'Fuel Variance',
    'Lube Sales',
    'Credit Sales',
    'Incomes',
    'Expenses',
    'Digital Receipt',
    'Cash Flow',
    'Variance Accumulation',

  ];


  const tabKeyMap: { [key: string]: string } = {
    'Fuel Sales': 'fuel-sales',
    'Fuel Delivery': 'fuel-delivery',
    'Tested Fuel': 'tested-fuel',
    'Fuel Variance': 'fuel-variance',
    'Lube Sales': 'lube-sales',
    'Credit Sales': 'credit-sales',
    'Incomes': 'charges',
    'Expenses': 'deductions',
    'Digital Receipt': 'payments',
    'Cash Flow': 'cash-flow',
    'Variance Accumulation': 'variance-accumulation',
  };


  const [filters, setFilters] = useState<any>({
    client_id: '',
    company_id: '',
    site_id: '',
  });


  const handleTabClick = async (tabName: string) => {

    try {
      const key = tabKeyMap[tabName];
      const response = await getData(`/stats/${key}?station_id=${stationId}&drs_date=${startDate}`);
      if (response && response.data) {

        setBarData(response.data?.data?.barData);
        setDates(response.data?.data?.dates);
        setSelectedTab(tabName);
        setTabData(response.data?.data);
        setActiveAccordion(null);
        setPrevActiveAccordion(null);

      } else {
        throw new Error('No data available in the response');
      }
    } catch (error) {

      handleApiError(error);
    }
  };


  const handleApplyFilters = async (values: any) => {
    try {

      if (!values?.start_month) {
        const currentMonth = new Date()?.toISOString().slice(0, 7); // Format YYYY-MM
        values.start_month = currentMonth;
      }

      setFilters(values)
      const response = await getData(`/stats/fuel-sales?station_id=${values?.station_id}&drs_date=${values?.start_month}`);
      if (response && response.data && response.data.data) {
        setSelectedTab("Fuel Sales")
        setTabData(response.data?.data);
        setStationId(values?.station_id);
        setStartDate(values?.start_month);
        setIsFilterModalOpen(false)
      } else {

        throw new Error('No data available in the response');
      }
    } catch (error) {

      handleApiError(error);
    }
  };



  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    entity_id: Yup.string().required("Entity is required"),
    station_id: Yup.string().required('Station is required'),
    start_month: Yup.string().required('Month is required'),
  });
  const salesByCategory = tabData;
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [prevActiveAccordion, setPrevActiveAccordion] = useState<string | null>(null);

  const handleToggle = async (id: string, date: string, selectedTab: string, item: any, checkType: string) => {
    const isCurrentlyActive = checkType === 'previous'
      ? prevActiveAccordion === item
      : activeAccordion === item;

    const newActiveAccordion = isCurrentlyActive ? null : item;

    // Toggle the correct accordion based on the checkType
    if (checkType === 'previous') {
      setPrevActiveAccordion(newActiveAccordion);
    } else {
      setActiveAccordion(newActiveAccordion);
    }

    // If the accordion is being opened, make the API call
    if (!isCurrentlyActive) {
      if (selectedTab === 'Expenses') {
        // Pass deductions if selectedTab is Expenses
        await GetSubData(date, "deductions", checkType);
      } else if (selectedTab === 'Incomes') {
        // Pass charges if selectedTab is Incomes
        await GetSubData(date, "charges", checkType);
      } else {
        // Call without additional parameters
        await GetSubData(date, selectedTab, checkType);
      }
    }
  };

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const year = dateObj.getFullYear();
    return `${day}${month}${year}`;
  };
  const convertTabName = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };
  const GetSubData = async (date: string, selectedTab: string, checkType: string) => {
    try {
      const formattedDate = formatDate(date);




      const formattedTab = convertTabName(selectedTab);

      // Check if formattedTab is 'digital-receipt' and send 'payments' instead
      const endpoint = formattedTab === 'digital-receipt' ? 'payments' : formattedTab;

      const response = await getData(`/daily-stats/${endpoint}?station_id=${stationId}&drs_date=${formattedDate}`);

      if (response && response.data && response.data.data) {
        if (endpoint === "fuel-sales") {
          setConsiderNozzle(response.data?.data?.considerNozzle || null);
          if (checkType === 'previous') {
            setSubPreviousData(response.data?.data?.listing || [])
          } else {
            setSubData(response.data?.data?.listing || []);
          }
        } else {
          if (checkType === 'previous') {
            setSubPreviousData(response.data?.data?.listing || [])
          } else {
            setSubData(response.data?.data?.listing || []);
          }
        }
      } else {

        throw new Error('No data available in the response');
      }
    } catch (error) {

      handleApiError(error);
    }
  };





  // State to store barData and dates
  const [barData, setBarData] = useState<ApexData[]>([]);
  const [dates, setDates] = useState<any[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const closeModal = () => {
    setIsFilterModalOpen(false);
  }


  const [activeTab, setActiveTab] = useState('current'); // 'current' for Current Month, 'previous' for Previous Month

  // Step 2: Create a function to handle tab switching
  const handleTabClickk = (tab: any) => {
    setActiveTab(tab);
  };

  return <>
    {isLoading && <LoaderImg />}

    <div className="flexspacebetween ">
      {id ? (
        <ul className="flex space-x-2 rtl:space-x-reverse my-2">
          <li>
            <Link to="/dashboard" className="text-primary hover:underline">
              Dashboard
            </Link>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-primary hover:underline">
            <Link to="/dashboard/overview" className="text-primary hover:underline">
              Dashboard Overview
            </Link>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span>Dashboard Stats</span>
          </li>
        </ul>
      ) : (
        <ul className="flex space-x-2 rtl:space-x-reverse mb-2 md:mb-0">
          <li>
            <Link to="/dashboard" className="text-primary hover:underline">
              Dashboard
            </Link>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span>Data Entry Stats</span>
          </li>
        </ul>
      )}


      <div className=" flex gap-4 flex-wrap">


        {filters?.client_id || filters?.entity_id || filters?.station_id ? (
          <>
            <div className="badges-container flex flex-wrap items-center gap-2  text-white" >

              {filters?.client_id && (
                <div className="badge bg-blue-600 flex items-center gap-2 px-2 py-1 ">
                  <span className="font-semibold">Client :</span>
                  {filters?.client_name ? filters?.client_name : <>
                    {ReduxData?.full_name}
                  </>}
                </div>
              )}

              {filters?.entity_name && filters?.entity_name && (
                <div className="badge bg-green-600 flex items-center gap-2 px-2 py-1 ">
                  <span className="font-semibold">Entity : </span> {filters?.entity_name}
                </div>
              )}

              {filters?.station_name && filters?.station_name && (
                <div className="badge bg-red-600 flex items-center gap-2 px-2 py-1 ">
                  <span className="font-semibold">Station :</span> {filters?.station_name}
                </div>
              )}
              {filters?.start_month && (
                <div className="badge bg-gray-600 flex items-center gap-2 px-2 py-1 ">
                  <span className="font-semibold"> Month :</span> {filters?.start_month}
                </div>
              )}
            </div>
          </>
        ) : (
          ''
        )}

        <button onClick={() => setIsFilterModalOpen(true)} type="button" className="btn btn-dark ">
          Apply Filter
        </button>


      </div>
    </div>



    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-1 mb-6">


        <div className='panel h-full col-span-4'>
          <div className="flex justify-between  ">
            <h5 className="font-bold text-lg dark:text-white-light">Data Entry Stats</h5>

          </div>
          <div>
            {startDate && stationId ? (
              <ul className="flex flex-wrap font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 overflow-y-auto">
                {staticTabs?.map((tabName) => (
                  <li key={tabName} className="w-1/8 inline-block" style={{ minWidth: "100px" }}>
                    <button
                      onClick={() => handleTabClick(tabName)}
                      className={`
                        flex gap-2 p-3 border-b border-transparent hover:border-primary hover:text-primary 
                        
                  ${selectedTab === tabName ? 'border-primary c-border-primary bg-gray-200 dark:bg-gray-700 p-0 ' : ''}`}
                    // style={{ color: 'currentColor' }}
                    >

                      {tabName}
                    </button>
                  </li>
                ))}
              </ul>
            ) : <>
              <img
                src={noDataImage} // Use the imported image directly as the source
                alt="no data found"
                className="all-center-flex nodata-image"
              /></>}

          </div>
          <div className="p-2" style={{ padding: "10px" }}>
            {stationId && selectedTab !== 'Variance Accumulation' && selectedTab !== 'Cash Flow' && selectedTab !== 'Lube Sales' && (

              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-1 mb-6">


                <StatsCard
                  label={tabData?.prevLabel}
                  value={tabData?.prevMonth}
                  TabData={tabData}
                  symbol={null} // No symbol for previous month
                  profit={null} // No profit percentage for previous month
                  capacity={capacity}
                  currency={currency}
                  selectedTab={selectedTab}
                />


                <StatsCard
                  label={tabData?.currentLabel}
                  value={tabData?.currentMonth}
                  symbol={tabData?.symbol}
                  profit={tabData?.profit}
                  TabData={tabData}
                  capacity={capacity}
                  currency={currency}
                  selectedTab={selectedTab}
                />

              </div>
            )}

            {stationId && selectedTab === 'Cash Flow' && (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-1 mb-6">
                <div className="panel h-full xl:col-span-2 firstbox">
                  <div className="flex justify-between">
                    <div style={{ color: "#fff" }} className="ltr:mr-1 rtl:ml-1 text-md ">
                      {tabData?.prevLabel}
                    </div>
                  </div>
                  <div style={{ lineHeight: "31px" }} className="flex items-center mt-2">
                    <div style={{ color: "#fff" }} className="  ltr:mr-3 rtl:ml-3">
                      Bank  Deposits :   {currency} {FormatNumberCommon(tabData?.prevMonth)}
                    </div>
                  </div>
                  <div style={{ lineHeight: "31px" }} className="flex items-center mt-2">
                    <div style={{ color: "#fff" }} className="  ltr:mr-3 rtl:ml-3">
                      Owner  Collections :    {currency} {FormatNumberCommon(tabData?.ownerPrevMonth)}
                    </div>
                  </div>
                  <div style={{ lineHeight: "31px" }} className="flex items-center mt-2">
                    <div style={{ color: "#fff" }} className="  ltr:mr-3 rtl:ml-3">
                      Digital Payments:    {currency} {FormatNumberCommon(tabData?.digitalPrevMonth)}
                    </div>
                  </div>
                </div>

                <div className="panel h-full xl:col-span-2 firstbox">
                  <div className="flex justify-between">
                    <div style={{ color: "#fff" }} className="ltr:mr-1 rtl:ml-1 text-md ">
                      {tabData?.currentLabel}
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <div style={{ color: "#fff" }} className=" ltr:mr-3 rtl:ml-3">
                      Bank Deposits : {currency} {FormatNumberCommon(tabData?.currentMonth)}
                    </div>
                    <div className="badge bg-white">
                      <div className="flex items-center space-x-1">
                        {tabData.symbol === 'UP' ? (
                          <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i> // Icon for 'up'
                        ) : tabData.symbol === 'DOWN' ? (
                          <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i> // Icon for 'down'
                        ) : null}
                        <span
                          className=""
                          style={{
                            color: tabData.symbol === 'UP'
                              ? '#37a40a'   // Color for 'up'
                              : tabData.symbol === 'DOWN'
                                ? 'red'      // Color for 'down'
                                : '#000'     // Default color
                          }}
                        >
                          {tabData?.profit}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <div style={{ color: "#fff" }} className=" ltr:mr-3 rtl:ml-3">
                      Owner Collections :  {currency} {FormatNumberCommon(tabData?.ownerCurrentMonth)}
                    </div>
                    <div className="badge bg-white">
                      <div className="flex items-center space-x-1">
                        {tabData?.ownerSymbol === 'UP' ? (
                          <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i> // Icon for 'up'
                        ) : tabData.ownerSymbol === 'DOWN' ? (
                          <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i> // Icon for 'down'
                        ) : null}
                        <span
                          className=""
                          style={{
                            color: tabData.ownerSymbol === 'UP'
                              ? '#37a40a'   // Color for 'up'
                              : tabData.ownerSymbol === 'DOWN'
                                ? 'red'      // Color for 'down'
                                : '#000'     // Default color
                          }}
                        >
                          {tabData?.ownerProfit}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <div style={{ color: "#fff" }} className=" ltr:mr-3 rtl:ml-3">
                      Digital Payments :  {currency} {FormatNumberCommon(tabData?.digitalCurrentMonth)}
                    </div>
                    <div className="badge bg-white">
                      <div className="flex items-center space-x-1">
                        {tabData?.digitalSymbol === 'UP' ? (
                          <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i> // Icon for 'up'
                        ) : tabData.digitalSymbol === 'DOWN' ? (
                          <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i> // Icon for 'down'
                        ) : null}
                        <span
                          className=""
                          style={{
                            color: tabData.digitalSymbol === 'UP'
                              ? '#37a40a'   // Color for 'up'
                              : tabData.digitalSymbol === 'DOWN'
                                ? 'red'      // Color for 'down'
                                : '#000'     // Default color
                          }}
                        >
                          {tabData?.digitalProfit}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
            {stationId && selectedTab === 'Lube Sales' && (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-1 mb-6">
                <div className="panel h-full xl:col-span-2 firstbox">
                  <div className="flex justify-between">
                    <div style={{ color: "#fff" }} className="ltr:mr-1 rtl:ml-1 text-md ">
                      {tabData?.prevLabel}
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <div style={{ color: "#fff" }} className=" ltr:mr-3 rtl:ml-3">
                      Amount :   {currency} {FormatNumberCommon(tabData?.prevMonth)}
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <div style={{ color: "#fff" }} className=" ltr:mr-3 rtl:ml-3">
                      Profit :    {currency} {FormatNumberCommon(tabData?.prevMonthProfit)}
                    </div>
                  </div>
                </div>

                <div className="panel h-full xl:col-span-2 firstbox">
                  <div className="flex justify-between">
                    <div style={{ color: "#fff" }} className="ltr:mr-1 rtl:ml-1 text-md ">
                      {tabData?.currentLabel}
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <div style={{ color: "#fff" }} className="ltr:mr-3 rtl:ml-3">
                      Amount : {currency} {FormatNumberCommon(tabData?.currentMonth)}
                    </div>
                    <div className="badge bg-white">
                      <div className="flex items-center space-x-1">
                        {tabData.symbol === 'UP' ? (
                          <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i> // Icon for 'up'
                        ) : tabData.symbol === 'DOWN' ? (
                          <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i> // Icon for 'down'
                        ) : null}
                        <span
                          className="font-semibold"
                          style={{
                            color: tabData.symbol === 'UP'
                              ? '#37a40a'   // Color for 'up'
                              : tabData.symbol === 'DOWN'
                                ? 'red'      // Color for 'down'
                                : '#000'     // Default color
                          }}
                        >
                          {tabData?.amountProfit}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <div style={{ color: "#fff" }} className=" ltr:mr-3 rtl:ml-3">
                      Profit :  {currency} {FormatNumberCommon(tabData?.currentMonthProfit)}
                    </div>
                    <div className="badge bg-white">
                      <div className="flex items-center space-x-1">
                        {tabData?.profitSymbol === 'UP' ? (
                          <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i> // Icon for 'up'
                        ) : tabData.profitSymbol === 'DOWN' ? (
                          <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i> // Icon for 'down'
                        ) : null}
                        <span
                          className="font-semibold"
                          style={{
                            color: tabData.profitSymbol === 'UP'
                              ? '#37a40a'   // Color for 'up'
                              : tabData.profitSymbol === 'DOWN'
                                ? 'red'      // Color for 'down'
                                : '#000'     // Default color
                          }}
                        >
                          {tabData?.profit}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            <div className="mt-3">

              {stationId && selectedTab === 'Variance Accumulation' ? (
                tabData?.listing?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-200">
                        <tr>
                          <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/6">Date</th>
                          <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/6">Total Sales
                            <OverlayTrigger placement="top" overlay={<Tooltip className="custom-tooltip">
                              (Fuel Sales + Lubes Sales + Incomes ) - (Expenses + Credit Sales)
                            </Tooltip>}>
                              <i style={{ fontSize: "20px" }} className="fi fi-sr-comment-info ml-1"></i>
                            </OverlayTrigger>
                          </th>
                          <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/6">Fuel Sales</th>
                          <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/6">Cash Deposited</th>
                          <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/6"> Owner Collection</th>
                          <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/6"> Credit Received</th>
                          <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/6">Previous Variance</th>
                          <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/6">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tabData?.listing?.map((item) => (
                          <tr

                            style={{
                              backgroundColor: item?.id == "0" ? "#1c8b3359" : "hover:bg-gray-100",
                              color: item?.id == "0" ? "#000" : "",
                              fontWeight: item?.id == "0" ? "bold" : ""
                            }}

                            key={item?.id} className="hover:bg-gray-100">
                            <td className="px-2 py-2 whitespace-nowrap text-sm  w-1/6">{item?.date}    </td>
                            <td className="px-2 py-2 whitespace-nowrap text-sm  w-1/6">{currency} {FormatNumberCommon(item?.total_sales)}</td>
                            <td className="px-2 py-2 whitespace-nowrap text-sm  w-1/6">{currency} {FormatNumberCommon(item?.fuel_sales)}</td>
                            <td className="px-2 py-2 whitespace-nowrap text-sm  w-1/6">{currency} {FormatNumberCommon(item?.cash_deposited)}</td>
                            <td className="px-2 py-2 whitespace-nowrap text-sm  w-1/6">{currency} {FormatNumberCommon(item?.owner_collection)}</td>
                            <td className="px-2 py-2 whitespace-nowrap text-sm  w-1/6">{currency} {FormatNumberCommon(item?.credit_received)}</td>
                            <td className="px-2 py-2 whitespace-nowrap text-sm  w-1/6">{currency} {FormatNumberCommon(item?.previous_variance)}</td>
                            <td className="px-2 py-2 whitespace-nowrap text-sm  w-1/6">{currency} {FormatNumberCommon(item?.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex justify-center items-center">
                    <img
                      src={noDataImage} // Use the imported image directly as the source
                      alt="no data found"
                      className="nodata-image"
                    />
                  </div>
                )
              ) : null}


              {stationId && selectedTab !== 'Variance Accumulation' && (
                <>
                  <div className={`grid ${tabData?.prev_data ? ' xl:grid-cols-2  md:grid-cols-2' : ' xl:grid-cols-1  md:grid-cols-1'} sm:grid-cols-1 gap-2 mb-6`}>

                    <div className={` h-full xl:col-span-1 ${tabData?.prev_data ? 'panel' : ' hidden'}`}>

                      {tabData?.prev_data?.listing?.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {tabData?.prev_data?.listing?.map((item: any, index: any) => (
                            <CollapsibleItem
                              key={index}
                              id={`${currency}-${index}`}
                              title={item?.date}
                              selectedTab={selectedTab}
                              subtitle={item?.amount}
                              // isActive={prevActiveAccordion === `${currency}-${index}`}
                              isActive={prevActiveAccordion === `${item?.id}-previous-${index}`}
                              onToggle={() => handleToggle(`${currency}-${index}`, item?.date, selectedTab, `${item?.id}-previous-${index}`, 'previous')}
                            >
                              {selectedTab === "Fuel Sales" ? (
                                <div className="overflow-x-auto">
                                  {!considerNozzle ? (
                                    <ul className="divide-y divide-gray-200 w-full min-w-[600px]">
                                      <li className="flex justify-between p-2 bg-gray-200">
                                        <p className="font-semibold w-1/6">Name </p>
                                        <p className="font-semibold w-1/6">Price</p>
                                        <p className="font-semibold w-1/6">Volume</p>
                                        <p className="font-semibold w-1/6">Net Value</p>
                                      </li>
                                      {prevActiveAccordion === `${item?.id}-previous-${index}` && subPreviousData?.map((subItem, subIndex) => (
                                        <li key={subIndex} className="flex justify-between p-2 hover:bg-gray-100">
                                          <p className="w-1/6">{subItem?.name}</p>
                                          <p className="w-1/6">{currency} {FormatNumberCommon(subItem?.price)}</p>
                                          <p className="w-1/6">{capacity}{FormatNumberCommon(subItem?.volume)}</p>
                                          <p className="w-1/6">{currency} {FormatNumberCommon(subItem?.amount)}</p>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <ul className="divide-y divide-gray-200 w-full min-w-[600px]">
                                      <li className="flex justify-between p-2 bg-gray-200">

                                        <p className="font-semibold w-1/6">Nozzle Name</p>
                                        <p className="font-semibold w-1/6">Price</p>
                                        <p className="font-semibold w-1/6">Volume</p>
                                        <p className="font-semibold w-1/6">Gross Value</p>
                                        <p className="font-semibold w-1/6">Discount</p>
                                        <p className="font-semibold w-1/6">Net Value</p>
                                      </li>


                                      {subPreviousData?.map((fuelType, fuelIndex) => (
                                        <>

                                          <div className="grid xl:grid-cols-1  md:grid-cols-1 sm:grid-cols-1 gap-2 mb-6">
                                            <div className="panel h-full mx-0 px-0 pt-0 fuel-sale-table-border">
                                              <div key={fuelIndex}>
                                                <p className="p-2 bg-[#e5e7eb] font-bold w-1/10">Fuel Type: {fuelType?.name}</p>
                                                {fuelType?.tanks?.map((tank: any, tankIndex: any) => (
                                                  <React.Fragment key={tankIndex}>
                                                    <p className="mt-2 mb-2 font-bold p-2 bg-[#e5e7eb] w-1/10">Tank Name: {tank?.tank_name}</p>
                                                    <div className="flex flex-col">
                                                      {tank?.nozzles?.map((nozzle: any, nozzleIndex: any) => (
                                                        <li key={nozzleIndex} className="flex justify-between p-2 hover:bg-gray-100 mt-2 fuel-sale-table-li"
                                                          style={{
                                                            backgroundColor: nozzle?.id == "0" ? "#02449b24" : "hover:bg-gray-100",
                                                            fontWeight: nozzle?.id == "0" ? "bold" : ""
                                                          }}
                                                        >
                                                          <p className="w-1/6">{nozzle?.name} </p>
                                                          <p className="w-1/6">
                                                            {nozzle?.id == "0" ? `${nozzle?.price}` : `${currency} ${FormatNumberCommon(nozzle?.price)}`}
                                                          </p>
                                                          <p className="w-1/6">{capacity} {FormatNumberCommon(nozzle?.volume)}</p>
                                                          <p className="w-1/6">{currency} {FormatNumberCommon(nozzle?.gross_value)}</p>
                                                          <p className="w-1/6">{currency} {FormatNumberCommon(nozzle?.discount)}</p>
                                                          <p className="w-1/6">{currency} {FormatNumberCommon(nozzle?.amount)}</p>
                                                        </li>
                                                      ))}

                                                    </div>

                                                  </React.Fragment>

                                                ))}
                                                <li style={{ background: "#1c8b3359" }} key={fuelType} className="flex justify-between p-2 mt-2 mb-2 font-bold hover:bg-gray-100">
                                                  <p className="w-1/6 ">{fuelType?.name} Total</p>
                                                  <p className="w-1/6">

                                                  </p>
                                                  <p className="w-1/6">{capacity}{FormatNumberCommon(fuelType?.volume)}</p>
                                                  <p className="w-1/6">{currency} {FormatNumberCommon(fuelType?.gross_value)}</p>
                                                  <p className="w-1/6">{currency} {FormatNumberCommon(fuelType?.discount)}</p>
                                                  <p className="w-1/6">{currency} {FormatNumberCommon(fuelType?.amount)}</p>
                                                </li>
                                              </div>


                                            </div>
                                          </div>
                                        </>
                                      ))}

                                    </ul>
                                  )}
                                </div>
                              ) : selectedTab === "Fuel Variance" ? (
                                <div className="overflow-x-auto">
                                  <ul className="divide-y divide-gray-200 w-full min-w-[600px]">
                                    <li className="flex justify-between p-2 bg-gray-200">
                                      <p className="font-semibold w-1/4">Name</p>
                                      <p className="font-semibold w-1/4">Variance</p>
                                      <p className="font-semibold w-1/4"> Price</p>
                                      <p className="font-semibold w-1/4">Total Amount</p>

                                    </li>
                                    {activeAccordion === `${item?.id}-previous-${index}` && subPreviousData?.map((subItem, subIndex) => (
                                      <li style={{
                                        backgroundColor: subItem?.id == "0" ? "#1c8b3359" : "hover:bg-gray-100",
                                        color: subItem?.id == "0" ? "#000" : "",
                                        fontWeight: subItem?.id == "0" ? "bold" : ""
                                      }} key={subIndex} className="flex justify-between p-2 hover:bg-gray-100">
                                        <p className="w-1/4">{subItem?.name}</p>
                                        <p className="w-1/4">{capacity} {FormatNumberCommon(subItem?.variance)}</p>
                                        <p className="w-1/4">
                                          {subItem?.id == "0" ? "" : `${currency} ${FormatNumberCommon(subItem?.price)}`}
                                        </p>
                                        <p className="w-1/4">{currency}{FormatNumberCommon(subItem?.amount)}</p>

                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : selectedTab === "Lube Sales" ? (
                                <div className="overflow-x-auto">
                                  <ul className="divide-y divide-gray-200 w-full min-w-[600px]">
                                    <li className="flex justify-between p-2 bg-gray-200">
                                      <p className="font-semibold w-1/5">Name</p>
                                      <p className="font-semibold w-1/5">Size</p>
                                      <p className="font-semibold w-1/5">Opening</p>
                                      <p className="font-semibold w-1/5">Closing</p>
                                      <p className="font-semibold w-1/5">Sale Quantity</p>
                                      <p className="font-semibold w-1/5">Amount</p>
                                      <p className="font-semibold w-1/5">Profit</p>
                                    </li>
                                    {prevActiveAccordion === `${item?.id}-previous-${index}` && subPreviousData?.map((subItem, subIndex) => (
                                      <li key={subIndex} className="flex justify-between p-2 hover:bg-gray-100">
                                        <p className="w-1/5">{subItem?.lubricant_name}</p>
                                        <p className="w-1/5">{subItem?.lubricant_size}</p>
                                        <p className="w-1/5">{currency} {FormatNumberCommon(subItem?.opening)}</p>
                                        <p className="w-1/5">{currency} {FormatNumberCommon(subItem?.closing)}</p>
                                        <p className="w-1/5">{FormatNumberCommon(subItem?.sale)}</p>
                                        <p className="w-1/5">{currency} {FormatNumberCommon(subItem?.sale_amount)}</p>
                                        <p className="w-1/5">{currency} {FormatNumberCommon(subItem?.profit)}</p>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : selectedTab === "Tested Fuel" ? (
                                <div className="overflow-x-auto">
                                  <ul className="divide-y divide-gray-200 w-full min-w-[600px]">
                                    <li className="flex justify-between p-2 bg-gray-200">
                                      <p className="font-semibold w-1/5">Name</p>
                                      <p className="font-semibold w-1/5">Volume</p>

                                    </li>
                                    {prevActiveAccordion === `${item?.id}-previous-${index}` && subPreviousData?.map((subItem, subIndex) => (
                                      <li key={subIndex} className="flex justify-between p-2 hover:bg-gray-100">
                                        <p className="w-1/5">{subItem?.name}</p>
                                        <p className="w-1/5">{capacity} {FormatNumberCommon(subItem?.volume)}</p>

                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                <div className="overflow-x-auto">
                                  <ul className="divide-y divide-gray-200 w-full min-w-[400px]">
                                    <li className="flex justify-between p-2 bg-gray-200">
                                      <p className="font-semibold w-1/2">Name  </p>
                                      <p className="font-semibold w-1/2">
                                        {selectedTab === 'Fuel Delivery' ? 'Delivery'
                                          : (selectedTab === 'Fuel Variance' ? 'Variance' : 'Amount')}
                                      </p>
                                    </li>

                                    {subPreviousData?.length > 0 ? (
                                      prevActiveAccordion === `${item?.id}-previous-${index}` &&
                                      subPreviousData?.map((subItem, subIndex) => (
                                        <li key={subIndex} className="flex justify-between p-2 hover:bg-gray-100">
                                          <p className="w-1/2">{subItem?.name}  {(selectedTab == 'Incomes' || selectedTab == 'Expenses') && subItem?.notes && (
                                            <OverlayTrigger
                                              placement="bottom"
                                              overlay={
                                                <Tooltip className="custom-tooltip" id="tooltip-amount">
                                                  {subItem?.notes}
                                                </Tooltip>
                                              }
                                            >
                                              <span>
                                                <i className="fi fi-sr-comment-info"></i>
                                              </span>
                                            </OverlayTrigger>
                                          )}</p>
                                          <p className="w-1/2">
                                            {selectedTab === 'Fuel Delivery'
                                              ? capacity + FormatNumberCommon(subItem?.delivery)
                                              : selectedTab === 'Fuel Variance'
                                                ? capacity + FormatNumberCommon(subItem?.variance)
                                                : currency + FormatNumberCommon(subItem?.amount)}
                                          </p>
                                        </li>
                                      ))
                                    ) : (
                                      <li className="flex justify-between p-2 hover:bg-gray-100">
                                        <p className="w-1/2">--</p>
                                        <p className="w-1/2">---</p>
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              )}

                            </CollapsibleItem>
                          ))}
                        </ul>
                      )
                        : (
                          <div className="flex justify-center items-center">
                            <img
                              src={noDataImage} // Use the imported image directly as the source
                              alt="no data found"
                              className="nodata-image"
                            />
                          </div>
                        )}
                    </div>


                    <div
                      className={` h-full xl:col-span-1 ${tabData?.prev_data ? 'panel' : ' '}`}
                    >

                      {tabData?.current_data?.listing?.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {tabData?.current_data?.listing?.map((item: any, index: number) => (
                            <CollapsibleItem
                              key={index}
                              id={`${currency}-${index}`}
                              title={item?.date}
                              selectedTab={selectedTab}
                              subtitle={item?.amount}
                              // isActive={activeAccordion === `${currency}-${index}`}
                              isActive={activeAccordion === `${item?.id}-current-${index}`}
                              onToggle={() => handleToggle(`${currency}-${index}`, item?.date, selectedTab, `${item?.id}-current-${index}`, 'current')}
                            >
                              {selectedTab === "Fuel Sales" ? (
                                <div className="overflow-x-auto">
                                  {!considerNozzle ? (
                                    <ul className="divide-y divide-gray-200 w-full min-w-[600px]">
                                      <li className="flex justify-between p-2 bg-gray-200">
                                        <p className="font-semibold w-1/6">Name </p>
                                        <p className="font-semibold w-1/6">Price</p>
                                        <p className="font-semibold w-1/6">Volume</p>
                                        <p className="font-semibold w-1/6">Net Value</p>
                                      </li>
                                      {activeAccordion === `${item?.id}-current-${index}` && subData?.map((subItem, subIndex) => (
                                        <li key={subIndex} className="flex justify-between p-2 hover:bg-gray-100">
                                          <p className="w-1/6">{subItem?.name}</p>
                                          <p className="w-1/6">{currency} {FormatNumberCommon(subItem?.price)}</p>
                                          <p className="w-1/6">{capacity}{FormatNumberCommon(subItem?.volume)}</p>
                                          <p className="w-1/6">{currency} {FormatNumberCommon(subItem?.amount)}</p>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <ul className="divide-y divide-gray-200 w-full min-w-[600px]">
                                      <li className="flex justify-between p-2 bg-gray-200">

                                        <p className="font-semibold w-1/6">Nozzle Name</p>
                                        <p className="font-semibold w-1/6">Price</p>
                                        <p className="font-semibold w-1/6">Volume</p>
                                        <p className="font-semibold w-1/6">Gross Value</p>
                                        <p className="font-semibold w-1/6">Discount</p>
                                        <p className="font-semibold w-1/6">Net Value</p>
                                      </li>


                                      {subData?.map((fuelType, fuelIndex) => (
                                        <>

                                          <div className="grid xl:grid-cols-1  md:grid-cols-1 sm:grid-cols-1 gap-2 mb-6">
                                            <div className="panel h-full mx-0 px-0 pt-0 fuel-sale-table-border">
                                              <div key={fuelIndex}>
                                                <p className="p-2 bg-[#e5e7eb] font-bold w-1/10">Fuel Type: {fuelType?.name}</p>
                                                {fuelType?.tanks?.map((tank: any, tankIndex: any) => (
                                                  <React.Fragment key={tankIndex}>
                                                    <p className="mt-2 mb-2 font-bold p-2 bg-[#e5e7eb] w-1/10">Tank Name: {tank?.tank_name}</p>
                                                    <div className="flex flex-col">
                                                      {tank?.nozzles?.map((nozzle: any, nozzleIndex: any) => (
                                                        <li key={nozzleIndex} className="flex justify-between p-2 hover:bg-gray-100 mt-2 fuel-sale-table-li"
                                                          style={{
                                                            backgroundColor: nozzle?.id == "0" ? "#02449b24" : "hover:bg-gray-100",
                                                            fontWeight: nozzle?.id == "0" ? "bold" : ""
                                                          }}
                                                        >
                                                          <p className="w-1/6">{nozzle?.name} </p>
                                                          <p className="w-1/6">
                                                            {nozzle?.id == "0" ? `${nozzle?.price}` : `${currency} ${FormatNumberCommon(nozzle?.price)}`}
                                                          </p>
                                                          <p className="w-1/6">{capacity} {FormatNumberCommon(nozzle?.volume)}</p>
                                                          <p className="w-1/6">{currency} {FormatNumberCommon(nozzle?.gross_value)}</p>
                                                          <p className="w-1/6">{currency} {FormatNumberCommon(nozzle?.discount)}</p>
                                                          <p className="w-1/6">{currency} {FormatNumberCommon(nozzle?.amount)}</p>
                                                        </li>
                                                      ))}

                                                    </div>

                                                  </React.Fragment>

                                                ))}
                                                <li style={{ background: "#1c8b3359" }} key={fuelType} className="flex justify-between p-2 mt-2 mb-2 font-bold hover:bg-gray-100">
                                                  <p className="w-1/6 ">{fuelType?.name} Total</p>
                                                  <p className="w-1/6">

                                                  </p>
                                                  <p className="w-1/6">{capacity}{FormatNumberCommon(fuelType?.volume)}</p>
                                                  <p className="w-1/6">{currency} {FormatNumberCommon(fuelType?.gross_value)}</p>
                                                  <p className="w-1/6">{currency} {FormatNumberCommon(fuelType?.discount)}</p>
                                                  <p className="w-1/6">{currency} {FormatNumberCommon(fuelType?.amount)}</p>
                                                </li>
                                              </div>


                                            </div>
                                          </div>
                                        </>
                                      ))}

                                    </ul>
                                  )}
                                </div>

                              ) : selectedTab === "Fuel Variance" ? (
                                <div className="overflow-x-auto">
                                  <ul className="divide-y divide-gray-200 w-full min-w-[600px]">
                                    <li className="flex justify-between p-2 bg-gray-200">
                                      <p className="font-semibold w-1/4">Name</p>
                                      <p className="font-semibold w-1/4">Variance</p>
                                      <p className="font-semibold w-1/4"> Price</p>


                                      <p className="font-semibold w-1/4">Total Amount</p>

                                    </li>
                                    {activeAccordion === `${item?.id}-current-${index}` && subData?.map((subItem, subIndex) => (
                                      <li style={{
                                        backgroundColor: subItem?.id == "0" ? "#1c8b3359" : "hover:bg-gray-100",
                                        color: subItem?.id == "0" ? "#000" : "",
                                        fontWeight: subItem?.id == "0" ? "bold" : ""
                                      }} key={subIndex} className="flex justify-between p-2 hover:bg-gray-100">
                                        <p className="w-1/4">{subItem?.name}</p>
                                        <p className="w-1/4">{capacity} {FormatNumberCommon(subItem?.variance)}</p>
                                        <p className="w-1/4">
                                          {subItem?.id == "0" ? "" : `${currency} ${FormatNumberCommon(subItem?.price)}`}
                                        </p>



                                        <p className="w-1/4">{currency}{FormatNumberCommon(subItem?.amount)}</p>

                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : selectedTab === "Lube Sales" ? (
                                <div className="overflow-x-auto">
                                  <ul className="divide-y divide-gray-200 w-full min-w-[600px]">
                                    <li className="flex justify-between p-2 bg-gray-200">
                                      <p className="font-semibold w-1/5">Name</p>
                                      <p className="font-semibold w-1/5">Size</p>
                                      <p className="font-semibold w-1/5">Opening</p>
                                      <p className="font-semibold w-1/5">Closing</p>
                                      <p className="font-semibold w-1/5">Sale Quantity</p>
                                      <p className="font-semibold w-1/5">Amount</p>
                                      <p className="font-semibold w-1/5">Profit</p>
                                    </li>
                                    {activeAccordion === `${item?.id}-current-${index}` && subData?.map((subItem, subIndex) => (
                                      <li key={subIndex} className="flex justify-between p-2 hover:bg-gray-100">
                                        <p className="w-1/5">{subItem?.lubricant_name}</p>
                                        <p className="w-1/5">{subItem?.lubricant_size}</p>
                                        <p className="w-1/5">{currency} {FormatNumberCommon(subItem?.opening)}</p>
                                        <p className="w-1/5">{currency} {FormatNumberCommon(subItem?.closing)}</p>
                                        <p className="w-1/5">{FormatNumberCommon(subItem?.sale)}</p>
                                        <p className="w-1/5">{currency} {FormatNumberCommon(subItem?.sale_amount)}</p>
                                        <p className="w-1/5">{currency} {FormatNumberCommon(subItem?.profit)}</p>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : selectedTab === "Tested Fuel" ? (
                                <div className="overflow-x-auto">
                                  <ul className="divide-y divide-gray-200 w-full min-w-[600px]">
                                    <li className="flex justify-between p-2 bg-gray-200">
                                      <p className="font-semibold w-1/5">Name</p>
                                      <p className="font-semibold w-1/5">Volume</p>

                                    </li>
                                    {activeAccordion === `${item?.id}-current-${index}` && subData?.map((subItem, subIndex) => (
                                      <li key={subIndex} className="flex justify-between p-2 hover:bg-gray-100">
                                        <p className="w-1/5">{subItem?.name}</p>
                                        <p className="w-1/5">{capacity} {FormatNumberCommon(subItem?.volume)}</p>

                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                <div className="overflow-x-auto">
                                  <ul className="divide-y divide-gray-200 w-full min-w-[400px]">
                                    <li className="flex justify-between p-2 bg-gray-200">
                                      <p className="font-semibold w-1/2">Name


                                      </p>
                                      <p className="font-semibold w-1/2">
                                        {selectedTab === 'Fuel Delivery' ? 'Delivery'
                                          : (selectedTab === 'Fuel Variance' ? 'Variance' : 'Amount')}
                                      </p>
                                    </li>

                                    {subData?.length > 0 ? (
                                      activeAccordion === `${item?.id}-current-${index}` &&
                                      subData?.map((subItem, subIndex) => (
                                        <li key={subIndex} className="flex justify-between p-2 hover:bg-gray-100">
                                          <p className="w-1/2">{subItem?.name}  {(selectedTab == 'Incomes' || selectedTab == 'Expenses') && subItem?.notes && (
                                            <OverlayTrigger
                                              placement="bottom"
                                              overlay={
                                                <Tooltip className="custom-tooltip" id="tooltip-amount">
                                                  {subItem?.notes}
                                                </Tooltip>
                                              }
                                            >
                                              <span>
                                                <i className="fi fi-sr-comment-info"></i>
                                              </span>
                                            </OverlayTrigger>
                                          )}</p>
                                          <p className="w-1/2">
                                            {selectedTab === 'Fuel Delivery'
                                              ? capacity + FormatNumberCommon(subItem?.delivery)
                                              : selectedTab === 'Fuel Variance'
                                                ? capacity + FormatNumberCommon(subItem?.variance)
                                                : currency + FormatNumberCommon(subItem?.amount)}
                                          </p>
                                        </li>
                                      ))
                                    ) : (
                                      <li className="flex justify-between p-2 hover:bg-gray-100">
                                        <p className="w-1/2">--</p>
                                        <p className="w-1/2">---</p>
                                      </li>
                                    )}





                                  </ul>
                                </div>
                              )}

                            </CollapsibleItem>
                          ))}
                        </ul>
                      )
                        : (
                          <div className="flex justify-center items-center">
                            <img
                              src={noDataImage} // Use the imported image directly as the source
                              alt="no data found"
                              className="nodata-image"
                            />
                          </div>
                        )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

      </div>






      <>

        <div className='panel h-full col-span-4'>

          {stationId && selectedTab !== 'Variance Accumulation' && (
            <>
              {/* Step 3: Render the Tabs */}
              <ul className="flex flex-wrap font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 overflow-y-auto">
                <li className="w-full inline-block" style={{ minWidth: '100px' }}>
                  <div className="flex gap-4">

                    {tabData?.prev_data && (<>
                      <button
                        onClick={() => handleTabClickk('previous')}
                        className={`flex gap-2 p-3 border-b ${activeTab === 'previous' ? 'border-primary text-primary' : 'border-transparent hover:border-primary hover:text-primary'}`}
                      >
                        Previous Month
                      </button>
                    </>)}
                    {tabData?.current_data && (<>
                      <button
                        onClick={() => handleTabClickk('current')}
                        className={`flex gap-2 p-3 border-b ${activeTab === 'current' ? 'border-primary text-primary' : 'border-transparent hover:border-primary hover:text-primary'}`}
                      >
                        Current Month
                      </button>
                    </>)}

                  </div>
                </li>
              </ul>


              {/* Step 4: Conditional rendering of the charts based on the active tab */}
              {activeTab === 'previous' && tabData?.prev_data && (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-1 mb-6">
                  <div className="xl:col-span-8 p-2">
                    <div className="panel h-full">
                      <div className="flex justify-between">
                        <h5 className="font-bold text-lg dark:text-white-light">
                          {selectedTab} Bar Graph Stats (Previous Month: {tabData?.currentDates})
                        </h5>
                        <hr />
                      </div>
                      <div style={{ padding: '10px' }}>
                        <StatsBarChart
                          series={tabData?.prev_data?.bar_chart?.barData}
                          categories={tabData?.prev_data?.bar_chart?.labels}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="xl:col-span-4 p-2">
                    <div className="panel h-full">
                      <div className="flex justify-between">
                        <h5 className="font-bold text-lg dark:text-white-light">
                          {selectedTab} Pie Graph Stats (Previous Month)
                        </h5>
                        <hr />
                      </div>
                      {tabData?.prev_data?.pie_chart?.labels?.length && (
                        <div style={{ padding: '10px' }}>
                          <PieChart data={tabData.prev_data.pie_chart} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'current' && tabData?.current_data && (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-1 mb-6">
                  <div className="xl:col-span-8 p-2">
                    <div className="panel h-full">
                      <div className="flex justify-between">
                        <h5 className="font-bold text-lg dark:text-white-light">
                          {selectedTab} Bar Graph Stats (Current Month: {tabData?.currentDates})
                        </h5>
                        <hr />
                      </div>
                      <div style={{ padding: '10px' }}>
                        <StatsBarChart
                          series={tabData?.current_data?.bar_chart?.barData}
                          categories={tabData?.current_data?.bar_chart?.labels}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="xl:col-span-4 p-2">
                    <div className="panel h-full">
                      <div className="flex justify-between">
                        <h5 className="font-bold text-lg dark:text-white-light">
                          {selectedTab} Pie Graph Stats (Current Month)
                        </h5>
                        <hr />
                      </div>
                      {tabData?.current_data?.pie_chart?.labels?.length && (
                        <div style={{ padding: '10px' }}>
                          <PieChart data={tabData.current_data.pie_chart} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

      </>


    </div >

    {isFilterModalOpen && (
      <div className="modal fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white w-full max-w-md m-6">
          <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
            <h5 className="text-lg font-bold">
              Apply Filter
            </h5>
            <button onClick={closeModal} type="button" className="text-white-dark hover:text-dark">
              <IconX />
            </button>
          </div>

          <div className='p-6'>

            <CustomInput
              getData={getData}
              isLoading={isLoading}
              smallScreen={true}
              onApplyFilters={handleApplyFilters}
              showClientInput={true}
              showEntityInput={true}
              showStationInput={true}
              showStationValidation={true}
              validationSchema={validationSchemaForCustomInput}
              layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-2 gap-5"
              isOpen={false}
              onClose={() => { }}
              showDateInput={false}
              fullWidthButton={false}
              showMonthInput={true}
              storedKeyName={storedKeyName}
            />


          </div>

        </div>
      </div>
    )}
  </>;
};

export default withApiHandler(DataEntryStatsComponent);
