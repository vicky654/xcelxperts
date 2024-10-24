import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../CrudModal/AddModalHeader';
import useErrorHandler from '../../../hooks/useHandleError';
import noDataImage from '../../../assets/AuthImages/noDataFound.png'; // Import the image
import * as Yup from "yup";
import FormikSelect from '../../FormikFormTools/FormikSelect';
import DataTable, { TableColumn } from 'react-data-table-component';
import { currency } from '../../../utils/CommonData';
import Dropdown from '../../Dropdown';
import IconHorizontalDots from '../../Icon/IconHorizontalDots';
import Tippy from '@tippyjs/react';
import useCustomDelete from '../../../utils/customDelete';
interface AddonsModalProps {
    isOpen: boolean;
    onClose: () => void;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    userId:any;
}

interface AddonData {
    id: any;
    name: string;
    checked: boolean;
}
interface CashBankingItem {
    id: any;
    creator: string;
    month: string;
    prev_salary: any;
    salary: any;

}
const AddUserSalary: React.FC<AddonsModalProps> = ({ isOpen, onClose, getData, postData, userId }) => {
    const [data, setData] = useState<AddonData[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [SalaryList, setSalaryList] = useState<CashBankingItem[]>([]);
    const [name, setname] = useState('');
    const handleApiError = useErrorHandler();
    useEffect(() => {
        if (userId) {
            fetchData();
        }
    }, [userId,isOpen]);

    const fetchData = async () => {
        try {
            const response = await getData(`/station/employee/salary/list?employee_id=${userId}`);
            if (response && response.data) {
                setSalaryList(response?.data?.data?.salaries)
                setname(response?.data?.data?.name)
                console.log(response.data, "response.data");
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const formik = useFormik({
        initialValues: {
            id: " ",
            monthYear: "",
            amount: "",
        },
        validationSchema: Yup.object({
            monthYear: Yup.string().required("Month and year are required"), // Validation for month and year
            amount: Yup.number().required("Salary is required")
                .positive("Salary must be positive")
                .max(500000, "Salary must not exceed 500,000"),
        }),
        onSubmit: (values) => {
            SubmitAddon(values)
        },
    });


    const SubmitAddon = async (values: any) => {
        try {
            const formData = new FormData();
            formData.append('employee_id', userId ?? '');
            const [year, month] = values.monthYear ? values.monthYear.split("-") : ["", ""];
            const formattedDate = month && year ? `${year}-${month}-01` : "";
            formData.append('month', formattedDate ?? '');
            formData.append('salary', values?.amount ?? '');
            if (isEditMode) {
                formData.append('id', values?.id);
            }

            const url = isEditMode && userId ? `/station/employee/salary/update` : `station/employee/salary/create`;
            const isSuccess = await postData(url, formData);

            // const isSuccess = await postData(postDataUrl, formData);
            if (isSuccess) {
                formik.resetForm()
                fetchData()
                if (isEditMode) {
                    setIsEditMode(false)
                }

            }
        } catch (error) {
            handleApiError(error);
        }
    };
    const { customDelete } = useCustomDelete();
    const handleDelete = (id: any) => {
        const formData = new FormData();
        formData.append('id', id?.id);
        customDelete(postData, 'station/employee/salary/delete', formData, fetchData);
    };
    const handleEditcancel = () => {
        setIsEditMode(false)
        formik.resetForm();
    };
    const handleEdit = (id: any) => {
        setIsEditMode(true);

        const monthYearString = id?.month;  // "April 2024"
        const [monthName, year] = monthYearString.split(" ");  // Split into ["April", "2024"]

        // Map month names to numbers
        const monthMap: Record<string, string> = {
            January: "01",
            February: "02",
            March: "03",
            April: "04",
            May: "05",
            June: "06",
            July: "07",
            August: "08",
            September: "09",
            October: "10",
            November: "11",
            December: "12",
        };

        const month = monthMap[monthName as keyof typeof monthMap];  // Convert month name to number
        const formattedMonthYear = `${year}-${month}`;  // "2024-04"
        formik.setFieldValue("monthYear", formattedMonthYear); // Set monthYear
        formik.setFieldValue("amount", id?.salary)
        formik.setFieldValue("id", id?.id)

    };


    const columns: TableColumn<CashBankingItem>[] = [

        {
            name: 'Month',
            sortable: false,
            selector: (row) => row.month,
        },
        {
            name: 'Prev Salary',
            selector: (row) => `${currency} ${row.prev_salary} `,
            sortable: false,
        },
        {
            name: 'Salary',
            selector: (row) => `${currency} ${row.salary} `,
            sortable: false,
        },
        {
            name: 'Actions',
            selector: (row: CashBankingItem) => row.id,
            sortable: false,
            width: '10%',
            cell: (row) => (
                <>
                    <Tippy content="Edit">
                        <button onClick={() => handleEdit(row)} type="button" >
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
        }


    ];
    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>
                <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 w-full">
                                <AddModalHeader title={`Manage Salary ${name ? '(' + name + ')' : ''}`} onClose={onClose} />
                                <div className="relative py-6 px-4 bg-white">

                                    {userId && isEditMode && (
                                        <div className="mb-6 mt-6">
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
                                                        {formik.touched.monthYear && formik.errors.monthYear ? (
                                                            <div className="text-red-600 text-sm">{formik.errors.monthYear}</div>
                                                        ) : null}
                                                    </div>

                                                    <div className="col-span-12 md:col-span-4">
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Salary  <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="amount"
                                                            placeholder="Salary"
                                                            value={formik.values.amount}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            className="form-input mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                                        />
                                                        {formik.touched.amount && formik.errors.amount ? (
                                                            <div className="text-red-600 text-sm">{formik.errors.amount}</div>
                                                        ) : null}
                                                    </div>

                                                    <div className="col-span-12 md:col-span-4 flex items-end space-x-4 flexcenter  mt-6 ">
                                                        <button
                                                            type="submit"
                                                            className=" bg-green-600 text-white rounded-md btn btn-primary"
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={handleEditcancel}
                                                            className=" bg-red-600 text-white rounded-md btn btn-danger"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )}

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
                                                        {formik.touched.monthYear && formik.errors.monthYear ? (
                                                            <div className="text-red-600 text-sm">{formik.errors.monthYear}</div>
                                                        ) : null}
                                                    </div>

                                                    <div className="col-span-12 md:col-span-4">
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Salary  <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="amount"
                                                            placeholder="Salary"
                                                            value={formik.values.amount}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            className="form-input mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                                        />
                                                        {formik.touched.amount && formik.errors.amount ? (
                                                            <div className="text-red-600 text-sm">{formik.errors.amount}</div>
                                                        ) : null}
                                                    </div>

                                                    <div className="col-span-12 md:col-span-4 mt-6  items-end flexcenter">

                                                        <button
                                                            type="submit"
                                                            className=" bg-blue-600 text-white rounded-md btn btn-primary"
                                                        >
                                                            Add
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                    <hr></hr>
                                    {SalaryList?.length > 0 ? (
                                        <DataTable
                                            columns={columns}
                                            data={SalaryList}
                                        // pagination
                                        />
                                    ) : (
                                        <>
                                            <img
                                                src={noDataImage} // Use the imported image directly as the source
                                                alt="no data found"
                                                className="all-center-flex nodata-image"
                                            />
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

export default AddUserSalary;
