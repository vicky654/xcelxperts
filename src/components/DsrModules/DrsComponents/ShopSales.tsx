import React, { useEffect, useState } from 'react';
import withApiHandler from '../../../utils/withApiHandler';
import { CommonDataEntryProps } from '../../commonInterfaces';
import useErrorHandler from '../../../hooks/useHandleError';
import { Formik, Form, Field, ErrorMessage, FieldProps, FieldArray } from 'formik';
import * as Yup from 'yup';
import DataTable from 'react-data-table-component';

import noDataImage from '../../../assets/noDataFoundImage/noDataFound.png';
import LoaderImg from '../../../utils/Loader';

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
            closing: Yup.number().required('Closing is required'),
            sale_amount: Yup.number().required('Sale Amount is required'),
        })
    ),
});

const ShopSales: React.FC<CommonDataEntryProps> = ({ stationId, startDate, postData, getData, isLoading, applyFilters }) => {
    const [data, setData] = useState<ShopSalesData[]>([]);
    const [isEditable, setIsEditable] = useState(true);

    const handleApiError = useErrorHandler();

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
        console.log(numericValue, "numericValue");
        // Update the field value in the form values
        setFieldValue(`data[${index}].${field}`, numericValue);
        if (field == 'opening' || field === 'sale' || field === 'sale_price') {
            // const opening = values.data[index].opening ;
            // const sale = values.data[index].sale ;
            // const salePrice = values.data[index].sale_price ;
            // console.log(opening, sale, salePrice, "opening");

            const opening = field === 'opening' ? numericValue : values.data[index].opening;
            const sale = field === 'sale' ? numericValue : values.data[index].sale;
            const salePrice = field === 'sale_price' ? numericValue : values.data[index].sale_price;
console.log(opening, "opening");
console.log(sale, "sale");
            const closing = opening - sale;
            console.log(closing, "closing");
            setFieldValue(`data[${index}].closing`, closing);



            // // Calculate 'closing' as 'opening - sale'
            // const closing = opening - sale;
            // setFieldValue(`data[${index}].closing`, closing);

            // Calculate 'sale_amount' as '(opening - sale) * sale_price'
            const saleAmount = sale * salePrice;
            setFieldValue(`data[${index}].sale_amount`, saleAmount);
        }
    };

    const columns = [
        {
            name: 'Item',
            selector: (row: ShopSalesData) => row.lubricant_name,
            cell: (row: ShopSalesData) => <span>{row.lubricant_name}</span>,
        },
        {
            name: 'Size',
            selector: (row: ShopSalesData) => row.lubricant_size,
            cell: (row: ShopSalesData) => <span>{row.lubricant_size}</span>,
        },
        {
            name: 'Purchase Price',
            cell: (row: ShopSalesData, index: number) => (
                <>
                    <Field name={`data[${index}].purchage_price`}>
                        {({ field, form: { setFieldValue, values } }: FieldProps<any>) => (
                            <div className="relative">
                                <input
                                    type="number"
                                    {...field}
                                    className={`form-input ${!row.update_purchage_price ? 'readonly' : ''}`}
                                    readOnly={!row.update_purchage_price}
                                    onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'purchage_price', e.target.value, row)}
                                />
                                <ErrorMessage name={`data[${index}].purchage_price`} component="div" className="text-red-500 text-xs mt-1 absolute left-0" />
                            </div>
                        )}
                    </Field>
                </>
            ),
        },
        {
            name: 'Opening',
            cell: (row: ShopSalesData, index: number) => (
                <>
                    <Field name={`data[${index}].opening`}>
                        {({ field, form: { setFieldValue, values } }: FieldProps<any>) => (
                            <div className="relative">
                                <input
                                    type="number"
                                    {...field}
                                    className={`form-input ${!row.update_opening ? 'readonly' : ''}`}
                                    readOnly={!row.update_opening}
                                    onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'opening', e.target.value, row)}
                                />
                                <ErrorMessage name={`data[${index}].opening`} component="div" className="text-red-500 text-xs mt-1 absolute left-0" />
                            </div>
                        )}
                    </Field>
                </>
            ),
        },

        {
            name: 'Sales ',
            cell: (row: ShopSalesData, index: number) => (
                <>
                    <Field name={`data[${index}].sale`}>
                        {({ field, form: { setFieldValue, values } }: FieldProps<any>) => (
                            <div className="relative">
                                <input
                                    type="number"
                                    {...field}
                                    className={`form-input ${!row.update_sale ? 'readonly' : ''}`}
                                    readOnly={!row.update_sale}
                                    onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'sale', e.target.value, row)}
                                />
                                <ErrorMessage name={`data[${index}].sale`} component="div" className="text-red-500 text-xs mt-1 absolute left-0" />
                            </div>
                        )}
                    </Field>
                </>
            ),
        },
        {
            name: 'Closing',
            cell: (row: ShopSalesData, index: number) => (
                <>
                    <Field name={`data[${index}].closing`}>
                        {({ field, form: { setFieldValue, values } }: FieldProps<any>) => (
                            <div className="relative">
                                <input
                                    type="number"
                                    {...field}
                                    className={`form-input ${!row.update_closing ? 'readonly' : ''}`}
                                    readOnly={!row.update_closing}
                                    onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'closing', e.target.value, row)}
                                />
                                <ErrorMessage name={`data[${index}].closing`} component="div" className="text-red-500 text-xs mt-1 absolute left-0" />
                            </div>
                        )}
                    </Field>
                </>
            ),
        },
        {
            name: 'Rate',
            cell: (row: ShopSalesData, index: number) => (
                <>
                    <Field name={`data[${index}].sale_price`}>
                        {({ field, form: { setFieldValue, values } }: FieldProps<any>) => (
                            <div className="relative">
                                <input
                                    type="number"
                                    {...field}
                                    className={`form-input ${!row.update_sale_price ? 'readonly' : ''}`}
                                    readOnly={!row.update_sale_price}
                                    onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'sale_price', e.target.value, row)}
                                />
                                <ErrorMessage name={`data[${index}].sale_price`} component="div" className="text-red-500 text-xs mt-1 absolute left-0" />
                            </div>
                        )}
                    </Field>
                </>
            ),
        },
        {
            name: ' Amount',
            cell: (row: ShopSalesData, index: number) => (
                <>
                    <Field name={`data[${index}].sale_amount`}>
                        {({ field, form: { setFieldValue, values } }: FieldProps<any>) => (
                            <div className="relative">
                                <input
                                    type="number"
                                    {...field}
                                    className={`form-input ${!row.update_sale_amount ? 'readonly' : ''}`}
                                    readOnly={!row.update_sale_amount}
                                    onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'sale_amount', e.target.value, row)}
                                />
                                <ErrorMessage name={`data[${index}].sale_amount`} component="div" className="text-red-500 text-xs mt-1 absolute left-0" />
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

    return (
        <>
        {isLoading && <LoaderImg />}

        <div>
            <h1 className="text-lg font-semibold mb-4 ">{`Lube Sale `} {startDate ? `(${startDate})` : ''}</h1>

            <Formik
                initialValues={{ data }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ values, setFieldValue }) => (
                    <Form>
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
      <footer> {isEditable &&     <button type="submit" className=" btn btn-primary submit-button">
                                    Submit
                                </button>}</footer>
                     
                     
                    </Form>
                )}
            </Formik>

            {/* {data.length !== 0 && (
                  <img
                  src={noDataImage} // Use the imported image directly as the source
                  alt="no data found"
                  className="all-center-flex nodata-image"
              />
            )} */}
        </div>
        </>
    );
};

export default withApiHandler(ShopSales);
