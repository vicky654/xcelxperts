import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import 'tippy.js/dist/tippy.css';
import useErrorHandler from '../../hooks/useHandleError';
import LoaderImg from '../../utils/Loader';
import withApiHandler from '../../utils/withApiHandler';
import CustomInput from './CustomInput';
import * as Yup from 'yup';
import noDataImage from '../../assets/AuthImages/noDataFound.png';
import { capacity, currency } from '../../utils/CommonData';
import ReactApexChart from 'react-apexcharts';
import CollapsibleItem from '../../utils/CollapsibleItem';
import StatsBarChart from './StatsBarChart';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import IconX from '../Icon/IconX';
import DashboardFilter from './DashboardFilter';
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
  prevLabel: string;
  prevMonth: string;
  profit: string;
  symbol: string;
  total: string;
  currentLabel: string;

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

const DataEntryStatsComponent: React.FC<ManageSiteProps> = ({ postData, getData, isLoading }) => {
  const [data, setData] = useState([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('Variance Accumulation');
  const [subData, setSubData] = useState<any[]>([]);
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

  const { id } = useParams();
  const keyName = id ? DashboardstoredKeyName : storedKeyName;
  useEffect(() => {

    const storedDataString = localStorage.getItem(keyName);


    if (storedDataString) {
      try {
        const storedData = JSON.parse(storedDataString);


        // Check for the existence of `start_month` or other necessary properties
        if (storedData.start_month) {

          handleApplyFilters(storedData);
        }
      } catch (error) {
        console.error("Error parsing stored data", error);
      }
    }
  }, [dispatch]);



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
    if (cards?.length > 0) {
      setSelectedCardName(cards[0]?.name);
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
      setFilters(values)
      const response = await getData(`/stats/variance-accumulation?station_id=${values?.station_id}&drs_date=${values?.start_month}`);
      if (response && response.data && response.data.data) {
        setSelectedTab("Variance Accumulation")
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

      // Check if formattedTab is 'digital-receipt' and send 'payments' instead
      const endpoint = formattedTab === 'digital-receipt' ? 'payments' : formattedTab;

      const response = await getData(`/daily-stats/${endpoint}?station_id=${stationId}&drs_date=${formattedDate}`);

      if (response && response.data && response.data.data) {
        setSubData(response.data?.data?.listing);
      } else {

        throw new Error('No data available in the response');
      }
    } catch (error) {

      handleApiError(error);
    }
  };
  const pieChart: any = {
    series: salesByCategory?.data?.map(amount => parseFloat(amount)),
    options: {
      chart: {
        height: 300,
        type: 'pie',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      labels: salesByCategory?.labels,
      colors: ['#4361ee', '#805dca', '#00ab55', '#e7515a', '#e2a03f'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
          },
        },
      ],
      stroke: {
        show: false,
      },
      legend: {
        position: 'bottom',
      },
    },
  };





  // State to store barData and dates
  const [barData, setBarData] = useState<ApexData[]>([]);
  const [dates, setDates] = useState<any[]>([]);
  const graphstaticTabs = ["Bar Chart", "Pie Chart"];
  const [graphselectedTab, graphsetSelectedTab] = useState(graphstaticTabs[0]);

  const handleGraphTabClick = (tabName: any) => {
    graphsetSelectedTab(tabName);
  };
  const [filters, setFilters] = useState<any>({
    client_id: localStorage.getItem('client_id') || '',
    company_id: localStorage.getItem('company_id') || '',
    site_id: localStorage.getItem('site_id') || '',
  });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const closeModal = () => {
    setIsFilterModalOpen(false);
  }

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
              {filters?.start_date && (
                <div className="badge bg-gray-600 flex items-center gap-2 px-2 py-1 ">
                  <span className="font-semibold"> Date :</span> {filters?.start_date}
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


        {/* {modalOpen && (
<>
<DashboardFilterModal
    isOpen={modalOpen}
    onClose={() => setModalOpen(false)}
    onApplyFilters={handleApplyFilters} // Pass the handler to the modal
/>
</>
)} */}
      </div>
    </div>



    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-1 mb-6">
        {/* <div className='panel h-full hidden md:block'>
          <CustomInput
            getData={getData}
            isLoading={isLoading}
            onApplyFilters={handleApplyFilters}

            showClientInput={true}
            showEntityInput={true}
            showStationInput={true}
            showStationValidation={true}
            validationSchema={validationSchemaForCustomInput}
            layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-1 gap-5"
            isOpen={false}
            onClose={() => { }}
            showDateInput={false}
            showMonthInput={true}
            storedKeyName={storedKeyName}
          />


        </div> */}

        {/* 
        <div className=" flex justify-end flex-col gap-4 flex-wrap">
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
                    <span className="font-semibold">Month :</span> {filters?.start_month}
                  </div>
                )}
              </div>
            </>
          ) : (
            ''
          )}


        </div> */}

        <div className='panel h-full col-span-4'>
          <div className="flex justify-between  ">
            <h5 className="font-bold text-lg dark:text-white-light">Data Entry Stats</h5>
            {/* <div className=" flex ">
              <button type="button" className="btn btn-primary" onClick={() => setIsFilterModalOpen(true)}>
                Filter
              </button>
            </div> */}
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



                      style={{ color: 'currentColor' }}
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

            {stationId && selectedTab !== 'Variance Accumulation' && (

              <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-1 mb-6'>
                <div className="panel h-full  xl:col-span-2  firstbox ">
                  <div className="flex justify-between">
                    <div style={{ color: "#fff" }} className="ltr:mr-1 rtl:ml-1 text-md font-semibold">{tabData?.currentLabel}</div>

                  </div>
                  <div className="flex items-center mt-2">

                    <div style={{ color: "#fff" }} className="font-bold  text-3xl ltr:mr-3 rtl:ml-3">
                      {(selectedTab === 'Fuel Variance' || selectedTab === 'Fuel Delivery') ? capacity : currency} {tabData?.currentMonth}
                    </div>


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
                <div className="panel h-full  xl:col-span-2 firstbox ">
                  <div className="flex justify-between">
                    <div style={{ color: "#fff" }} className="ltr:mr-1 rtl:ml-1 text-md font-semibold">{tabData?.prevLabel}</div>
                  </div>
                  <div className="flex items-center mt-2">
                    <div style={{ color: "#fff" }} className="text-3xl font-bold ltr:mr-3 rtl:ml-3 ">  {(selectedTab === 'Fuel Variance' || selectedTab === 'Fuel Delivery') ? capacity : currency}  {tabData?.prevMonth} </div>

                  </div>

                </div>
              </div>
            )

            }
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
                              (Fuel Sales + Lubes Sales + Incomes ) - Expenses + Credit Sales
                            </Tooltip>}>
                              <i style={{ fontSize: "20px" }} className="fi fi-sr-comment-info ml-1"></i>
                            </OverlayTrigger>
                          </th>
                          <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/6">Fuel Sales</th>
                          <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/6">Cash Deposited</th>
                          <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/6">Previous Variance</th>
                          <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-1/6">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tabData?.listing?.map((item) => (
                          <tr key={item?.id} className="hover:bg-gray-100">
                            <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500 w-1/6">{item?.date}</td>
                            <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500 w-1/6">{currency} {item?.total_sales}</td>
                            <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500 w-1/6">{currency} {item?.fuel_sales}</td>
                            <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500 w-1/6">{currency} {item?.cash_deposited}</td>
                            <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500 w-1/6">{currency} {item?.previous_variance}</td>
                            <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500 w-1/6">{currency} {item?.balance}</td>
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
                tabData?.listing?.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {tabData?.listing?.map((item, index) => (
                      <CollapsibleItem
                        key={index}
                        id={`${currency}-${index}`}
                        title={item?.date}
                        selectedTab={selectedTab}
                        subtitle={item?.amount}
                        isActive={activeAccordion === `${currency}-${index}`}
                        onToggle={() => handleToggle(`${currency}-${index}`, item?.date, selectedTab)}
                      >
                        {selectedTab === "Fuel Sales" ? (
                          <div className="overflow-x-auto">
                            <ul className="divide-y divide-gray-200 w-full min-w-[600px]">
                              <li className="flex justify-between p-2 bg-gray-200">
                                <p className="font-semibold w-1/6">Name</p>
                                <p className="font-semibold w-1/6">Price</p>
                                <p className="font-semibold w-1/6">Volume</p>
                                <p className="font-semibold w-1/6">Gross Value</p>
                                <p className="font-semibold w-1/6">Discount</p>
                                <p className="font-semibold w-1/6">Balance</p>
                              </li>
                              {activeAccordion === `${currency}-${index}` && subData?.map((subItem, subIndex) => (
                                <li key={subIndex} className="flex justify-between p-2 hover:bg-gray-100">
                                  <p className="w-1/6">{subItem?.name}</p>
                                  <p className="w-1/6">{currency} {subItem?.price}</p>
                                  <p className="w-1/6">{subItem?.volume}</p>
                                  <p className="w-1/6">{currency} {subItem?.gross_value}</p>
                                  <p className="w-1/6">{currency} {subItem?.discount}</p>
                                  <p className="w-1/6">{currency} {subItem?.amount}</p>
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
                              </li>
                              {activeAccordion === `${currency}-${index}` && subData?.map((subItem, subIndex) => (
                                <li key={subIndex} className="flex justify-between p-2 hover:bg-gray-100">
                                  <p className="w-1/5">{subItem?.lubricant_name}</p>
                                  <p className="w-1/5">{subItem?.lubricant_size}</p>
                                  <p className="w-1/5">{currency} {subItem?.opening}</p>
                                  <p className="w-1/5">{currency} {subItem?.closing}</p>
                                  <p className="w-1/5">{subItem?.sale}</p>
                                  <p className="w-1/5">{currency}{subItem?.sale_amount}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <ul className="divide-y divide-gray-200 w-full min-w-[400px]">
                              <li className="flex justify-between p-2 bg-gray-200">
                                <p className="font-semibold w-1/2">Name</p>
                                <p className="font-semibold w-1/2">
                                  {selectedTab === 'Fuel Delivery' ? 'Delivery'
                                    : (selectedTab === 'Fuel Variance' ? 'Variance' : 'Amount')}
                                </p>

                              </li>
                              {activeAccordion === `${currency}-${index}` && subData?.map((subItem, subIndex) => (
                                <li key={subIndex} className="flex justify-between p-2 hover:bg-gray-100">
                                  <p className="w-1/2">{subItem?.name}</p>
                                  <p className="w-1/2">
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
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-1 mb-6">


          <div className='panel h-full xl:col-span-3'>
            <div className="flex justify-between  ">
              <h5 className="font-bold text-lg dark:text-white-light">{selectedTab} Graph Stats</h5>


              <hr></hr>
            </div>

            <div className="p-2" style={{ padding: "10px" }}>


              <>
                <ul className="flex flex-wrap font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 overflow-y-auto">
                  {graphstaticTabs.map((tabName) => (
                    <li key={tabName} className="w-1/8 inline-block" style={{ minWidth: "100px" }}>
                      <button
                        onClick={() => handleGraphTabClick(tabName)}
                        className={`
                    flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary 
                    ${graphselectedTab === tabName ? 'border-primary c-border-primary bg-gray-200 dark:bg-gray-700' : ''}`}
                        style={{ color: 'currentColor' }}
                      >

                        {tabName}
                      </button>
                    </li>
                  ))}
                </ul>
                {graphselectedTab === "Bar Chart" && (
                  <div>


                    <StatsBarChart
                      series={barData}
                      categories={dates}
                    // title="Financial Overview"
                    // subtitle="Monthly Data"
                    // yaxisTitle="Values (in thousands)"
                    />
                  </div>
                )}
                {graphselectedTab === "Pie Chart" && (
                  <div>

                    <ReactApexChart
                      series={pieChart?.series}
                      options={pieChart?.options}
                      className="rounded-lg bg-white dark:bg-black overflow-hidden"
                      type="pie"
                      height={300}
                    />
                  </div>
                )}</>
            </div>
          </div>

        </div>
      )}
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


            {id ? (
              <DashboardFilter
                getData={getData}
                isLoading={isLoading}
                onApplyFilters={handleApplyFilters}
                showClientInput={true}
                showEntityInput={true}
                showStationInput={true}
                showStationValidation={true}
                validationSchema={validationSchemaForCustomInput}
                layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-1 gap-5"
                isOpen={false}
                onClose={() => { }}
                showDateInput={false}
                showMonthInput={true}
                storedKeyName={storedKeyName}
              />
            ) : (
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
                showMonthInput={true}
                storedKeyName={storedKeyName}
              />
            )}
          </div>

        </div>
      </div>
    )}
  </>;
};

export default withApiHandler(DataEntryStatsComponent);
