import React, { useEffect } from 'react';
import withApiHandler from '../../../utils/withApiHandler';
import { CommonDataEntryProps } from '../../commonInterfaces';
import useErrorHandler from '../../../hooks/useHandleError';


const FuelDelivery: React.FC<CommonDataEntryProps> = ({ stationId, startDate, postData, getData, isLoading }) => {
    const handleApiError = useErrorHandler();
    useEffect(() => {
        if (stationId && startDate) {
            handleApplyFilters(stationId, startDate);
        }
    }, [stationId, startDate]);
    const handleApplyFilters = async (stationId: string | null, startDate: string | null) => {
        try {
            const response = await getData(`/data-entry/fuel-delivery/list?station_id=${stationId}&drs_date=${startDate}`);
            if (response && response.data && response.data.data) {
                console.log(response.data.data, "columnIndex");
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <div>
            <h1>{`FuelDelivery ${stationId} ${startDate}`}</h1>
            {/* Your component content */}
        </div>
    );
};

export default withApiHandler(FuelDelivery);
