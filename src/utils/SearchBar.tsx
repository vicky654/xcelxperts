import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  hideReset?: boolean;
  onReset: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onReset, placeholder, hideReset }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm('');
    onReset();
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        className="w-40 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
        placeholder={placeholder || 'Search...'}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      <button
        className="ml-2 px-2 py-2 btn btn-primary text-white rounded-md hover:bg-blue-600 transition duration-150 ease-in-out"
        onClick={handleSearch}
        aria-label="Search"
      >
        {/* Search */}
        <i className="fi fi-tr-member-search"></i>
      </button>

      {hideReset && (
        <button
          className="ml-2 px-2 py-2 btn btn-danger  text-white rounded-md hover:bg-red-600 transition duration-150 ease-in-out"
          onClick={handleReset}
          aria-label="Clear"
        >
          {/* Clear */}
          <i className="fi fi-tr-not-found-alt"></i>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
