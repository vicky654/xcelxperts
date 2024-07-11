import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import 'tippy.js/dist/tippy.css';
import useErrorHandler from '../../hooks/useHandleError';
import LoaderImg from '../../utils/Loader';
import withApiHandler from '../../utils/withApiHandler';
import CustomInput from './CustomInput';
import * as Yup from 'yup';

import noDataImage from '../../assets/noDataFoundImage/noDataFound.png';
import { currency } from '../../utils/CommonData';
import ReactApexChart from 'react-apexcharts';
import CollapsibleItem from '../../utils/CollapsibleItem';
import axios from 'axios';

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
  total: string;
  listing: { id: string; date: string; amount: string; variance: string; balance: string }[];
}

const DataEntryStatsComponent: React.FC<ManageSiteProps> = ({ postData, getData, isLoading }) => {
  const [data, setData] = useState([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('Varience-accumulation');
  const [subData, setSubData] = useState<any[]>([]);
  const [tabData, setTabData] = useState<TabData>({
    labels: [],
    data: [],
    total: '0.00',
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

  useEffect(() => {
    const storedData = localStorage.getItem(storedKeyName);
    if (storedData) {
      handleApplyFilters(JSON.parse(storedData));
    }

  }, [dispatch]);


  const staticTabs = [
    'Varience-accumulation',
    'Fuel Sales',
    'Charges',
    'Deductions',
    'Payments',
    'Credit Sales',



  ];
  const tabKeyMap: { [key: string]: string } = {
    'Varience-accumulation': 'varience-accumulation',
    'Fuel Sales': 'fuel-sales',
    'Charges': 'charges',
    'Deductions': 'deductions',
    'Payments': 'payments',
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
      const response = await getData(`/stats/varience-accumulation?station_id=${values?.station_id}&drs_date=${values?.start_date}`);
      if (response && response.data && response.data.data) {

        setStationId(values?.station_id);
        setStartDate(values?.start_date);
      } else {

        throw new Error('No data available in the response');
      }
    } catch (error) {

      handleApiError(error);
    }
  };




  const filterValues = async (values: any) => {
    console.log(values, "filterValues");
  };

  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    entity_id: Yup.string().required("Entity is required"),
    station_id: Yup.string().required('Station is required'),
    start_date: Yup.string().required('Date is required'),
  });




  const salesByCategory = tabData;
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const handleToggle = async (id: string, date: string, selectedTab: string) => {
    const isCurrentlyActive = activeAccordion === id;
    const newActiveAccordion = isCurrentlyActive ? null : id;
    setActiveAccordion(newActiveAccordion);

    // If the accordion is being opened, make the API call
    if (!isCurrentlyActive) {
      await GetSubData(date, selectedTab);
      // Log the ID to the console
      console.log(id, "handleToggle");
    }
  };
  const formatKey = (key: string) => key.replace(/\s+/g, '');
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
      const response = await getData(`/daily-stats/${formattedTab}?station_id=${stationId}&drs_date=${formattedDate}`);
      if (response && response.data && response.data.data) {
        setSubData(response.data?.data?.listing);
        console.log(response.data.data, "columnIndex");
      } else {

        throw new Error('No data available in the response');
      }
    } catch (error) {

      handleApiError(error);
    }
  };
  const pieChart: any = {
    series:salesByCategory?.data?.map(amount => parseFloat(amount)),
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
  return <>
    {isLoading && <LoaderImg />}
    <div className="flex justify-between items-center">
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link to="/" className="text-primary hover:underline">
            Dashboard
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>  Data Entry Stats </span>

          {/* {languageContent[currentLanguage as keyof typeof languageContent].dashboardLink} */}
        </li>
      </ul>
    </div>
   
    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 gap-6 mb-6">
        <div className='panel h-full '>
          <CustomInput
            getData={getData}
            isLoading={isLoading}
            onApplyFilters={handleApplyFilters}
            FilterValues={filterValues}
            showClientInput={true}
            showEntityInput={true}
            showStationInput={true}
            showStationValidation={true}
            validationSchema={validationSchemaForCustomInput}
            layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-1 gap-5"
            isOpen={false}
            onClose={() => { }}
            showDateInput={true}
            storedKeyName={storedKeyName}
          />


        </div>

        <div className='panel h-full xl:col-span-5'>
          <div className="flex justify-between  ">
            <h5 className="font-semibold text-lg dark:text-white-light">Data Entry Stats</h5>
            {/* <div className='Action-btns flex'>
              <button className='btn btn-primary' onClick={() => openUserAddonModal()}>View Stats</button>

            </div> */}
            <hr></hr>
          </div>
          {/* <div className='flex '>     <button className='ms-2  btn btn-primary' onClick={() => switchLanguage('english')}>English</button>
            <button className='ms-2 btn btn-primary' onClick={() => switchLanguage('hindi')}>हिंदी</button>
            <button className='ms-2 btn btn-primary' onClick={() => switchLanguage('punjabi')}>ਪੰਜਾਬੀ</button></div> */}
          <div>
            {startDate && stationId ? (
              <ul className="flex flex-wrap font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 overflow-y-auto">
                {staticTabs?.map((tabName) => (
                  <li key={tabName} className="w-1/8 inline-block" style={{ minWidth: "100px" }}>
                    <button
                      onClick={() => handleTabClick(tabName)}
                      className={`flex gap-2 border-b border-transparent hover:border-primary hover:text-primary ${selectedTab === tabName ? 'border-primary c-border-primary' : ''}`}
                      style={{ color: 'currentColor' }}
                    >
                      <i className={`fi fi-rr-${tabName.toLowerCase().replace(/\s/g, '-')}`}></i>
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
            {stationId && <h2 className="text-lg font-semibold">{selectedTab}</h2>}
            <div className="">
              {/* {stationId  && selectedTab !== 'Varience-accumulation' && (
                <ul className="divide-y divide-gray-200">
                  <li className="flex justify-between p-2 bg-gray-200">
                    <p className="font-semibold">Date</p>
                    <p className="font-semibold">Amount</p>
                  </li>
                  {tabData?.listing?.map((item, index) => (
                    <li key={index} className="flex justify-between py-2 hover:bg-gray-100">
                      <p className="font-semibold">{item?.date}</p>
                      <p>{currency} {item?.amount} </p>
                    </li>
                  ))}
                </ul>
              )} */}
              {stationId && selectedTab === 'Varience-accumulation' && (
                <ul className="divide-y divide-gray-200">
                  <li className="flex justify-between py-2 bg-gray-200">
                    <p className="font-semibold">Date</p>
                    <p className="font-semibold">Variance</p>
                    <p className="font-semibold">Balance</p>
                  </li>
                  {tabData?.listing?.map((item, index) => (
                    <li key={item?.id} className="flex justify-between py-2 hover:bg-gray-100">
                      <p>{item?.date}</p>
                      <p>{item?.variance}</p>
                      <p>{item?.balance}</p>
                    </li>
                  ))}
                </ul>
              )}

              {stationId && selectedTab !== 'Varience-accumulation' && (
                <ul className="divide-y divide-gray-200">
                  {tabData?.listing?.map((item, index) => (
                    <CollapsibleItem
                      key={index}
                      id={`${currency}-${index}`}
                      title={item?.date}
                      isActive={activeAccordion === `${currency}-${index}`}
                      onToggle={() => handleToggle(`${currency}-${index}`, item?.date, selectedTab)}
                    >
                      {activeAccordion === `${currency}-${index}` && subData?.map((subItem, subIndex) => (
                        <li key={subIndex} className="flex justify-between py-2 hover:bg-gray-100">
                          <p>{subItem?.name}</p>
                          <p>{currency} {subItem?.amount}</p>
                        </li>
                      ))}
                    </CollapsibleItem>
                  ))}
                </ul>
              )}
            </div>



            {stationId && selectedTab !== 'Varience-accumulation' && (
              <div className="panel h-full mt-4">
                <div className="flex items-center mb-5">
                  <h5 className="font-semibold text-lg dark:text-white-light"> {selectedTab} Graph Stats</h5>
                </div> 
                <div>
               
      <ReactApexChart series={pieChart.series} options={pieChart.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="pie" height={300} />
      {/* <ReactApexChart
                    series={salesByCategory?.data?.map(amount => parseFloat(amount))}
                    options={{
                      chart: {
                        type: 'donut',
                        height: 400,
                      },
                      labels: salesByCategory?.labels,
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
                      dataLabels: {
                        enabled: false,
                      },
                    }}
                    type="donut"
                    height={460}
                  /> */}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  </>;
};

export default withApiHandler(DataEntryStatsComponent);
