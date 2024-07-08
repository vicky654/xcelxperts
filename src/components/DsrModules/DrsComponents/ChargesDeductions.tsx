import React, { useEffect, useState } from 'react';
import withApiHandler from '../../../utils/withApiHandler';
import { CommonDataEntryProps } from '../../commonInterfaces';
import useErrorHandler from '../../../hooks/useHandleError';
import DataTable, { TableColumn } from 'react-data-table-component'; // Import TableColumn type
import { Button, Form } from 'react-bootstrap';

interface ChargesDeductionsData {
    id: string;
    name: string;
    amount: string;
    update_amount: boolean;
}

const ChargesDeductions: React.FC<CommonDataEntryProps> = ({ stationId, startDate, postData, getData, isLoading }) => {
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

            charges.forEach(charge => {
                formData.append(`charge[${charge.id}]`, charge.amount);
            });

            deductions.forEach(deduction => {
                formData.append(`deduction[${deduction.id}]`, deduction.amount);
            });
            if (stationId && startDate) {
                formData.append('drs_date', startDate);
                formData.append('station_id', stationId);
            }

            const url = 'data-entry/charge-deduction/update';
            const isSuccess = await postData(url, formData);
         
            if (isSuccess) {
                // Optionally, refetch data after successful submission
                fetchData();
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleChange = (value: string, id: string, field: keyof ChargesDeductionsData) => {

        console.log(field, "field");

        // Update charges or deductions based on the field
        if (field === 'amount') {
            const updatedCharges = charges.map(charge => charge.id === id ? { ...charge, amount: value } : charge);
            setCharges(updatedCharges);
        } else {
            const updatedDeductions = deductions.map(deduction => deduction.id === id ? { ...deduction, name: value } : deduction);
            setDeductions(updatedDeductions);
        }
    };

    const columns: TableColumn<ChargesDeductionsData>[] = [
        {
            name: 'Name',
            selector: (row) => row.name,
            sortable: true,
            cell: (row) => (
                <span>{row.name}</span>
            )
        },
        {
            name: 'Amount',
            selector: (row) => row.amount,
            sortable: true,
            cell: (row) => (
                <Form.Control
                    type="text"
                    value={row.amount}
                    className="form-input"
                    onChange={(e) => handleChange(e.target.value, row.id, 'amount')}
                    readOnly={!row.update_amount}
                />
            )
        }
    ];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{`Charges and Deductions for ${stationId} on ${startDate}`}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">Charges</h2>
                    <DataTable
                        columns={columns}
                        data={charges}
                        noHeader
                        striped
                        highlightOnHover

                    />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">Deductions</h2>
                    <DataTable
                        columns={columns}
                        data={deductions}
                        noHeader
                        striped
                        highlightOnHover

                    />
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
    );
};

export default withApiHandler(ChargesDeductions);
