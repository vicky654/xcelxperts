import React from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import DataTable from 'react-data-table-component';
import LoaderImg from '../../../utils/Loader';
import useErrorHandler from '../../../hooks/useHandleError';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { capacity } from '../../../utils/CommonData';

// Define your interfaces
interface NozzleData {
    id: string;
    nozzle_name: string;
    fuel_name: string;
    fuel_price: string;
    opening: number;
    closing: number;
    test_volume: number;
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
    update_test_volume: boolean;
}

interface TankData {
    id: string;
    tank_name: string;
    capacity: string;
    fuel_left: number;
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
        const testvolume = field === 'test_volume' ? numericValue : nozzle.test_volume;

        if (sales_volume) {
            const grossvalue = sales_volume * fuel_price;
        }

        const salesvolume = closing - opening - testvolume;
        const gross_value = salesvolume * fuel_price;
        const nettvalue = gross_value - discount;




        setFieldValue(`data[${tankIndex}].nozzles[${nozzleIndex}].gross_value`, gross_value);
        setFieldValue(`data[${tankIndex}].nozzles[${nozzleIndex}].sales_volume`, salesvolume);
        setFieldValue(`data[${tankIndex}].nozzles[${nozzleIndex}].nett_value`, nettvalue);


    };

    const characterLimit = 20; // Set the character limit for the tooltip

    const columns = (tankIndex: number) => [
        {

            name: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-variance">Nozzle</Tooltip>}
                >
                    <span >Nozzle</span>
                </OverlayTrigger>
            ),
            selector: (row: NozzleData) => row.nozzle_name,
            width: '7%',
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
                        <span className='ms-2'>{displayText}</span>
                    </OverlayTrigger>
                );
            },
        },
        {
            name: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-variance">Fuel</Tooltip>}
                >
                    <span >Fuel</span>
                </OverlayTrigger>
            ),
            width: '7%',
            selector: (row: NozzleData) => row.fuel_name,
            cell: (row: NozzleData) => <span>{row.fuel_name}</span>,
        },
        {
            name: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-variance">Fuel Price</Tooltip>}
                >
                    <span >Fuel Price</span>
                </OverlayTrigger>
            ),
            cell: (row: NozzleData, index: number) => (
                <Field name={`data[${tankIndex}].nozzles[${index}].fuel_price`}>
                    {({ field, form: { setFieldValue, values } }: FieldProps) => (
                        <input
                            type="number"
                            {...field}
                            className={`form-input workflorform-input ${!row.update_price ? 'readonly' : ''}`}
                            readOnly={!row.update_price}
                            onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, tankIndex, index, 'fuel_price', e.target.value)}
                        />
                    )}
                </Field>
            ),
        },
        {
            name: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-variance">Opening</Tooltip>}
                >
                    <span >Opening</span>
                </OverlayTrigger>
            ),
            cell: (row: NozzleData, index: number) => (
                <Field name={`data[${tankIndex}].nozzles[${index}].opening`}>
                    {({ field, form: { setFieldValue, values } }: FieldProps) => (
                        <input
                            type="number"
                            {...field}
                            className={`form-input workflorform-input ${!row.update_opening ? 'readonly' : ''}`}
                            readOnly={!row.update_opening}
                            onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, tankIndex, index, 'opening', e.target.value)}
                        />
                    )}
                </Field>
            ),
        },
        {
            name: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-variance">Closing</Tooltip>}
                >
                    <span >Closing</span>
                </OverlayTrigger>
            ),
            cell: (row: NozzleData, index: number) => (
                <Field name={`data[${tankIndex}].nozzles[${index}].closing`}>
                    {({ field, form: { setFieldValue, values } }: FieldProps) => (
                        <input
                            type="number"
                            {...field}
                            className={`form-input workflorform-input ${!row.update_closing ? 'readonly' : ''}`}
                            readOnly={!row.update_closing}
                            onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, tankIndex, index, 'closing', e.target.value)}
                        />
                    )}
                </Field>
            ),
        },
        {
            name: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-variance">Testing</Tooltip>}
                >
                    <span >Testing</span>
                </OverlayTrigger>
            ),
            cell: (row: NozzleData, index: number) => (
                <Field name={`data[${tankIndex}].nozzles[${index}].test_volume`}>
                    {({ field, form: { setFieldValue, values } }: FieldProps) => (
                        <input
                            type="number"
                            {...field}
                            className={`form-input workflorform-input ${!row.update_test_volume ? 'readonly' : ''}`}
                            readOnly={!row.update_test_volume}
                            onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, tankIndex, index, 'test_volume', e.target.value)}
                        />
                    )}
                </Field>
            ),
        },
        {

            name: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-variance">Sales Volume</Tooltip>}
                >
                    <span >Sales Volume</span>
                </OverlayTrigger>
            ),
            cell: (row: NozzleData, index: number) => (
                <Field name={`data[${tankIndex}].nozzles[${index}].sales_volume`}>
                    {({ field, form: { setFieldValue, values } }: FieldProps) => (
                        <input
                            type="number"
                            {...field}
                            className={`form-input workflorform-input ${!row.update_sales_volume ? 'readonly' : ''}`}
                            readOnly={!row.update_sales_volume}
                            onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, tankIndex, index, 'sales_volume', e.target.value)}
                        />
                    )}
                </Field>
            ),
        },
        {

            name: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-variance">Gross Value</Tooltip>}
                >
                    <span >Gross Value</span>
                </OverlayTrigger>
            ),
            cell: (row: NozzleData, index: number) => (
                <Field name={`data[${tankIndex}].nozzles[${index}].gross_value`}>
                    {({ field }: FieldProps) => (
                        <input
                            type="number"
                            {...field}
                            className={`form-input workflorform-input ${!row.update_gross_value ? 'readonly' : ''}`}
                            readOnly={!row.update_gross_value}
                        />
                    )}
                </Field>
            ),
        },
        {

            name: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-variance">Discount</Tooltip>}
                >
                    <span >Discount</span>
                </OverlayTrigger>
            ),
            cell: (row: NozzleData, index: number) => (
                <Field name={`data[${tankIndex}].nozzles[${index}].discount`}>
                    {({ field, form: { setFieldValue, values } }: FieldProps) => (
                        <input
                            type="number"
                            {...field}
                            className={`form-input workflorform-input ${!row.update_discount ? 'readonly' : ''}`}
                            readOnly={!row.update_discount}
                            onChange={(e) => handleFieldChange(setFieldValue, values as FormValues, tankIndex, index, 'discount', e.target.value)}
                        />
                    )}
                </Field>
            ),
        },
        {

            name: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-variance">Net Value</Tooltip>}
                >
                    <span >Net Value</span>
                </OverlayTrigger>
            ),
            cell: (row: NozzleData, index: number) => (
                <Field name={`data[${tankIndex}].nozzles[${index}].nett_value`}>
                    {({ field }: FieldProps) => (
                        <input
                            type="number"
                            {...field}
                            className={`form-input workflorform-input ${!row.update_nett_value ? 'readonly' : ''}`}
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




            values?.data.forEach(tank => {
                tank?.nozzles?.forEach(nozzle => {
                    formData.append(`sales_volume[${nozzle.id}]`, nozzle.sales_volume.toString());
                    formData.append(`gross_value[${nozzle.id}]`, nozzle.gross_value.toString());
                    formData.append(`discount[${nozzle.id}]`, nozzle.discount.toString());
                    formData.append(`nett_value[${nozzle.id}]`, nozzle.nett_value.toString());
                    formData.append(`opening[${nozzle.id}]`, nozzle.opening.toString());
                    formData.append(`closing[${nozzle.id}]`, nozzle.closing.toString());
                    formData.append(`test_volume[${nozzle.id}]`, nozzle.test_volume.toString());

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

    const calculateTotalSalesVolume = (tankName: string, tankData: any[]): number => {
        const tank = tankData.find(t => t.tank_name === tankName);
        if (!tank) {
            return 0; // Return 0 if the tank name is not found
        }

        return tank.nozzles.reduce((total: number, nozzle: any) => total + Number(nozzle?.sales_volume || 0), 0);
    };

    return (
        <Formik
            initialValues={{ data }}
            validationSchema={validationSchema}
            onSubmit={nozzlehandleSubmit}
            enableReinitialize
        >
            {({ values }) => (
                <Form>
                    {values?.data.map((tank, tankIndex) => {
                        const totalSalesVolume = calculateTotalSalesVolume(tank?.tank_name, values.data);


                        return (
                            <div key={tank.id} className='mt-4'>
                                <div className='flex'>
                                    {/* <h3 className='FuelSaleContainer'>
                                        <div className='flex flex-col'>
                                            <span
                                                className='ps-2'
                                                style={{
                                                    background: "#f6f8fa",
                                                    padding: "15.5px 6px",
                                                    borderBottom: "1px solid #d8dadc",
                                                }}
                                            >
                                                Tank
                                            </span>

                                            <span className='tank_name'>
                                                {tank.tank_name}
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip className='custom-tooltip' id="tooltip-variance">
                                                            Fuel Left: {tank?.fuel_left} units<br />
                                                            Capacity: {tank?.capacity} units
                                                        </Tooltip>
                                                    }
                                                >
                                                    <i className="fi fi-tr-comment-info mt-2"></i>
                                                </OverlayTrigger>
                                            </span>

                                            <span className='ps-2'>
                                                Total Sales Volume: {totalSalesVolume}
                                            </span>
                                        </div>
                                    </h3> */}
                                    <h3 className='FuelSaleContainer '>
                                        <div className=' flex flex-col'>
                                            <span className='ps-2' style={{ background: "#f6f8fa", padding: "15.5px 6px", borderBottom: "1px solid #d8dadc" }}>Tank  </span>
                                            {/* <span className='tank_name'> {tank.tank_name}</span> */}
                                            {/* <span className='ps-2'>
                                                Total Sales Volume: {totalSalesVolume}
                                            </span> */}
                                            <span className='tank_name'>
                                                {tank.tank_name}
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip className='custom-tooltip' id="tooltip-variance">
                                                            Fuel Left : {tank?.fuel_left - totalSalesVolume} {capacity}<br />
                                                            Capacity : {tank?.capacity} {capacity}
                                                        </Tooltip>
                                                    }
                                                >
                                                    <i className="fi fi-tr-comment-info mt-2 pointer"></i>
                                                </OverlayTrigger>
                                            </span>


                                        </div>

                                    </h3>
                                    <DataTable
                                        columns={columns(tankIndex)} // Ensure columns function is defined
                                        className="custom-table-body"
                                        data={tank.nozzles}
                                        progressComponent={<LoaderImg />} // Ensure LoaderImg is defined
                                    />
                                </div>
                            </div>
                        );
                    })}


                    {iseditable && values?.data?.length > 0 && (
                        <button className='btn btn-primary mt-4' type="submit">Submit</button>
                    )}
                </Form>
            )}
        </Formik>



    );
};

export default GenericTableForm;
