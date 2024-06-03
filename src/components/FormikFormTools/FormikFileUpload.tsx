import React, { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';

interface FormikFileUploadProps {
    formik: any;
    name: string;
    label?: string;
    className?: string;
    isRequired?: boolean;
}

const FormikFileUpload: React.FC<FormikFileUploadProps> = ({
    formik,
    name,
    label,
    className = 'form-input',
    isRequired = true,
}) => {
    const { setFieldValue } = useFormikContext();
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        const image = formik.values[name];
        if (typeof image === 'string') {
            setPreviewImage(image);
        }
    }, [formik.values[name]]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (file) {
            setFieldValue(name, file);

            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            setFieldValue(name, file);

            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const dynamicLabel = label || name.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

    return (
        <div className={formik.submitCount && formik.errors[name] ? 'has-error' : formik.submitCount ? 'has-success' : ''}>
            <label htmlFor={name}>
                {dynamicLabel}
                {isRequired && <span className="text-danger">*</span>}
            </label>
            <div
                className={`dropzone ${formik.errors[name] && formik.touched[name] ? 'is-invalid' : ''}`}
                onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}
            >
                <input
                    type="file"
                    id={name}
                    name={name}
                    onChange={handleImageChange}
                    className={className}
                />
                <p style={{ margin: '6px', color: '#4d5875' }}>
                    Drag and drop your file here, or click to browse
                </p>
            </div>
            {formik.submitCount > 0 && formik.errors[name] && formik.touched[name] && (
                <div className="text-danger mt-1">{formik.errors[name]}</div>
            )}
            {previewImage && (
                <div>
                    <p>Preview:</p>
                    <img src={previewImage} alt="Preview" />
                </div>
            )}
        </div>
    );
};

export default FormikFileUpload;
