import React, { useEffect, useState } from 'react';
import withApiHandler from '../../../utils/withApiHandler';
import { CommonDataEntryProps } from '../../commonInterfaces';
import useErrorHandler from '../../../hooks/useHandleError';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useCustomDelete from '../../../utils/customDelete';
import Tippy from '@tippyjs/react';

import noDataImage from '../../../assets/AuthImages/noDataFound.png';
import { currency } from '../../../utils/CommonData';
import LoaderImg from '../../../utils/Loader';
import FormikSelect from '../../FormikFormTools/FormikSelect';
import { handleDownloadPdf } from '../../CommonFunctions';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
interface CashBankingItem {
    id: string;
    reference: string;
    amount: string;
    station_bank_id: string;
    bank_name: string;
    type: string;
    created_date: string;
    update_amount: boolean;
}

interface RoleItem {
    id: number;
    bank_name: string;
    account_no: string;
}
const CashBanking: React.FC<CommonDataEntryProps> = ({ stationId, startDate, postData, getData, applyFilters }) => {
    const handleApiError = useErrorHandler();
    const [cashBankingData, setCashBankingData] = useState<CashBankingItem[]>([]);
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [isdownloadpdf, setIsdownloadpdf] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedCashBanking, setSelectedCashBanking] = useState<CashBankingItem | null>(null);
    const [RoleList, setRoleList] = useState<RoleItem[]>([]);
    const FetchRoleList = async () => {
        try {
            const response = await getData(`/station/bank/list?drs_date=${startDate}&station_id=${stationId}`);
            
            if (response && response.data && response.data.data) {

                setRoleList(response.data.data);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            console.error('API error:', error);
        }
    };

    useEffect(() => {
        if (stationId && startDate) {
            FetchRoleList()
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
                setIsdownloadpdf(response.data.data?.download_pdf);
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
        reference: Yup.string().required('Notes is required'),
        station_bank_id: Yup.string().required('Bank is required'),
        amount: Yup.string().required('Amount is required'),
    });

    const formik = useFormik({
        initialValues: {
            id: '',
            reference: '',
            station_bank_id: '',
            amount: '',
            update_amount: true,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append('reference', values.reference);
                formData.append('amount', values.amount);
                formData.append('station_bank_id', values.station_bank_id);

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
                            applyFilters({ station_id: stationId, start_date: startDate, selectedCardName: "Cash Deposited" });
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
        { name: 'Bank', selector: (row) => row.bank_name, sortable: true },
        { name: 'Notes', selector: (row) => row.reference, sortable: true },
        {
            name: 'Amount',
            selector: (row) => `${currency} ${row.amount} `,
            sortable: true
        }
        ,
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
        <div >
            {/* <h1 className="text-lg font-semibold mb-4">{`Cash Deposit ${startDate}`}</h1> */}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 className="text-lg font-semibold mb-4">
                        {`Cash Deposit`} {startDate ? `(${startDate})` : ''}
                      
                        
                        {isdownloadpdf && (
                            <span onClick={() => handleDownloadPdf('cashes', stationId, startDate, getData, handleApiError)}>
                                  <OverlayTrigger  placement="top" overlay={<Tooltip className="custom-tooltip" >PDF Download</Tooltip>}>
                                    <i style={{ fontSize: "20px", color: "red", cursor: "pointer" }} className="fi fi-tr-file-pdf"></i>
                                </OverlayTrigger>
                                </span> )}
                   
                    </h1>
                     
                    {/* {isdownloadpdf  && (
                    <button
                        className='btn btn-primary'
                        onClick={() => handleDownloadPdf('cashes', stationId, startDate, getData, handleApiError)}
                    >
                      Download Pdf   <i className="fi fi-tr-file-download"></i> 
                    </button>   )} */}
                </div>


            {selectedCashBanking && isEditable && cashBankingData?.length !== 0 && (
                <div className="mt-6 mb-4">

                    <h2 className="text-lg font-semibold mb-4">Edit Cash Deposit</h2>
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 md:col-span-4">
                                <FormikSelect
                                    formik={formik}
                                    name="station_bank_id"
                                    label="Bank"
                                    options={RoleList?.map((item) => ({ id: item.id,  name: `${item.bank_name} - ${item.account_no}`}))}
                                    className="form-select text-white-dark"
                                />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <label className="block text-sm font-medium text-gray-700">Notes <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    name="reference"
                                    placeholder="Notes"
                                    value={formik.values.reference}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className=" form-input mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
                                    className=" form-input mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
            )}

            {!selectedCashBanking && isEditable && (
                <div className="mb-3">

                    <h2 className="text-lg font-semibold mb-4">Add New Cash Deposit Entry</h2>
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-4">
                                <FormikSelect
                                    formik={formik}
                                    name="station_bank_id"
                                    label="Bank"
                                    options={RoleList?.map((item) => ({ id: item.id, name: `${item.bank_name} - ${item.account_no}`}))}
                                    className="form-select text-white-dark"
                                />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <label className="block text-sm font-medium text-gray-700">Notes <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    name="reference"
                                    placeholder="Notes"
                                    value={formik.values.reference}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className=" form-input mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
                                    className=" form-input mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
            )}


            {loading ? (
                <>
                    {LoaderImg}
                </>
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
    );
};

export default withApiHandler(CashBanking);
