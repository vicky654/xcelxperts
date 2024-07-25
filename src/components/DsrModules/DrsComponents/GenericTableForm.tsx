import React from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import DataTable from 'react-data-table-component';
import LoaderImg from '../../../utils/Loader';
import useErrorHandler from '../../../hooks/useHandleError';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

// Define your interfaces
interface NozzleData {
    id: string;
    nozzle_name: string;
    fuel_name: string;
    fuel_price: string;
    opening: number;
    closing: number;
    sales_volume: number;
    gross_value: number;
    discount: number;
    nett_value: number;
    update_price: boolean;
    update_sales_volume: boolean;
    update_gross_value: boolean;
    update_nett_value: boolean;
    update_discount: boolean;
    update_opening: boolean;
    update_closing: boolean;
}

interface TankData {
    id: string;
    tank_name: string;
    nozzles: NozzleData[];
}

interface FormValues {
    data: TankData[];
}

interface GenericTableFormProps {
    stationId: string | null;
    startDate: string | null;
    iseditable: boolean | null;

    applyFilters: (values: any) => Promise<void>;
    postData: (url: string, body: any) => Promise<any>;
    data: TankData[];

}

// Validation schema
const validationSchema = Yup.object({
    data: Yup.array().of(
        Yup.object().shape({
            nozzles: Yup.array().of(
                Yup.object().shape({
                    sales_volume: Yup.number().required('Required'),
                    gross_value: Yup.number().required('Required'),
                    opening: Yup.number().required('Required'),
                    closing: Yup.number().required('Required'),
                    discount: Yup.number().required('Required'),
                    nett_value: Yup.number().required('Required'),
                })
            )
        })
    ),
});

const GenericTableForm: React.FC<GenericTableFormProps> = ({ data, applyFilters, stationId, startDate, postData, iseditable }) => {
    console.log(data, "data");
    const handleFieldChange = (
        setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
        values: FormValues,
        tankIndex: number,
        nozzleIndex: number,
        field: string,
        value: any
    ) => {
        const numericValue = parseFloat(value);
        setFieldValue(`data[${tankIndex}].nozzles[${nozzleIndex}].${field}`, numericValue);

        const nozzle = values.data[tankIndex].nozzles[nozzleIndex];
        const sales_volume = field === 'sales_volume' ? numericValue : nozzle.sales_volume;
        const fuel_price = field === 'fuel_price' ? numericValue : parseFloat(nozzle.fuel_price);
        const discount = field === 'discount' ? numericValue : nozzle.discount;
        const grossvalue = field === 'gross_value' ? numericValue : nozzle.gross_value;
        const opening = field === 'opening' ? numericValue : nozzle.opening;
        const closing = field === 'closing' ? numericValue : nozzle.closing;

        if (sales_volume) {
            const grossvalue = sales_volume * fuel_price;
        }
        // console.log(grossvalue, "gross_value");
        const salesvolume = closing - opening;
        const gross_value = salesvolume * fuel_price;
        const nettvalue = grossvalue - discount;

        setFieldValue(`data[${tankIndex}].nozzles[${nozzleIndex}].gross_value`, gross_value);
        setFieldValue(`data[${tankIndex}].nozzles[${nozzleIndex}].sales_volume`, salesvolume);
        setFieldValue(`data[${tankIndex}].nozzles[${nozzleIndex}].nett_value`, nettvalue);
    };

    const characterLimit = 20; // Set the character limit for the tooltip

    const columns = (tankIndex: number) => [
        {
            name: 'Nozzle',
            selector: (row: NozzleData) => row.nozzle_name,
            width: '15%',
            cell: (row: NozzleData) => {
                const isTextLong = row.nozzle_name.length > characterLimit;
                const displayText = isTextLong
                    ? row.nozzle_name.slice(0, characterLimit) + '...'
                    : row.nozzle_name;

                return (
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            isTextLong ? (
                                <Tooltip className="custom-tooltip">{row.nozzle_name}</Tooltip>
                            ) : (
                                <span />
                            )
                        }
                    >
                        <span>{displayText}</span>
                    </OverlayTrigger>
                );
            },
        },
        {
            name: 'Fuel ',
            width: '10%',
            selector: (row: NozzleData) => row.fuel_name,
            cell: (row: NozzleData) => <span>{row.fuel_name}</span>,
        },
        {
            name: 'Fuel Price',
            cell: (row: NozzleData, index: number) => (
                <Field name={`data[${tankIndex}].nozzles[${index}].fuel_price`}>
                    {({ field, form: { setFieldValue, values } }: FieldProps) => (
                        <input
                            type="number"
                            {...field}
                            className={`form-input ${!row.update_price ? 'readonly' : ''}`}
                            readOnly={!row.update_price}
                            onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, tankIndex, index, 'fuel_price', e.target.value)}
                        />
                    )}
                </Field>
            ),
        },
        {
            name: 'Opening',
            cell: (row: NozzleData, index: number) => (
                <Field name={`data[${tankIndex}].nozzles[${index}].opening`}>
                    {({ field, form: { setFieldValue, values } }: FieldProps) => (
                        <input
                            type="number"
                            {...field}
                            className={`form-input ${!row.update_opening ? 'readonly' : ''}`}
                            readOnly={!row.update_opening}
                            onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, tankIndex, index, 'opening', e.target.value)}
                        />
                    )}
                </Field>
            ),
        },
        {
            name: 'Closing',
            cell: (row: NozzleData, index: number) => (
                <Field name={`data[${tankIndex}].nozzles[${index}].closing`}>
                    {({ field, form: { setFieldValue, values } }: FieldProps) => (
                        <input
                            type="number"
                            {...field}
                            className={`form-input ${!row.update_closing ? 'readonly' : ''}`}
                            readOnly={!row.update_closing}
                            onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, tankIndex, index, 'closing', e.target.value)}
                        />
                    )}
                </Field>
            ),
        },
        {
            name: 'Sales Volume',
            cell: (row: NozzleData, index: number) => (
                <Field name={`data[${tankIndex}].nozzles[${index}].sales_volume`}>
                    {({ field, form: { setFieldValue, values } }: FieldProps) => (
                        <input
                            type="number"
                            {...field}
                            className={`form-input ${!row.update_sales_volume ? 'readonly' : ''}`}
                            readOnly={!row.update_sales_volume}
                            onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, tankIndex, index, 'sales_volume', e.target.value)}
                        />
                    )}
                </Field>
            ),
        },
        {
            name: 'Gross Value',
            cell: (row: NozzleData, index: number) => (
                <Field name={`data[${tankIndex}].nozzles[${index}].gross_value`}>
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
            cell: (row: NozzleData, index: number) => (
                <Field name={`data[${tankIndex}].nozzles[${index}].discount`}>
                    {({ field, form: { setFieldValue, values } }: FieldProps) => (
                        <input
                            type="number"
                            {...field}
                            className={`form-input ${!row.update_discount ? 'readonly' : ''}`}
                            readOnly={!row.update_discount}
                            onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, tankIndex, index, 'discount', e.target.value)}
                        />
                    )}
                </Field>
            ),
        },
        {
            name: 'Nett Value',
            cell: (row: NozzleData, index: number) => (
                <Field name={`data[${tankIndex}].nozzles[${index}].nett_value`}>
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


    const handleApiError = useErrorHandler();
    const nozzlehandleSubmit = async (values: FormValues) => {
        try {
            const formData = new FormData();

            // Append static data
            if (stationId && startDate) {
                formData.append('drs_date', startDate);
                formData.append('station_id', stationId);
            }

            // Append dynamic data from the form values
            values.data.forEach(tank => {
                tank.nozzles.forEach(nozzle => {
                    if (nozzle.update_sales_volume) {
                        formData.append(`sales_volume[${nozzle.id}]`, nozzle.sales_volume.toString());
                    }
                    if (nozzle.update_gross_value) {
                        formData.append(`gross_value[${nozzle.id}]`, nozzle.gross_value.toString());
                    }
                    if (nozzle.update_nett_value) {
                        formData.append(`nett_value[${nozzle.id}]`, nozzle.nett_value.toString());
                    }
                    if (nozzle.update_discount) {
                        formData.append(`discount[${nozzle.id}]`, nozzle.discount.toString());
                    }
                    if (nozzle.update_opening) {
                        formData.append(`opening[${nozzle.id}]`, nozzle.opening.toString());
                    }
                    if (nozzle.update_closing) {
                        formData.append(`closing[${nozzle.id}]`, nozzle.closing.toString());
                    }
                });
            });


            const url = `data-entry/fuel-sale/update`;
            const isSuccess = await postData(url, formData);
            if (isSuccess) {
                if (stationId && startDate) {

                    applyFilters({ station_id: stationId, start_date: startDate, selectedCardName: "Fuel Sales" });
                }
            }
        } catch (error) {
            handleApiError(error);
        }
    };




    return (
        <Formik
            initialValues={{ data }}
            validationSchema={validationSchema}
            onSubmit={nozzlehandleSubmit}
            enableReinitialize
        >
            {({ values, handleChange, setFieldValue }) => (
                <Form>
                    {values.data.map((tank, tankIndex) => (
                        <div key={tank.id}>
                            <div className='flex'>
                                <h3 className='FuelSaleContainer '>
                                    <div className=' flex flex-col'>

                                        <span className='' style={{background:"#f6f8fa",padding:"15px 46px",borderBottom:"1px solid #d8dadc"}}>Tank  </span>
                                        <span className='tank_name'> {tank.tank_name}</span>
                                    </div>

                                </h3>
                                <DataTable
                                    columns={columns(tankIndex)}
                                    className="custom-table-body"
                                    data={tank.nozzles}

                                    progressComponent={<LoaderImg />}
                                />
                            </div>
                        </div>
                    ))}


                    {iseditable && (
                        <button className='btn btn-primary mt-4' type="submit">Submit</button>
                    )}

                </Form>
            )}
        </Formik>
    );
};

export default GenericTableForm;
