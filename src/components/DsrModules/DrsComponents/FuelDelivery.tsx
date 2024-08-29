import React, { useEffect, useRef, useState } from 'react';
import withApiHandler from '../../../utils/withApiHandler';
import { CommonDataEntryProps } from '../../commonInterfaces';
import useErrorHandler from '../../../hooks/useHandleError';
import { Formik, Form, Field, FieldArray, ErrorMessage, FieldProps, FormikProps } from 'formik';
import * as Yup from 'yup';
import DataTable from 'react-data-table-component';

import noDataImage from '../../../assets/AuthImages/noDataFound.png';
import LoaderImg from '../../../utils/Loader';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface FuelDeliveryData {
    id: string;
    fuel_name: string;
    tank_name: string;
    opening: any;
    delivery_volume: any;
    sales_volume: any;
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



type FormikInstance = FormikProps<any>;

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

const FuelDelivery: React.FC<CommonDataEntryProps> = ({ stationId, startDate, postData, getData, isLoading, applyFilters }) => {
    const [data, setData] = useState<FuelDeliveryData[]>([]);
    const [isEditable, setIsEditable] = useState(true);

    const handleApiError = useErrorHandler();

    useEffect(() => {
        if (stationId && startDate) {
            handleApplyFilters(stationId, startDate);
        }
    }, [stationId, startDate]);

    const handleApplyFilters = async (stationId: string | null, startDate: string | null) => {
        try {
            const response = await getData(`/data-entry/fuel-delivery/list?station_id=${stationId}&drs_date=${startDate}`);
            if (response && response.data && response.data.data) {
                setData(response.data.data.listing);
                setIsEditable(response.data.data.is_editable);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleSubmit = async (values: FormValues) => {
        try {
            const formData = new FormData();

            values.data.forEach((obj) => {
                if (obj.id) {
                    const id = obj.id;

                    formData.append(`opening[${id}]`, obj.opening.toString());
                    formData.append(`delivery_volume[${id}]`, obj.delivery_volume.toString());
                    formData.append(`sales_volume[${id}]`, obj.sales_volume.toString());
                    formData.append(`book_stock[${id}]`, obj.book_stock.toString());
                    formData.append(`dips_stock[${id}]`, obj.dips_stock.toString());
                    formData.append(`variance[${id}]`, obj.variance.toString());
                }
            });

            if (stationId && startDate) {
                formData.append('drs_date', startDate);
                formData.append('station_id', stationId);
            }

            const url = `data-entry/fuel-delivery/update`;

            const isSuccess = await postData(url, formData);
            if (isSuccess) {
                if (stationId && startDate) {
                    handleApplyFilters(stationId, startDate);
                    applyFilters({ station_id: stationId, start_date: startDate, selectedCardName: "Fuel Stock" });
                }
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleFieldChange = (
        setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void,
        values: FormValues,
        index: number,
        field: string,
        value: any,
        row: FuelDeliveryData
    ) => {
        const numericValue: any = parseFloat(value);
        setFieldValue(`data[${index}].${field}`, numericValue);

        // Update book_stock field if opening, delivery_volume, or sales_volume changes
        if (field === 'opening' || field === 'delivery_volume' || field === 'sales_volume') {

            const opening = field === 'opening' ? Number(numericValue) : Number(values.data[index].opening);
            let delivery_volume = field === 'delivery_volume' ? Number(numericValue) : Number(values.data[index].delivery_volume);
            const sales_volume = field === 'sales_volume' ? Number(numericValue) : Number(values.data[index].sales_volume);





            const newBookStock = opening + delivery_volume - sales_volume;
            setFieldValue(`data[${index}].book_stock`, newBookStock.toFixed(2));
            // setFieldValue(`data[${index}].dips_stock`, newBookStock.toFixed(2));
            // Update variance
            const dips_stock = values.data[index].dips_stock;
            const newVariance = dips_stock - newBookStock;
            setFieldValue(`data[${index}].variance`, newVariance.toFixed(2));
        }

        // Update dips_stock field if dips_stock changes
        if (field === 'dips_stock') {
            const newVariance = numericValue - values.data[index].book_stock;
            setFieldValue(`data[${index}].variance`, newVariance.toFixed(2));
        }
    };


    const getTabIndex = (rowIndex: number, colIndex: number) => {
        // Adjust the base index according to your needs
        return rowIndex * columns.length + colIndex + 1;
    };



    const handleNavigation = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const validKeys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'];

        if (!validKeys.includes(e.key)) {
            return; // Allow default behavior for other keys
        }

        // Check if Ctrl key is pressed
        const isCtrlPressed = e.ctrlKey;

        // Only handle navigation if Ctrl is pressed and key is ArrowRight, ArrowLeft, ArrowDown, or ArrowUp
        if (!isCtrlPressed && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
            return;
        }

        e.preventDefault(); // Prevent default arrow key behavior for navigation keys

        const inputs = Array.from(document.querySelectorAll('.workflorform-input')) as HTMLInputElement[];
        const currentInput = e.currentTarget as HTMLInputElement;
        const currentTabIndex = currentInput.tabIndex;

        let nextInput: HTMLInputElement | null = null;

        switch (e.key) {
            case 'ArrowRight':
                if (isCtrlPressed) {
                    nextInput = inputs.find(input => input.tabIndex > currentTabIndex && input.tabIndex !== -1) || null;
                }
                break;
            case 'ArrowLeft':
                if (isCtrlPressed) {
                    nextInput = inputs.slice().reverse().find(input => input.tabIndex < currentTabIndex && input.tabIndex !== -1) || null;
                }
                break;
            case 'ArrowDown':
                if (isCtrlPressed) {
                    nextInput = inputs.find(input => input.tabIndex === currentTabIndex + columns.length) || null;
                }
                break;
            case 'ArrowUp':
                if (isCtrlPressed) {
                    nextInput = inputs.find(input => input.tabIndex === currentTabIndex - columns.length) || null;
                }
                break;
            default:
                break;
        }

        if (nextInput) {
            nextInput.focus();
        }
    };

    const columns = [
        {
            name: (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-fuel">Fuel </Tooltip>}
                >
                    <span >Fuel</span>
                </OverlayTrigger>
            ),
            selector: (row: FuelDeliveryData) => row.fuel_name,
            cell: (row: FuelDeliveryData, index: number) => (
                <span tabIndex={getTabIndex(index, 0)}>{row.fuel_name}</span>
            ),
        },
        {
            name: (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-tank">Tank </Tooltip>}
                >
                    <span >Tank</span>
                </OverlayTrigger>
            ),
            selector: (row: FuelDeliveryData) => row.tank_name,
            cell: (row: FuelDeliveryData, index: number) => <span tabIndex={getTabIndex(index, 1)}>{row.tank_name}</span>,
        },
        {
            name: (
                <div className='flexcenter'>
                    <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip className='custom-tooltip' id="tooltip-opening-stock">Opening Stock</Tooltip>}
                    >
                        <span >Opening Stock </span>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip className='custom-tooltip' id="tooltip-variance">
                                Previous Dip Stock = Opening Stock
                            </Tooltip>
                        }
                    >
                        <span> <i className="fi fi-sr-comment-info  pointer"></i></span>
                    </OverlayTrigger>
                </div>
            ),
            cell: (row: FuelDeliveryData, index: number) => (
                <>
                    <Field name={`data[${index}].opening`}>
                        {({ field, form: { setFieldValue, values }, meta: { touched, error } }: FieldProps<any>) => (
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder='value'
                                    {...field}
                                    className={`form-input workflorform-input ${!row.update_opening ? 'readonly' : ''} ${touched && error ? ' errorborder border-red-500' : ''}`}
                                    readOnly={!row.update_opening}
                                    onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'opening', e.target.value, row)}
                                    onKeyDown={(e) => handleNavigation(e, index)}
                                    tabIndex={!row.update_opening ? -1 : getTabIndex(index, 2)}


                                />
                                {/* {touched && error && (
                                    <ErrorMessage name={`data[${index}].opening`} component="div" className="text-red-500 text-xs mt-1 absolute left-0" />
                                )} */}
                            </div>
                        )}
                    </Field>
                </>
            ),
        },

        {
            name: (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-received-stock">Received Stock</Tooltip>}
                >
                    <span >Received Stock</span>
                </OverlayTrigger>
            ),
            cell: (row: FuelDeliveryData, index: number) => (
                <>
                    <Field name={`data[${index}].delivery_volume`}>
                        {({ field, form: { setFieldValue, values }, meta: { touched, error } }: FieldProps<any>) => (
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder='value'
                                    {...field}
                                    className={`form-input workflorform-input ${!row.update_delivery_volume ? 'readonly' : ''} ${touched && error ? ' errorborder border-red-500' : ''} `}
                                    readOnly={!row.update_delivery_volume}
                                    onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'delivery_volume', e.target.value, row)}

                                    onKeyDown={(e) => handleNavigation(e, index)}
                                    tabIndex={!row.update_delivery_volume ? -1 : getTabIndex(index, 3)}

                                />
                            </div>
                        )}
                    </Field>
                </>
            ),
        },
        {
            name: (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-sales-volume">Sales Volume</Tooltip>}
                >
                    <span >Sales Volume</span>
                </OverlayTrigger>
            ),
            cell: (row: FuelDeliveryData, index: number) => (
                <>
                    <Field name={`data[${index}].sales_volume`}>
                        {({ field, form: { setFieldValue, values }, meta: { touched, error } }: FieldProps<any>) => (
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder='value'
                                    {...field}
                                    className={`form-input workflorform-input ${!row.update_sales_volume ? 'readonly' : ''} ${touched && error ? ' errorborder border-red-500' : ''}`}
                                    readOnly={!row.update_sales_volume}
                                    onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'sales_volume', e.target.value, row)}

                                    onKeyDown={(e) => handleNavigation(e, index)}
                                    tabIndex={!row.update_sales_volume ? -1 : getTabIndex(index, 4)}
                                />

                                {/* <ErrorMessage name={`data[${index}].sales_volume`} component="div" className="text-red-500 text-xs mt-1 absolute left-0" /> */}

                            </div>
                        )}
                    </Field>
                </>
            ),
        },
        {
            name: (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-book-stock">Book Stock</Tooltip>}
                >
                    <span >Book Stock</span>
                </OverlayTrigger>
            ),
            cell: (row: FuelDeliveryData, index: number) => (
                <>
                    <Field name={`data[${index}].book_stock`}>
                        {({ field, form: { setFieldValue, values }, meta: { touched, error } }: FieldProps<any>) => (
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder='value'
                                    {...field}
                                    className="form-input workflorform-input readonly"
                                    readOnly

                                    onKeyDown={(e) => handleNavigation(e, index)}
                                    tabIndex={-1}
                                />
                                {/* <ErrorMessage name={`data[${index}].book_stock`} component="div" className="text-red-500 text-xs mt-1 absolute left-0" /> */}
                            </div>
                        )}
                    </Field>
                </>
            ),
        },
        {
            name: (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-dips-stock">Dips Stock</Tooltip>}
                >
                    <span >Dips Stock</span>
                </OverlayTrigger>
            ),
            cell: (row: FuelDeliveryData, index: number) => (
                <>
                    <Field name={`data[${index}].dips_stock`}>
                        {({ field, form: { setFieldValue, values }, meta: { touched, error } }: FieldProps<any>) => (
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder='value'
                                    {...field}
                                    className={`form-input workflorform-input ${!row.update_dips_stock ? 'readonly' : ''} ${touched && error ? ' errorborder border-red-500' : ''}`}
                                    readOnly={!row.update_dips_stock}
                                    onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'dips_stock', e.target.value, row)}

                                    onKeyDown={(e) => handleNavigation(e, index)}
                                    tabIndex={!row.update_dips_stock ? -1 : getTabIndex(index, 6)}
                                />
                                {/* <ErrorMessage name={`data[${index}].dips_stock`} component="div" className="text-red-500 text-xs mt-1 absolute left-0" /> */}
                            </div>
                        )}
                    </Field>
                </>
            ),
        },
        {
            name: (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-variance">Variance</Tooltip>}
                >
                    <span >Variance</span>
                </OverlayTrigger>
            ),
            cell: (row: FuelDeliveryData, index: number) => (
                <>
                    <Field name={`data[${index}].variance`}>
                        {({ field }: FieldProps<any>) => (
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder='value'
                                    {...field}
                                    className="form-input workflorform-input readonly"
                                    readOnly
                                    onKeyDown={(e) => handleNavigation(e, index)}
                                    tabIndex={-1}
                                />
                                {/* <ErrorMessage name={`data[${index}].variance`} component="div" className="text-red-500 text-xs mt-1 absolute left-0" /> */}
                            </div>
                        )}
                    </Field>
                </>
            ),
        },
    ];



    const formikRef = useRef<FormikInstance | null>(null);

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.altKey && event.key === 'Enter') {
                event.preventDefault(); // Prevent default action of Alt + Enter
                if (formikRef.current) {
                    formikRef.current.handleSubmit();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <>
            {isLoading && <LoaderImg />}

            <div className="w-full">
                <h1 className="text-lg font-semibold mb-4 ">{`Fuel Stock`} {startDate ? `(${startDate})` : ''}</h1>

                {data.length > 0 ? (
                    <Formik
                        innerRef={formikRef} // Attach the ref to Formik
                        initialValues={{ data: data }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ values }) => (
                            <Form className="w-full auto-height-react-table">
                                <FieldArray
                                    name="data"
                                    render={() => (
                                        <DataTable
                                            columns={columns}
                                            data={values.data}
                                            noHeader
                                            customStyles={{
                                                cells: {
                                                    style: {
                                                        padding: '8px',
                                                    },
                                                },
                                            }}
                                            style={{ width: '100%' }}
                                        />
                                    )}
                                />
                                <footer> {isEditable && <button type="submit" className=" btn btn-primary submit-button">
                                    Submit
                                </button>}</footer>
                            </Form>
                        )}
                    </Formik>
                ) : (
                    <img
                        src={noDataImage} // Use the imported image directly as the source
                        alt="no data found"
                        className="all-center-flex nodata-image"
                    />
                )}

            </div>
        </>
    );
};

export default withApiHandler(FuelDelivery);
