import React from 'react';

interface FormikSelectProps {
    formik: any; // Replace 'any' with the actual Formik type
    name: string;
    label: string;
    options: { id: any; name: string }[];
    className?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Add onChange prop
    isRequired?: boolean;
}

const FormikSelect: React.FC<FormikSelectProps> = ({
    formik,
    name,
    label,
    options,
    className = 'form-select',
    onChange,
    
    isRequired = true, // Default to true if not provided
}) => {

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        formik.handleChange(e); // Call default handleChange
        if (onChange) {
            onChange(e); // Call custom onChange if provided
        }
    };

    return (
        <div className={formik.submitCount && formik.errors[name] ? 'has-error' : formik.submitCount ? 'has-success' : ''}>
            <label htmlFor={name}>
                {label} {isRequired && <span className="text-danger">*</span>}{' '}
            </label>
            <select
                id={name}
                name={name}
                // onChange={formik.handleChange}
                onChange={handleChange} // Use handleChange function
                onBlur={formik.handleBlur}
                value={formik.values[name]}
                className={className}
            >
                <option value="">Select {label}</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
            {formik.submitCount > 0 && formik.errors[name] && (
                <div className="text-danger mt-1">{formik.errors[name]}</div>
            )}
        </div>
    );
};

export default FormikSelect;
