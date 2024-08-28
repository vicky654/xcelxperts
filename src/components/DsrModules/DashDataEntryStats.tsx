import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import 'tippy.js/dist/tippy.css';
import useErrorHandler from '../../hooks/useHandleError';
import LoaderImg from '../../utils/Loader';
import withApiHandler from '../../utils/withApiHandler';
import * as Yup from 'yup';

import noDataImage from '../../assets/AuthImages/noDataFound.png';
import { capacity, currency } from '../../utils/CommonData';
import ReactApexChart from 'react-apexcharts';
import CollapsibleItem from '../../utils/CollapsibleItem';
import StatsBarChart from './StatsBarChart';
import DashboardFilter from './DashboardFilter';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import IconX from '../Icon/IconX';
import PieChart from './PieChart';

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
  labels: string[];

  data: string[];
  currentMonth: string;
  currentLabel: string;
  prevLabel: string;
  prevMonth: string;
  profit: string;
  symbol: string;
  total: string;
  listing: {
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
    previous_variance: string;
    amount: string;
    balance: string;
  }[];
}
interface ApexData {
  name: string;
  data: number[];
  type: string;
  color: string;
}

const DashDataEntryStats: React.FC<ManageSiteProps> = ({ postData, getData, isLoading }) => {
  const [data, setData] = useState([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('Variance Accumulation');
  const [subData, setSubData] = useState<any[]>([]);
  const [considerNozzle, setConsiderNozzle] = useState<boolean | null>(null);

  const [tabData, setTabData] = useState<TabData>({
    labels: [],
    data: [],
    total: '0.00',
    currentMonth: '0.00',
    prevLabel: '0.00',
    currentLabel: '0.00',
    prevMonth: '0.00',
    profit: '0.00',
    symbol: '0.00',
    listing: []
  });
  const dispatch = useDispatch();
  const handleApiError = useErrorHandler();
  const [currentLanguage, setCurrentLanguage] = useState('english'); // Default language
  const [isUserAddonModalOpen, setIsUserAddonModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // Assuming userId is a string


  const [selectedCardName, setSelectedCardName] = useState<string | null>(null);
  const [stationId, setStationId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);



  const isNotClient = localStorage.getItem("superiorRole") !== "Client";
  const storedKeyName = "stationTank";
  const DashboardstoredKeyName = 'Dashboard_Stats_values'; // Adjust the key name as needed

  const id = useParams()
  useEffect(() => {
    // Select the first card by default if cards have data
    const stationTank = localStorage.getItem(DashboardstoredKeyName);

    if (stationTank) {
      const parsedData = JSON.parse(stationTank);
      setFilters({
        client_id: parsedData.client_id || '',
        company_id: parsedData.entity_id || '',
        site_id: parsedData.station_id || '',
        // You can include more fields as needed:
        client_name: parsedData.client_name || '',
        entity_name: parsedData.entity_name || '',
        start_date: parsedData.start_date || '',
        start_month: parsedData.start_month || '',
        station_name: parsedData.station_name || '',
        clients: parsedData.clients || [],
        companies: parsedData.companies || [],
        sites: parsedData.sites || [],
      });
    }
    if (cards?.length > 0) {



      setSelectedCardName(cards[0]?.name);
    }
  }, [cards]);
  useEffect(() => {
    const storedDataString = localStorage.getItem(DashboardstoredKeyName);


    if (storedDataString) {
      try {
        const storedData = JSON.parse(storedDataString);
        if (storedData.start_month) {
          handleApplyFilters(storedData);
        }
      } catch (error) {
      }
    }
  }, [dispatch]);


  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const closeModal = () => {
    setIsFilterModalOpen(false);
  }

  const [filters, setFilters] = useState<any>({
    client_id: localStorage.getItem('client_id') || '',
    company_id: localStorage.getItem('company_id') || '',
    site_id: localStorage.getItem('site_id') || '',
  });

  const staticTabs = [
    'Variance Accumulation',
    'Fuel Variance',
    'Fuel Sales',
    'Fuel Delivery',
    'Lube Sales',
    'Incomes',
    'Expenses',
    'Digital Receipt',
    'Credit Sales',



  ];
  const tabKeyMap: { [key: string]: string } = {
    'Variance Accumulation': 'variance-accumulation',
    'Fuel Variance': 'fuel-variance',
    'Fuel Sales': 'fuel-sales',
    'Fuel Delivery': 'fuel-delivery',
    'Lube Sales': 'lube-sales',
    'Incomes': 'charges',
    'Expenses': 'deductions',
    'Digital Receipt': 'payments',
    'Credit Sales': 'credit-sales',


  };
  useEffect(() => {
    // Select the first card by default if cards have data
    if (cards.length > 0) {
      setSelectedCardName(cards[0].name);
    }
  }, [cards]);
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
      } else {
        throw new Error('No data available in the response');
      }
    } catch (error) {

      handleApiError(error);
    }
  };


  const handleApplyFilters = async (values: any) => {


    try {
      const response = await getData(`/stats/variance-accumulation?station_id=${values?.station_id || values?.site_id}&drs_date=${values?.start_month}`);
      if (response && response.data && response.data.data) {
        setSelectedTab("Variance Accumulation")
        setTabData(response.data?.data);
        setStationId(values?.station_id || values?.site_id);
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

  const handleToggle = async (id: string, date: string, selectedTab: string) => {
    const isCurrentlyActive = activeAccordion === id;
    const newActiveAccordion = isCurrentlyActive ? null : id;
    setActiveAccordion(newActiveAccordion);

    // If the accordion is being opened, make the API call
    if (!isCurrentlyActive) {
      if (selectedTab === 'Expenses') {
        // Pass deductions if selectedTab is Expenses
        await GetSubData(date, "deductions");
      } else if (selectedTab === 'Incomes') {
        // Pass charges if selectedTab is Incomes
        await GetSubData(date, "charges");
      } else {
        // Call without additional parameters
        await GetSubData(date, selectedTab);
      }
      // Log the ID to the console

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
  const GetSubData = async (date: string, selectedTab: string) => {
    try {
      const formattedDate = formatDate(date);
      const formattedTab = convertTabName(selectedTab);
      const endpoint = formattedTab === 'digital-receipt' ? 'payments' : formattedTab;

      const response = await getData(`/daily-stats/${endpoint}?station_id=${stationId}&drs_date=${formattedDate}`);
      if (response && response.data && response.data.data) {
        if (endpoint === "fuel-sales") {
          setConsiderNozzle(response.data?.data?.considerNozzle || null);
          setSubData(response.data?.data?.listing || []);
        } else {
          setSubData(response.data?.data?.listing || []);
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
  const [dates, setDates] = useState<string[]>([]);




  return <>
    {isLoading && <LoaderImg />}
    <div className="flexspacebetween ">

      <ul className="flex space-x-2 rtl:space-x-reverse my-2">
        <li>
          <Link to="/dashboard" className="text-primary hover:underline">
            Dashboard
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-primary hover:underline" >
          <Link to="/dashboard/overview" className="text-primary hover:underline">
            <span className='dash-breadcrub-header'>Dashboard </span> Overview
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Dashboard Stats</span>
        </li>
      </ul>


      <div className=" flex gap-4 flex-wrap">


        {filters?.client_name || filters?.entity_name || filters?.station_name ? (
          <>
            <div className="badges-container flex flex-wrap items-center gap-2  text-white" >
              {filters?.client_id && (
                <div className="badge bg-blue-600 flex items-center gap-2 px-2 py-1 ">
                  <span className="font-semibold">Client :</span> {filters?.client_name}
                </div>
              )}

              {filters?.entity_name && (
                <div className="badge bg-green-600 flex items-center gap-2 px-2 py-1 ">
                  <span className="font-semibold">Entity : </span> {filters?.entity_name}
                </div>
              )}

              {filters?.station_name && (
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
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-1 gap-1 mb-6">


        <div className='panel h-full col-span-3'>
          <div className="flex justify-between  ">
            <h5 className="font-bold text-lg dark:text-white-light">Data Entry Stats</h5>

            <hr></hr>
          </div>
          <div>
            {startDate && stationId ? (
              <ul className="flex flex-wrap font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 overflow-y-auto">
                {staticTabs?.map((tabName) => (
                  <li key={tabName} className="w-1/8 inline-block" style={{ minWidth: "100px" }}>
                    <button
                      onClick={() => handleTabClick(tabName)}
                      className={`
                        flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary 
                        
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
            {/* {stationId && <h2 className="text-lg font-semibold">{selectedTab}</h2>}
             */}

            {stationId && selectedTab !== 'Variance Accumulation' && (

              <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-1 mb-6'>
                <div className=" panel h-full xl:col-span-2  firstbox ">
                  <div className="flex justify-between">
                    <div style={{ color: "#fff" }} className="ltr:mr-1 rtl:ml-1 text-md ">{tabData?.currentLabel}</div>

                  </div>
                  <div className="flex items-center mt-2">
                    {/* <div style={{ color: "#fff" }} className=" font-bold ltr:mr-3 rtl:ml-3 "> {currency} {tabData?.currentMonth} </div> */}
                    <div style={{ color: "#fff" }} className="font-bold ltr:mr-3 rtl:ml-3">
                      {(selectedTab === 'Fuel Variance' || selectedTab === 'Fuel Delivery') ? capacity : currency} {tabData?.currentMonth}
                    </div>
                    {/* <span>  <i className="fi fi-tr-caret-up "></i></span> */}
                    <div



                      className={`badge bg-white`}
                    >

                      <div className="flex items-center space-x-1">
                        {tabData.symbol === 'UP' ? (
                          <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i> // Icon for 'up'
                        ) : tabData.symbol === 'DOWN' ? (
                          <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i> // Icon for 'down'
                        ) : null}
                        <span
                          className="font-semibold"
                          style={{
                            color:
                              tabData.symbol === 'UP'
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

                </div>
                <div className=" panel h-full    xl:col-span-2  firstbox ">
                  <div className="flex justify-between">
                    <div style={{ color: "#fff" }} className="ltr:mr-1 rtl:ml-1 text-md">{tabData?.prevLabel}</div>
                  </div>
                  <div className="flex items-center mt-2">
                    <div style={{ color: "#fff" }} className=" ltr:mr-3 rtl:ml-3 ">  {(selectedTab === 'Fuel Variance' || selectedTab === 'Fuel Delivery') ? capacity : currency}  {tabData?.prevMonth}</div>

                  </div>

                </div>
              </div>
            )

            }
            <div className="mt-3">

              <div className="overflow-x-auto">
                {stationId && selectedTab === 'Variance Accumulation' ? (
                  tabData?.listing.length > 0 ? (
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th className="p-3">Date</th>
                            <th className="p-3">Total Sales
                              <OverlayTrigger
                                placement="bottom"
                                overlay={<Tooltip className="custom-tooltip">
                                  (Fuel Sales + Lubes Sales + Incomes) - Expenses + Credit Sales
                                </Tooltip>}
                              >
                                <i
                                  style={{ fontSize: "20px", marginLeft: "5px" }}
                                  className="fi fi-sr-comment-info"
                                ></i>
                              </OverlayTrigger>
                            </th>
                            <th className="p-3">Fuel Sales</th>
                            <th className="p-3">Bank Deposited</th>
                            <th className="p-3">Previous Variance</th>
                            <th className="p-3">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tabData?.listing?.map((item, index) => (
                            <tr key={item?.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="p-3">{item?.date}</td>
                              <td className="p-3">{currency} {item?.total_sales}</td>
                              <td className="p-3">{currency} {item?.fuel_sales}</td>
                              <td className="p-3">{currency} {item?.cash_deposited}</td>
                              <td className="p-3">{currency} {item?.previous_variance}</td>
                              <td className="p-3">{currency} {item?.balance}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center p-5">
                      <img
                        src={noDataImage} // Use the imported image directly as the source
                        alt="no data found"
                        className="w-1/2 md:w-1/3 lg:w-1/4"
                      />
                    </div>
                  )
                ) : null}
              </div>



              {stationId && selectedTab !== 'Variance Accumulation' && (
                tabData?.listing?.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {tabData?.listing?.map((item, index) => (
                      <CollapsibleItem
                        selectedTab={selectedTab}
                        key={index}
                        id={`${currency}-${index}`}
                        title={item?.date}
                        subtitle={item?.amount}
                        isActive={activeAccordion === `${currency}-${index}`}
                        onToggle={() => handleToggle(`${currency}-${index}`, item?.date, selectedTab)}
                      >
                        {selectedTab === "Fuel Sales" ? (
                          <div className="overflow-x-auto">
                            {!considerNozzle ? (
                              <ul className="divide-y divide-gray-200 w-full min-w-[600px]">
                                <li className="flex justify-between p-2 bg-gray-200">
                                  <p className="font-semibold w-1/6">Name</p>
                                  <p className="font-semibold w-1/6">Price</p>
                                  <p className="font-semibold w-1/6">Volume</p>
                                  <p className="font-semibold w-1/6">Gross Value</p>
                                  <p className="font-semibold w-1/6">Discount</p>
                                  <p className="font-semibold w-1/6">Net Value</p>
                                </li>
                                {activeAccordion === `${currency}-${index}` && subData?.map((subItem, subIndex) => (
                                  <li key={subIndex} className="flex justify-between p-2 hover:bg-gray-100">
                                    <p className="w-1/6">{subItem?.name}</p>
                                    <p className="w-1/6">{currency} {subItem?.price}</p>
                                    <p className="w-1/6">{capacity}{subItem?.volume}</p>
                                    <p className="w-1/6">{currency} {subItem?.gross_value}</p>
                                    <p className="w-1/6">{currency} {subItem?.discount}</p>
                                    <p className="w-1/6">{currency} {subItem?.amount}</p>
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
                                                      {nozzle?.id == "0" ? `${nozzle?.price}` : `${currency} ${nozzle?.price}`}
                                                    </p>
                                                    <p className="w-1/6">{capacity}{nozzle?.volume}</p>
                                                    <p className="w-1/6">{currency} {nozzle?.gross_value}</p>
                                                    <p className="w-1/6">{currency} {nozzle?.discount}</p>
                                                    <p className="w-1/6">{currency} {nozzle?.amount} </p>
                                                  </li>
                                                ))}

                                              </div>

                                            </React.Fragment>

                                          ))}
                                          <li style={{ background: "#1c8b3359" }} key={fuelType} className="flex justify-between p-2 mt-2 mb-2 font-bold hover:bg-gray-100">
                                            <p className="w-1/6 ">{fuelType?.name} Total</p>
                                            <p className="w-1/6">

                                            </p>
                                            <p className="w-1/6">{capacity}{fuelType?.volume}</p>
                                            <p className="w-1/6">{currency} {fuelType?.gross_value}</p>
                                            <p className="w-1/6">{currency} {fuelType?.discount}</p>
                                            <p className="w-1/6">{currency} {fuelType?.amount} </p>
                                          </li>
                                        </div>


                                      </div>
                                    </div>
                                  </>
                                ))}

                              </ul>
                            )}
                          </div>






                        ) : selectedTab === "Lube Sales" ? (
                          <div className="overflow-x-auto">
                            <ul className="divide-y divide-gray-200 w-full min-w-[600px]">
                              <li className="flex flex-wrap justify-between p-2 bg-gray-200">
                                <p className="font-semibold w-1/5 min-w-[80px]">Name</p>
                                <p className="font-semibold w-1/5 min-w-[80px]">Size</p>
                                <p className="font-semibold w-1/5 min-w-[80px]">Opening</p>
                                <p className="font-semibold w-1/5 min-w-[80px]">Closing</p>
                                <p className="font-semibold w-1/5 min-w-[80px]">Sale Quantity</p>
                                <p className="font-semibold w-1/5 min-w-[80px]">Amount</p>
                              </li>
                              {activeAccordion === `${currency}-${index}` && subData?.map((subItem, subIndex) => (
                                <li key={subIndex} className="flex flex-wrap justify-between p-2 hover:bg-gray-100">
                                  <p className="w-1/5 min-w-[80px]">{subItem?.lubricant_name}</p>
                                  <p className="w-1/5 min-w-[80px]">{subItem?.lubricant_size}</p>
                                  <p className="w-1/5 min-w-[80px]">{currency} {subItem?.opening}</p>
                                  <p className="w-1/5 min-w-[80px]">{currency} {subItem?.closing}</p>
                                  <p className="w-1/5 min-w-[80px]">{subItem?.sale}</p>
                                  <p className="w-1/5 min-w-[80px]">{currency}{subItem?.sale_amount}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <ul className="divide-y divide-gray-200 w-full min-w-[400px]">
                              <li className="flex flex-wrap justify-between p-2 bg-gray-200">
                                <p className="font-semibold w-1/2 min-w-[150px]">Name</p>
                                <p className="font-semibold w-1/2 min-w-[150px]"> {selectedTab === 'Fuel Delivery' ? 'Delivery'
                                  : (selectedTab === 'Fuel Variance' ? 'Variance' : 'Amount')}
                                </p>
                              </li>
                              {activeAccordion === `${currency}-${index}` && subData?.map((subItem, subIndex) => (
                                <li key={subIndex} className="flex flex-wrap justify-between p-2 hover:bg-gray-100">
                                  <p className="w-1/2 min-w-[150px]">{subItem?.name}</p>
                                  <p className="w-1/2 min-w-[150px]">
                                    {selectedTab === 'Fuel Delivery'
                                      ? capacity + subItem?.delivery
                                      : (selectedTab !== 'Fuel Variance'
                                        ? currency + subItem?.amount
                                        : capacity + subItem?.variance)}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CollapsibleItem>
                    ))}
                  </ul>
                ) : (
                  <div className="flex justify-center items-center">
                    <img
                      src={noDataImage} // Use the imported image directly as the source
                      alt="no data found"
                      className="nodata-image"
                    />
                  </div>
                )
              )}



            </div>







          </div>
        </div>

      </div>
      {stationId && selectedTab !== 'Variance Accumulation' && (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-1 mb-6">
          <div className="xl:col-span-8 p-2">
            <div className="panel h-full">
              <div className="flex justify-between">
                <h5 className="font-bold text-lg dark:text-white-light">{selectedTab} Bar Graph Stats</h5>
                <hr />
              </div>
              <div style={{ padding: "10px" }}>
                <StatsBarChart
                  series={barData}
                  categories={dates}
                />
              </div>
            </div>
          </div>
          <div className="xl:col-span-4 p-2">
            <div className="panel h-full">
              <div className="flex justify-between">
                <h5 className="font-bold text-lg dark:text-white-light">{selectedTab} Pie Graph Stats</h5>
                <hr />
              </div>
              <div style={{ padding: "10px" }}>
                {/* <ReactApexChart
                        series={pieChart?.series}
                        options={pieChart?.options}
                        className="rounded-lg bg-white dark:bg-black overflow-hidden"
                        type="pie"
                        height={300}
                    /> */}

                <PieChart

                  data={salesByCategory}

                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
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


            <DashboardFilter
              getData={getData}
              isLoading={isLoading}
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
              showMonthInput={true}
              fullWidthButton={false}
              storedKeyName={DashboardstoredKeyName}
            />
          </div>

        </div>
      </div>
    )}
  </>;
};

export default withApiHandler(DashDataEntryStats);


