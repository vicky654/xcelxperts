import React, { useEffect, useState } from 'react';
import withApiHandler from '../../../utils/withApiHandler';
import { CommonDataEntryProps } from '../../commonInterfaces';
import useErrorHandler from '../../../hooks/useHandleError';
import { Formik, Form, Field, FieldArray, ErrorMessage, FieldProps } from 'formik';
import * as Yup from 'yup';
import DataTable from 'react-data-table-component';
import noDataImage from '../../../assets/noDataFoundImage/noDataFound.png';
import LoaderImg from '../../../utils/Loader';

interface LubricantData {
    id: string;
    lubricant_name: string;
    lubricant_size: string;
    purchase_price: number | string;
    opening: number | string;
    sale: number | string;
    closing: number | string;
    sale_price: number | string;
    purchase_amount: number | string;
    sale_amount: number | string;
    profit: number | string;
    update_purchase_price: boolean;
    update_opening: boolean;
    update_sale: boolean;
    update_closing: boolean;
    update_sale_price: boolean;
    update_purchase_amount: boolean;
    update_sale_amount: boolean;
    update_profit: boolean;
}

interface FormValues {
    data: LubricantData[];
}

const validationSchema = Yup.object().shape({
    data: Yup.array().of(
        Yup.object().shape({
            purchage_price: Yup.number().when('lubricant_name', {
                is: (val: string) => val !== "Total Sale",
                then: Yup.number().required('Required'),
                otherwise: Yup.number()
            }),
            opening: Yup.number().when('lubricant_name', {
                is: (val: string) => val !== "Total Sale",
                then: Yup.number().required('Required'),
                otherwise: Yup.number()
            }),
            sale: Yup.number().when('lubricant_name', {
                is: (val: string) => val !== "Total Sale",
                then: Yup.number().required('Required'),
                otherwise: Yup.number()
            }),
            closing: Yup.number().when('lubricant_name', {
                is: (val: string) => val !== "Total Sale",
                then: Yup.number().required('Required'),
                otherwise: Yup.number()
            }),
            sale_price: Yup.number().when('lubricant_name', {
                is: (val: string) => val !== "Total Sale",
                then: Yup.number().required('Required'),
                otherwise: Yup.number()
            }),
            purchage_amount: Yup.number().when('lubricant_name', {
                is: (val: string) => val !== "Total Sale",
                then: Yup.number().required('Required'),
                otherwise: Yup.number()
            }),
            sale_amount: Yup.number().when('lubricant_name', {
                is: (val: string) => val !== "Total Sale",
                then: Yup.number().required('Required'),
                otherwise: Yup.number()
            }),
            profit: Yup.number().when('lubricant_name', {
                is: (val: string) => val !== "Total Sale",
                then: Yup.number().required('Required'),
                otherwise: Yup.number()
            }),
        })
    ),
});


const ShopSales: React.FC<CommonDataEntryProps> = ({ stationId, startDate, postData, getData, isLoading }) => {
    const [data, setData] = useState<LubricantData[]>([]);
    const [isEditable, setIsEditable] = useState(true);

    const handleApiError = useErrorHandler();

    useEffect(() => {
        if (stationId && startDate) {
            handleApplyFilters(stationId, startDate);
        }
    }, [stationId, startDate]);

    const handleApplyFilters = async (stationId: string | null, startDate: string | null) => {
        try {
            const response = await getData(`/data-entry/lube-sale/list?drs_date=${startDate}&station_id=${stationId}`);
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
            console.log(values, "values");
            values.data.forEach((obj) => {
                if (obj.id) {
                    const id = obj.id;

                    formData.append(`purchase_price[${id}]`, obj.purchase_price.toString());
                    formData.append(`opening[${id}]`, obj.opening.toString());
                    formData.append(`sale[${id}]`, obj.sale.toString());
                    formData.append(`closing[${id}]`, obj.closing.toString());
                    formData.append(`sale_price[${id}]`, obj.sale_price.toString());
                    formData.append(`purchase_amount[${id}]`, obj.purchase_amount.toString());
                    formData.append(`sale_amount[${id}]`, obj.sale_amount.toString());
                    formData.append(`profit[${id}]`, obj.profit.toString());
                }
            });

            if (stationId && startDate) {
                formData.append('drs_date', startDate);
                formData.append('station_id', stationId);
            }

            const url = `data-entry/lube-sale/update`;

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

    const renderInputField = (row: LubricantData, index: number, fieldName: string, isEditable: boolean) => (
        <Field name={`data[${index}].${fieldName}`}>
            {({ field }: FieldProps<any>) => (
                <div className="relative">
                    <input
                        type="number"
                        {...field}
                        className={`form-input ${!isEditable ? 'readonly' : ''}`}
                        readOnly={!isEditable}
                    />
                    <ErrorMessage name={`data[${index}].${fieldName}`} component="div" className="tabletext-red-500  text-xs mt-1 absolute left-0" />
                </div>
            )}
        </Field>
    );

    const columns = [
        {
            name: 'Name',
            selector: (row: LubricantData) => row.lubricant_name,
            cell: (row: LubricantData) => <span>{row.lubricant_name}</span>,
        },
        {
            name: 'Size',
            selector: (row: LubricantData) => row.lubricant_size,
            cell: (row: LubricantData) => <span>{row.lubricant_size}</span>,
        },
        {
            name: 'Purchase Price',
            cell: (row: LubricantData, index: number) => (
                <Field name={`data[${index}].purchage_price`}>
                    {({ field }: FieldProps<any>) => (
                        <div className="relative">
                            <input
                                type="number"
                                {...field}
                                className={`form-input ${!row.update_purchase_price ? 'readonly' : ''}`}
                                readOnly={!row.update_opening}
                            />
                            <ErrorMessage name={`data[${index}].purchage_price`} component="div" className="tabletext-red-500  text-xs mt-1 absolute left-0" />
                        </div>
                    )}
                </Field>
            ),
        },
        {
            name: 'Opening',
            cell: (row: LubricantData, index: number) => (
                <Field name={`data[${index}].opening`}>
                    {({ field }: FieldProps<any>) => (
                        <div className="relative">
                            <input
                                type="number"
                                {...field}
                                className={`form-input ${!row.update_opening ? 'readonly' : ''}`}
                                readOnly={!row.update_opening}
                            />
                            <ErrorMessage name={`data[${index}].opening`} component="div" className="tabletext-red-500  text-xs mt-1 absolute left-0" />
                        </div>
                    )}
                </Field>
            ),
        },

        {
            name: 'Sale Quantity',
            cell: (row: LubricantData, index: number) => (
                <Field name={`data[${index}].sale`}>
                    {({ field }: FieldProps<any>) => (
                        <div className="relative">
                            <input
                                type="number"
                                {...field}
                                className={`form-input ${!row.update_sale ? 'readonly' : ''}`}
                                readOnly={!row.update_sale}
                            />
                            <ErrorMessage name={`data[${index}].sale`} component="div" className="tabletext-red-500  text-xs mt-1 absolute left-0" />
                        </div>
                    )}
                </Field>
            ),
        },
        {
            name: 'Closing',
            cell: (row: LubricantData, index: number) => (
                <Field name={`data[${index}].closing`}>
                    {({ field }: FieldProps<any>) => (
                        <div className="relative">
                            <input
                                type="number"
                                {...field}
                                className={`form-input ${!row.update_closing ? 'readonly' : ''}`}
                                readOnly={!row.update_closing}
                            />
                            <ErrorMessage name={`data[${index}].closing`} component="div" className="tabletext-red-500  text-xs mt-1 absolute left-0" />
                        </div>
                    )}
                </Field>
            ),
        },
        {
            name: 'Rate',
            cell: (row: LubricantData, index: number) => (
                <Field name={`data[${index}].sale_price`}>
                    {({ field }: FieldProps<any>) => (
                        <div className="relative">
                            <input
                                type="number"
                                {...field}
                                className="form-input"
                            />
                            <ErrorMessage name={`data[${index}].sale_price`} component="div" className="tabletext-red-500  text-xs mt-1 absolute left-0" />
                        </div>
                    )}
                </Field>
            ),
        },
        {
            name: 'Sale Amount',
            cell: (row: LubricantData, index: number) => (
                <Field name={`data[${index}].sale_amount`}>
                    {({ field }: FieldProps<any>) => (
                        <div className="relative">
                            <input
                                type="number"
                                {...field}
                                className="form-input readonly"
                                readOnly
                            />
                            <ErrorMessage name={`data[${index}].sale_amount`} component="div" className="tabletext-red-500  text-xs mt-1 absolute left-0" />
                        </div>
                    )}
                </Field>
            ),
        },
    ];


    return (
        <div className="shop-sales-form">
            {isLoading ? (
                <LoaderImg />
            ) : (
                <Formik
                    initialValues={{ data: data }}
                    enableReinitialize={true}
                    // validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values }) => (
                        <Form>
                            <DataTable
                                columns={columns}
                                data={values.data}
                                noHeader
                                highlightOnHover
                                noDataComponent={
                                    <div className="no-data">
                                        <img src={noDataImage} alt="No data found" />
                                        <p>No data available</p>
                                    </div>
                                }
                                
                                persistTableHead
                                className="react-dataTable"
                            />
                            <div className="form-actions">
                                {isEditable && (
                                    <button type="submit" className="btn btn-primary">
                                        Save
                                    </button>
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};

export default withApiHandler(ShopSales);
