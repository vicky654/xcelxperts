import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (searchTerm: string) => void;
    onReset: () => void;
    placeholder?: string;
    isSearchApplied: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onReset, placeholder, isSearchApplied }) => {
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
        <div className="search-component d-flex gap-2 align-items-center">
            <input
                type="text"
                className="search-input w-40 form-control"
                placeholder={placeholder || 'Search...'}
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />

            <button type="button" className="btn btn-dark" onClick={handleSearch}>
                Search
            </button>
            {/* <Button
                isLight
                className="ms-2 px-2"
                color="primary"
                onClick={handleSearch}
                icon="Search"
                aria-label="Search"
            /> */}
            {isSearchApplied && (
                <button type="button" className="btn btn-dark" onClick={handleReset}>
                    Clear
                </button>
                // <Button
                //     isLight
                //     className="ms-2 px-2"
                //     color="danger"
                //     onClick={handleReset}
                //     icon="Clear"
                //     aria-label="Clear"
                // />
            )}
        </div>
    );
};

export default SearchBar;
