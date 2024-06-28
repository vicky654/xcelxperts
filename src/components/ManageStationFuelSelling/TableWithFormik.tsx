import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Define types for your data
interface Fuel {
    id: string;
    price: number;
    prev_price: number;
    status: string;
}

interface Site {
    id: string;
    station_name: string;
    fuels: (Fuel | null | [])[];
}

interface Data {
    head_array: string[];
    listing: Site[];
}

// Define type for form values
interface FormValues {
    [siteId: string]: {
        [fuelId: string]: number;
    };
}

interface TableWithFormikProps {
    data: Data;
    onSubmit: (values: FormValues) => void;
}

const TableWithFormik: React.FC<TableWithFormikProps> = ({ data, onSubmit }) => {
    const [initialValues, setInitialValues] = useState<FormValues>({});

    useEffect(() => {
        const newInitialValues: FormValues = data.listing.reduce((acc, site) => {
            acc[site.id] = site.fuels.reduce((fuelAcc, fuel) => {
                if (fuel && typeof fuel === 'object' && 'id' in fuel) {
                    fuelAcc[fuel.id] = fuel.price;
                }
                return fuelAcc;
            }, {} as { [fuelId: string]: number });
            return acc;
        }, {} as { [siteId: string]: { [fuelId: string]: number } });

        setInitialValues(newInitialValues);
    }, [data]);


    const validationSchema = Yup.object().shape({
        // Add your validation schema here if needed
    });

    const handleSubmit = (values: FormValues) => {
        onSubmit(values); // Call the parent callback with form values
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
            {({ values, setFieldValue }) => (
                <Form>
                    {data.listing.length > 0 ? (
                        <table cellPadding="10">
                            <thead>
                                <tr>
                                    {data.head_array.map((header, index) => (
                                        <th key={index}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.listing.map((site) => (
                                    <tr key={site.id}>
                                        <td>{site.station_name}</td>
                                        {site.fuels.map((fuel, index) => (
                                            Array.isArray(fuel) && fuel.length === 0 ? (
                                                <td key={`empty-${index}`}>
                                                    <Field
                                                        type="text"
                                                        name={`dummy`}
                                                        className="form-input"
                                                        value=""
                                                        readOnly
                                                        style={{
                                                            backgroundColor: '#ddd',
                                                            borderColor: 'black',
                                                            borderWidth: '2px',
                                                        }}
                                                    />
                                                </td>
                                            ) : (
                                                fuel && typeof fuel === 'object' && 'id' in fuel ? (
                                                    <td key={fuel.id}>
                                                        <Field
                                                            type="number"
                                                            name={`${site.id}.${fuel.id}`}
                                                            className="form-input"
                                                            value={values[site.id] && values[site.id][fuel.id] !== undefined ? values[site.id][fuel.id] : ''}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue(`${site.id}.${fuel.id}`, parseFloat(e.target.value))}
                                                            style={{
                                                                backgroundColor: 'white',
                                                                borderColor: fuel.status === 'DOWN' ? 'red' : fuel.status === 'UP' ? 'green' : 'black',
                                                                borderWidth: '2px',
                                                            }}
                                                        />
                                                        <ErrorMessage name={`${site.id}.${fuel.id}`} component="div" />
                                                    </td>
                                                ) : (
                                                    <td key={`invalid-${index}`}>
                                                        <Field
                                                            type="text"
                                                            name={`dummy`}
                                                            className="form-input"
                                                            value=""
                                                            readOnly
                                                            style={{
                                                                backgroundColor: '#ddd',
                                                                borderColor: 'black',
                                                                borderWidth: '2px',
                                                            }}
                                                        />
                                                    </td>
                                                )
                                            )
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No data available</p>
                    )}
                    {data.listing.length > 0 ? (
                        <div className="text-end mt-6">
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    ) : null}
                </Form>
            )}
        </Formik>
    );
};

export default TableWithFormik;
