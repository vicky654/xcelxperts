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

interface FuelDeliveryData {
    id: string;
    fuel_name: string;
    tank_name: string;
    platts_price: string;
    opening: number;
    delivery_volume: number;
    sales_volume: number;
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

const ManageStationFuelPurchase: React.FC<CommonDataEntryProps> = ({ postData, getData, isLoading }) => {
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
   
    useEffect(() => {
        const storedData = localStorage.getItem(storedKeyName);
        if (storedData) {
            setstationData(JSON.parse(storedData));
            handleApplyFilters(JSON.parse(storedData));
        }
        dispatch(setPageTitle('Alternative Pagination Table'));
    }, [dispatch, currentPage]);

    const handleApplyFilters = async (values: any) => {
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

        // Update book_stock and variance based on changes
        if (field === 'opening' || field === 'delivery_volume' || field === 'sales_volume') {
            const opening = field === 'opening' ? numericValue : values.data[index].opening;
            const delivery_volume = field === 'delivery_volume' ? numericValue : values.data[index].delivery_volume;
            const sales_volume = field === 'sales_volume' ? numericValue : values.data[index].sales_volume;

            const newBookStock = opening + delivery_volume - sales_volume;
            setFieldValue(`data[${index}].book_stock`, newBookStock.toFixed(2));

            const dips_stock = values.data[index].dips_stock;
            const newVariance = dips_stock - newBookStock;
            setFieldValue(`data[${index}].variance`, newVariance.toFixed(2));
        }

        if (field === 'dips_stock') {
            const newVariance = numericValue - values.data[index].book_stock;
            setFieldValue(`data[${index}].variance`, newVariance.toFixed(2));
        }
    };

    const columns = [
        // Define columns here
        {
            name: 'Fuel',
            selector: (row: FuelDeliveryData) => row.fuel_name,
            cell: (row: FuelDeliveryData) => <span>{row.fuel_name}</span>,
        },
    
        {
            name: 'Price',
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
                                onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'platts_price', e.target.value)}
                            />
                        </div>
                    )}
                </Field>
            ),
        },
        {
            name: 'platts_price',
            cell: (row: FuelDeliveryData, index: number) => (
                <Field name={`data[${index}].ex_vat_price`}>
                    {({ field, form: { setFieldValue, values }, meta: { touched, error } }: FieldProps<any>) => (
                        <div className="relative">
                            <input
                                type="number"
                                placeholder='value'
                                {...field}
                                className={`form-input  ${touched && error ? ' errorborder border-red-500' : ''}`}
                                // readOnly={!row.update_ex_vat_price}
                                onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'ex_vat_price', e.target.value)}
                            />
                        </div>
                    )}
                </Field>
            ),
        },
        {
            name: 'total',
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
        {
            name: 'vat_percentage_rate',
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
        // Define other columns similarly
    ];

    const handleSubmit = async (values: FormValues) => {
        try {
            const formData = new FormData();
            values.data.forEach((obj: any) => {
                if (obj.id) {
                    formData.append(`opening[${obj.id}]`, obj.opening.toString());
                    formData.append(`delivery_volume[${obj.id}]`, obj.delivery_volume.toString());
                    formData.append(`sales_volume[${obj.id}]`, obj.sales_volume.toString());
                    formData.append(`book_stock[${obj.id}]`, obj.book_stock.toString());
                    formData.append(`dips_stock[${obj.id}]`, obj.dips_stock.toString());
                    formData.append(`variance[${obj.id}]`, obj.variance.toString());
                }
            });

            const url = `data-entry/fuel-delivery/update`;
            const isSuccess = await postData(url, formData);
            if (isSuccess) {
                handleApplyFilters(stationData);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const validationSchema = Yup.object().shape({
        data: Yup.array().of(
            Yup.object().shape({
                opening: Yup.number().required('Required'),
                delivery_volume: Yup.number().required('Required'),
                sales_volume: Yup.number().required('Required'),
                book_stock: Yup.number().required('Required'),
                dips_stock: Yup.number().required('Required'),
                variance: Yup.number().required('Required'),
            })
        ),
    });


    
    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditUserData(null);
        setIsFilterModalOpen(false);
    };    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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
        station_id: Yup.string().required('Station is required'),
        start_date: Yup.string().required('Start Date is required'),
    });


    const handleFormSubmit = () =>{
        console.log( "columnIndex");
    }
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
            {/* <AddEditStationFuelPurchaseModal getData={getData} isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} isEditMode={isEditMode}  /> */}

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
                            showStationValidation={true} // or false
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
                                pagination
                                paginationComponentOptions={{ rowsPerPageText: 'Rows per page:', rangeSeparatorText: 'of', noRowsPerPage: false }}
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
                                showStationValidation={true} // or false
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
