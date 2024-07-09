import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'tippy.js/dist/tippy.css';
import useErrorHandler from '../../hooks/useHandleError';
import { setPageTitle } from '../../store/themeConfigSlice';
import LoaderImg from '../../utils/Loader';
import withApiHandler from '../../utils/withApiHandler';
import CustomInput from './CustomInput';
import * as Yup from 'yup';
import { IRootState } from '../../store';

import FuelSales from './DrsComponents/FuelSales';
import FuelInventory from './DrsComponents/FuelInventory';
import FuelDelivery from './DrsComponents/FuelDelivery';
import ShopSales from './DrsComponents/ShopSales';
import ChargesDeductions from './DrsComponents/ChargesDeductions';
import CreditSales from './DrsComponents/CreditSales';
import Payment from './DrsComponents/Payment';
import CashBanking from './DrsComponents/CashBanking';
import Summary from './DrsComponents/Summary';

interface ManageSiteProps {
  isLoading: boolean;
  getData: (url: string) => Promise<any>;
  postData: (url: string, body: any) => Promise<any>;
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
    dispatch(setPageTitle('Alternative Pagination Table'));
  }, [dispatch]);
  const componentMap: {
    [key: string]: React.ComponentType<{
      stationId: string | null;
      startDate: string | null;
      isLoading: boolean;
      getData: (url: string) => Promise<any>;
      postData: (url: string, body: any) => Promise<any>;
    }>
  } = {
    'Fuel Sales': FuelSales,
    'Fuel Inventory': FuelInventory,
    'Fuel Delivery': FuelDelivery,
    'Shop Sales': ShopSales,
    'Charges & Deductions': ChargesDeductions,
    'Credit Sales': CreditSales,
    'Payment': Payment,
    'Cash Banking': CashBanking,
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
          <span>Data Entry </span>
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
          <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
            <h5 className="font-semibold text-lg dark:text-white-light">Data Entry</h5>
            <hr></hr>
          </div>
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
              {SelectedComponent ? <SelectedComponent stationId={stationId} startDate={startDate} isLoading={isLoading} getData={getData} postData={postData} /> : <div>Select a card to view details</div>}
            </div>
          </div>
        </div>
        {/* <div className='panel h-full md:col-span-3 xl:col-span-3'>
          <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
            <h5 className="font-semibold text-lg dark:text-white-light">Data Entry</h5>
          </div>
          <ul className="flex flex-wrap font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 overflow-y-auto">
            {cards.map((card) => (
              <li
                key={card.id}
                onClick={() => toggleTabs(card.name)}
                className={`flexcenter dataentrytab ${selectedCardName === card.name ? 'activeTab' : ''}`}
                style={{ background: card.bgColor }}
              >
                <i className={`fi fi-rr-${card.name.toLowerCase().replace(/\s/g, '-')}`}></i>
                {card.name}
              </li>
            ))}
          </ul>
        </div> */}
        {/* <div className="panel h-full xl:col-span-4">
          {SelectedComponent ? (
            <SelectedComponent
              stationId={stationId}
              startDate={startDate}
              isLoading={isLoading}
              getData={getData}
              postData={postData}
            />
          ) : (
            <div>Select a card to view details</div>
          )}
        </div> */}
      </div>
    </div>
  </>;
};

export default withApiHandler(DataEntrymodule);
