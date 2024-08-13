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


        // Check for the existence of `start_month` or other necessary properties
        if (storedData.start_date && storedData.station_id) {
          handleApplyFilters(storedData);
        }
      } catch (error) {
        console.error("Error parsing stored data", error);
      }
    }
  }, [dispatch]);

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

    if (currentIndex === -1 || currentIndex === keys.length - 1) {
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
    setitemDeleted(true);

    // Reset the flag after a brief period (optional)
    setTimeout(() => setitemDeleted(false), 1000);
    try {
      const formData = new FormData();
      if (stationId && startDate) {
        formData.append('drs_date', startDate);
        formData.append('station_id', stationId);
      }

      const url = `data-entry/delete-data`;

      await customDelete(postData, url, formData, handleSuccess, "You will not be able to recover this item!", "Are you suredd?");
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



  return <>
    {isLoading && <LoaderImg />}
    <div className="flex justify-between items-center">
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
    </div>


    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-1 mb-6">
        <div className='panel h-full hidden md:block'>
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
            fullWidthButton={true}
            showDateInput={true}
            // showDateInput={true}
            storedKeyName={storedKeyName}
          />


          {SelectedComponent && isDeletePermissionAvailable ? (
            <>
              <hr className='m-2' />
              <div className='text-end'>
                <button className='btn btn-danger' style={{ width: "100%" }} onClick={handleDeleteDataEntry}>Delete Data
                </button>
              </div>
            </>
          ) : null}

        </div>

        <div className="md:hidden flex justify-end flex-col gap-4 flex-wrap">
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


        </div>

        <div className='panel h-full xl:col-span-3'>
          <div className="flex justify-between  mb-2">
            <h5 className="font-bold text-lg dark:text-white-light">{languageContent[currentLanguage].dataEntry}</h5>
        
            <div className="md:hidden flex ">
              <button type="button" className="btn btn-primary" onClick={() => setIsFilterModalOpen(true)}>
                Filter
              </button>
            </div>
            {/* <hr></hr> */}
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

      </div>
    </div>


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
              layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-1 gap-5"
              isOpen={false}
              onClose={() => { }}
              showDateInput={true}
              showMonthInput={false}
              storedKeyName={storedKeyName}
            />


            {SelectedComponent && isDeletePermissionAvailable ? (
              <>
                <hr className='m-2' />
                <div className='text-end'>
                  <button className='btn btn-danger' style={{ width: "100%" }} onClick={handleDeleteDataEntry}>Delete Data
                  </button>
                </div>
              </>
            ) : null}
          </div>

        </div>
      </div>
    )}
  </>;
};

export default withApiHandler(DataEntrymodule);
