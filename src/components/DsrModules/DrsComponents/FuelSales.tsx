import React, { useEffect, useState } from 'react';
import withApiHandler from '../../../utils/withApiHandler';
import { CommonDataEntryProps } from '../../commonInterfaces';
import useErrorHandler from '../../../hooks/useHandleError';
import { Formik, Form, Field, FieldArray, FieldProps } from 'formik';
import * as Yup from 'yup';
import DataTable from 'react-data-table-component';
import noDataImage from '../../../assets/noDataFoundImage/noDataFound.png';
import LoaderImg from '../../../utils/Loader';
import { handleDownloadPdf } from '../../CommonFunctions';

interface FuelSalesData {
    id: number;
    fuel_name: string;
    fuel_price: string;
    sales_volume: number;
    gross_value: number;
    discount: number;
    nett_value: number;
    update_discount: boolean;
    update_gross_value: boolean;
    update_nett_value: boolean;
    update_price: boolean;
    update_sales_volume: boolean;
}

interface FormValues {
    data: FuelSalesData[];
}

const validationSchema = Yup.object({
    data: Yup.array().of(
        Yup.object().shape({
            sales_volume: Yup.number().required('Required'),
            gross_value: Yup.number().required('Required'),
            discount: Yup.number().required('Required'),
            nett_value: Yup.number().required('Required'),
        })
    ),
});

const FuelSales: React.FC<CommonDataEntryProps> = ({ stationId, startDate, postData, getData, isLoading, applyFilters }) => {
    const [data, setData] = useState<FuelSalesData[]>([]);
    const [iseditable, setIsEditable] = useState(true);
    const [isconsiderNozzle, setconsiderNozzle] = useState(true);
    const [isdownloadpdf, setIsdownloadpdf] = useState(true);

    const handleApiError = useErrorHandler();

    useEffect(() => {
        if (stationId && startDate) {
            handleApplyFilters(stationId, startDate,);
        }
    }, [stationId, startDate]);

    const handleApplyFilters = async (stationId: string | null, startDate: string | null) => {
        try {
            const response = await getData(`/data-entry/fuel-sale/list?drs_date=${startDate}&station_id=${stationId}`);
            if (response && response.data && response.data.data) {

                setData(response.data.data?.listing);
                setIsEditable(response.data.data?.is_editable);
                setconsiderNozzle(response.data.data?.considerNozzle);
                setIsdownloadpdf(response.data.data?.download_pdf);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        }
    };
    const DownloadPdf = async (stationId: string | null, startDate: string | null) => {
        try {
            const response = await getData(`/pdf/fuel-sales?drs_date=${startDate}&station_id=${stationId}`);
            if (response && response.data && response.data.data) {
                console.log(response.data.data, "response.data.data");
                // setData(response.data.data?.listing);
                // setIsEditable(response.data.data?.is_editable);
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
                if (obj.id !== undefined) {
                    const id = obj.id;

                    // Append each field with its corresponding id as part of the key
                    formData.append(`gross_value[${id}]`, obj.gross_value.toString());
                    formData.append(`discount[${id}]`, obj.discount.toString());
                    formData.append(`nett_value[${id}]`, obj.nett_value.toString());
                    formData.append(`sales_volume[${id}]`, obj.sales_volume.toString());
                }
            });

            if (stationId && startDate) {
                formData.append('drs_date', startDate);

                formData.append('station_id', stationId);
            }


            const url = `data-entry/fuel-sale/update`;

            const isSuccess = await postData(url, formData);
            if (isSuccess) {
                if (stationId && startDate) {
                    handleApplyFilters(stationId, startDate);
                    applyFilters({ station_id: stationId, start_date: startDate, selectedCardName: "Fuel Sales" });
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
        row: FuelSalesData
    ) => {
        const numericValue = parseFloat(value);
        setFieldValue(`data[${index}].${field}`, numericValue);

        const sales_volume = field === 'sales_volume' ? numericValue : values.data[index].sales_volume;
        const fuel_price = field === 'fuel_price' ? numericValue : parseFloat(values.data[index].fuel_price);
        const discount = field === 'discount' ? numericValue : values.data[index].discount;

        const gross_value = sales_volume * fuel_price;
        const nett_value = gross_value - discount;

        setFieldValue(`data[${index}].gross_value`, gross_value);
        setFieldValue(`data[${index}].nett_value`, nett_value);
    };



    const columns = [
        {
            name: 'Fuel',
            selector: (row: FuelSalesData) => row.fuel_name,
            cell: (row: FuelSalesData) => <span>{row.fuel_name}</span>,
        },
        {
            name: 'Fuel Price',
            cell: (row: FuelSalesData, index: number) => (
                <Field name={`data[${index}].fuel_price`}>
                    {({ field, form: { setFieldValue, values } }: FieldProps) => (
                        <input
                            type="number"
                            {...field}
                            className={`form-input ${!row.update_price ? 'readonly' : ''}`}
                            readOnly={!row.update_price}
                            onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'fuel_price', e.target.value, row)}
                        />
                    )}
                </Field>
            ),
        },
        {
            name: 'Sales Volume',
            cell: (row: FuelSalesData, index: number) => (
                <Field name={`data[${index}].sales_volume`}>
                    {({ field, form: { setFieldValue, values } }: FieldProps) => (
                        <input
                            type="number"
                            {...field}
                            className={`form-input ${!row.update_sales_volume ? 'readonly' : ''}`}
                            readOnly={!row.update_sales_volume}
                            onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'sales_volume', e.target.value, row)}
                        />
                    )}
                </Field>
            ),
        },
        {
            name: 'Gross Value',
            cell: (row: FuelSalesData, index: number) => (
                <Field name={`data[${index}].gross_value`}>
                    {({ field }: FieldProps) => (
                        <input
                            type="number"
                            {...field}
                            className={`form-input ${!row.update_gross_value ? 'readonly' : ''}`}
                            readOnly={!row.update_gross_value}
                        />
                    )}
                </Field>
            ),
        },
        {
            name: 'Discount',
            cell: (row: FuelSalesData, index: number) => (
                <Field name={`data[${index}].discount`}>
                    {({ field, form: { setFieldValue, values } }: FieldProps) => (
                        <input
                            type="number"
                            {...field}
                            className={`form-input ${!row.update_discount ? 'readonly' : ''}`}
                            readOnly={!row.update_discount}
                            onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, index, 'discount', e.target.value, row)}
                        />
                    )}
                </Field>
            ),
        },
        {
            name: 'Nett Value',
            cell: (row: FuelSalesData, index: number) => (
                <Field name={`data[${index}].nett_value`}>
                    {({ field }: FieldProps) => (
                        <input
                            type="number"
                            {...field}
                            className={`form-input ${!row.update_nett_value ? 'readonly' : ''}`}
                            readOnly={!row.update_nett_value}
                        />
                    )}
                </Field>
            ),
        },
    ];

    return (
        <>
            {isLoading && <LoaderImg />}
            <div>


                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 className="text-lg font-semibold mb-4">
                        {`Fuel Sales`} {startDate ? `(${startDate})` : ''}
                    </h1>

                    {isdownloadpdf && (
                        <button
                            className='btn btn-primary'
                            onClick={() => handleDownloadPdf('fuel-sales', stationId, startDate, getData, handleApiError)}
                        >
                            Download Pdf   <i className="fi fi-tr-file-download"></i>
                        </button>
                    )}
                </div>

                {!isconsiderNozzle ? (
                    data.length > 0 ? (
                        <Formik
                            initialValues={{ data }}
                            enableReinitialize
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values }) => (
                                <Form>
                                    <FieldArray name="data">
                                        {() => (
                                            <DataTable
                                                columns={columns}
                                                data={values.data}
                                                noHeader
                                                defaultSortAsc={false}
                                                striped
                                                persistTableHead
                                                highlightOnHover
                                            />
                                        )}
                                    </FieldArray>
                                    <hr></hr>
                                    <footer>
                                        {iseditable && (
                                            <button className="btn btn-primary mt-3" type="submit">Submit</button>
                                        )}
                                    </footer>
                                </Form>
                            )}
                        </Formik>
                    ) : (
                        <img
                            src={noDataImage} // Use the imported image directly as the source
                            alt="no data found"
                            className="all-center-flex nodata-image"
                        />
                    )
                ) : (
                    data.length > 0 ? (
                        <h1>DSDASDASD</h1>
                    ) : (
                        <img
                            src={noDataImage} // Use the imported image directly as the source
                            alt="no data found"
                            className="all-center-flex nodata-image"
                        />
                    )// Replace this with the text or component you want to display
                )}

            </div>
        </>
    );
};

export default withApiHandler(FuelSales);
