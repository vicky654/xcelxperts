import React from 'react';
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
    fuels: Fuel[];
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
    // Handle cases where data or listing is undefined
    const listings = data?.listing || [];

    const initialValues: FormValues = listings.reduce((acc, site) => {
        acc[site.id] = site.fuels.reduce((fuelAcc, fuel) => {
            fuelAcc[fuel.id] = fuel.price;
            return fuelAcc;
        }, {} as { [fuelId: string]: number });
        return acc;
    }, {} as { [siteId: string]: { [fuelId: string]: number } });

    const validationSchema = Yup.object().shape({
        // Add your validation schema here if needed
    });

    const handleSubmit = (values: FormValues) => {
        onSubmit(values); // Call the parent callback with form values
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ values }) => (
                <Form>
                    {listings.length > 0 ? (
                        <table cellPadding="10">
                            <thead>
                                <tr>
                                    {data.head_array.map((header, index) => (
                                        <th key={index}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {listings.map((site) => (
                                    <tr key={site.id}>
                                        <td>{site.station_name}</td>
                                        {site.fuels.length === 0 ? (
                                            <td>
                                                <Field
                                                    type="text"
                                                    name={`dummy`}
                                                    className="form-input"
                                                    value="Dummy"
                                                    readOnly
                                                    style={{
                                                        backgroundColor: '#ddd',
                                                        borderColor: 'black',
                                                        borderWidth: '2px',
                                                    }}
                                                />
                                            </td>
                                        ) : (
                                            site.fuels.map((fuel) => (
                                                Array.isArray(fuel) && fuel.length === 0 ? (
                                                    <td key={Math.random()}>
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
                                                    <td key={fuel.id}>
                                                        <Field
                                                            type="number"
                                                            name={`${site.id}.${fuel.id}`}
                                                            className="form-input"
                                                            style={{
                                                                backgroundColor: 'white',
                                                                borderColor: fuel.status === 'DOWN' ? 'red' : fuel.status === 'UP' ? 'green' : 'black',
                                                                borderWidth: '2px',
                                                            }}
                                                        />
                                                        <ErrorMessage name={`${site.id}.${fuel.id}`} component="div" />
                                                    </td>
                                                )
                                            ))
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No data available</p>
                    )}
                    {listings.length > 0 ? (
                        <div className="text-end mt-6">
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    ) : ""}
                </Form>
            )}
        </Formik>
    );
};

export default TableWithFormik;
