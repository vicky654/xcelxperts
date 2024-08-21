import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import 'tippy.js/dist/tippy.css';
import noDataImage from '../../assets/AuthImages/noDataFound.png'; // Import the image
import useErrorHandler from '../../hooks/useHandleError';
import { setPageTitle } from '../../store/themeConfigSlice';
import LoaderImg from '../../utils/Loader';
import CustomInput from '../ManageStationTank/CustomInput';
import AddEditStationFuelPurchaseModal from './AddEditStationFuelPurchaseModal';
import { Formik, Form, Field, FieldArray, FieldProps } from 'formik';
import * as Yup from 'yup';
import { IRootState } from '../../store';
import IconX from '../Icon/IconX';
import { currency } from '../../utils/CommonData';
import { CommonDataEntryProps } from '../commonInterfaces';
import withApiHandler from '../../utils/withApiHandler';
import { FormGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { MultiSelect } from 'react-multi-select-component';
import showMessage from '../../hooks/showMessage';

interface FuelDeliveryData {
    id: string;
    fuel_name: string;
    tank_name: string;
    platts_price: number;
    opening: number;
    delivery_volume: number;
    sales_volume: number;
    ex_vat_price: number;
    vat_percentage_rate: number;
    total: number;
    book_stock: number;
    dips_stock: number;
    variance: number;
    update_opening: boolean;
    update_delivery_volume: boolean;
    update_sales_volume: boolean;
    update_book_stock: boolean;
    update_dips_stock: boolean;
    update_variance: boolean;
}

interface FormValues {
    data: FuelDeliveryData[];
}
interface ManageStationFuelPurchaseProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
}
const ManageStationFuelPurchase: React.FC<ManageStationFuelPurchaseProps> = ({ postData, getData, isLoading }) => {
    const [data, setData] = useState<FuelDeliveryData[]>([]);
    const [isEditable, setIsEditable] = useState(true);
    const [stationData, setstationData] = useState<any>();
    const dispatch = useDispatch();
    const handleApiError = useErrorHandler();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserData, setEditUserData] = useState<Partial<FuelDeliveryData> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
    let storedKeyName = "stationTank";

    const UserPermissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);

    const isAddPermissionAvailable = UserPermissions?.includes("fuel-purchase-add");
    const isListPermissionAvailable = UserPermissions?.includes("fuel-purchase-list");
    const isEditPermissionAvailable = UserPermissions?.includes("fuel-purchase-update");
    const isEditSettingPermissionAvailable = UserPermissions?.includes("fuel-purchase-setting");
    const isDeletePermissionAvailable = UserPermissions?.includes("fuel-purchase-delete");
    const isAssignAddPermissionAvailable = UserPermissions?.includes("fuel-purchase-assign-permission");


    const anyPermissionAvailable = isEditPermissionAvailable || isDeletePermissionAvailable;
    const [selected, setSelected] = useState<any>([]);
    useEffect(() => {
        const storedData = localStorage.getItem(storedKeyName);
        if (storedData) {
            setstationData(JSON.parse(storedData));
            handleApplyFilters(JSON.parse(storedData));
        }
        dispatch(setPageTitle('Alternative Pagination Table'));
    }, [dispatch, currentPage]);

    const handleApplyFilters = async (values: any) => {

  
        setSelected([])
        setData([])
        setstationData(values);
        const apiURL = `station/fuel/purchase-price?client_id=${values?.client_id}&entity_id=${values?.entity_id}&station_id=${values?.station_id}&date=${values?.start_date}`;
        try {
            const response = await getData(apiURL);
            if (response && response.data && response.data.data) {
                
                setData(response.data.data);
                // setIsFilterModalOpen(false);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleFieldChange = (
        setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
        values: FormValues,
        index: number,
        field: string,
        value: any
    ) => {
        const numericValue: number = parseFloat(value);
        setFieldValue(`data[${index}].${field}`, numericValue);

        // Update fields based on changes
        if (field === 'vat_percentage_rate' || field === 'ex_vat_price' || field === 'platts_price') {

            const vatPercentageRate = field === 'vat_percentage_rate' ? numericValue : values.data[index].vat_percentage_rate;
            const exVatPrice = field === 'ex_vat_price' ? numericValue : values.data[index].ex_vat_price;
            const plattsPrice = field === 'platts_price' ? numericValue : values.data[index].platts_price;

            // Update ex_vat_price to platts_price if platts_price is changed
            if (field === 'platts_price') {
                setFieldValue(`data[${index}].ex_vat_price`, plattsPrice.toFixed(2));
            }

            // Calculate total based on ex_vat_price and vat_percentage_rate
            const calculatedExVatPrice = field === 'platts_price' ? plattsPrice : exVatPrice;
            const calculatedTotal = calculatedExVatPrice * (1 + vatPercentageRate / 100);
            setFieldValue(`data[${index}].total`, calculatedTotal.toFixed(2));


        }
    };

    const columns = [

        {

            name: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-opening-stock">Fuel Name</Tooltip>}
                >
                    <span >Fuel</span>
                </OverlayTrigger>
            ),
            selector: (row: FuelDeliveryData) => row.fuel_name,
            cell: (row: FuelDeliveryData) => <span>{row.fuel_name}</span>,
        },

        {


            name: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-opening-stock">Fuel Price</Tooltip>}
                >
                    <span >Price</span>
                </OverlayTrigger>
            ),
            cell: (row: FuelDeliveryData, index: number) => (
                <Field name={`data[${index}].platts_price`}>
                    {({ field, form: { setFieldValue, values }, meta: { touched, error } }: FieldProps<any>) => (
                        <div className="relative">
                            <input
                                type="number"
                                placeholder='value'
                                {...field}
                                className={`form-input  ${touched && error ? ' errorborder border-red-500' : ''}`}
                                // readOnly={!row.update_opening}
                                onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'platts_price', e.target.value)


                                    
                                }
                            />
                        </div>
                    )}
                </Field>
            ),
        },
        {

            name: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-opening-stock">EX Vat</Tooltip>}
                >
                    <span >EX Vat</span>
                </OverlayTrigger>
            ),
            cell: (row: FuelDeliveryData, index: number) => (
                <Field name={`data[${index}].ex_vat_price`}>
                    {({ field, form: { setFieldValue, values }, meta: { touched, error } }: FieldProps<any>) => (
                        <div className="relative">
                            <input
                                type="number"
                                placeholder='value'
                                {...field}
                                className={`form-input readonly  ${touched && error ? ' errorborder border-red-500' : ''}`}
                                readOnly
                                onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'ex_vat_price', e.target.value)}
                            />
                        </div>
                    )}
                </Field>
            ),
        },

        {
            // name: 'Vat Percentage Rate',
            name: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-opening-stock">Vat Percentage Rate</Tooltip>}
                >
                    <span >Vat Percentage Rate</span>
                </OverlayTrigger>
            ),
            cell: (row: FuelDeliveryData, index: number) => (
                <Field name={`data[${index}].vat_percentage_rate`}>
                    {({ field, form: { setFieldValue, values }, meta: { touched, error } }: FieldProps<any>) => (
                        <div className="relative">
                            <input
                                type="number"
                                placeholder='value'
                                {...field}
                                className={`form-input  ${touched && error ? ' errorborder border-red-500' : ''}`}
                                // readOnly={!row.update_vat_percentage_rate}
                                onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'vat_percentage_rate', e.target.value)}
                            />
                        </div>
                    )}
                </Field>
            ),
        },
        {
            // name: 'Total',
            name: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-opening-stock">Total</Tooltip>}
                >
                    <span >Total</span>
                </OverlayTrigger>
            ),
            cell: (row: FuelDeliveryData, index: number) => (
                <Field name={`data[${index}].total`}>
                    {({ field, form: { setFieldValue, values }, meta: { touched, error } }: FieldProps<any>) => (
                        <div className="relative">
                            <input
                                type="number"
                                placeholder='value'
                                {...field}
                                className={`form-input  ${touched && error ? ' errorborder border-red-500' : ''}`}
                                // readOnly={!row.update_total}
                                onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'total', e.target.value)}
                            />
                        </div>
                    )}
                </Field>
            ),
        },
        // Define other columns similarly
    ];
    const handleSuccess = () => {
        // fetchData();
        const storedData = localStorage.getItem(storedKeyName);

        if (storedData) {
            setstationData(JSON.parse(storedData))
            handleApplyFilters(JSON.parse(storedData));
        }
    };

    const handleaddSubmit = async (values: any, selected: any) => { 
        try {
            const formData = new FormData();

            formData.append("platts_price", values.platts);
            // formData.append("premium_price", values.premium);
            // formData.append("development_fuels_price", values.development_fuels_price);
            // formData.append("duty_price", values.duty_price);
            formData.append("vat_percentage_rate", values.vat_percentage_rate);
            formData.append("ex_vat_price", values.ex_vat_price);
            formData.append("total", values.total);
            formData.append("date", values.date);
            formData.append("fuel_id", values.fuel_id);


            values?.selectedStations?.forEach((selected: any, index: any) => {
                formData.append(`station_id[${index}]`, selected.value);
            });


            const url = `/station/fuel/purchase-price/create`;
            const isSuccess = await postData(url, formData);
            if (isSuccess) {
                handleSuccess();
                closeModal();
            }
        } catch (error) {
            handleApiError(error);
        }
    };

   
    const validationSchema = Yup.object().shape({
        data: Yup.array().of(
            Yup.object().shape({
                total: Yup.number().required('Required'),
                platts_price: Yup.number().required('Required'),
                vat_percentage_rate: Yup.number()
                    .required('Required')
                    .max(100, 'VAT percentage rate cannot be more than 100'),
                // ex_vat_price: Yup.number().required('Required'),

            })
        ),
    });



    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditUserData(null);
        setIsFilterModalOpen(false);
    }; const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [filters, setFilters] = useState<any>({
        client_id: '',
        company_id: '',
        site_id: '',
    });




    const validationSchemaForCustomInput = Yup.object({
        client_id: isNotClient
            ? Yup.string().required("Client is required")
            : Yup.mixed().notRequired(),
        entity_id: Yup.string().required("Entity is required"),
        // station_id: Yup.string().required('Station is required'),
        start_date: Yup.string().required('Start Date is required'),
    });

    const handleSubmit = async (values: FormValues) => {
        // event.preventDefault();
        if (
            selected === undefined ||
            selected === null ||
            (Array?.isArray(selected) && selected?.length === 0)
        ) {
            showMessage("Please select at least one site", 'error');
        }

        // Check if at least one site is selected
        if (!selected || selected?.length === 0) {
            showMessage("Please select at least one site", 'error');
            return; // Exit the function if no site is selected
        }

      

        try {
            const formData = new FormData();
            values.data.forEach((obj: any) => {
                if (obj.id) {

           
                    formData.append(`platts_price[${obj.id}]`, obj.platts_price.toString());
                    formData.append(`ex_vat_price[${obj.id}]`, obj.ex_vat_price.toString());
                    formData.append(`total[${obj.id}]`, obj.total.toString());
                    formData.append(`vat_percentage_rate[${obj.id}]`, obj.vat_percentage_rate.toString());

                }
            });
            const selectedSiteIds = selected?.map((site: any) => site.value);

            selectedSiteIds?.forEach((id: any, index: number) => {
                formData.append(`station_id[${index}]`, id);
            });

            formData.append("date", stationData?.start_date);

            const postDataUrl = "/station/fuel/purchase-price/update";

            await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
        } catch (error) {
            handleApiError(error); // Set the submission state to false if an error occurs
        }
    };



    return (
        <>
            {isLoading && <LoaderImg />}
            <div className="flex justify-between items-center">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/dashboard" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Stations Fuel Purchase</span>
                    </li>
                </ul>

                {isAddPermissionAvailable && <>
                    <button type="button" className="btn btn-dark " onClick={() => setIsModalOpen(true)}>
                        Add Station Fuel Purchase
                    </button>
                </>}


            </div>
            <AddEditStationFuelPurchaseModal
                getData={getData}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleaddSubmit}
                isEditMode={isEditMode}
                userId={editUserData?.id}
            />
            <div className=" mt-6">
                <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-1 mb-6'>
                    <div className='panel h-full hidden md:block'>
                        <CustomInput
                            getData={getData}
                            isLoading={isLoading}
                            onApplyFilters={handleApplyFilters}
                            showClientInput={true}  // or false
                            showEntityInput={true}  // or false
                            showStationInput={true} // or false
                            showStationValidation={false} // or false
                            showDateValidation={true} // or false
                            validationSchema={validationSchemaForCustomInput}
                            layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-1 gap-5"
                            isOpen={false}
                            onClose={function (): void {
                                throw new Error('Function not implemented.');
                            }}
                            showDateInput={true}
                            // storedKeyItems={storedKeyItems}
                            storedKeyName={storedKeyName}
                        />

                    </div>


                    {/* Button for Small Screens */}
                    <div className="md:hidden flex justify-end flex-col gap-4 flex-wrap">
                        {filters?.client_name || filters?.entity_name || filters?.start_date ? (
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


                    <div className='panel h-full col-span-3'>
                        <div className="flex md:items-center md:flex-row w-100 mb-5 justify-between">
                            <h5 className="font-bold text-lg dark:text-white-light"> Stations Fuel Purchase ( {currency} )</h5>
                            <div className="md:hidden flex">
                                <button type="button" className="btn btn-primary" onClick={() => setIsFilterModalOpen(true)}>
                                    Filter
                                </button>
                            </div>
                        </div>
                        {data?.length > 0 ?    <div className=' my-4'>
                            <FormGroup>
                                <label className="form-label mt-4">
                                    Select Stations
                                    <span className="text-danger">*</span>
                                </label>
                                <MultiSelect
                                    value={selected}
                                    onChange={setSelected}
                                    labelledBy="Select Sites"
                                    // disableSearch="true"
                                    options={stationData?.sites?.map((item: any) => ({ value: item?.id, label: item?.name })) || []}
                                />
                            </FormGroup>
                        </div>: ""}
                        {/* {data?.length > 0 ? "Data:" : "No Data"} */}

                    
                        <Formik
                            initialValues={{ data: data }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({ values, setFieldValue }) => (
                                <Form>
                                    <DataTable
                                        columns={columns}
                                        data={values.data}
                                        noDataComponent={
                                            <div className="flex justify-center items-center">
                                                <img src={noDataImage} alt="No data found" className="w-1/2" />
                                            </div>
                                        }
                                    />
                                    <div className="mt-4">
                                        <button type="submit" className="btn btn-dark">Submit</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>

                </div>

            </div>
            {/* Modal for Filters on Small Screens */}
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
                                onApplyFilters={handleApplyFilters}

                                showClientInput={true}  // or false
                                showEntityInput={true}  // or false
                                showStationInput={true} // or false
                                showStationValidation={false} // or false
                                showDateValidation={true} // or false
                                validationSchema={validationSchemaForCustomInput}
                                layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-1 gap-5"
                                isOpen={false}
                                onClose={function (): void {
                                    throw new Error('Function not implemented.');
                                }}
                                showDateInput={true}
                                // storedKeyItems={storedKeyItems}
                                storedKeyName={storedKeyName}
                                smallScreen={true}
                            />
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default withApiHandler(ManageStationFuelPurchase);




//     return (
//         <>
//             {isLoading && <LoaderImg />}
//             <div className="flex justify-between items-center">
//                 <ul className="flex space-x-2 rtl:space-x-reverse">
//                     <li>
//                         <Link to="/dashboard" className="text-primary hover:underline">
//                             Dashboard
//                         </Link>
//                     </li>
//                     <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
//                         <span>Stations Fuel Purchase</span>
//                     </li>
//                 </ul>
//                 <button type="button" className="btn btn-dark" onClick={() => setIsModalOpen(true)}>
//                     Add Station Fuel Purchase
//                 </button>
//             </div>

//             <AddEditStationFuelPurchaseModal
//                 getData={getData}
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 onSubmit={handleSubmit}
//                 isEditMode={isEditMode}
//                 userId={editUserData?.id}
//             />

//             <div className="mt-6">
//                 <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
//                     {/* Filter components */}
//                 </div>

//                 <Formik
//                     initialValues={{ data: data }}
//                     validationSchema={validationSchema}
//                     onSubmit={handleSubmit}
//                     enableReinitialize
//                 >
//                     {({ values, setFieldValue }) => (
//                         <Form>
//                             <DataTable
//                                 columns={columns}
//                                 data={values.data}
//                                 noDataComponent={
//                                     <div className="flex justify-center items-center">
//                                         <img src={noDataImage} alt="No data found" className="w-1/2" />
//                                     </div>
//                                 }
//                                 pagination
//                                 paginationComponentOptions={{ rowsPerPageText: 'Rows per page:', rangeSeparatorText: 'of', noRowsPerPage: false }}
//                             />
//                             <div className="mt-4">
//                                 <button type="submit" className="btn btn-dark">Submit</button>
//                             </div>
//                         </Form>
//                     )}
//                 </Formik>
//             </div>
//         </>
//     );
// };

// export default ManageStationFuelPurchase;
