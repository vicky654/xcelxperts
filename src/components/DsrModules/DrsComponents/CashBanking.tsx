import React, { useEffect, useState } from 'react';
import withApiHandler from '../../../utils/withApiHandler';
import { CommonDataEntryProps } from '../../commonInterfaces';
import useErrorHandler from '../../../hooks/useHandleError';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useCustomDelete from '../../../utils/customDelete';
import Tippy from '@tippyjs/react';

import noDataImage from '../../../assets/noDataFoundImage/noDataFound.png';
import { currency } from '../../../utils/CommonData';
interface CashBankingItem {
    id: string;
    reference: string;
    amount: string;
    type: string;
    created_date: string;
    update_amount: boolean;
}


const CashBanking: React.FC<CommonDataEntryProps> = ({ stationId, startDate, postData, getData, applyFilters }) => {
    const handleApiError = useErrorHandler();
    const [cashBankingData, setCashBankingData] = useState<CashBankingItem[]>([]);
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedCashBanking, setSelectedCashBanking] = useState<CashBankingItem | null>(null);

    useEffect(() => {
        if (stationId && startDate) {
            handleApplyFilters(stationId, startDate);
        }
    }, [stationId, startDate]);

    const handleApplyFilters = async (stationId: string | null, startDate: string | null) => {
        try {
            setLoading(true);
            const response = await getData(`/data-entry/cash-banking?drs_date=${startDate}&station_id=${stationId}`);
            if (response && response.data && response.data.data) {
             
                const { listing, is_editable } = response.data.data;
                formik.setFieldValue("amount", response.data?.data?.cash_value)
                setCashBankingData(listing);
                setIsEditable(is_editable);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (cashBanking: CashBankingItem) => {
        setSelectedCashBanking(cashBanking);
        formik.setValues(cashBanking);
    };

    const handleEditcancel = () => {
        setSelectedCashBanking(null)
        formik.resetForm();
    };

    const validationSchema = Yup.object({
        reference: Yup.string().required('Reference is required'),
        amount: Yup.string().required('Amount is required'),
    });

    const formik = useFormik({
        initialValues: {
            id: '',
            reference: '',
            amount: '',
            update_amount: true,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append('reference', values.reference);
                formData.append('amount', values.amount);

                if (selectedCashBanking) {
                    if (stationId && startDate) {
                        formData.append('drs_date', startDate);
                        formData.append('station_id', stationId);
                    }
                    formData.append('id', selectedCashBanking.id);
                    const url = `/data-entry/cash-banking/update`;

                    const isSuccess = await postData(url, formData);
                    if (isSuccess) {
                        if (stationId && startDate) {
                            applyFilters({ station_id: stationId, start_date: startDate });
                            handleApplyFilters(stationId, startDate);
                        }
                        setSelectedCashBanking(null);
                        formik.resetForm();
                    }
                } else {
                    // Adding new entry
                    if (stationId && startDate) {
                        formData.append('drs_date', startDate);
                        formData.append('station_id', stationId);
                    }

                    const url = `/data-entry/cash-banking/create`;

                    const isSuccess = await postData(url, formData);
                    if (isSuccess) {
                        if (stationId && startDate) {
                            handleApplyFilters(stationId, startDate);
                        }
                        formik.resetForm();
                    }
                }
            } catch (error) {
                handleApiError(error);
            }
        },
    });

    const columns: TableColumn<CashBankingItem>[] = [
        { name: 'Reference', selector: (row) => row.reference, sortable: true },
        { name: `Amount ${currency}`, selector: (row) => row.amount, sortable: true },
        // { name: 'Type', selector: (row) => row.type, sortable: true },
        { name: 'Created Date', selector: (row) => row.created_date, sortable: true },
    ];

    if (isEditable) {
        columns.push({
            name: 'Actions',
            cell: (row) => (
                <>
                    <Tippy content="Edit">
                        <button type="button" onClick={() => handleEdit(row)}>
                            <i className="pencil-icon fi fi-rr-file-edit"></i>
                        </button>
                    </Tippy>
                    <Tippy content="Delete">
                        <button onClick={() => handleDelete(row)} type="button">
                            <i className="icon-setting delete-icon fi fi-rr-trash-xmark"></i>
                        </button>
                    </Tippy>
                </>
            ),
        });
    }

    const { customDelete } = useCustomDelete();
    const handleSuccess = () => {
        if (stationId && startDate) {
            handleApplyFilters(stationId, startDate);
        }
    };
    const handleDelete = (id: any) => {
        const formData = new FormData();
        formData.append('id', id?.id);
        customDelete(postData, 'data-entry/cash-banking/delete', formData, handleSuccess);
    };

    return (
        <div className="p-6">
            <h1 className="text-lg font-semibold mb-4">{`Cash Deposit ${startDate}`}</h1>
            {selectedCashBanking && isEditable && cashBankingData?.length !== 0 && (
                <div className="mt-6 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-lg font-semibold mb-4">Edit Cash Deposit</h2>
                            <form onSubmit={formik.handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12 md:col-span-4">
                                        <label className="block text-sm font-medium text-gray-700">Reference <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="reference"
                                            placeholder="Reference"
                                            value={formik.values.reference}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                        />
                                        {formik.touched.reference && formik.errors.reference ? (
                                            <div className="text-red-600 text-sm">{formik.errors.reference}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <label className="block text-sm font-medium text-gray-700">Amount {currency} <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="amount"
                                            placeholder="Amount"
                                            value={formik.values.amount}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                        />
                                        {formik.touched.amount && formik.errors.amount ? (
                                            <div className="text-red-600 text-sm">{formik.errors.amount}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-span-12 md:col-span-4 flex items-end space-x-4">
                                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md btn btn-primary">Update</button>
                                        <button type="button" onClick={handleEditcancel} className="px-4 py-2 bg-red-600 text-white rounded-md btn btn-danger">Cancel</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {!selectedCashBanking && isEditable && (
                <div className="mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-lg font-semibold mb-4">Add New Cash Deposit Entry</h2>
                            <form onSubmit={formik.handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12 md:col-span-4">
                                        <label className="block text-sm font-medium text-gray-700">Reference <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="reference"
                                            placeholder="Reference"
                                            value={formik.values.reference}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                        />
                                        {formik.touched.reference && formik.errors.reference ? (
                                            <div className="text-red-600 text-sm">{formik.errors.reference}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <label className="block text-sm font-medium text-gray-700">Amount {currency} <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="amount"
                                            placeholder="Amount"
                                            value={formik.values.amount}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                        />
                                        {formik.touched.amount && formik.errors.amount ? (
                                            <div className="text-red-600 text-sm">{formik.errors.amount}</div>
                                        ) : null}
                                    </div>
                                    <div className="col-span-12 md:col-span-4 flex items-end">
                                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md btn btn-primary">Add</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        cashBankingData?.length === 0 ? (
                            <img
                                src={noDataImage} // Use the imported image directly as the source
                                alt="no data found"
                                className="all-center-flex nodata-image"
                            />
                        ) : (

                            <DataTable
                                columns={columns}
                                data={cashBankingData}
                            // pagination
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default withApiHandler(CashBanking);
