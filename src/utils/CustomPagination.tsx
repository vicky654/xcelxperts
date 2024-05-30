import React from "react";
import IconCaretDown from "../components/Icon/IconCaretDown";
import IconCaretsDown from "../components/Icon/IconCaretsDown";

interface CustomPaginationProps {
    currentPage: number;
    lastPage: number;
    handlePageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
    currentPage,
    lastPage,
    handlePageChange,
}) => {
    const maxPagesToShow = 5; // Adjust the number of pages to show in the center
    const pages = [];

    // Calculate the range of pages to display
    let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, lastPage);

    // Handle cases where the range is near the beginning or end
    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }

    // Render the pagination items
    for (let i = startPage; i <= endPage; i++) {
        pages.push(
            <li key={i}>
                <button
                    type="button"
                    className={`flex justify-center font-semibold px-3.5 py-2 rounded-full transition ${i === currentPage
                        ? 'bg-primary text-white dark:text-white-light dark:bg-primary'
                        : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary'
                        }`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            </li>
        );
    }

    return (
        <div className="panel" id="rounded">
            <div className="mb-5 flex justify-end items-center">
                <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse mb-4">
                    <li>
                        <button
                            type="button"
                            className={`flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark   dark:text-white-light dark:bg-[#191e3a]  ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "dark:hover:bg-primary hover:bg-primary  hover:text-white"}`}
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        >
                            <IconCaretsDown className="rotate-90 rtl:-rotate-90" />
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className={`flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark dark:text-white-light dark:bg-[#191e3a]  ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "dark:hover:bg-primary hover:bg-primary  hover:text-white"}`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <IconCaretDown className="w-5 h-5 rotate-90 rtl:-rotate-90" />
                        </button>
                    </li>
                    {startPage > 1 && (
                        <li>
                            <button
                                type="button"
                                className="flex justify-center font-semibold px-3.5 py-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                                onClick={() => handlePageChange(startPage - 1)}
                            >
                                ...
                            </button>
                        </li>
                    )}
                    {pages}
                    {endPage < lastPage && (
                        <li>
                            <button
                                type="button"
                                className="flex justify-center font-semibold px-3.5 py-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                                onClick={() => handlePageChange(endPage + 1)}
                            >
                                ...
                            </button>
                        </li>
                    )}
                    <li>
                        <button
                            type="button"

                            className={`flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark  dark:text-white-light dark:bg-[#191e3a] ${currentPage === lastPage ? "text-gray-400 cursor-not-allowed" : "dark:hover:bg-primary hover:bg-primary  hover:text-white"}`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === lastPage}
                        >
                            <IconCaretDown className="w-5 h-5 -rotate-90 rtl:rotate-90" />
                        </button>
                    </li>

                    <li>
                        <button
                            type="button"
                            className={`flex justify-center font-semibold p-2 rounded-full transition bg-white-light text-dark hover:text-white dark:text-white-light dark:bg-[#191e3a] ${currentPage === lastPage ? "text-gray-400 cursor-not-allowed" : "dark:hover:bg-primary hover:bg-primary"}`}
                            onClick={() => handlePageChange(lastPage)}
                            disabled={currentPage === lastPage}
                        >
                            <IconCaretsDown className={`-rotate-90 rtl:rotate-90 ${currentPage === lastPage ? "text-gray-400" : ""}`} />
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default CustomPagination;
