import React from 'react';

interface FormikInputProps {
    formik: any; // Replace 'any' with the actual Formik type
    name: string;
    label?: string;
    type?: string;
    placeholder?: string;
    className?: string;
    isRequired?: boolean;
}

const FormikInput: React.FC<FormikInputProps> = ({
    formik,
    name,
    label,
    type,
    placeholder,
    className = 'form-input',
    isRequired = true, // Default to true if not provided
}) => {
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
                placeholder={dynamicPlaceholder}
                className={className}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[name]}
            />
            {formik.submitCount > 0 && formik.errors[name] && formik.touched[name] && (
                <div className="text-danger mt-1">{formik.errors[name]}</div>
            )}
        </div>
    );
};

export default FormikInput;
