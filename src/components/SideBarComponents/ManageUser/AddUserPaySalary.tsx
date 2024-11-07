import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../CrudModal/AddModalHeader';
import useErrorHandler from '../../../hooks/useHandleError';
import * as Yup from "yup";
import useCustomDelete from '../../../utils/customDelete';
import SalaryCard from './SalaryCard';
import BarLineChart from '../../../utils/BarLineChart';

interface AddonsModalProps {
    isOpen: boolean;
    onClose: () => void;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    userId: any;
}

interface CashBankingItem {
    id: string;
    phone: string;
    shift: string;
    salary: any;
    debit: any;
    credit: any;
    payable: any;
    name: any;
    payable_info: any;
}

const AddUserPaySalary: React.FC<AddonsModalProps> = ({ isOpen, onClose, getData, postData, userId }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [SalaryList, setSalaryList] = useState<CashBankingItem>();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const handleApiError = useErrorHandler();

    useEffect(() => {
        if (userId && isOpen) {
            fetchData();
        }
    }, [userId, isOpen]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let year, month;
            if (formik?.values.monthYear) {
                [year, month] = formik.values.monthYear.split("-");
            } else {
                const currentDate = new Date();
                year = currentDate.getFullYear();
                month = String(currentDate.getMonth() + 1).padStart(2, "0");
                formik.setFieldValue("monthYear", `${year}-${month}`);
            }

            const formattedDate = `${year}-${month}-01`;
            const response = await getData(`/station/employee/salary/payable?employee_id=${userId}&month=${formattedDate}`);
            if (response?.data?.data) {
                setSalaryList(response.data.data);
                setName(response.data.data.name);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            id: "",
            monthYear: "",
        },
        validationSchema: Yup.object({
            monthYear: Yup.string().required("Month and year are required"),
        }),
        onSubmit: () => {
            fetchData();
        },
    });

    const { customDelete } = useCustomDelete();

    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>
                <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 w-full">
                                <AddModalHeader title={`Manage Pay Salary ${name ? '(' + name + ')' : ''}`} onClose={onClose} />
                                <div className="relative py-6 px-4 bg-white">

                                    {loading ? (
                                        <div className="text-center py-10">Loading...</div>
                                    ) : (
                                        <>
                                            {userId && !isEditMode && (
                                                <div className="mb-3">
                                                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                                                        <div className="grid grid-cols-12 gap-4">
                                                            <div className="col-span-12 md:col-span-4">
                                                                <label className="block text-sm font-medium text-gray-700">
                                                                    Month and Year <span className="text-danger">*</span>
                                                                </label>
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
                                                            <div className="col-span-12 md:col-span-4 mt-6 flex items-center justify-center">
                                                                <button type="submit" className="bg-blue-600 text-white rounded-md py-2 px-4">
                                                                    Search
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            )}

                                            <hr className="my-4" />

                                            <SalaryCard
                                                key={SalaryList?.id}
                                                name={SalaryList?.name || "N/A"}
                                                phone={SalaryList?.phone || "N/A"}
                                                shift={SalaryList?.shift || "N/A"}
                                                salary={SalaryList?.salary || "N/A"}
                                                debit={SalaryList?.debit || "N/A"}
                                                credit={SalaryList?.credit || "N/A"}
                                                payable={SalaryList?.payable || "N/A"}
                                                payableInfo={SalaryList?.payable_info || "N/A"}
                                            />
                                            <BarLineChart ChartData={SalaryList} />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AddUserPaySalary;
