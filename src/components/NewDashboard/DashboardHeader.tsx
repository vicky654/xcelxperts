import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Tippy from '@tippyjs/react';

interface DashboardHeaderProps {
    filterData: {
        basic_details?: {
            day_end_date?: string;
            client_name?: string;
        };
        stock?: boolean;
    };
    UserPermissions?: {
        dates?: string;
    };
    filters: {
        client_id?: string;
        entity_id?: string;
        station_id?: string;
        client_name?: string;
        entity_name?: string;
        station_name?: string;
    };
    data?: {
        full_name?: string;
    };
    setModalOpen: (open: boolean) => void;
    handleResetFilters: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    filterData,
    UserPermissions,
    filters,
    data,
    setModalOpen,
    handleResetFilters,
}) => {
    return (
        <div className='flex justify-between items-center flex-wrap'>
            <div>
                <h2 className='font-bold'>
                    Dashboard
                    {filterData?.basic_details?.day_end_date && (
                        <>
                            ({filterData?.basic_details?.day_end_date})
                            {filterData?.stock && (
                                <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                        <Tooltip className='custom-tooltip' id="tooltip-amount">
                                            You are able to see data till the last day end {filterData?.basic_details?.day_end_date}
                                        </Tooltip>
                                    }
                                >
                                    <span><i className="fi fi-sr-comment-info"></i></span>
                                </OverlayTrigger>
                            )}
                        </>
                    )}
                    {!filterData?.basic_details?.client_name && `(${UserPermissions?.dates})`}
                </h2>
                <ul className="flex space-x-2 rtl:space-x-reverse my-1"></ul>
            </div>

            <div className='flex gap-4 flex-wrap'>
                {(filters?.client_id || filters?.entity_id || filters?.station_id) && (
                    <div className="badges-container flex flex-wrap items-center gap-2 px-4 text-white" style={{ background: "#ddd" }}>
                        {filters?.client_id && (
                            <div className="badge bg-blue-600 flex items-center gap-2 px-2 py-1">
                                <span className="font-semibold">Client :</span> {filters?.client_name || data?.full_name}
                            </div>
                        )}
                        {filters?.entity_id && filters?.entity_name && (
                            <div className="badge bg-green-600 flex items-center gap-2 px-2 py-1">
                                <span className="font-semibold">Entity :</span> {filters?.entity_name}
                            </div>
                        )}
                        {filters?.station_id && filters?.station_name && (
                            <div className="badge bg-red-600 flex items-center gap-2 px-2 py-1">
                                <span className="font-semibold">Station :</span> {filters?.station_name}
                            </div>
                        )}
                    </div>
                )}

                <button onClick={() => setModalOpen(true)} type="button" className="btn btn-dark">
                    Apply Filter
                </button>

                {(filters?.client_id || filters?.entity_id || filters?.station_id) && (
                    <button onClick={handleResetFilters}>
                        <div className="grid place-content-center w-16 h-10 border border-white-dark/20 dark:border-[#191e3a]">
                            <Tippy content="Reset Filter">
                                <span className="btn bg-danger btn-danger">
                                    <i className="fi fi-ts-filter-slash w-6 h-6"></i>
                                </span>
                            </Tippy>
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
};

export default DashboardHeader;
