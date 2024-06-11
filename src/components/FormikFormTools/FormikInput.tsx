import React from 'react';

interface FormikInputProps {
    formik: any; // Replace 'any' with the actual Formik type
    name: string;
    label?: string;
    type?: string;
    placeholder?: string;
    className?: string;
    isRequired?: boolean;
    readOnly?: boolean;
    // onBlur: any; // Add onChange prop
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // Change type here


}

const FormikInput: React.FC<FormikInputProps> = ({
    formik,
    name,
    label,
    type,
    placeholder,
    className = 'form-input',
    isRequired = true, // Default to true if not provided
    readOnly = false,
    onBlur,
}) => {

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => { // Change type here
        formik.handleBlur(e); // Call default handleBlur
        if (onBlur) {
            onBlur(e); // Call custom onBlur if provided
        }
    };


    const dynamicLabel = label || name.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()); // Dynamic label
    const dynamicPlaceholder = placeholder || name.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()); // Dynamic placeholder

    return (
        <div className={formik.submitCount && formik.errors[name] ? 'has-error' : formik.submitCount ? 'has-success' : ''}>
            <label htmlFor={name}>
                {dynamicLabel}
                {isRequired && <span className="text-danger">*</span>}{' '}
            </label>
            <input
                name={name}
                type={type}
                id={name}
                readOnly={readOnly}
                placeholder={dynamicPlaceholder}
                className={` ${className} ${readOnly ? 'readonly' : ''}`}
                onChange={formik.handleChange}
                onBlur={handleBlur}
                value={formik.values[name]}
            />
            {formik.submitCount > 0 && formik.errors[name] && formik.touched[name] && (
                <div className="text-danger mt-1">{formik.errors[name]}</div>
            )}
        </div>
    );
};

export default FormikInput;
