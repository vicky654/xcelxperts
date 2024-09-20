import React, { useEffect, useState } from 'react';
import withApiHandler from '../../../utils/withApiHandler';
import { CommonDataEntryProps } from '../../commonInterfaces';
import useErrorHandler from '../../../hooks/useHandleError';
import { Formik, Form, Field, ErrorMessage, FieldProps, FieldArray } from 'formik';
import * as Yup from 'yup';
import DataTable from 'react-data-table-component';

import noDataImage from '../../../assets/AuthImages/noDataFound.png';
import LoaderImg from '../../../utils/Loader';
import { handleDownloadPdf } from '../../CommonFunctions';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Badge } from '@mantine/core';
import { currency } from '../../../utils/CommonData';
import { IRootState } from '../../../store';
import { useSelector } from 'react-redux';

interface ShopSalesData {
    id: string;
    lubricant_name: string;
    lubricant_size: string;
    purchage_price: number;
    opening: number;
    sale: number;
    closing: number;
    sale_price: number;
    purchage_amount: number;
    sale_amount: number;
    profit: number;
    update_purchage_price: boolean;
    update_opening: boolean;
    update_sale: boolean;
    update_closing: boolean;
    update_sale_price: boolean;
    update_purchage_amount: boolean;
    update_sale_amount: boolean;
    update_profit: boolean;
}

interface FormValues {
    data: ShopSalesData[];
}

const validationSchema = Yup.object().shape({
    data: Yup.array().of(
        Yup.object().shape({
            purchage_price: Yup.number().required('Purchase Price is required'),
            opening: Yup.number().required('Opening is required'),
            sale: Yup.number().required('Sale is required'),
            sale_price: Yup.number().required('Sale Price is required'),
            profit: Yup.number().required('Sale Price is required'),
            closing: Yup.number().required('Closing is required'),
            sale_amount: Yup.number().required('Sale Amount is required'),
        })
    ),
});

const ShopSales: React.FC<CommonDataEntryProps> = ({ stationId, startDate, postData, getData, isLoading, applyFilters }) => {
    const [data, setData] = useState<ShopSalesData[]>([]);
    const [isEditable, setIsEditable] = useState(true);
    const [isdownloadpdf, setIsdownloadpdf] = useState(true);
    const handleApiError = useErrorHandler();

    const Permissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);

    const isReportGeneratePermissionAvailable = Permissions?.includes('report-generate');

    useEffect(() => {
        if (stationId && startDate) {
            handleApplyFilters(stationId, startDate);
        }
    }, [stationId, startDate]);

    const handleApplyFilters = async (stationId: string | null, startDate: string | null) => {
        try {
            const response = await getData(`/data-entry/lube-sale/list?station_id=${stationId}&drs_date=${startDate}`);
            if (response && response.data && response.data.data) {
                setData(response.data.data.listing);






                setIsdownloadpdf(response.data.data?.download_pdf);
                setIsEditable(response.data.data.is_editable);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleSubmit = async (values: { data: ShopSalesData[] }) => {
        try {
            const formData = new FormData();

            values.data.forEach((obj) => {
                formData.append(`opening[${obj.id}]`, obj.opening.toString());
                formData.append(`purchage_price[${obj.id}]`, obj.purchage_price.toString());
                formData.append(`sale[${obj.id}]`, obj.sale.toString());
                formData.append(`sale_price[${obj.id}]`, obj.sale_price.toString());
            });

            if (stationId && startDate) {
                formData.append('drs_date', startDate);
                formData.append('station_id', stationId);
            }

            const url = `data-entry/lube-sale/update`;
            const isSuccess = await postData(url, formData);

            if (isSuccess) {
                handleApplyFilters(stationId, startDate);
                applyFilters({ station_id: stationId, start_date: startDate, selectedCardName: "Lubes Sales" });
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
        value: any,
        row: ShopSalesData
    ) => {
        // Convert empty string to 0 or keep it as-is if it's already a number
        const numericValue = parseFloat(value);

        // Update the field value in the form values
        setFieldValue(`data[${index}].${field}`, numericValue);
        if (field == 'opening' || field === 'sale' || field === 'sale_price' || field === 'purchage_price') {


            const opening = field === 'opening' ? numericValue : values.data[index].opening;
            const sale = field === 'sale' ? numericValue : values.data[index].sale;
            const salePrice = field === 'sale_price' ? numericValue : values.data[index].sale_price;
            const purchageprice = field === 'purchage_price' ? numericValue : values.data[index].purchage_price;

            const closing = opening - sale;
            setFieldValue(`data[${index}].closing`, closing.toFixed(2));
            const saleAmount = sale * salePrice;
            const purchaseAmount = purchageprice * sale;
            var CalculatedProfit = saleAmount - purchaseAmount;


            setFieldValue("CalculatedProfit", CalculatedProfit.toFixed(2))
            setFieldValue(`data[${index}].sale_amount`, saleAmount.toFixed(2));
            setFieldValue(`data[${index}].profit`, CalculatedProfit.toFixed(2));
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
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-item">Item</Tooltip>}
                >
                    <span>Item</span>
                </OverlayTrigger>
            ),
            sortable: false,
            selector: (row: ShopSalesData) => row.lubricant_name,
            cell: (row: ShopSalesData, index: number) => <span
                tabIndex={getTabIndex(index, 0)}
            >{row.lubricant_name}</span>,
        },
        {
            name: (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-size">Size</Tooltip>}
                >
                    <span>Size</span>
                </OverlayTrigger>
            ),
            sortable: false,
            selector: (row: ShopSalesData) => row.lubricant_size,
            cell: (row: ShopSalesData) => <span>{row.lubricant_size}</span>,
        },
        {
            name: (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-purchase-price">Purchase Price</Tooltip>}
                >
                    <span>Purchase Price</span>
                </OverlayTrigger>
            ),
            sortable: false,
            cell: (row: ShopSalesData, index: number) => (
                <>
                    <Field name={`data[${index}].purchage_price`}>
                        {({ field, form: { setFieldValue, values }, meta: { touched, error } }: FieldProps<any>) => (
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder='Value'
                                    {...field}
                                    className={`form-input workflorform-input ${!row.update_purchage_price ? 'readonly' : ''} ${touched && error ? ' errorborder border-red-500' : ''}   `}
                                    readOnly={!row.update_purchage_price}
                                    onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'purchage_price', e.target.value, row)}

                                    onKeyDown={(e) => handleNavigation(e, index)}
                                    tabIndex={!row.update_purchage_price ? -1 : getTabIndex(index, 3)}

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
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-opening-qty">Opening Qty</Tooltip>}
                >
                    <span>Opening Qty</span>
                </OverlayTrigger>
            ),
            sortable: false,
            cell: (row: ShopSalesData, index: number) => (
                <>
                    <Field name={`data[${index}].opening`}>
                        {({ field, form: { setFieldValue, values }, meta: { touched, error } }: FieldProps<any>) => (
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder='Value'
                                    {...field}
                                    className={`form-input workflorform-input ${!row.update_opening ? 'readonly' : ''} ${touched && error ? ' errorborder border-red-500' : ''}   `}
                                    readOnly={!row.update_opening}
                                    onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'opening', e.target.value, row)}

                                    onKeyDown={(e) => handleNavigation(e, index)}
                                    tabIndex={!row.update_opening ? -1 : getTabIndex(index, 4)}

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
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-sale-qty">Sale Qty</Tooltip>}
                >
                    <span>Sale Qty</span>
                </OverlayTrigger>
            ),
            sortable: false,
            cell: (row: ShopSalesData, index: number) => (
                <>
                    <Field name={`data[${index}].sale`}>
                        {({ field, form: { setFieldValue, values }, meta: { touched, error } }: FieldProps<any>) => (
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder='Value'
                                    {...field}
                                    className={`form-input workflorform-input ${!row.update_sale ? 'readonly' : ''} ${touched && error ? ' errorborder border-red-500' : ''}   `}
                                    readOnly={!row.update_sale}
                                    onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'sale', e.target.value, row)}


                                    onKeyDown={(e) => handleNavigation(e, index)}
                                    tabIndex={!row.update_sale ? -1 : getTabIndex(index, 5)}

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
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-closing-qty">Closing Qty</Tooltip>}
                >
                    <span>Closing Qty</span>
                </OverlayTrigger>
            ),
            sortable: false,
            cell: (row: ShopSalesData, index: number) => (
                <>
                    <Field name={`data[${index}].closing`}>
                        {({ field, form: { setFieldValue, values }, meta: { touched, error } }: FieldProps<any>) => (
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder='Value'
                                    {...field}
                                    className={`form-input workflorform-input ${!row.update_closing ? 'readonly' : ''} ${touched && error ? ' errorborder border-red-500' : ''}   `}
                                    readOnly={!row.update_closing}
                                    onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'closing', e.target.value, row)}

                                    onKeyDown={(e) => handleNavigation(e, index)}
                                    tabIndex={!row.update_closing ? -1 : getTabIndex(index, 6)}


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
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-rate">Rate</Tooltip>}
                >
                    <span>Rate</span>
                </OverlayTrigger>
            ),
            sortable: false,
            cell: (row: ShopSalesData, index: number) => (
                <>
                    <Field name={`data[${index}].sale_price`}>
                        {({ field, form: { setFieldValue, values }, meta: { touched, error } }: FieldProps<any>) => (
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder='Value'
                                    {...field}
                                    className={`form-input workflorform-input ${!row.update_sale_price ? 'readonly' : ''} ${touched && error ? ' errorborder border-red-500' : ''}   `}
                                    readOnly={!row.update_sale_price}
                                    onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'sale_price', e.target.value, row)}


                                    onKeyDown={(e) => handleNavigation(e, index)}
                                    tabIndex={!row.update_sale_price ? -1 : getTabIndex(index, 7)}

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
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-amount">Amount</Tooltip>}
                >
                    <span>Amount</span>
                </OverlayTrigger>
            ),
            sortable: false,
            cell: (row: ShopSalesData, index: number) => (
                <>
                    <Field name={`data[${index}].sale_amount`}>
                        {({ field, form: { setFieldValue, values }, meta: { touched, error } }: FieldProps<any>) => (
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder='Value'
                                    {...field}
                                    className={`form-input workflorform-input ${!row.update_sale_amount ? 'readonly' : ''} ${touched && error ? ' errorborder border-red-500' : ''}   `}
                                    readOnly={!row.update_sale_amount}
                                    onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'sale_amount', e.target.value, row)}

                                    onKeyDown={(e) => handleNavigation(e, index)}
                                    tabIndex={!row.update_sale_amount ? -1 : getTabIndex(index, 8)}

                                />


                            </div>
                        )}
                    </Field>
                </>
            ),
        },
    ];

    if (isLoading) {
        return <LoaderImg />;
    }

    const calculateFields = (data: ShopSalesData[]): ShopSalesData[] => {
        return data.map(item => {
            let purchage_amount = 0;
            let sale_amount = 0;
            let profit = 0;

            // if (item) {

            //     sale_amount = item.sale * item.sale_price;
            //     purchage_amount =  item.purchage_price * item.sale;
            //     profit = sale_amount - purchage_amount;

            // }
            if (item) {
                purchage_amount = item.purchage_price * item.sale;
            }

            if (item) {
                sale_amount = item.sale * item.sale_price;
            }

            if (item?.profit) {

                profit = sale_amount - purchage_amount;

            }

            return {
                ...item,
                purchage_amount,
                sale_amount,
                profit,
            };
        });
    };


    return (
        <>
            {isLoading && <LoaderImg />}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="text-lg font-semibold mb-4 displaycanter">
                    {`Lubes Sales`} {startDate ? `(${startDate})` : ''} {isdownloadpdf && (<span onClick={() => handleDownloadPdf('lube-sales', stationId, startDate, getData, handleApiError)}>
                        {isReportGeneratePermissionAvailable && (<>
                            <OverlayTrigger placement="top" overlay={<Tooltip className="custom-tooltip" >Download Report</Tooltip>}>
                                <i style={{ fontSize: "20px", color: "red", cursor: "pointer" }} className="fi fi-tr-file-pdf"></i>
                            </OverlayTrigger>
                        </>)}

                    </span>)}

                </h1>

            </div>
            <div>

                <Formik
                    initialValues={{ data }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    {({ values, setFieldValue }) => {

                        const updatedData = calculateFields(values?.data);
                        const totalSaleAmount = updatedData.reduce((total, item) => total + item.sale_amount, 0);
                        const totalProfitAmount = updatedData.reduce((total, item) => total + item.profit, 0);

                        return (
                            <Form className='auto-height-react-table'>
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
                                        />
                                    )}
                                />


                                <footer className='flexspacebetween'>
                                    {isEditable && <button type="submit" className="btn btn-primary submit-button mt-3">
                                        Submit
                                    </button>}


                                    <div className='flex mt-4 text-end '>
                                        <Badge className='bg-primary' style={{ borderRadius: "0px", color: "#fff", fontSize: "12px" }}>
                                            Total Amount:  {currency} {isEditable
                                                ? (isNaN(totalSaleAmount) ? '--' : totalSaleAmount.toFixed(2))
                                                : (isNaN(totalSaleAmount) ? '0' : totalSaleAmount.toFixed(2))}
                                        </Badge>
                                        <Badge className=' bg-success ms-2 ' style={{ borderRadius: "0px", color: "#fff", fontSize: "12px" }}>
                                            Total Profit: {currency} {isEditable
                                                ? (isNaN(totalProfitAmount) ? '0' : totalProfitAmount.toFixed(2))
                                                : (isNaN(totalProfitAmount) ? '--' : totalProfitAmount.toFixed(2))}
                                        </Badge>
                                    </div>

                                </footer>


                            </Form>
                        );
                    }}
                </Formik>

            </div>
        </>
    );
};

export default withApiHandler(ShopSales);
