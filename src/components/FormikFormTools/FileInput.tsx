import React, { useState } from 'react';

interface FileInputProps {
    name: string;
    label: string;
    onChange: (file: File | null) => void;
    error?: string;
}

const FileInput: React.FC<FileInputProps> = ({ name, label, onChange, error }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        onChange(file);
    };

    return (
        <div>
            <label htmlFor={name}>{label}</label>
            <input type="file" id={name} name={name} onChange={handleChange} />
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default FileInput;
