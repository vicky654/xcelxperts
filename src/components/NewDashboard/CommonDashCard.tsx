import React from 'react';
import { FormatNumberCommon } from '../CommonFunctions';
import { capacity, currency } from '../../utils/CommonData';

interface SubHeadingData {
    status?: 'UP' | 'DOWN' | string;
    percentage?: number;
}

interface CommonDashCardProps {
    data?: any;
    boxNumberClass: string;
    title: string;
    firstScreen: boolean;
    headingValue: number | null | undefined;
    subHeadingData?: SubHeadingData;
    onClick?: () => void;
}

const CommonDashCard: React.FC<CommonDashCardProps> = ({
    data,
    onClick,
    title,
    firstScreen,
    headingValue,
    subHeadingData,
    boxNumberClass,
}) => {


    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'UP':
                return '#37a40a'; // Green for 'up'
            case 'DOWN':
                return 'red'; // Red for 'down'
            default:
                return '#000'; // Black for any other case
        }
    };

    return (
        <div
            className={`panel updownDiv ${boxNumberClass} ${(data && firstScreen) ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="flex justify-between">
                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">{title}</div>
            </div>
            <div className="flex items-center">
                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                    {title === "Gross Volume (Fuel)" ? `${capacity}` : `${currency}`}
                    {FormatNumberCommon(headingValue)}
                </div>
            </div>
            <div
                style={{ color: getStatusColor(subHeadingData?.status) }}
                className="badge w-1/2 bg-white flex items-center font-semibold mt-5"
            >
                {subHeadingData?.status === 'UP' ? (
                    <i style={{ color: '#37a40a' }} className="fi fi-tr-chart-line-up"></i>
                ) : (
                    <i style={{ color: 'red' }} className="fi fi-tr-chart-arrow-down"></i>
                )}
                <span>

                    Last Month  <br /> {subHeadingData?.percentage !== undefined ? subHeadingData.percentage + '%' : ''}
                </span>
            </div>
        </div>
    );
};

export default CommonDashCard;
