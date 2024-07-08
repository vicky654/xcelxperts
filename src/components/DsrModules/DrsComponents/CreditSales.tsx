import React, { useEffect } from 'react';
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
    useEffect(() => {
        if (stationId && startDate) {
            handleApplyFilters(stationId, startDate);
        }
    }, [stationId, startDate]);
    const handleApplyFilters = async (stationId: string | null, startDate: string | null) => {
        try {
            const response = await getData(`/data-entry/credit-sale/list?drs_date=${startDate}&station_id=${stationId}`);
            if (response && response.data && response.data.data) {
                console.log(response.data.data, "columnIndex");
            } else {
                throw new Error('No data available in the response');
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
        onSubmit: (values,) => {
            handleFormSubmit(values);
            console.log(values, "values");
        },
    });
    const handleFormSubmit = async (data: any) => {
        try {

            const formData = new FormData();


            // Add service fields
            data.services.forEach((service: any, index: number) => {
                formData.append(`credit_user_id[${index}]`, service.credit_user_id);
                formData.append(`amount[${index}]`, service.amount);
                formData.append(`fuel_sub_category_id[${index}]`, service.fuel_sub_category_id);
            });




            if (data?.id) {
                formData.append(`id`, data?.id);
            }

            const url = data?.id ? `/service-agreement/update` : `/service-agreement/create`;
            const response = await postData(url, formData);
            if (response && response.status_code == 200) {
                console.log(response, "columnIndex");
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const addRow = () => {
        const services = [...formik.values.services];
        services?.push({
            credit_user_id: '',
            amount: '',
            fuel_sub_category_id: '',
        });
        formik.setFieldValue('services', services);
    };

    const removeRow = (index: number) => {
        const services = [...formik.values.services];
        services?.splice(index, 1);
        formik.setFieldValue('services', services);
    };
    return (
        <div className='container mx-auto p-4'>
        <h1 className='text-2xl font-bold mb-4'>{`CreditSales ${stationId} ${startDate}`}</h1>
       <button className='btn btn-primary' onClick={addRow}>Add</button>
        <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-wrap gap-4">
                {formik.values.services.map((service: any, index: any) => (
                    <div key={index} className="flex flex-col-4 items-center gap-4 p-4 border border-gray-200 rounded-md">
                        <div className="flex flex-col mb-4">
                            <label htmlFor={`services[${index}].credit_user_id`} className="block text-sm font-medium text-gray-700">
                                {`Credit User ${index + 1}`} <span className="text-red-500">*</span>
                            </label>
                            <select
                                id={`services[${index}].credit_user_id`}
                                name={`services[${index}].credit_user_id`}
                                value={formik.values.services[index].credit_user_id}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-select text-white-dark mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">Select Credit User {index + 1}</option>
                                {/* {commonListData?.servicelist?.map((item: any) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))} */}
                            </select>
                            {formik.errors.services?.[index]?.credit_user_id && formik.touched.services?.[index]?.credit_user_id && (
                                <div className="text-red-500 text-sm mt-1">
                                    <span>Credit User {index + 1} is required</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex flex-col mb-4">
                            <label htmlFor={`services[${index}].fuel_sub_category_id`} className="block text-sm font-medium text-gray-700">
                                {`Fuel ${index + 1}`} <span className="text-red-500">*</span>
                            </label>
                            <select
                                id={`services[${index}].fuel_sub_category_id`}
                                name={`services[${index}].fuel_sub_category_id`}
                                value={formik.values.services[index].fuel_sub_category_id}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-select text-white-dark mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">Select Fuel {index + 1}</option>
                                {/* {commonListData?.frequencies?.map((item: any) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))} */}
                            </select>
                            {formik.errors.services?.[index]?.fuel_sub_category_id && formik.touched.services?.[index]?.fuel_sub_category_id && (
                                <div className="text-red-500 text-sm mt-1">
                                    <span>Fuel {index + 1} is required</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex flex-col mb-4">
                            <label htmlFor={`services[${index}].amount`} className="block text-sm font-medium text-gray-700">
                                {`Amount ${index + 1}`} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type='text'
                                id={`services[${index}].amount`}
                                name={`services[${index}].amount`}
                                placeholder={`Amount ${index + 1}`}
                                value={formik.values.services[index].amount}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {formik.errors.services?.[index]?.amount && formik.touched.services?.[index]?.amount && (
                                <div className="text-red-500 text-sm mt-1">
                                    <span>Amount {index + 1} is required</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            {index > 0 && (
                                <button
                                    type='button'
                                    className='btn btn-danger'
                                    onClick={() => removeRow(index)}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-end">
                <button type="submit" className="btn btn-primary">
                    Apply
                </button>
            </div>
        </form>
    </div>
    );
};

export default withApiHandler(CreditSales);
