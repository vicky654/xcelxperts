import React, { useEffect, useState } from 'react';
import withApiHandler from '../../../utils/withApiHandler';
import { CommonDataEntryProps } from '../../commonInterfaces';
import useErrorHandler from '../../../hooks/useHandleError';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { currency } from '../../../utils/CommonData';

import noDataImage from '../../../assets/noDataFoundImage/noDataFound.png';
import LoaderImg from '../../../utils/Loader';

interface Service {
    credit_user_id: string;
    amount: string;
    quantity: string;
    fuel_sub_category_id: string;
}

interface AddEditSLAInitialValues {
    services: Service[];
}

const CreditSales: React.FC<CommonDataEntryProps> = ({ stationId, startDate, postData, getData, applyFilters, isLoading }) => {
    const handleApiError = useErrorHandler();
    const [commonListData, setCommonListData] = useState<any>(null);
    const [iseditable, setIsEditable] = useState(true);
    const [totalAmount, setTotalAmount] = useState<number>(0); // State to hold total amount

    useEffect(() => {
        if (stationId && startDate) {
            handleApplyFilters(stationId, startDate);
        }
    }, [stationId, startDate]);

    const handleApplyFilters = async (stationId: string | null, startDate: string | null) => {
        try {
            const response = await getData(`/data-entry/credit-sale/list?drs_date=${startDate}&station_id=${stationId}`);
            if (response && response.data && response.data.data) {

                setCommonListData(response.data.data);
                setIsEditable(response.data.data?.is_editable);
                if (response.data.data.listing) {
                    formik.setValues({ services: response.data.data.listing });
                }
            } else {
                throw new Error('No data available in the response');
            }
            if (Array.isArray(response.data.data?.listing) && response.data.data.listing.length === 0) {
                response.data.data.listing = [
                    {
                        credit_user_id: '',
                        amount: '',
                        fuel_sub_category_id: '',
                    },
                ];
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const addEditSLAInitialValues: AddEditSLAInitialValues = {
        services: [
            {
                credit_user_id: '',
                amount: '',
                quantity: '',
                fuel_sub_category_id: '',
            },
        ],
    };

    const validationSchema = Yup.object().shape({
        services: Yup.array().of(
            Yup.object().shape({
                credit_user_id: Yup.string().required('Credit User is required'),
                quantity: Yup.string().required('Quantity is required'),
                fuel_sub_category_id: Yup.string().required('Fuel is required'),
            })
        ),
    });

    const formik: any = useFormik({
        initialValues: addEditSLAInitialValues,
        validationSchema,
        onSubmit: (values) => {
            handleFormSubmit(values);
          
        },
    });

    const handleFormSubmit = async (data: any) => {
        try {
            const formData = new FormData();
            data.services.forEach((service: any, index: number) => {
                formData.append(`credit_user_id[${index}]`, service.credit_user_id);
                formData.append(`amount[${index}]`, service.amount);
                formData.append(`quantity[${index}]`, service.quantity);
                formData.append(`fuel_sub_category_id[${index}]`, service.fuel_sub_category_id);
            });

            if (stationId && startDate) {
                formData.append('drs_date', startDate);
                formData.append('station_id', stationId);
            }

            if (data?.id) {
                formData.append(`id`, data?.id);
            }

            const url = data?.id ? `/data-entry/credit-sale/update` : `/data-entry/credit-sale/update`;
            const isSuccess = await postData(url, formData);
            if (isSuccess) {
                if (stationId && startDate) {
                    handleApplyFilters(stationId, startDate);
                    applyFilters({ station_id: stationId, start_date: startDate, selectedCardName: "Credit Sales" });
                }
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const addRow = () => {
        const services = [...formik.values.services];
        services.push({
            credit_user_id: '',
            amount: '',
            quantity: '',
            fuel_sub_category_id: '',
        });
        formik.setFieldValue('services', services);
    };

    const removeRow = (index: number) => {
        const services = [...formik.values.services];
        services.splice(index, 1);
        formik.setFieldValue('services', services);
    };

    // Function to calculate the amount
    const calculateAmount = (fuelId: string, quantity: string) => {
        const fuel = commonListData?.fuels.find((item: any) => item.id === fuelId);
        if (fuel && quantity) {
            return (parseFloat(fuel.price) * parseFloat(quantity)).toFixed(2);
        }
        return '';
    };

    // Function to calculate total amount
    const calculateTotalAmount = () => {
        let total = 0;
        formik.values.services.forEach((service: any) => {
            if (service.amount) {
                total += parseFloat(service.amount);
            }
        });
        setTotalAmount(total);
    };

    // Update the amount field when fuel or quantity changes
    const handleFuelChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const { value } = e.target;
        formik.setFieldValue(`services[${index}].fuel_sub_category_id`, value);
        const amount = calculateAmount(value, formik.values.services[index].quantity);
        formik.setFieldValue(`services[${index}].amount`, amount);
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        formik.setFieldValue(`services[${index}].quantity`, value);
        const amount = calculateAmount(formik.values.services[index].fuel_sub_category_id, value);
        formik.setFieldValue(`services[${index}].amount`, amount);
    };

    // Calculate total amount on component mount and when formik values change
    useEffect(() => {
        calculateTotalAmount();
    }, [formik.values.services]);

    return (
        <>
            {isLoading ? (
                <>
                    {LoaderImg}
                </>
            ) : (
                <div>
                    <div className='spacebetween'>
                        <h1 className="text-lg font-semibold  ">Credit Sales {startDate ? `(${startDate})` : ''}</h1>
                        {iseditable ? (
                            <button className='btn btn-primary mb-3' onClick={addRow}>Add</button>
                        ) : null}
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex flex-wrap gap-4">
                            {formik.values.services.map((service: any, index: any) => (
                                <div key={index} className="w-full flex flex-wrap items-center p-4 border border-gray-200 rounded-md gap-4">
                                    {/* Column 4 - Credit User */}
                                    <div className="w-full lg:w-3/12 flex flex-col ">
                                        <label htmlFor={`services[${index}].credit_user_id`} className="block text-sm font-medium text-gray-700">
                                            User <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id={`services[${index}].credit_user_id`}
                                            name={`services[${index}].credit_user_id`}
                                            value={formik.values.services[index].credit_user_id}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={!iseditable}
                                            className={`form-input form-input text-white-dark mt-1 block w-full pl-3 pr-10 py-2 text-base  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${!iseditable ? 'readonly' : ''}`}

                                       
                                       >
                                            <option value="">Select User</option>
                                            {commonListData?.users?.map((item: any) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                        {formik.errors.services?.[index]?.credit_user_id && formik.touched.services?.[index]?.credit_user_id && (
                                            <div className="text-red-500 text-sm mt-1">
                                                <span>Credit User is required</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Column 4 - Fuel Sub Category */}
                                    <div className="w-full lg:w-2/12 flex flex-col ">
                                        <label htmlFor={`services[${index}].fuel_sub_category_id`} className="block text-sm font-medium text-gray-700">
                                            Fuel <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id={`services[${index}].fuel_sub_category_id`}
                                            name={`services[${index}].fuel_sub_category_id`}
                                            value={formik.values.services[index].fuel_sub_category_id}
                                            onChange={(e) => handleFuelChange(e, index)}
                                            onBlur={formik.handleBlur}
                                            disabled={!iseditable}
                                            className={`form-input  text-white-dark mt-1 block w-full pl-3 pr-10 py-2 text-base  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${!iseditable ? 'readonly' : ''}`}
                                            >
                                            <option value="">Select Fuel</option>
                                            {commonListData?.fuels?.map((item: any) => (
                                                <option key={item.id} value={item.id}>{item.sub_category_name} ({currency}{item.price})</option>
                                            ))}
                                        </select>
                                        {formik.errors.services?.[index]?.fuel_sub_category_id && formik.touched.services?.[index]?.fuel_sub_category_id && (
                                            <div className="text-red-500 text-sm mt-1">
                                                <span>Fuel is required</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Column 4 - Quantity */}
                                    <div className="w-full lg:w-2/12 flex flex-col ">
                                        <label htmlFor={`services[${index}].quantity`} className="block text-sm font-medium text-gray-700">
                                            Quantity <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id={`services[${index}].quantity`}
                                            name={`services[${index}].quantity`}
                                            value={formik.values.services[index].quantity}
                                            placeholder='Quantity'
                                            onChange={(e) => handleQuantityChange(e, index)}
                                            onBlur={formik.handleBlur}
                                            disabled={!iseditable}
                                            className={`form-input  text-white-dark mt-1 block w-full pl-3 pr-10 py-2 text-base  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${!iseditable ? 'readonly' : ''}`}

                                        />
                                        {formik.errors.services?.[index]?.quantity && formik.touched.services?.[index]?.quantity && (
                                            <div className="text-red-500 text-sm mt-1">
                                                <span>Quantity is required</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Column 4 - Amount */}
                                    <div className="w-full lg:w-2/12 flex flex-col ">
                                        <label htmlFor={`services[${index}].amount`} className="block text-sm font-medium text-gray-700">
                                            Amount <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id={`services[${index}].amount`}
                                            name={`services[${index}].amount`}
                                            value={formik.values.services[index].amount}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                             placeholder='Amount'
                                            disabled
                                            readOnly
                                            className="readonly form-input text-white-dark mt-1 block w-full pl-3 pr-10 py-2 text-base  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        />
                                    </div>

                                    {iseditable ? (
                                        <div className="w-full lg:w-1/12 flex items-center mt-6  ">
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => removeRow(index)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                        <div className="">
                            <div className="font-semibold text-lg">
                                Total Amount: {currency} {totalAmount.toFixed(2)}
                            </div>
                        </div>
                        {iseditable && formik.values.services.length> 0  &&(
                            <div className="mt-6">
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        )}
                    </form>
                    {!isLoading && commonListData?.listing?.length === 0 && (
                        <div className="text-center mt-5">
                            <img src={noDataImage} alt="No data found" className="mx-auto " />
                            <p className="text-gray-500">No data found.</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default withApiHandler(CreditSales);
