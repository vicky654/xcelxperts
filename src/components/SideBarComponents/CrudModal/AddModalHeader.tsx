import React from 'react';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

const AddModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
  return (
    <header className="px-6 py-4 bg-gray-100">
      <div className="flex items-center justify-between">
        <h2 className="text-lg  leading-7 text-gray-900 fw-bolder" style={{fontWeight:"bold"}}>{title}</h2>
        <button className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring" onClick={onClose}>
          <span className="sr-only">Close panel</span>
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default AddModalHeader;
