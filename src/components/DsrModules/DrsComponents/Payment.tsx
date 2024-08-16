import React, { useEffect, useState } from 'react';
import withApiHandler from '../../../utils/withApiHandler';
import { CommonDataEntryProps } from '../../commonInterfaces';
import useErrorHandler from '../../../hooks/useHandleError';
import DataTable, { TableColumn } from 'react-data-table-component';
import { currency } from '../../../utils/CommonData'
import { handleDownloadPdf } from '../../CommonFunctions';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
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

const Payment: React.FC<CommonDataEntryProps> = ({ stationId, startDate, getData, postData, applyFilters }) => {
    const handleApiError = useErrorHandler();
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [isdownloadpdf, setIsdownloadpdf] = useState(true);
// Default to 'USD' if not set

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
             
                const data = response.data.data;
                setIsEditable(data?.is_editable);
                setIsdownloadpdf(response.data.data?.download_pdf);
                const totalAmount = calculateTotalAmount(data?.listing);
                data.listing = updateTotalInListing(data?.listing, totalAmount, data?.is_editable);
                setPaymentData(data);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };
    

    const calculateTotalAmount = (listing: PaymentItem[]) => {
        return listing.reduce((total, item) => {
            if (item.update_amount) {
                return total + parseFloat(item.amount);
            }
            return total;
        }, 0);
    };

    const updateTotalInListing = (listing: PaymentItem[], totalAmount: number, isEditable: boolean) => {
        if (isEditable) {
            return listing.map((item) =>
                item.card_name === 'Total' ? { ...item, amount: totalAmount.toFixed(2) } : item
            );
        }
        return listing; // Return the original listing if not editable
    };
    
    
    const handleAmountChange = (value: string, id: string) => {
        if (paymentData) {
            const updatedList = paymentData.listing.map((payment) =>
                payment.id === id ? { ...payment, amount: value } : payment
            );
            const totalAmount = calculateTotalAmount(updatedList);
            
            // Use isEditable from state directly within the function
            const updatedListWithTotal = updateTotalInListing(updatedList, totalAmount, isEditable);
            
            setPaymentData({ ...paymentData, listing: updatedListWithTotal });
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
                        applyFilters({ station_id: stationId, start_date: startDate, selectedCardName: "Digital Receipt" });
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
        { name: (
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip className='custom-tooltip' id="tooltip-amount">Card Name</Tooltip>}
            >
                <span>Card Name</span>
            </OverlayTrigger>
        ),
            
            
            selector: (row: PaymentItem) => row.card_name, sortable: false },
        {
            name: (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-amount">Amount {currency}</Tooltip>}
                >
                    <span>Amount {currency}</span>
                </OverlayTrigger>
            ),
            sortable: false,
            cell: (row: PaymentItem) => (
                <input
                    type="number"
                    value={row.amount}
                    readOnly={!row.update_amount}
                    className={`${!row.update_amount ? 'readonly' : ''} form-input workflorform-input mt-1 block w-80 pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    onChange={(e) => handleAmountChange(e.target.value, row.id)}
                />
            ),
            
        },
    ];

    return (
        <div>
          
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 className="text-lg font-semibold mb-4 displaycanter">
                        {`Digital Receipt`} {startDate ? `(${startDate})` : ''} {isdownloadpdf && (<span onClick={() => handleDownloadPdf('payments', stationId, startDate, getData, handleApiError)}>
                        <OverlayTrigger  placement="top" overlay={<Tooltip className="custom-tooltip" >Download Report</Tooltip>}>
                                    <i style={{ fontSize: "20px", color: "red", cursor: "pointer" }} className="fi fi-tr-file-pdf"></i>
                                </OverlayTrigger>
                            
                            </span> )}
                   
                    </h1>
{/*                      
                    {isdownloadpdf  && (
                    <button
                        className='btn btn-primary'
                        onClick={() => handleDownloadPdf('payments', stationId, startDate, getData, handleApiError)}
                    >
                      Download Pdf   <i className="fi fi-tr-file-download"></i> 
                    </button>   )} */}
                </div>
            <form onSubmit={handleFormSubmit}>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    paymentData && (
                        <DataTable columns={columns} data={paymentData?.listing} />
                    )
                )}

                {isEditable?
                <button type="submit" className="btn btn-primary">Submit</button>:""}
            </form>
        </div>
    );
};

export default withApiHandler(Payment);
