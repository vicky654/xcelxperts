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
    datepopup?: boolean;
    autoComplete?: string;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const FormikInput: React.FC<FormikInputProps> = ({
    formik,
    name,
    label,
    type = 'text', // Default to 'text' if type is not provided
    placeholder,
    className = 'form-input',
    isRequired = true,
    readOnly = false,
    autoComplete = 'off',
    datepopup = true,
    onBlur,
}) => {

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        formik.handleBlur(e);
        if (onBlur) {
            onBlur(e);
        }
    };

    const handleShowDate = () => {
        const inputDateElement = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
        if (inputDateElement) {
            inputDateElement.showPicker();
        }
    };

    const dynamicLabel = label || name.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    const dynamicPlaceholder = placeholder || name.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

    return (
        <div className={formik.submitCount && formik.errors[name] ? 'has-error' : formik.submitCount ? 'has-success' : ''}>
            <label htmlFor={name}>
                {dynamicLabel}
                {isRequired && <span className="text-danger">*</span>}
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
                autoComplete={autoComplete}
                // onClick={type === 'date' ? handleShowDate : undefined} // Conditionally add onClick
                onClick={
                    (type === 'date' || type === 'month') && datepopup
                        ? handleShowDate
                        : undefined
                }
                style={{ cursor: type === 'date' ? 'pointer' : 'auto' }}
            />
            {formik.submitCount > 0 && formik.errors[name] && formik.touched[name] && (
                <div className="text-danger mt-1">{formik.errors[name]}</div>
            )}
        </div>
    );
};

export default FormikInput;
