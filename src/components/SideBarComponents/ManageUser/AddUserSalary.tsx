import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../CrudModal/AddModalHeader';
import useErrorHandler from '../../../hooks/useHandleError';
import noDataImage from '../../../assets/AuthImages/noDataFound.png';
import * as Yup from "yup";
import DataTable, { TableColumn } from 'react-data-table-component';
import Tippy from '@tippyjs/react';
import useCustomDelete from '../../../utils/customDelete';

interface AddonsModalProps {
    isOpen: boolean;
    onClose: () => void;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    userId: any;
}

interface CashBankingItem {
    id: any;
    creator: string;
    month: string;
    prev_salary: any;
    salary: any;
}

const AddUserSalary: React.FC<AddonsModalProps> = ({ isOpen, onClose, getData, postData, userId }) => {
    const [salaryList, setSalaryList] = useState<CashBankingItem[]>([]);
    const [name, setName] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const handleApiError = useErrorHandler();
    const { customDelete } = useCustomDelete();

    useEffect(() => {
        if (userId && isOpen) {
            fetchData();
        }
    }, [userId, isOpen]);

    const fetchData = async () => {
        try {
            const response = await getData(`/station/employee/salary/list?employee_id=${userId}`);
            if (response?.data?.data?.salaries) {
                setSalaryList(response.data.data.salaries);
                setName(response.data.data.name);
            } else {
                throw new Error('No data available');
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const formik = useFormik({
        initialValues: {
            id: "",
            monthYear: "",
            amount: "",
        },
        validationSchema: Yup.object({
            monthYear: Yup.string().required("Month and year are required"),
            amount: Yup.number().required("Salary is required").positive("Must be positive").max(500000),
        }),
        onSubmit: (values) => handleFormSubmit(values),
    });

    const handleFormSubmit = async (values: any) => {
        try {
            const [year, month] = values.monthYear.split("-");
            const formattedDate = `${year}-${month}-01`;
            const url = isEditMode ? `/station/employee/salary/update` : `/station/employee/salary/create`;
            const formData = new FormData();
            formData.append('employee_id', userId);
            formData.append('month', formattedDate);
            formData.append('salary', values.amount);
            if (isEditMode) formData.append('id', values.id);

            const isSuccess = await postData(url, formData);
            if (isSuccess) {
                formik.resetForm();
                fetchData();
                setIsEditMode(false);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleDelete = (item: CashBankingItem) => {
        const formData = new FormData();
        formData.append('id', item.id);
        customDelete(postData, '/station/employee/salary/delete', formData, fetchData);
    };

    const handleEdit = (item: CashBankingItem) => {
        setIsEditMode(true);
        const [monthName, year] = item.month.split(" ");
        const monthMap: Record<string, string> = {
            January: "01", February: "02", March: "03", April: "04", May: "05",
            June: "06", July: "07", August: "08", September: "09", October: "10",
            November: "11", December: "12",
        };
        const formattedMonthYear = `${year}-${monthMap[monthName]}`;
        formik.setValues({ id: item.id, monthYear: formattedMonthYear, amount: item.salary });
    };

    const columns: TableColumn<CashBankingItem>[] = [
        { name: 'Month', selector: row => row.month, sortable: false },
        { name: 'Prev Salary', selector: row => `${row.prev_salary}`, sortable: false },
        { name: 'Salary', selector: row => `${row.salary}`, sortable: false },
        {
            name: 'Actions', cell: row => (
                <>
                    <Tippy content="Edit"><button onClick={() => handleEdit(row)}><i className="pencil-icon fi fi-rr-file-edit"></i></button></Tippy>
                    <Tippy content="Delete"><button onClick={() => handleDelete(row)}><i className="icon-setting delete-icon fi fi-rr-trash-xmark"></i></button></Tippy>
                </>
            ), sortable: false
        }
    ];

    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>
                <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <AddModalHeader title={`Manage Salary ${name ? `(${name})` : ''}`} onClose={onClose} />
                            <div className="relative py-6 px-4 bg-white">
                                <form onSubmit={formik.handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-12 md:col-span-4">
                                            <label>Month and Year <span>*</span></label>
                                            <input
                                                type="month"
                                                name="monthYear"
                                                value={formik.values.monthYear}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className="form-input mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                            />
                                            {formik.touched.monthYear && formik.errors.monthYear && (
                                                <div className="text-red-600 text-sm">{formik.errors.monthYear}</div>
                                            )}
                                        </div>
                                        <div className="col-span-12 md:col-span-4">
                                            <label>Salary <span>*</span></label>
                                            <input
                                                type="number"
                                                name="amount"
                                                placeholder="Salary"
                                                value={formik.values.amount}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className="form-input mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                            />
                                            {formik.touched.amount && formik.errors.amount && (
                                                <div className="text-red-600 text-sm">{formik.errors.amount}</div>
                                            )}
                                        </div>
                                        <div className="col-span-12 md:col-span-4 mt-6 flex justify-end">
                                            <button type="submit" className="bg-blue-600 text-white rounded-md py-2 px-4">
                                                {isEditMode ? 'Update' : 'Add'}
                                            </button>
                                            {isEditMode && (
                                                <button type="button" onClick={() => setIsEditMode(false)} className="bg-red-600 text-white rounded-md py-2 px-4 ml-2">
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </form>
                                <hr />
                                {salaryList.length > 0 ? (
                                    <DataTable columns={columns} data={salaryList} />
                                ) : (
                                    <img src={noDataImage} alt="no data found" className="mx-auto mt-10" />
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AddUserSalary;
