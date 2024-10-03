import React, { useEffect, useRef, useState } from 'react';
import withApiHandler from '../../../utils/withApiHandler';
import { CommonDataEntryProps } from '../../commonInterfaces';
import useErrorHandler from '../../../hooks/useHandleError';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { currency } from '../../../utils/CommonData';

import noDataImage from '../../../assets/AuthImages/noDataFound.png';
import LoaderImg from '../../../utils/Loader';
import { handleDownloadPdf } from '../../CommonFunctions';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import useCustomDelete from '../../../utils/customDelete';
import { IRootState } from '../../../store';
import { useSelector } from 'react-redux';

interface Service {
    employee_id: string;
    amount: string;
    notes: string;
    trans_type: string;
}

interface AddEditSLAInitialValues {
    services: Service[];
}

const EmployeePayments: React.FC<CommonDataEntryProps> = ({ stationId, startDate, postData, getData, applyFilters, isLoading }) => {
    const handleApiError = useErrorHandler();
    const [commonListData, setCommonListData] = useState<any>(null);
    const [iseditable, setIsEditable] = useState(true);
    const [totalAmount, setTotalAmount] = useState<number>(0); // State to hold total amount
    const [isdownloadpdf, setIsdownloadpdf] = useState(true);

    const Permissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);

    const isReportGeneratePermissionAvailable = Permissions?.includes('report-generate');

    useEffect(() => {
        if (stationId && startDate) {
            handleApplyFilters(stationId, startDate);
        }
    }, [stationId, startDate]);

    const handleApplyFilters = async (stationId: string | null, startDate: string | null) => {
        try {
            const response = await getData(`/data-entry/employee-payment/list?drs_date=${startDate}&station_id=${stationId}`);
            if (response && response.data && response.data.data) {

                setCommonListData(response.data.data);
                setIsdownloadpdf(response.data.data?.download_pdf);
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
                        employee_id: '',
                        amount: '',
                        trans_type: '',
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
                employee_id: '',
                amount: '',
                notes: '',
                trans_type: '',
            },
        ],
    };

    const validationSchema = Yup.object().shape({
        services: Yup.array().of(
            Yup.object().shape({
                employee_id: Yup.string().required('Employee is required'),

                amount: Yup.string().required('Amount is required'),
                trans_type: Yup.string().required('Transaction Type is required'),
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
                formData.append(`employee_id[${index}]`, service.employee_id);
                formData.append(`amount[${index}]`, service.amount);
                formData.append(`notes[${index}]`, service.notes);
                formData.append(`trans_type[${index}]`, service.trans_type);
            });

            if (stationId && startDate) {
                formData.append('drs_date', startDate);
                formData.append('station_id', stationId);
            }

            if (data?.id) {
                formData.append(`id`, data?.id);
            }

            const url = data?.id ? `/data-entry/employee-payment/update` : `/data-entry/employee-payment/update`;
            const isSuccess = await postData(url, formData);
            if (isSuccess) {
                if (stationId && startDate) {
                    handleApplyFilters(stationId, startDate);
                    applyFilters({ station_id: stationId, start_date: startDate, selectedCardName: "Employee Payments" });
                }
            }
        } catch (error) {
            handleApiError(error);
        }
    };
    const handleSuccess = () => {
        if (stationId && startDate) {
            handleApplyFilters(stationId, startDate);
        }
    }

    const addRow = () => {
        const services = [...formik.values.services];
        services.push({
            employee_id: '',
            amount: '',
            notes: '',
            trans_type: '',
        });
        formik.setFieldValue('services', services);
    };
    const { customDelete } = useCustomDelete();
    const handleDelete = (id: any) => {
        const formData = new FormData();
        if (stationId && startDate) {
            // formData.append('station_id', stationId);
            // formData.append('drs_date', startDate);
            formData.append('id', id);
        }
        customDelete(postData, 'data-entry/employee-payment/delete', formData, handleSuccess);
    };

    const removeRow = (index: number) => {

        const services = [...formik.values.services];


        // Check if index is within bounds
        if (index >= 0 && index < services.length) {
            const serviceToRemove = services[index];
            const serviceId = serviceToRemove.id; // Assuming 'id' is the property you need


            if (
                serviceId
            ) {
                handleDelete(serviceId)

            } else {
                // Optionally remove the item from the array
                services.splice(index, 1);
                // // Update the formik field value
                formik.setFieldValue('services', services);

            }


        } else {
            console.warn('Index out of bounds');
        }
    };






    // Update the amount field when fuel or notes changes
    const handleFuelChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const { value } = e.target;
        formik.setFieldValue(`services[${index}].trans_type`, value);

    };

    const handlenoteChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        formik.setFieldValue(`services[${index}].notes`, value);
  
    };






    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.altKey && event.key === 'Enter') {
                event.preventDefault(); // Prevent default action of Alt + Enter
                if (iseditable && formik?.values?.services?.length > 0) {
                    formik.handleSubmit(); // Trigger form submission
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [iseditable, formik?.values?.services?.length, formik.handleSubmit]);

    return (
        <>
            {isLoading && <LoaderImg />}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 className="text-lg font-semibold mb-4">
                        {`Employee Payments`} {startDate ? `(${startDate})` : ''} {isdownloadpdf && (<span onClick={() => handleDownloadPdf('employee-payment', stationId, startDate, getData, handleApiError)}>

                            {isReportGeneratePermissionAvailable && (<>
                                <OverlayTrigger placement="top" overlay={<Tooltip className="custom-tooltip" >Download Report</Tooltip>}>
                                    <i style={{ fontSize: "20px", color: "red", cursor: "pointer" }} className="fi fi-tr-file-pdf"></i>
                                </OverlayTrigger>
                            </>)}

                        </span>)}

                    </h1>
                    {iseditable ? (
                        <button className='btn btn-primary mb-3' onClick={addRow}>Add Employee Payment</button>
                    ) : null}


                </div>
                {
                    <form onSubmit={formik.handleSubmit}>
                        {formik.values.services.length > 0 ? (
                            <>
                                <div className="flex flex-wrap gap-4">
                                    {formik.values.services.map((service: any, index: number) => (
                                        <div
                                            key={index}
                                            className="w-full flex flex-wrap items-center p-4 border border-gray-200 rounded-md gap-4"
                                        >
                                            {/* Column 4 - Credit User */}
                                            <div className="w-full lg:w-2/12 flex flex-col">
                                                <label
                                                    htmlFor={`services[${index}].employee_id`}
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Employee <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    id={`services[${index}].employee_id`}
                                                    name={`services[${index}].employee_id`}
                                                    value={formik.values.services[index].employee_id}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    disabled={!iseditable}
                                                    className={`form-input text-white-dark mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${!iseditable ? "readonly" : ""
                                                        }`}
                                                    style={{ height: "42px" }} // Fixed height for consistent layout
                                                >
                                                    <option value="">Select Employee</option>
                                                    {commonListData?.employees?.map((item: any) => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div
                                                    style={{ height: "22px" }} // Fixed height for error message space
                                                >
                                                    {formik.errors.services?.[index]?.employee_id &&
                                                        formik.touched.services?.[index]?.employee_id && (
                                                            <div className="text-red-500 text-sm mt-1">
                                                                <span>Employee is required</span>
                                                            </div>
                                                        )}
                                                </div>
                                            </div>

                                            {/* Column 4 - Fuel Sub Category */}
                                            <div className="w-full lg:w-2/12 flex flex-col">
                                                <label
                                                    htmlFor={`services[${index}].trans_type`}
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Transaction Type <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    id={`services[${index}].trans_type`}
                                                    name={`services[${index}].trans_type`}
                                                    value={formik.values.services[index].trans_type}
                                                    onChange={(e) => handleFuelChange(e, index)}
                                                    onBlur={formik.handleBlur}
                                                    disabled={!iseditable}
                                                    className={`form-input text-white-dark mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${!iseditable ? "readonly" : ""
                                                        }`}
                                                    style={{ height: "42px" }} // Fixed height for consistent layout
                                                >
                                                    <option value="">Select Transaction Type</option>
                                                    {commonListData?.trans_type?.map((item: any) => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div
                                                    style={{ height: "22px" }} // Fixed height for error message space
                                                >
                                                    {formik.errors.services?.[index]?.trans_type &&
                                                        formik.touched.services?.[index]?.trans_type && (
                                                            <div className="text-red-500 text-sm mt-1">
                                                                <span>Transaction Type is required</span>
                                                            </div>
                                                        )}
                                                </div>
                                            </div>




                                            {/* Column 4 - Amount */}
                                            <div className="w-full lg:w-2/12 flex flex-col">
                                                <label
                                                    htmlFor={`services[${index}].amount`}
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Amount <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    id={`services[${index}].amount`}
                                                    name={`services[${index}].amount`}
                                                    value={formik.values.services[index].amount}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    placeholder="Amount"
                                                    disabled={!iseditable}

                                                    className={`form-input text-white-dark mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${!iseditable ? "readonly" : ""
                                                        }`}

                                                    style={{ height: "42px" }} // Fixed height for consistent layout
                                                />
                                                <div
                                                    style={{ height: "22px" }} // Fixed height for error message space
                                                >
                                                    {formik.errors.services?.[index]?.amount &&
                                                        formik.touched.services?.[index]?.amount && (
                                                            <div className="text-red-500 text-sm mt-1">
                                                                <span>Amount is required</span>
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                            {/* Column 4 - notes */}
                                            <div className="w-full lg:w-2/12 flex flex-col">
                                                <label
                                                    htmlFor={`services[${index}].notes`}
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Note 
                                                </label>
                                                <input
                                                    type="text"
                                                    id={`services[${index}].notes`}
                                                    name={`services[${index}].notes`}
                                                    value={formik.values.services[index].notes}
                                                    placeholder="Note"
                                                    onChange={(e) => handlenoteChange(e, index)}
                                                    onBlur={formik.handleBlur}
                                                    disabled={!iseditable}
                                                    className={`form-input text-white-dark mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${!iseditable ? "readonly" : ""
                                                        }`}
                                                    style={{ height: "42px" }} // Fixed height for consistent layout
                                                />
                                                <div
                                                    style={{ height: "22px" }} // Fixed height for error message space
                                                >
                                                    {formik.errors.services?.[index]?.notes &&
                                                        formik.touched.services?.[index]?.notes && (
                                                            <div className="text-red-500 text-sm mt-1">
                                                                <span>Note is required</span>
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                            {iseditable ? (
                                                <div className="w-full lg:w-1/12 flex items-center ">
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
                                {/* <div className="">
                                    <div className="font-semibold text-lg">
                                        Total Amount: {currency} {totalAmount.toFixed(2)}
                                    </div>
                                </div> */}
                                {iseditable && formik.values.services.length > 0 && (
                                    <div className="mt-6">
                                        <button type="submit" className="btn btn-primary">
                                            Submit
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <img
                                src={noDataImage} // Use the imported image directly as the source
                                alt="no data found"
                                className="all-center-flex nodata-image"
                            />
                        )}
                    </form>


                }


            </div>


        </>
    );
};

export default withApiHandler(EmployeePayments);
