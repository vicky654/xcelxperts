import React from 'react';

interface FormikTextAreaProps {
    formik: any; // Replace 'any' with the actual Formik type
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    className?: string;
    isRequired?: boolean;
}

const FormikTextArea: React.FC<FormikTextAreaProps> = ({
    formik,
    name,
    label,
    type,
    placeholder = '',
    className = 'form-input',
    isRequired = true, // Default to true if not provided
}) => {
    return (
        <div className={formik.submitCount && formik.errors[name] ? 'has-error' : formik.submitCount ? 'has-success' : ''}>
            <label htmlFor={name}>
                {label}
                {isRequired && <span className="text-danger">*</span>}{' '}
            </label>
            <textarea
                name={name}
                id={name}
                placeholder={placeholder}
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

export default FormikTextArea;