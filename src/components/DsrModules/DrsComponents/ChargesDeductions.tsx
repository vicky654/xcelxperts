import React, { useEffect, useState } from 'react';
import withApiHandler from '../../../utils/withApiHandler';
import { CommonDataEntryProps } from '../../commonInterfaces';
import useErrorHandler from '../../../hooks/useHandleError';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Button, Form } from 'react-bootstrap';
import { currency } from '../../../utils/CommonData';
import LoaderImg from '../../../utils/Loader';
import noDataImage from '../../../assets/noDataFoundImage/noDataFound.png';

interface ChargesDeductionsData {
    id: string;
    name: string;
    amount: string;
    notes: string;
    update_amount: boolean;
    type: 'charge' | 'deduction'; // Added type to differentiate between charges and deductions
}

const ChargesDeductions: React.FC<CommonDataEntryProps> = ({ isLoading, stationId, startDate, postData, getData, applyFilters }) => {
    const handleApiError = useErrorHandler();
    const [charges, setCharges] = useState<ChargesDeductionsData[]>([]);
    const [deductions, setDeductions] = useState<ChargesDeductionsData[]>([]);
    const [isEditable, setIsEditable] = useState<boolean>(false);

    const fetchData = async () => {
        try {
            if (stationId && startDate) {
                const response = await getData(`data-entry/charge-deduction/list?drs_date=${startDate}&station_id=${stationId}`);
                if (response && response.data && response.data.data) {
                    const { charges, deductions, is_editable } = response.data.data;
                    setCharges(charges);
                    setDeductions(deductions);
                    setIsEditable(is_editable);
                } else {
                    throw new Error('No data available in the response');
                }
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [stationId, startDate]);

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            console.log(charges, "charges");
            console.log(deductions, "deductions");
    
            charges.forEach(charge => {
                if (charge.amount !== null && charge.amount !== undefined && charge.amount !== "") {
                    formData.append(`charge[${charge.id}]`, charge.amount);
                }
                if (charge.notes !== null && charge.notes !== undefined && charge.notes !== "") {
                    formData.append(`charge[${charge.id}]`, charge.notes);
                }
            });
    
            deductions.forEach(deduction => {
                if (deduction.amount !== null && deduction.amount !== undefined && deduction.amount !== "") {
                    formData.append(`deduction[${deduction.id}]`, deduction.amount);
                }
                if (deduction.notes !== null && deduction.notes !== undefined && deduction.notes !== "") {
                    formData.append(`deduction[${deduction.id}]`, deduction.notes);
                }
            });
    
            if (stationId && startDate) {
                formData.append('drs_date', startDate);
                formData.append('station_id', stationId);
            }
    
            const url = 'data-entry/charge-deduction/update';
            const isSuccess = await postData(url, formData);
    
            if (isSuccess) {
                applyFilters({ station_id: stationId, start_date: startDate });
                fetchData();
            }
        } catch (error) {
            handleApiError(error);
        }
    };
    
    
    
    const handleAmountChange = (value: string, row: ChargesDeductionsData) => {
        if (row.type === 'charge') {
            const updatedCharges = charges.map(charge =>
                charge.id === row.id ? { ...charge, amount: value } : charge
            );
            setCharges(updatedCharges);
        } else {
            const updatedDeductions = deductions.map(deduction =>
                deduction.id === row.id ? { ...deduction, amount: value } : deduction
            );
            setDeductions(updatedDeductions);
        }
    };

    const handleNoteChange = (value: string, row: ChargesDeductionsData) => {

        console.log(value, "handleNoteChange");
        if (row.type === 'charge') {
            const updatedCharges = charges.map(charge =>
                charge.id === row.id ? { ...charge, notes: value } : charge
            );
            console.log(updatedCharges, "updatedCharges");
            setCharges(updatedCharges);
        } else {
            const updatedDeductions = deductions.map(deduction =>
                deduction.id === row.id ? { ...deduction, notes: value } : deduction
            );
            setDeductions(updatedDeductions);
        }
    };

    const columns: TableColumn<ChargesDeductionsData>[] = [
        {
            name: 'Name',
            selector: (row) => row.name,
            sortable: true,
            cell: (row) => <span>{row.name}</span>
        },
        {
            name: 'Note',
            selector: (row) => row.notes,
            sortable: true,
            cell: (row) => (
                <Form.Control
                    type="text"
                    value={row.notes}
                    placeholder='Notes'
                    className={`form-input ${row.update_amount ? '' : 'readonly'}`}
                    onChange={(e) => handleNoteChange(e.target.value, row)}
                    readOnly={!row.update_amount}
                />
            )
        },
        {
            name: `Amount ${currency}`,
            selector: (row) => row.amount,
            sortable: true,
            cell: (row) => (
                <Form.Control
                    type="text"
                    value={row.amount}
                    className={`form-input ${row.update_amount ? '' : 'readonly'}`}
                    onChange={(e) => handleAmountChange(e.target.value, row)}
                    readOnly={!row.update_amount}
                />
            )
        }
    ];

    return (
        <>
            {isLoading && <LoaderImg />}
            <div>
                <h1 className="text-lg font-semibold mb-4">
                    Income and Expenses {startDate ? `(${startDate})` : ''}
                </h1>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-6">
                        <h2 className="text-lg font-semibold mb-4">Income</h2>
                        {charges && charges.length > 0 ? (
                            <DataTable
                                columns={columns}
                                data={charges}
                                noHeader
                                striped
                                highlightOnHover
                            />
                        ) : (
                            <div className="all-center-flex">
                                <img
                                    src={noDataImage}
                                    alt="No data found"
                                    className="nodata-image"
                                />
                            </div>
                        )}
                    </div>
                    <div className="col-span-12 md:col-span-6">
                        <h2 className="text-lg font-semibold mb-4">Expenses</h2>
                        {deductions && deductions.length > 0 ? (
                            <DataTable
                                columns={columns}
                                data={deductions}
                                noHeader
                                striped
                                highlightOnHover
                            />
                        ) : (
                            <div className="all-center-flex">
                                <img
                                    src={noDataImage}
                                    alt="No data found"
                                    className="nodata-image"
                                />
                            </div>
                        )}
                    </div>
                </div>
                {isEditable && (
                    <div className="mt-4">
                        <Button variant="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default withApiHandler(ChargesDeductions);
