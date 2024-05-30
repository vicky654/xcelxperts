// FormikClientSelect.tsx
import React from 'react';

interface FormikClientSelectProps {
    formik: any; // Replace 'any' with the actual Formik type
    clients: Client[];
    name: string;
    label: string;
    options: { id: any; name: string }[];
    className?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Add onChange prop
}


interface FormikSelectProps {
    formik: any; // Replace 'any' with the actual Formik type
    name: string;
    label: string;
    options: { id: any; name: string }[];
    className?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Add onChange prop
}

export interface Client {
    id: string;
    name: string;
    // Add more properties if needed
}

const FormikClientSelect: React.FC<FormikClientSelectProps> = ({ formik, clients, name, label }) => {
    return (
        <div className={formik.submitCount && formik.errors[name] ? 'has-error' : formik.submitCount ? 'has-success' : ''}>
            <label htmlFor={name}>
                {label}
                <span className="text-danger">*</span>{' '}
            </label>
            <select
                id={name}
                name={name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[name]}
                className="form-select"
            >
                <option value="">Select a Client</option>
                {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                ))}
            </select>
            {formik.submitCount > 0 && formik.errors[name] && (
                <div className="text-danger mt-1">{formik.errors[name]}</div>
            )}

        </div>
    );
};

export default FormikClientSelect;
