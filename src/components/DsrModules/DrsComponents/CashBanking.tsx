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
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { saveAs } from "file-saver";

interface CashBankingItem {
    id: string;
    reference: string;
    amount: string;
    cash_value: any;
    prev_variance: any;
    total_sales: any;
    cash_inhand: string;
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
    const [casheditable, setcasheditable] = useState<boolean>(false);
    const [isdownloadpdf, setIsdownloadpdf] = useState(true);
    const [cashvalue, setcashvalue] = useState<CashBankingItem | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedCashBanking, setSelectedCashBanking] = useState<CashBankingItem | null>(null);
    const [RoleList, setRoleList] = useState<RoleItem[]>([]);
    const [receipts, setReceipts] = useState([]);


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

                const { listing, is_editable, cash_editable } = response.data.data;
                cashValueFormik.setFieldValue("cash_inhand", response.data?.data?.cash_inhand)
                setRoleList(response?.data?.data?.bankLists);
                setcashvalue(response.data?.data)
                setReceipts(response.data?.data?.receipts);
                setCashBankingData(listing);
                setIsdownloadpdf(response.data.data?.download_pdf);
                setIsEditable(is_editable);
                setcasheditable(cash_editable);
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
            cash_inhand: '',
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
                            applyFilters({ station_id: stationId, start_date: startDate, selectedCardName: "Bank Deposited" });
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
                            applyFilters({ station_id: stationId, start_date: startDate, selectedCardName: "Bank Deposited" });
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

    const cashValueFormik = useFormik({
        initialValues: {
            cash_inhand: '',
        },
        validationSchema: Yup.object({
            cash_inhand: Yup.number()
                .required('Amount is required')
                .max(1000000, 'Cash value cannot exceed 10 lakh'),
        }),
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append('amount', values.cash_inhand);
                if (stationId && startDate) {
                    formData.append('drs_date', startDate);
                    formData.append('station_id', stationId);
                }

                const url = `/data-entry/cash-inhand/update`;
                const isSuccess = await postData(url, formData);

                if (stationId && startDate) {
                    // applyFilters({ station_id: stationId, start_date: startDate, selectedCardName: "Bank Deposited" });
                    handleApplyFilters(stationId, startDate);
                }
                formik.resetForm();
            } catch (error) {
                handleApiError(error);
            }
        },
    });
    const columns: TableColumn<CashBankingItem>[] = [
        {
            name: 'Bank',
            sortable: false,
            selector: (row) => row.bank_name,
        },
        {
            name: 'Notes',

            selector: (row) => row.reference,
            sortable: false,
        },
        {
            name: 'Amount',

            selector: (row) => `${currency} ${row.amount} `,
            sortable: false,
        }
        ,
        // { name: 'Type', selector: (row) => row.type, sortable: true },
        { name: 'Created Date', selector: (row) => row.created_date, sortable: false },
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

    const Invoiceformik = useFormik({
        initialValues: {
            file1: null,
            file2: null,
            file3: null,
            file4: null,
        },
        validationSchema: Yup.object({
            file1: Yup.mixed()
                .required('At least one file is required')
                .test('fileType', 'Only .jpg and .png files are allowed', (value) => {
                    if (value) {
                        return ['image/jpeg', 'image/png'].includes(value.type);
                    }
                    return true;
                }),
            file2: Yup.mixed()
                .nullable()
                .test('fileType', 'Only .jpg and .png files are allowed', (value) => {
                    if (value) {
                        return ['image/jpeg', 'image/png'].includes(value.type);
                    }
                    return true;
                }),
            file3: Yup.mixed()
                .nullable()
                .test('fileType', 'Only .jpg and .png files are allowed', (value) => {
                    if (value) {
                        return ['image/jpeg', 'image/png'].includes(value.type);
                    }
                    return true;
                }),
            file4: Yup.mixed()
                .nullable()
                .test('fileType', 'Only .jpg and .png files are allowed', (value) => {
                    if (value) {
                        return ['image/jpeg', 'image/png'].includes(value.type);
                    }
                    return true;
                }),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const formData = new FormData();


                // Append files to formData
                if (values.file1) formData.append('receipt[]', values.file1);
                if (values.file2) formData.append('receipt[]', values.file2);
                if (values.file3) formData.append('receipt[]', values.file3);
                if (values.file4) formData.append('receipt[]', values.file4);

                // Determine URL and logic based on selectedCashBanking
                const url = selectedCashBanking
                    ? '/data-entry/receipt/create'
                    : '/data-entry/receipt/create';

                if (selectedCashBanking) {
                    formData.append('id', selectedCashBanking.id);
                }

                if (stationId && startDate) {
                    formData.append('drs_date', startDate);
                    formData.append('station_id', stationId);
                }

                const isSuccess = await postData(url, formData);

                if (isSuccess) {
                    if (stationId && startDate) {
                        applyFilters({
                            station_id: stationId,
                            start_date: startDate,
                            selectedCardName: 'Bank Deposited',
                        });
                        handleApplyFilters(stationId, startDate);
                    }
                    setSelectedCashBanking(null);
                    resetForm();
                }
            } catch (error) {
                handleApiError(error);
            }
        },
    });

    const handleFileChange = (event: any, fileFieldName: any) => {
        const file = event.target.files[0];
        Invoiceformik.setFieldValue(fileFieldName, file);
    };

    const renderFileDetails = (file: any) => {
        if (!file) return null;

        return (
            <div className="text-sm mt-2">
                <h2 className="text-lg font-semibold">{file.name}</h2>
                <p className="text-gray-600">Size: {Math.round(file.size / 1024)} KB</p>
                <p className="text-gray-600">Type: {file.type}</p>
            </div>
        );
    };

    const onRemove = (item: any) => {

        const formData = new FormData();
        formData.append('id', item);
        customDelete(postData, 'data-entry/receipt/delete', formData, handleSuccess);
    };

    const onDownload = (item: any) => {
        saveAs(item?.receipt, `receipt_${item?.id}.png`);

    };

    return (
        <div >

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="text-lg font-semibold mb-4 displaycanter">
                    {`Bank Deposited`} {startDate ? `(${startDate})` : ''}


                    {isdownloadpdf && (
                        <span onClick={() => handleDownloadPdf('cashes', stationId, startDate, getData, handleApiError)}>
                            <OverlayTrigger placement="top" overlay={<Tooltip className="custom-tooltip" >Download Report</Tooltip>}>
                                <i style={{ fontSize: "20px", color: "red", cursor: "pointer" }} className="fi fi-tr-file-pdf"></i>
                            </OverlayTrigger>
                        </span>)}


                </h1>

            </div>
            <div className="mt-6">
                {/* Container for the row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        {casheditable &&
                            <div className="col-span-1 bg-white border  shadow-lg p-3  ">

                                <h2 className="text-lg font-semibold mb-4"> Cash In Hand       </h2>
                                <hr className='mb-2'></hr>
                                {/* //Cash Value */}

                                <form onSubmit={cashValueFormik.handleSubmit}>
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-4 md:col-span-4">
                                            <label className="block text-sm font-medium text-gray-700">Amount <span className="text-danger">*</span></label>
                                            <input
                                                type="number"
                                                name="cash_inhand"
                                                className={`form-input mt-1 block w-full p-2 border border-gray-300 rounded-md ${!isEditable ? 'readonly' : ''}`}
                                                readOnly={!isEditable}
                                                placeholder="Amount"
                                                value={cashValueFormik.values.cash_inhand}
                                                onChange={cashValueFormik.handleChange}
                                                onBlur={cashValueFormik.handleBlur}
                                            // className=" form-input mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                            />
                                            {cashValueFormik.touched.cash_inhand && cashValueFormik.errors.cash_inhand ? (
                                                <div className="text-red-600 text-sm">{cashValueFormik.errors.cash_inhand}</div>
                                            ) : null}
                                        </div>
                                        {isEditable && <div className="col-span-4 md:col-span-4">
                                            <button className="px-4 py-2 mt-7 bg-blue-600 text-white rounded-md btn btn-primary" type="submit">Submit</button>
                                        </div>}
                                    </div>


                                </form>


                                {/* // End Cash Value */}
                            </div>
                        }
                        {/* First column with dummy data */}
                        <div className="col-span-1 bg-white border  shadow-lg p-3  ">



                            <h2 className="text-lg font-semibold mb-4"> Bank Deposited      {cashvalue ? (
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id="cashvalue-tooltip" className="custom-tooltip">
                                            Cash Available For Banking
                                        </Tooltip>
                                    }
                                >
                                    <span>({currency}{cashvalue?.cash_value})</span>
                                </OverlayTrigger>
                            ) : (
                                ''
                            )} </h2>

                            <Badge className='  ' style={{ borderRadius: "0px" }}>
                                Cash Value: {cashvalue?.cash_value}
                            </Badge>
                            <Badge className='ms-2  ' style={{ borderRadius: "0px" }}>
                                Cash In Hand: {cashvalue?.cash_inhand}
                            </Badge>
                            <Badge className='ms-2  ' style={{ borderRadius: "0px" }}>
                                Prev Variance: {cashvalue?.prev_variance}
                            </Badge>
                            <Badge className='ms-2  ' style={{ borderRadius: "0px" }}>
                                Total Sales: {cashvalue?.total_sales}
                            </Badge>







                            <hr className='mt-4 mb-4'></hr>


                            {/* End Upload Bank Deposited */}
                            {/* Start Edit Bank Deposited */}
                            {selectedCashBanking && isEditable && cashBankingData?.length !== 0 && (
                                <div className="mb-6 mt-6 ">



                                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-12 gap-4">
                                            <div className="col-span-12 md:col-span-4">
                                                <FormikSelect
                                                    formik={formik}
                                                    name="station_bank_id"
                                                    label="Bank"
                                                    options={RoleList?.map((item) => ({ id: item?.id, name: `${item?.bank_name} - ${item.account_no}` }))}
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
                                                    type="number"
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
                            {/* End Edit Bank Deposited */}
                            {/* Start Add Bank Deposited */}
                            {!selectedCashBanking && isEditable && (
                                <div className="mb-3">



                                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-12 gap-4">
                                            <div className="col-span-12 md:col-span-4">
                                                <FormikSelect
                                                    formik={formik}
                                                    name="station_bank_id"
                                                    label="Bank"
                                                    options={RoleList?.map((item) => ({ id: item.id, name: `${item.bank_name} - ${item.account_no}` }))}
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
                                                    type="number"
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
                            <hr className='mb-2'></hr>
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
                    </div>

                    {/* Second column with dummy data */}
                    <div className="col-span-1 bg-white border  shadow-lg p-3 ">
                        <h2 className="text-lg font-semibold mb-4"> Bank Deposited Receipts </h2>
                        <hr className='mb-2'></hr>
                        {receipts.length > 0 || isEditable ? (
                            <div className="col-span-12  ">

                                {isEditable && (<form
                                    onSubmit={Invoiceformik.handleSubmit}
                                    className="col-span-12  "
                                >


                                    {/* File Uploads */}
                                    <div className="grid grid-cols-12 gap-4">


                                        {/*  Receipt 1 */}
                                        <div className="col-span-3">
                                            <label
                                                htmlFor="file1"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Receipt 1
                                            </label>
                                            <div
                                                className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 cursor-pointer focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500"
                                                onClick={() => {
                                                    const fileInput = document.getElementById('file1') as HTMLInputElement | null;
                                                    if (fileInput) {
                                                        fileInput.click();
                                                    }
                                                }}
                                            >
                                                <input
                                                    type="file"
                                                    id="file1"
                                                    name="file1"
                                                    accept=".pdf,.jpg,.png"
                                                    onChange={(e) => handleFileChange(e, "file1")}
                                                    className="hidden"
                                                />
                                                <div className="flex flex-col items-center py-4">

                                                    <span className="text-sm font-medium text-gray-600">
                                                        Click to upload
                                                    </span>
                                                </div>
                                            </div>
                                            {Invoiceformik.touched.file1 && Invoiceformik.errors.file1 ? (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {Invoiceformik.errors.file1}
                                                </div>
                                            ) : null}
                                            {Invoiceformik.values.file1 && (
                                                <div className="text-sm mt-2">
                                                    {renderFileDetails(Invoiceformik.values.file1)}
                                                </div>
                                            )}
                                        </div>


                                        {/*  Receipt 2 */}
                                        <div className="col-span-3">
                                            <label
                                                htmlFor="file2"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Receipt 2
                                            </label>
                                            <div
                                                onClick={() => {
                                                    const fileInput = document.getElementById('file2') as HTMLInputElement | null;
                                                    if (fileInput) {
                                                        fileInput.click();
                                                    }
                                                }}
                                                className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 cursor-pointer focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500">
                                                <input
                                                    type="file"
                                                    id="file2"
                                                    name="file2"
                                                    accept=".pdf,.jpg,.png"
                                                    onChange={(e) => handleFileChange(e, "file2")}
                                                    className="hidden"
                                                />
                                                <div className="flex flex-col items-center py-4 " >

                                                    <span className="text-sm font-medium text-gray-600">
                                                        Click to upload
                                                    </span>
                                                </div>
                                            </div>
                                            {Invoiceformik.touched.file2 && Invoiceformik.errors.file2 ? (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {Invoiceformik.errors.file2}
                                                </div>
                                            ) : null}
                                            {Invoiceformik.values.file2 && (
                                                <div className="text-sm mt-2">
                                                    {renderFileDetails(Invoiceformik.values.file2)}
                                                </div>
                                            )}
                                        </div>

                                        {/*  Receipt 3 */}
                                        <div className="col-span-3">
                                            <label
                                                htmlFor="file3"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Receipt 3
                                            </label>
                                            <div

                                                onClick={() => {
                                                    const fileInput = document.getElementById('file3') as HTMLInputElement | null;
                                                    if (fileInput) {
                                                        fileInput.click();
                                                    }
                                                }}
                                                className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 cursor-pointer focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500">
                                                <input
                                                    type="file"
                                                    id="file3"
                                                    name="file3"
                                                    accept=".pdf,.jpg,.png"
                                                    onChange={(e) => handleFileChange(e, "file3")}
                                                    className="hidden"
                                                />
                                                <div className="flex flex-col items-center py-4">

                                                    <span className="text-sm font-medium text-gray-600">
                                                        Click to upload
                                                    </span>
                                                </div>
                                            </div>
                                            {Invoiceformik.touched.file3 && Invoiceformik.errors.file3 ? (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {Invoiceformik.errors.file3}
                                                </div>
                                            ) : null}
                                            {Invoiceformik.values.file3 && (
                                                <div className="text-sm mt-2">
                                                    {renderFileDetails(Invoiceformik.values.file3)}
                                                </div>
                                            )}
                                        </div>

                                        {/*  Receipt 4 */}
                                        <div className="col-span-3">
                                            <label
                                                htmlFor="file4"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Receipt 4
                                            </label>
                                            <div

                                                onClick={() => {
                                                    const fileInput = document.getElementById('file4') as HTMLInputElement | null;
                                                    if (fileInput) {
                                                        fileInput.click();
                                                    }
                                                }}
                                                className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 cursor-pointer focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500">
                                                <input
                                                    type="file"
                                                    id="file4"
                                                    name="file4"
                                                    accept=".pdf,.jpg,.png"
                                                    onChange={(e) => handleFileChange(e, "file4")}
                                                    className="hidden"
                                                />
                                                <div className="flex flex-col items-center py-4">

                                                    <span className="text-sm font-medium text-gray-600">
                                                        Click to upload
                                                    </span>
                                                </div>
                                            </div>
                                            {Invoiceformik.touched.file4 && Invoiceformik.errors.file4 ? (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {Invoiceformik.errors.file4}
                                                </div>
                                            ) : null}
                                            {Invoiceformik.values.file4 && (
                                                <div className="text-sm mt-2">
                                                    {renderFileDetails(Invoiceformik.values.file4)}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-6">
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            Upload
                                        </button>
                                    </div>
                                </form>
                                )}
                                <hr className='mt-2'></hr>
                                {receipts && receipts.length > 0 && (
                                    <div className="mt-4">

                                        {isEditable && (<h2 className="text-lg font-semibold mb-4">Uploaded Receipts</h2>)}


                                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-1 mb-6">
                                            {receipts?.map((receipt: any) => (
                                                <div style={{ width: "200px", height: "200px", }} key={receipt.id} className=" panel h-full  sm:grid-cols-1 md:grid-cols-1  xl:col-span-2 ">
                                                    <img
                                                        src={receipt.receipt}
                                                        alt={`Receipt ${receipt.id}`}
                                                        className="w-full h-100 object-fit-contain"
                                                    />

                                                    {isEditable && (

                                                        <OverlayTrigger placement="top" overlay={<Tooltip className="custom-tooltip" >

                                                            Remove  Receipt

                                                        </Tooltip>}>
                                                            <button
                                                                onClick={() => onRemove(receipt?.id)} // Handle removal on click
                                                                className="absolute boxcenter top-2 right-2 bg-danger p-1 rounded-full shadow-md hover:bg-gray-200 focus:outline-none contentcenter"
                                                            >
                                                                <i style={{ color: "#fff" }} className="fi fi-tr-square-x"></i>
                                                            </button>
                                                        </OverlayTrigger>


                                                    )}


                                                    <OverlayTrigger placement="top" overlay={<Tooltip className="custom-tooltip" >

                                                        Download IMG

                                                    </Tooltip>}>
                                                        <button
                                                            onClick={() => onDownload(receipt)} // Handle removal on click
                                                            className="  absolute boxcenter top-10 right-2 bg-info p-1 rounded-full shadow-md hover:bg-gray-200 focus:outline-none"
                                                        >
                                                            <i style={{ color: "#fff" }} className="fi fi-tr-cloud-download-alt"></i>
                                                        </button>
                                                    </OverlayTrigger>


                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : <>   <img
                            src={noDataImage} // Use the imported image directly as the source
                            alt="no data found"
                            className="all-center-flex nodata-image"
                        /></>

                        }
                    </div>
                </div>
            </div>






            {/* End Add Bank Deposited */}






        </div>
    );
};

export default withApiHandler(CashBanking);
