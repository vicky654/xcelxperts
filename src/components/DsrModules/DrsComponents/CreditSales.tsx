import React, { useEffect, useState } from 'react';
import withApiHandler from '../../../utils/withApiHandler';
import { CommonDataEntryProps } from '../../commonInterfaces';
import useErrorHandler from '../../../hooks/useHandleError';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface Service {
    credit_user_id: string;
    amount: string;
    fuel_sub_category_id: string;
}

interface AddEditSLAInitialValues {
    services: Service[];
}

const CreditSales: React.FC<CommonDataEntryProps> = ({ stationId, startDate, postData, getData, isLoading }) => {
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
                fuel_sub_category_id: '',
            },
        ],
    };

    const validationSchema = Yup.object().shape({
        services: Yup.array().of(
            Yup.object().shape({
                credit_user_id: Yup.string().required('Credit User is required'),
                amount: Yup.string().required('Amount is required'),
                fuel_sub_category_id: Yup.string().required('Fuel is required'),
            })
        ),
    });

    const formik: any = useFormik({
        initialValues: addEditSLAInitialValues,
        validationSchema,
        onSubmit: (values) => {
            handleFormSubmit(values);
            console.log(values, "values");
        },
    });

    const handleFormSubmit = async (data: any) => {
        try {
            const formData = new FormData();
            data.services.forEach((service: any, index: number) => {
                formData.append(`credit_user_id[${index}]`, service.credit_user_id);
                formData.append(`amount[${index}]`, service.amount);
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
            fuel_sub_category_id: '',
        });
        formik.setFieldValue('services', services);
    };

    const removeRow = (index: number) => {
        const services = [...formik.values.services];
        services.splice(index, 1);
        formik.setFieldValue('services', services);
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

    // Calculate total amount on component mount and when formik values change
    useEffect(() => {
        calculateTotalAmount();
    }, [formik.values.services]);

    return (
        <div className='container mx-auto p-4'>
            <div className='spacebetween'>
                <h1 className="text-lg font-semibold mb-4 ">Credit Sales {startDate ? `(${startDate})` : ''}</h1>
                {iseditable ?
                    <button className='btn btn-primary mb-3' onClick={addRow}>Add</button> : ""}
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className="flex flex-wrap gap-4">
                    {formik.values.services.map((service: any, index: any) => (
                        <div key={index} className="w-full flex flex-wrap items-center p-4 border border-gray-200 rounded-md gap-4">

                            {/* Column 4 - Credit User */}
                            <div className="w-full lg:w-4/12 flex flex-col mb-4">
                                <label htmlFor={`services[${index}].credit_user_id`} className="block text-sm font-medium text-gray-700">
                                    {`User `} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id={`services[${index}].credit_user_id`}
                                    name={`services[${index}].credit_user_id`}
                                    value={formik.values.services[index].credit_user_id}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    
                                    className="form-select text-white-dark mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Select  User</option>
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
                            <div className="w-full lg:w-3/12 flex flex-col mb-4">
                                <label htmlFor={`services[${index}].fuel_sub_category_id`} className="block text-sm font-medium text-gray-700">
                                    {`Fuel `} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id={`services[${index}].fuel_sub_category_id`}
                                    name={`services[${index}].fuel_sub_category_id`}
                                    value={formik.values.services[index].fuel_sub_category_id}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                
                                    className="form-select text-white-dark mt-1 block w-full pl-3 pr-10  py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Select Fuel</option>
                                    {commonListData?.fuels?.map((item: any) => (
                                        <option key={item.id} value={item.id}>{item.sub_category_name}</option>
                                    ))}
                                </select>
                                {formik.errors.services?.[index]?.fuel_sub_category_id && formik.touched.services?.[index]?.fuel_sub_category_id && (
                                    <div className="text-red-500 text-sm mt-1">
                                        <span>Fuel is required</span>
                                    </div>
                                )}
                            </div>

                            {/* Column 3 - Amount */}
                            <div className="w-full lg:w-3/12 flex flex-col mb-4">
                                <label htmlFor={`services[${index}].amount`} className="block text-sm font-medium text-gray-700">
                                    {`Amount `} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id={`services[${index}].amount`}
                                    name={`services[${index}].amount`}
                                    placeholder="Amount"
                                    value={formik.values.services[index].amount}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    readOnly={!iseditable}
                                    // ${!formik.values.services[index].update_amount ? 'readonly' : ''}
                                    className={` mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                />

                                {formik.errors.services?.[index]?.amount && formik.touched.services?.[index]?.amount && (
                                    <div className="text-red-500 text-sm mt-1">
                                        <span>Amount is required</span>
                                    </div>
                                )}
                            </div>
                            {iseditable ?
                      <div className="w-full lg:w-1/12 flex justify-end">
                      {index > 0 && (
                          <button
                              type='button'
                              className='btn btn-danger'
                              onClick={() => removeRow(index)}
                          >
                              Remove
                          </button>
                      )}
                  </div> : ""}
                            {/* Column 1 - Remove Button */}
                         
                        </div>
                    ))}
                </div>

                {/* Display total amount */}
                <div className="mt-3">
                    <p className="text-lg font-semibold">Total Amount: {totalAmount}</p>
                </div>

                {/* Submit button */}
                <footer>
                    {iseditable && <button className="btn btn-primary mt-3" type="submit">Submit</button>}
                </footer>
            </form>
        </div>
    );
};

export default withApiHandler(CreditSales);
