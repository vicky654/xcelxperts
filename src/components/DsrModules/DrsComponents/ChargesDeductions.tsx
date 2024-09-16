import React, { useEffect, useRef, useState } from 'react';
import withApiHandler from '../../../utils/withApiHandler';
import { CommonDataEntryProps } from '../../commonInterfaces';
import useErrorHandler from '../../../hooks/useHandleError';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { currency } from '../../../utils/CommonData';
import LoaderImg from '../../../utils/Loader';
import noDataImage from '../../../assets/AuthImages/noDataFound.png';
import { handleDownloadPdf } from '../../CommonFunctions';

interface ChargesDeductionsData {
    id: string;
    name: string;
    amount: number;
    notes: string;
    update_amount: boolean;
    type: 'charge' | 'deduction'; // Added type to differentiate between charges and deductions
}

const ChargesDeductions: React.FC<CommonDataEntryProps> = ({ isLoading, stationId, startDate, postData, getData, applyFilters }) => {
    const handleApiError = useErrorHandler();
    const [charges, setCharges] = useState<ChargesDeductionsData[]>([]);
    const [deductions, setDeductions] = useState<ChargesDeductionsData[]>([]);
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [isdownloadpdf, setIsdownloadpdf] = useState(true);
    const calculateTotalRow = (items: ChargesDeductionsData[], type: 'charge' | 'deduction'): ChargesDeductionsData => {
        const totalAmount = items.reduce((total, item) => {
            if (item.update_amount) {
                return total + (item.amount || 0);
            }
            return total;
        }, 0);

        return {
            id: 'total',
            name: 'Total',
            type,
            amount: totalAmount,
            notes: '',
            update_amount: false
        };
    };

    const fetchData = async () => {
        try {
            if (stationId && startDate) {
                const response = await getData(`data-entry/charge-deduction/list?drs_date=${startDate}&station_id=${stationId}`);
                if (response && response.data && response.data.data) {
                    const { charges, deductions, is_editable } = response.data.data;
                    setIsdownloadpdf(response.data.data?.download_pdf);
                    const chargesWithTotal = [...charges, calculateTotalRow(charges, 'charge')];
                    const deductionsWithTotal = [...deductions, calculateTotalRow(deductions, 'deduction')];

                    setCharges(chargesWithTotal);
                    setDeductions(deductionsWithTotal);
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


    const formikRef = useRef<any>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.altKey && event.key === 'Enter') {
                event.preventDefault(); // Prevent default action of Alt + Enter
                if (isEditable) { // Check if isEditable is true
                    handleSubmit(); // Call the API after submission
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isEditable]);



    const handleSubmit = async () => {
        try {
            const formData = new FormData();

            charges.forEach(charge => {
                if (charge.amount !== null && charge.amount !== undefined && charge.amount !== 0) {
                    formData.append(`charge[${charge.id}]`, charge.amount.toString());
                }
                if (charge.notes !== null && charge.notes !== undefined && charge.notes !== "") {
                    formData.append(`charge_notes[${charge.id}]`, charge.notes);
                }
            });

            deductions.forEach(deduction => {
                if (deduction.amount !== null && deduction.amount !== undefined && deduction.amount !== 0) {
                    formData.append(`deduction[${deduction.id}]`, deduction.amount.toString());
                }
                if (deduction.notes !== null && deduction.notes !== undefined && deduction.notes !== "") {
                    formData.append(`deduction_notes[${deduction.id}]`, deduction.notes);
                }
            });

            if (stationId && startDate) {
                formData.append('drs_date', startDate);
                formData.append('station_id', stationId);
            }

            const url = 'data-entry/charge-deduction/update';
            const isSuccess = await postData(url, formData);

            if (isSuccess) {
                applyFilters({ station_id: stationId, start_date: startDate, selectedCardName: "Extra Income & Expenses" });
                fetchData();
            }
        } catch (error) {
            handleApiError(error);
        }
    };


    const handleAmountChange = (value: any, row: ChargesDeductionsData) => {
        // Convert the value to a number
        let numericValue = value === '' ? 0 : parseFloat(value);

        // onChange={(e) => formik.setFieldValue(e.target.name, e.target.value === '' ? 0 : parseFloat(e.target.value))}
                                                              
        // let numericValue = value ===  '' ? 0 : parseFloat(e.target.value))
        // e.target.name, e.target.value === '' ? 0 : parseFloat(e.target.value))
        // Check if the parsed value is a valid number
        if (isNaN(numericValue)) {
            console.error("Invalid amount value:", value);
            return;
        }
        
        if (isNaN(numericValue)) {
            console.error("Invalid amount value:", value);
            return;
        }

        if (row.type === 'charge') {
            // Update charges
            const updatedCharges = charges.map(charge =>
                charge.id === row.id ? { ...charge, amount: numericValue } : charge
            );

            // Calculate total amount for charges excluding the 'total' row
            const TotalChargesamount = updatedCharges
                .filter(charge => charge.id !== 'total') // Exclude the 'total' row
                .reduce((total, charge) => total + (charge.amount || 0), 0);


            // Update the last object (the total row)
            const updatedChargesWithTotal = updatedCharges.map(charge =>
                charge.id === 'total' ? { ...charge, amount: TotalChargesamount } : charge
            );
            setCharges(updatedChargesWithTotal);

        } else if (row.type === 'deduction') {
            // Update deductions
            const updatedDeductions = deductions.map(deduction =>
                deduction.id === row.id ? { ...deduction, amount: numericValue } : deduction
            );

            // Calculate total amount for deductions excluding the 'total' row
            const TotalDeductionsamount = updatedDeductions
                .filter(deduction => deduction.id !== 'total') // Exclude the 'total' row
                .reduce((total, deduction) => total + (deduction.amount || 0), 0);


            // Update the last object (the total row)
            const updatedDeductionsWithTotal = updatedDeductions.map(deduction =>
                deduction.id === 'total' ? { ...deduction, amount: TotalDeductionsamount } : deduction
            );

            setDeductions(updatedDeductionsWithTotal);
        }
    };



    const handleNoteChange = (value: string, row: ChargesDeductionsData) => {
        if (row.type === 'charge') {
            const updatedCharges = charges.map(charge =>
                charge.id === row.id ? { ...charge, notes: value } : charge
            );

            setCharges(updatedCharges);
        } else {
            const updatedDeductions = deductions.map(deduction =>
                deduction.id === row.id ? { ...deduction, notes: value } : deduction
            );
            setDeductions(updatedDeductions);
        }
    };


    const getTabIndex = (rowIndex: number, colIndex: number) => {
        // Adjust the base index according to your needs
        return rowIndex * columns.length + colIndex + 1;
    };



    const handleNavigation = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const validKeys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'];

        if (!validKeys.includes(e.key)) {
            return; // Allow default behavior for other keys
        }

        // Check if Ctrl key is pressed
        const isCtrlPressed = e.ctrlKey;

        // Only handle navigation if Ctrl is pressed and key is ArrowRight, ArrowLeft, ArrowDown, or ArrowUp
        if (!isCtrlPressed && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
            return;
        }


        e.preventDefault(); // Prevent default arrow key behavior for navigation keys

        const inputs = Array.from(document.querySelectorAll('.workflorform-input')) as HTMLInputElement[];
        const currentInput = e.currentTarget as HTMLInputElement;
        const currentTabIndex = currentInput.tabIndex;

        let nextInput: HTMLInputElement | null = null;

        switch (e.key) {
            case 'ArrowRight':
                if (isCtrlPressed) {
                    nextInput = inputs.find(input => input.tabIndex > currentTabIndex && input.tabIndex !== -1) || null;
                }
                break;
            case 'ArrowLeft':
                if (isCtrlPressed) {
                    nextInput = inputs.slice().reverse().find(input => input.tabIndex < currentTabIndex && input.tabIndex !== -1) || null;
                }
                break;
            case 'ArrowDown':
                if (isCtrlPressed) {
                    nextInput = inputs.find(input => input.tabIndex === currentTabIndex + columns.length) || null;
                }
                break;
            case 'ArrowUp':
                if (isCtrlPressed) {
                    nextInput = inputs.find(input => input.tabIndex === currentTabIndex - columns.length) || null;
                }
                break;
            default:
                break;
        }

        if (nextInput) {
            nextInput.focus();
        }
    };



    const handleNavigation2 = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const validKeys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'];

        if (!validKeys.includes(e.key)) {
            return; // Allow default behavior for other keys
        }

        e.preventDefault(); // Prevent default arrow key behavior for navigation keys

        const inputs = Array.from(document.querySelectorAll('.workflorform-input2')) as HTMLInputElement[];
        const currentInput = e.currentTarget as HTMLInputElement;
        const currentTabIndex = currentInput.tabIndex;

        let nextInput: HTMLInputElement | null = null;

        switch (e.key) {
            case 'ArrowRight':
                nextInput = inputs.find(input => input.tabIndex > currentTabIndex && input.tabIndex !== -1) || null;
                break;
            case 'ArrowLeft':
                nextInput = inputs.slice().reverse().find(input => input.tabIndex < currentTabIndex && input.tabIndex !== -1) || null;
                break;
            case 'ArrowDown':
                nextInput = inputs.find(input => input.tabIndex === currentTabIndex + columns.length) || null;
                break;
            case 'ArrowUp':
                nextInput = inputs.find(input => input.tabIndex === currentTabIndex - columns.length) || null;
                break;
            default:
                break;
        }

        if (nextInput) {
            nextInput.focus();
        }
    };

    const columns: TableColumn<ChargesDeductionsData>[] = [
        {
            name: (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-amount">Name</Tooltip>}
                >
                    <span>Name</span>
                </OverlayTrigger>
            ),
            selector: (row) => row.name,
            sortable: false,
            cell: (row, index: number) => <span tabIndex={getTabIndex(index, 1)}>{row.name}</span>
        },
        {
            name: (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-amount">Note</Tooltip>}
                >
                    <span>Note</span>
                </OverlayTrigger>
            ),
            selector: (row) => row.notes,
            sortable: false,
            cell: (row: any, index: number) => (
                <Form.Control
                    type="text"
                    value={row.notes}
                    placeholder='Notes'
                    className={`form-input workflorform-input ${row.update_amount ? '' : 'readonly'}`}
                    onChange={(e) => handleNoteChange(e.target.value, row)}
                    readOnly={!row.update_amount}
                    onKeyDown={(e: any) => handleNavigation(e, index)}
                    tabIndex={!row.update_amount ? -1 : getTabIndex(index, 2)}

                />
            )
        },
        {
            name: (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-amount">Amount {currency}</Tooltip>}
                >
                    <span>Amount {currency}</span>
                </OverlayTrigger>
            ),
            selector: (row) => row.amount,
            sortable: false,
            cell: (row, index: number) => (
                <Form.Control
                    type="number"
                    placeholder='Amount'
                    value={row.amount}
                    className={`form-input workflorform-input ${row.update_amount ? '' : 'readonly'}`}
                    onChange={(e) => handleAmountChange(e.target.value, row)}
                    readOnly={!row.update_amount}
                    onKeyDown={(e: any) => handleNavigation(e, index)}
                    tabIndex={!row.update_amount ? -1 : getTabIndex(index, 3)}

                />
            )
        }
    ];


    const DeductionColumns: TableColumn<ChargesDeductionsData>[] = [
        {
            name: (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-amount">Name</Tooltip>}
                >
                    <span>Name</span>
                </OverlayTrigger>
            ),
            selector: (row) => row.name,
            sortable: false,
            cell: (row, index: number) => <span tabIndex={getTabIndex(index, 4)}>{row.name}</span>
        },
        {
            name: (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-amount">Note</Tooltip>}
                >
                    <span>Note</span>
                </OverlayTrigger>
            ),
            selector: (row) => row.notes,
            sortable: false,
            cell: (row, index: number) => (
                <Form.Control
                    type="text"
                    value={row.notes}
                    placeholder='Notes'
                    className={`form-input workflorform-input2 ${row.update_amount ? '' : 'readonly'}`}
                    onChange={(e) => handleNoteChange(e.target.value, row)}
                    readOnly={!row.update_amount}
                    onKeyDown={(e: any) => handleNavigation2(e, index)}
                    tabIndex={!row.update_amount ? -1 : getTabIndex(index, 5)}

                />
            )
        },
        {
            name: (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip className='custom-tooltip' id="tooltip-amount">Amount {currency}</Tooltip>}
                >
                    <span>Amount {currency}</span>
                </OverlayTrigger>
            ),
            selector: (row) => row.amount,
            sortable: false,
            cell: (row, index: number) => (
                <Form.Control
                    type="text"
                    placeholder='Amount'
                    value={row.amount}
                    className={`form-input workflorform-input2 ${row.update_amount ? '' : 'readonly'}`}
                    onChange={(e) => handleAmountChange(e.target.value, row)}
                    readOnly={!row.update_amount}
                    onKeyDown={(e: any) => handleNavigation2(e, index)}
                    tabIndex={!row.update_amount ? -1 : getTabIndex(index, 6)}

                />
            )
        }
    ];

    return (
        <>
            {isLoading && <LoaderImg />}
            <div ref={formikRef}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 className="text-lg font-bold mb-4 displaycanter">
                        {`Expenses and Extra Income `} {startDate ? `(${startDate})` : ''}{isdownloadpdf && (<span onClick={() => handleDownloadPdf('charges', stationId, startDate, getData, handleApiError)}>


                            <OverlayTrigger placement="top" overlay={<Tooltip className="custom-tooltip" >Download Report</Tooltip>}>
                                <i style={{ fontSize: "20px", color: "red", cursor: "pointer" }} className="fi fi-tr-file-pdf"></i>
                            </OverlayTrigger>

                        </span>)}

                    </h1>


                </div>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-12">
                        <h2 className="text-lg font-bold mb-4">Expenses</h2>
                        {deductions && deductions.length > 0 ? (
                            <div className="datatables auto-height-react-table">
                                <DataTable
                                    columns={DeductionColumns}
                                    data={deductions}
                                // className="tablecardHeight"

                                />
                            </div>
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
                    <div className="col-span-12 md:col-span-12">
                        <h2 className="text-lg font-bold mb-4">Extra Income</h2>
                        {charges && charges.length > 0 ? (
                            <div className="datatables auto-height-react-table">
                                <DataTable
                                    columns={columns}
                                    data={charges}

                                />
                            </div>
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
                        <Button variant="primary"
                            type='submit'
                            onClick={handleSubmit} >
                            Submit
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default withApiHandler(ChargesDeductions);
