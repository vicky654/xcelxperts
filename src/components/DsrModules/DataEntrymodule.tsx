import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'tippy.js/dist/tippy.css';
import useErrorHandler from '../../hooks/useHandleError';
import { setPageTitle } from '../../store/themeConfigSlice';
import LoaderImg from '../../utils/Loader';
import withApiHandler from '../../utils/withApiHandler';
import CustomInput from './CustomInput';
import * as Yup from 'yup';
import { IRootState } from '../../store';
import { 
    FuelSales, FuelInventory, FuelDelivery, ShopSales, ChargesDeductions, CreditSales, Payment, CashBanking, Summary 
} from './CardComponents';

interface ManageSiteProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
}

interface RowData {
    id: string;
    full_name: string;
    role: string;
    addons: string;
    created_date: string;
    status: number;
    station_status: number;
    station_name: string;
    station: string;
    tank_name: string;
    fuel_name: string;
    station_code: string;
    station_address: string;
    storedKeyItems?: any;
    storedKeyName?: any;
}

interface CardData {
    id: string;
    name: string;
    bgColor: string;
}

interface ApiResponse {
    data: RowData[];
    cards: CardData[];
}

const DataEntrymodule: React.FC<ManageSiteProps> = ({ postData, getData, isLoading }) => {
    const [data, setData] = useState<RowData[]>([]);
    const [cards, setCards] = useState<CardData[]>([]);
    const dispatch = useDispatch();
    const handleApiError = useErrorHandler();
    const [selectedCardName, setSelectedCardName] = useState<string | null>(null);
    const navigate = useNavigate();
    const [tabs, setTabs] = useState('home');

    const toggleTabs = (name: string) => {
        setSelectedCardName(name);
    };

    const UserPermissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);
    const isNotClient = localStorage.getItem("superiorRole") !== "Client";
    let storedKeyItems = localStorage.getItem("stationTank") || '[]';
    let storedKeyName = "stationTank";

    const isAddPermissionAvailable = UserPermissions?.includes("tank-create");
    const isListPermissionAvailable = UserPermissions?.includes("tank-list");
    const isEditPermissionAvailable = UserPermissions?.includes("tank-edit");
    const isEditSettingPermissionAvailable = UserPermissions?.includes("tank-setting");
    const isDeletePermissionAvailable = UserPermissions?.includes("tank-delete");
    const isAssignAddPermissionAvailable = UserPermissions?.includes("tank-assign-permission");
    const isProfileUpdatePermissionAvailable = UserPermissions?.includes("profile-update-profile");
    const isUpdatePasswordPermissionAvailable = UserPermissions?.includes("profile-update-password");
    const isSettingsPermissionAvailable = UserPermissions?.includes("config-setting");

    useEffect(() => {
        const storedData = localStorage.getItem(storedKeyName);

        if (storedData) {
            handleApplyFilters(JSON.parse(storedData));
        }
        dispatch(setPageTitle('Alternative Pagination Table'));
    }, [dispatch]);

    const handleApplyFilters = async (values: any) => {
        try {
            const response = await getData(`/data-entry/cards?station_id=${values?.station_id}&drs_date=${values?.start_date}`);
            if (response && response.data && response.data.data) {
                setData(response.data?.data);
                setCards(response.data.data?.cards);
                console.log(response.data.data, "response.data.data");
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

    const componentMap: { [key: string]: React.ComponentType } = {
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

    return (
        <>
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
                <div className="grid xl:grid-cols-4 gap-6 mb-6">
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
                            onClose={() => {}}
                            showDateInput={true}
                            storedKeyName={storedKeyName}
                        />
                    </div>
                    <div className='panel h-full xl:col-span-3'>
                        <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Data Entry</h5>
                        </div>
                        <div>
                            <ul className="flex flex-wrap font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 overflow-y-auto">
                                {cards.map((card) => (
                                    <li key={card.id} className="w-1/5 inline-block">
                                        <button
                                            onClick={() => toggleTabs(card.name)}
                                            className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${selectedCardName === card.name ? '!border-primary text-primary' : ''}`}
                                            style={{ color: card.bgColor }}
                                        >
                                            <i className={`fi fi-rr-${card?.name.toLowerCase().replace(/\s/g, '-')}`}></i>
                                            {card?.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div>
                                {SelectedComponent ? <SelectedComponent /> : <div>Select a card to view details</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default withApiHandler(DataEntrymodule);
