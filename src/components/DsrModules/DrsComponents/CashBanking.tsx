import React, { useEffect } from 'react';
import withApiHandler from '../../../utils/withApiHandler';
import { CommonDataEntryProps } from '../../commonInterfaces';
import useErrorHandler from '../../../hooks/useHandleError';


const CashBanking: React.FC<CommonDataEntryProps> = ({ stationId, startDate, postData, getData, isLoading }) => {
    const handleApiError = useErrorHandler();
    useEffect(() => {
        if (stationId && startDate) {
            handleApplyFilters(stationId, startDate);
        }
    }, [stationId, startDate]);
    const handleApplyFilters = async (stationId: string | null, startDate: string | null) => {
        try {
            const response = await getData(`/data-entry/cash-banking/?drs_date=${startDate}&station_id=${stationId}`);
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
            <h1>{`CashBanking ${stationId} ${startDate}`}</h1>
            {/* Your component content */}
        </div>
    );
};

export default withApiHandler(CashBanking);
// import React, { useEffect, useState } from 'react';
// import withApiHandler from '../../../utils/withApiHandler';
// import { CommonDataEntryProps } from '../../commonInterfaces';
// import useErrorHandler from '../../../hooks/useHandleError';
// import DataTable, { TableColumn } from 'react-data-table-component';

// interface PaymentItem {
//     id: string;
//     card_name: string;
//     amount: string;
//     update_amount: boolean;
// }

// interface PaymentData {
//     listing: PaymentItem[];
//     is_editable: boolean;
// }

// const Payment: React.FC<CommonDataEntryProps> = ({ stationId, startDate, postData, getData, isLoading }) => {
//     const handleApiError = useErrorHandler();
//     const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
//     const [formData, setFormData] = useState<PaymentItem | null>(null);

//     useEffect(() => {
//         if (stationId && startDate) {
//             handleApplyFilters(stationId, startDate);
//         }
//     }, [stationId, startDate]);

//     const handleApplyFilters = async (stationId: string | null, startDate: string | null) => {
//         try {
//             setLoading(true);
//             const response = await getData(`/data-entry/payment/list?drs_date=${startDate}&station_id=${stationId}`);
//             if (response && response.data && response.data.data) {
//                 setPaymentData(response.data.data);
//             } else {
//                 throw new Error('No data available in the response');
//             }
//         } catch (error) {
//             handleApiError(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEdit = (payment: PaymentItem) => {
//         setSelectedPayment(payment);
//         setFormData(payment);
//     };

//     const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => prevData ? { ...prevData, [name]: value } : null);
//     };

//     const handleFormSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (formData) {
//             setPaymentData((prevData) => {
//                 if (!prevData) return null;
//                 const updatedList = prevData.listing.map((payment) =>
//                     payment.id === formData.id ? formData : payment
//                 );
//                 return { ...prevData, listing: updatedList };
//             });
//             setSelectedPayment(null);
//         }
//     };

//     const columns: TableColumn<PaymentItem>[] = [
//         { name: 'Card Name', selector: (row: PaymentItem) => row.card_name, sortable: true },
//         { name: 'Amount', selector: (row: PaymentItem) => row.amount, sortable: true },
//         {
//             name: 'Actions',
//             cell: (row: PaymentItem) => (
//                 <button onClick={() => handleEdit(row)}>Edit</button>
//             )
//         }
//     ];

//     return (
//         <div>
//             <h1>{`Payment ${stationId} ${startDate}`}</h1>
//             {selectedPayment && formData && (
//                 <div>
//                     <h2>Edit Payment</h2>
//                     <form onSubmit={handleFormSubmit}>
//                         <div>
//                             <label>Card Name</label>
//                             <input
//                                 type="text"
//                                 name="card_name"
//                                 value={formData.card_name}
//                                 onChange={handleFormChange}
//                             />
//                         </div>
//                         <div>
//                             <label>Amount</label>
//                             <input
//                                 type="text"
//                                 name="amount"
//                                 value={formData.amount}
//                                 onChange={handleFormChange}
//                             />
//                         </div>
//                         <div>
//                             <button type="submit">Save</button>
//                             <button type="button" onClick={() => setSelectedPayment(null)}>Cancel</button>
//                         </div>
//                     </form>
//                 </div>
//             )}
//             {loading ? (
//                 <p>Loading...</p>
//             ) : (
//                 paymentData && (
//                     <DataTable
//                         columns={columns}
//                         data={paymentData.listing}
//                         pagination
//                     />
//                 )
//             )}
       
//         </div>
//     );
// };

// export default withApiHandler(Payment);
