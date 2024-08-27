import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'tippy.js/dist/tippy.css';
import useErrorHandler from '../../hooks/useHandleError';
import LoaderImg from '../../utils/Loader';
import withApiHandler from '../../utils/withApiHandler';
import CustomInput from './CustomInput';
import * as Yup from 'yup';
import noDataImage from '../../assets/AuthImages/noDataFound.png';
import FuelSales from './DrsComponents/FuelSales';
import FuelDelivery from './DrsComponents/FuelDelivery';
import ShopSales from './DrsComponents/ShopSales';
import ChargesDeductions from './DrsComponents/ChargesDeductions';
import CreditSales from './DrsComponents/CreditSales';
import Payment from './DrsComponents/Payment';
import CashBanking from './DrsComponents/CashBanking';
import Summary from './DrsComponents/Summary';
import { languageContent } from '../../utils/Languages/LanguageTextComponent';
import { IRootState } from '../../store';
import useCustomDelete from '../../utils/customDelete';
import IconX from '../Icon/IconX';
import Tippy from '@tippyjs/react';
import IconRefresh from '../Icon/IconRefresh';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment';


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

const DataEntrymodule: React.FC<ManageSiteProps> = ({ postData, getData, isLoading }) => {
  const [data, setData] = useState([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const dispatch = useDispatch();
  const handleApiError = useErrorHandler();
  const [currentLanguage, setCurrentLanguage] = useState('english'); // Default language
  const [isUserAddonModalOpen, setIsUserAddonModalOpen] = useState(false);
  const [itemDeleted, setitemDeleted] = useState(false);
  const [selectedCardName, setSelectedCardName] = useState<string | null>(null);
  const [stationId, setStationId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);

  const toggleTabs = (name: string) => {
    // setSelectedCardName(name === selectedCardName ? null : name); // Toggle tab selection
    setSelectedCardName(name === selectedCardName ? selectedCardName : name); // Toggle tab selection
  };

  const isNotClient = localStorage.getItem("superiorRole") !== "Client";
  const storedKeyName = "stationTank";

  useEffect(() => {
    const storedDataString = localStorage.getItem(storedKeyName);

    if (storedDataString) {
      try {
        const storedData = JSON.parse(storedDataString);

        // Get the current date in 'YYYY-MM-DD' format
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Format month as 'MM'
        const day = now.getDate().toString().padStart(2, '0'); // Format day as 'DD'
        const currentDate = `${year}-${month}-${day}`;

        // Check if station_id is present
        if (storedData.station_id) {
          // Set start_date to the current date if it's missing
          if (!storedData.start_date) {
            storedData.start_date = currentDate;
          }


          handleApplyFilters(storedData);
        }
      } catch (error) {
        console.error("Failed to parse stored data:", error);
      }
    }
  }, [dispatch]);




  // useEffect(() => {
  //   const storedDataString = localStorage.getItem(storedKeyName);
  //   console.log(storedDataString, "storedDataString");

  //   if (storedDataString) {
  //     try {
  //       const storedData = JSON.parse(storedDataString);
  //       if (storedData.start_date && storedData.station_id) {
  //         handleApplyFilters(storedData);
  //       }
  //     } catch (error) {

  //     }
  //   }
  // }, [dispatch]);

  const UserPermissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);

  const isDeletePermissionAvailable = UserPermissions?.includes('dataentry-delete-data');
  const componentMap: {
    [key: string]: React.ComponentType<{
      stationId: string | null;
      startDate: string | null;
      isLoading: boolean;
      itemDeleted?: boolean;
      getData: (url: string) => Promise<any>;
      postData: (url: string, body: any) => Promise<any>;
      applyFilters: (values: any) => Promise<void>;

    }>
  } = {
    'Fuel Sales': FuelSales,
    'Fuel Stock': FuelDelivery,
    'Lubes Sales': ShopSales,
    'Extra Income & Expenses': ChargesDeductions,
    'Credit Sales': CreditSales,
    'Digital Receipt': Payment,
    'Bank Deposited': CashBanking,
    'Summary': Summary,


  };
  function getNextComponentName(currentName: string): string | null {
    const keys = Object.keys(componentMap);
    const currentIndex = keys.indexOf(currentName);

    if (currentIndex === -1 || currentIndex === keys?.length - 1) {
      // If the current name is not found or it is the last item in the array
      return null;
    }

    return keys[currentIndex + 1];
  }

  const SelectedComponent = selectedCardName ? componentMap[selectedCardName] : null;
  const handleApplyFilters = async (values: any) => {
    try {
      setFilters(values)
      const response = await getData(`/data-entry/cards?station_id=${values?.station_id}&drs_date=${values?.start_date}`);
      if (response && response.data && response.data.data) {
        setData(response.data?.data);
        setSelectedCardName(response.data.data?.cards[0].name);
        setCards(response.data.data?.cards);
        setStationId(values?.station_id);
        setStartDate(values?.start_date);
        setIsFilterModalOpen(false)
      } else {
        setData([])
        setCards([])
        setSelectedCardName(null)
        throw new Error('No data available in the response');
      }
    } catch (error) {
      setData([])
      setCards([])
      setSelectedCardName(null)
      handleApiError(error);
    }
  };
  const ApplyFilterNext = async (values: any) => {
    try {
      const response = await getData(`/data-entry/cards?station_id=${values?.station_id}&drs_date=${values?.start_date}`);
      if (response && response.data && response.data.data) {

        const nextComponentName = getNextComponentName(values?.selectedCardName);
        if (nextComponentName) {

          toggleTabs(nextComponentName);
        }
        setData(response.data?.data);
        setCards(response.data.data?.cards);
        setStationId(values?.station_id);
        setStartDate(values?.start_date);
      } else {
        setData([])
        setCards([])
        setSelectedCardName(null)
        throw new Error('No data available in the response');
      }
    } catch (error) {
      setData([])
      setCards([])
      setSelectedCardName(null)
      handleApiError(error);
    }
  };


  const { customDelete } = useCustomDelete();
  const handleSuccess = () => {
    if (stationId && startDate) {
      const values = {
        station_id: stationId,
        start_date: startDate
      };
      setitemDeleted(true)
      handleApplyFilters(values);
    }

  };


  const handleDeleteDataEntry = async () => {
    // setitemDeleted(true);
    // setTimeout(() => setitemDeleted(false), 1000);
    try {
      const formData = new FormData();
      if (stationId && startDate) {
        formData.append('drs_date', startDate);
        formData.append('station_id', stationId);
      }

      const url = `data-entry/delete-data`;

      await customDelete(postData, url, formData, handleSuccess, "You will not be able to recover this item!", "Are you sure?");
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
    start_date: Yup.string().required('Date is required'),
  });
  // useEffect(() => {
  //   // Select the first card by default if cards have data
  //   if (cards.length > 0) {
  //     setSelectedCardName(cards[0].name);
  //   }
  // }, [cards]);

  const closeUserAddonModal = () => {
    setIsUserAddonModalOpen(false);
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


  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const updateDateInLocalStorage = (increment: number): void => {
    const storedDataString = localStorage.getItem('stationTank');

    if (!storedDataString) {
      console.error("No data found in local storage for key 'stationTank'");
      return;
    }

    let storedData: { start_date?: string } = JSON.parse(storedDataString);
    const currentDate = new Date();

    if (storedData?.start_date) {
      const startDate = new Date(storedData.start_date);
      startDate.setDate(startDate.getDate() + increment);
      storedData.start_date = formatDate(startDate); // Update start_date
    } else {
      // If start_date does not exist, set it to the current date
      storedData.start_date = formatDate(currentDate);
    }

    // Update the local storage with the modified data
    localStorage.setItem('stationTank', JSON.stringify(storedData));


    handleApplyFilters(storedData)
  };

  const handleLeftClick = (): void => {
    updateDateInLocalStorage(-1);
  };

  const handleRightClick = (): void => {
    updateDateInLocalStorage(1);
  };


  return <>
    {isLoading && <LoaderImg />}
    <div className="flexspacebetween ">

      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link to="/dashboard" className="text-primary hover:underline">
            {languageContent[currentLanguage].dashboardLink}
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>  {languageContent[currentLanguage].dataEntry} </span>

          {/* {languageContent[currentLanguage as keyof typeof languageContent].dashboardLink} */}
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
        {SelectedComponent && isDeletePermissionAvailable ? (
          <>
            <button onClick={handleDeleteDataEntry}>
              <div className="grid place-content-center w-16 h-10 border border-white-dark/20 dark:border-[#191e3a] ">
                <Tippy content="Delete Data">
                  <span className="btn bg-danger btn-danger">
                    {/* <IconRefresh className="w-6 h-6" /> */}
                    <i className="icon-setting delete-icon fi fi-rr-trash-xmark"></i>
                  </span>
                </Tippy>
              </div>
            </button>
          </>
        ) : null}


      </div>
    </div>


    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-1 mb-6">




        <div className='panel h-full col-span-3'>
          <div className="flex justify-between  mb-2">
            <h5 className="font-bold flex text-lg dark:text-white-light w-100">

              <div className=' flex justify-between w-100'>
                <div>
                  {languageContent[currentLanguage].dataEntry}  {languageContent[currentLanguage].dataEntry && (
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip className='custom-tooltip p-3' id="tooltip-amount" style={{ lineHeight: "30px" }}>
                          <i className="fi fi-ts-arrow-right"></i> Use right arrow to go right
                          <br></br>
                          <hr></hr>
                          <i className="fi fi-ts-arrow-left"></i>   Use left arrow to go left     <br></br>    <hr></hr>
                          <i className="fi fi-ts-arrow-up"></i>  Use up arrow to go up     <br></br>    <hr></hr>
                          <i className="fi fi-ts-arrow-down"></i>   Use down arrow to go down
                          <br></br>    <hr></hr>

                          <span className='mt-1  px-2' style={{ border: "1px solid #fff" }}>Enter</span>  Form will submit on the submission of Enter Key
                        </Tooltip>
                      }
                    >
                      <span className=''> <i style={{ lineHeight: "10px", fontSize: "20px" }} className="fi fi-ts-keyboard"></i></span>
                    </OverlayTrigger>
                  )}
                </div>


                <>
                  {filters?.client_id && filters?.entity_id && filters?.station_id && filters?.start_date && (
                    <>
                      <div className=' flex'>
                        <span onClick={handleLeftClick}>

                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip className='custom-tooltip p-3' id="tooltip-amount" style={{ lineHeight: "30px" }}>
                                <>
                                  Go To  {moment(filters?.start_date).subtract(1, 'day').format('YYYY-MM-DD')} Day
                                </>
                              </Tooltip>
                            }
                          >
                            <button
                              className={`flex pointer p-2 border-b border-transparent hover:border-primary hover:text-primary `}                  >
                              <i className="fi fi-br-angle-left"></i>
                            </button>
                          </OverlayTrigger>

                        </span>
                        <span onClick={handleRightClick}>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip className='custom-tooltip p-3' id="tooltip-amount" style={{ lineHeight: "30px" }}>
                                <>
                                  Go To {moment(filters?.start_date).add(1, 'day').format('YYYY-MM-DD')}  Day
                                </>
                              </Tooltip>
                            }
                          >
                            <button
                              className={`flex pointer p-2 border-b border-transparent hover:border-primary hover:text-primary `}                  >
                              <i className="fi fi-br-angle-right"></i>
                            </button>
                          </OverlayTrigger>
                        </span>
                      </div>
                    </>
                  )}

                </>



              </div>
            </h5>
          </div>
          <div>
            <ul className="flex flex-wrap font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 overflow-y-auto">
              {cards?.map((card) => (
                <li key={card.id} className="w-1/8 inline-block">
                  <button
                    onClick={() => toggleTabs(card.name)}
                    className={`flex  p-2 border-b border-transparent hover:border-primary hover:text-primary ${selectedCardName == card.name ? 'border-primary c-border-primary bg-gray-200' : ''}`}
                    style={{ color: card.bgColor }}
                  >
                    <i className={`fi fi-rr-${card?.name.toLowerCase().replace(/\s/g, '-')}`}></i>
                    {card?.name}
                  </button>
                </li>
              ))}
            </ul>
            <div>
              {SelectedComponent ? <SelectedComponent applyFilters={ApplyFilterNext} stationId={stationId} itemDeleted={itemDeleted} startDate={startDate} isLoading={isLoading} getData={getData} postData={postData} /> : <div>   <img
                src={noDataImage} // Use the imported image directly as the source
                alt="no data found"
                className="all-center-flex nodata-image"
              /></div>}
            </div>
          </div>
        </div>

      </div >
    </div >


    {isFilterModalOpen && (
      <div className="modal fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white w-full max-w-md m-6">
          <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
            <h5 className="text-lg font-bold">
              Filter
            </h5>
            <button onClick={closeModal} type="button" className="text-white-dark hover:text-dark">
              <IconX />
            </button>
          </div>
          <div className='p-6 pt-0'>
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
              showDateInput={true}
              showMonthInput={false}
              fullWidthButton={false}
              storedKeyName={storedKeyName}
            />


            {/* {SelectedComponent && isDeletePermissionAvailable ? (
              <>
                <hr className='m-2' />
                <div className='text-end'>
                  <button className='btn btn-danger' style={{ width: "100%" }} onClick={handleDeleteDataEntry}>Delete Data
                  </button>
                </div>
              </>
            ) : null} */}
          </div>
        </div>
      </div>
    )}
  </>;
};

export default withApiHandler(DataEntrymodule);
