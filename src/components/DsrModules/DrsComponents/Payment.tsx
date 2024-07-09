import React, { useEffect, useState } from 'react';
import withApiHandler from '../../../utils/withApiHandler';
import { CommonDataEntryProps } from '../../commonInterfaces';
import useErrorHandler from '../../../hooks/useHandleError';
import DataTable, { TableColumn } from 'react-data-table-component';

interface PaymentItem {
    id: string;
    card_name: string;
    amount: string;
    update_amount: boolean;
}

interface PaymentData {
    listing: PaymentItem[];
    is_editable: boolean;
}

const Payment: React.FC<CommonDataEntryProps> = ({ stationId, startDate, getData, postData, isLoading }) => {
    const handleApiError = useErrorHandler();
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (stationId && startDate) {
            handleApplyFilters(stationId, startDate);
        }
    }, [stationId, startDate]);

    const handleApplyFilters = async (stationId: string | null, startDate: string | null) => {
        try {
            setLoading(true);
            const response = await getData(`/data-entry/payment/list?drs_date=${startDate}&station_id=${stationId}`);
            if (response && response.data && response.data.data) {
                setPaymentData(response.data?.data);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAmountChange = (value: string, id: string) => {
        if (paymentData) {
            const updatedList = paymentData.listing.map((payment) =>
                payment.id === id ? { ...payment, amount: value } : payment
            );
            setPaymentData({ ...paymentData, listing: updatedList });
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (paymentData) {
            try {
                setLoading(true);
                const formData = new FormData();

                paymentData.listing.forEach((payment) => {
                    formData.append(`card[${payment.id}]`, payment.amount);
                });

                if (stationId && startDate) {
                    formData.append('drs_date', startDate);
                    formData.append('station_id', stationId);
                }

                const url = `data-entry/payment/update`;

                const isSuccess = await postData(url, formData);
                if (isSuccess) {
                    if (stationId && startDate) {
                        handleApplyFilters(stationId, startDate);
                    }
                }
            } catch (error) {
                handleApiError(error);
            } finally {
                setLoading(false);
            }
        }
    };

    const columns: TableColumn<PaymentItem>[] = [
        { name: 'Card Name', selector: (row: PaymentItem) => row.card_name, sortable: true },
        {
            name: 'Amount',
            cell: (row: PaymentItem) => (
                <input
                    type="text"
                    value={row.amount}
                    className='form-input'
                    onChange={(e) => handleAmountChange(e.target.value, row.id)}
                    style={{ width: '100px' }} // Adjust styling as needed
                />
            ),
            sortable: true
        }
    ];

    return (
        <div>
            <h1 className="text-lg font-semibold mb-4 ">Payments</h1>
            <form onSubmit={handleFormSubmit}>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    paymentData && (
                        <DataTable
                            columns={columns}
                            data={paymentData?.listing}
                            
                        />
                    )
                )}
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default withApiHandler(Payment);
