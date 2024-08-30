import React from 'react';
import { FormatNumberCommon } from '../CommonFunctions';

interface SubHeadingData {
    status?: 'up' | 'down' | string;
    percentage?: number;
}

interface CommonDashCardProps {
    data?: any;
    boxNumberClass: string;
    title: string;
    headingValue: number | null | undefined;
    subHeadingData?: SubHeadingData;
    onClick?: () => void;
}

const CommonDashCard: React.FC<CommonDashCardProps> = ({
    data,
    onClick,
    title,
    headingValue,
    subHeadingData,
    boxNumberClass,
}) => {
    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'up':
                return '#37a40a'; // Green for 'up'
            case 'down':
                return 'red'; // Red for 'down'
            default:
                return '#000'; // Black for any other case
        }
    };

    return (
        <div
            className={`panel updownDiv ${boxNumberClass} ${data ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="flex justify-between">
                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">{title}</div>
            </div>
            <div className="flex items-center">
                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                    ℓ{FormatNumberCommon(headingValue)}
                </div>
            </div>
            <div
                style={{ color: getStatusColor(subHeadingData?.status) }}
                className="badge bg-white flex items-center font-semibold mt-5"
            >
                {subHeadingData?.status === 'up' ? (
                    <i style={{ color: '#37a40a' }} className="fi fi-tr-chart-line-up"></i>
                ) : (
                    <i style={{ color: 'red' }} className="fi fi-tr-chart-arrow-down"></i>
                )}
                <span>
                    Last Month {subHeadingData?.percentage !== undefined ? subHeadingData.percentage + '%' : ''}
                </span>
            </div>
        </div>
    );
};

export default CommonDashCard;
