import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'tippy.js/dist/tippy.css';
import useErrorHandler from '../../hooks/useHandleError';
import LoaderImg from '../../utils/Loader';
import withApiHandler from '../../utils/withApiHandler';
import CustomInput from './CustomInput';
import * as Yup from 'yup';
import noDataImage from '../../assets/noDataFoundImage/noDataFound.png';
import FuelSales from './DrsComponents/FuelSales';
import FuelInventory from './DrsComponents/FuelInventory';
import FuelDelivery from './DrsComponents/FuelDelivery';
import ShopSales from './DrsComponents/ShopSales';
import ChargesDeductions from './DrsComponents/ChargesDeductions';
import CreditSales from './DrsComponents/CreditSales';
import Payment from './DrsComponents/Payment';
import CashBanking from './DrsComponents/CashBanking';
import Summary from './DrsComponents/Summary';
import { languageContent } from '../../utils/Languages/LanguageTextComponent';
import DataEntryStats from './DataEntryStats';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IRootState } from '../../store';
import useCustomDelete from '../../utils/customDelete';


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
    const storedData = localStorage.getItem(storedKeyName);
    if (storedData) {
      handleApplyFilters(JSON.parse(storedData));
    }

  }, [dispatch]);
  const UserPermissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);

  const isDeletePermissionAvailable = UserPermissions?.includes('dataentry-delete-data');
  const componentMap: {
    [key: string]: React.ComponentType<{
      stationId: string | null;
      startDate: string | null;
      isLoading: boolean;
      getData: (url: string) => Promise<any>;
      postData: (url: string, body: any) => Promise<any>;
      applyFilters: (values: any) => Promise<void>;
    }>
  } = {
    'Fuel Sales': FuelSales,
    'Fuel Inventory': FuelInventory,
    'Fuel Delivery': FuelDelivery,
    // 'Shop Sales': ShopSales,
    'Lubes Sales': ShopSales,
    'Income & Expenses': ChargesDeductions,
    'Credit Sales': CreditSales,
    'Payments': Payment,
    'Cash Deposited': CashBanking,
    'Summary': Summary,
  };

  const SelectedComponent = selectedCardName ? componentMap[selectedCardName] : null;
  const handleApplyFilters = async (values: any) => {
    try {
      const response = await getData(`/data-entry/cards?station_id=${values?.station_id}&drs_date=${values?.start_date}`);
      if (response && response.data && response.data.data) {
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
  const handleApplyFilterss = async (values: any) => {
  

    try {
        // Simulate an API call with a dummy response
        const response = {
            data: {
                message: "Dummy response data",
                values: values,
            }
        };

    
    } catch (error) {
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
      handleApplyFilters(values);
    }
  };


  const handleDeleteDataEntry = async () => {
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
  //   const handleDeleteDataEntry = async () => {
  //     try {
  //       const formData = new FormData();
  // if (stationId && startDate) {
  //         formData.append('drs_date', startDate);
  //         formData.append('station_id', stationId);
  //       }

  //       const url = `data-entry/delete-data`;

  //       const isSuccess = await postData(url, formData);
  //       if (isSuccess) {
  //         if (stationId && startDate) {
  //           // handleApplyFilters(formik?.values);
  //         }
  //       }
  //     } catch (error) {
  //       handleApiError(error);
  //     }
  //   };


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
  useEffect(() => {
    // Select the first card by default if cards have data
    if (cards.length > 0) {
      setSelectedCardName(cards[0].name);
    }
  }, [cards]);
  const openUserAddonModal = () => {
    setIsUserAddonModalOpen(true);

  };
  const closeUserAddonModal = () => {
    setIsUserAddonModalOpen(false);
  };
  return <>
    {isLoading && <LoaderImg />}
    <div className="flex justify-between items-center">
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link to="/" className="text-primary hover:underline">
            {languageContent[currentLanguage].dashboardLink}
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>  {languageContent[currentLanguage].dataEntry} </span>

          {/* {languageContent[currentLanguage as keyof typeof languageContent].dashboardLink} */}
        </li>
      </ul>
    </div>
    <DataEntryStats getData={getData} isOpen={isUserAddonModalOpen} onClose={closeUserAddonModal} startDate={startDate} stationId={stationId} />

    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
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
            fullWidthButton={true}
            showDateInput={true}
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

        <div className='panel h-full xl:col-span-3'>
          <div className="flex justify-between  ">
            <h5 className="font-semibold text-lg dark:text-white-light">{languageContent[currentLanguage].dataEntry}</h5>
            {/* <div className='Action-btns flex'>
              <button className='btn btn-primary' onClick={() => openUserAddonModal()}>View Stats</button>

            </div> */}
            <hr></hr>
          </div>
          {/* <div className='flex '>     <button className='ms-2  btn btn-primary' onClick={() => switchLanguage('english')}>English</button>
            <button className='ms-2 btn btn-primary' onClick={() => switchLanguage('hindi')}>हिंदी</button>
            <button className='ms-2 btn btn-primary' onClick={() => switchLanguage('punjabi')}>ਪੰਜਾਬੀ</button></div> */}
          <div>
            <ul className="flex flex-wrap font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 overflow-y-auto">
              {cards?.map((card) => (
                <li key={card.id} className="w-1/8 inline-block">
                  <button
                    onClick={() => toggleTabs(card.name)}
                    className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${selectedCardName == card.name ? 'border-primary c-border-primary' : ''}`}
                    style={{ color: card.bgColor }}
                  >
                    <i className={`fi fi-rr-${card?.name.toLowerCase().replace(/\s/g, '-')}`}></i>
                    {card?.name}
                  </button>
                </li>
              ))}
            </ul>
            <div>
              {SelectedComponent ? <SelectedComponent applyFilters={handleApplyFilters} stationId={stationId} startDate={startDate} isLoading={isLoading} getData={getData} postData={postData} /> : <div>   <img
                src={noDataImage} // Use the imported image directly as the source
                alt="no data found"
                className="all-center-flex nodata-image"
              /></div>}
            </div>
          </div>
        </div>

      </div>
    </div>
  </>;
};

export default withApiHandler(DataEntrymodule);
