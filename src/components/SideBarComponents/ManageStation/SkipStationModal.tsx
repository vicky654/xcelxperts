import React, { useEffect, useState } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import AddModalHeader from '../CrudModal/AddModalHeader';
import MultiDateRangePicker from '../../../utils/MultiDateRangePicker';

interface RowData {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role: any;
}

interface SkipStationModalProps {
    isOpen: boolean;
    onClose: () => void;
    getData: (url: string) => Promise<any>;
    onSubmit: (values: any, formik: any) => Promise<void>;
    isEditMode: boolean;
    userId?: string | null;
    editUserData?: Partial<RowData> | null;
}

interface HolidayInitialValues {
    startDate: Date | null;
    endDate: Date | null;
}

const SkipStationModal: React.FC<SkipStationModalProps> = ({
    isOpen,
    onClose,
    getData,
    onSubmit,
    isEditMode,
    userId,
}) => {
    const holidayInitialValues: HolidayInitialValues = {
        startDate: null,
        endDate: null,
    };

    const formik = useFormik({
        initialValues: holidayInitialValues,
        onSubmit: async (values) => {
            try {
              
                await onSubmit(selectedDates, values);
            } catch (error) {
               
                throw error; // Rethrow the error to be handled by the caller
            }
        },
    });

    const [selectedDates, setSelectedDates] = useState<Date[]>([]);

    const handleDateChange = (dates: Date[]) => {
        setSelectedDates(dates);
  
        if (dates.length > 0) {
            formik.setFieldValue("startDate", dates[0]);
            formik.setFieldValue("endDate", dates[dates.length - 1]);
        }
    };

    useEffect(() => {
        if (isOpen) {
            formik.resetForm();
            if (isEditMode && userId) {
                // Fetch data or prefill form if necessary
            }
        }
    }, [isOpen, isEditMode, userId]);



    return (
        <div
            className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                    onClick={onClose}
                ></div>

                <section
                    className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
                        } duration-300 ease-in-out`}
                >
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 w-full">
                                <AddModalHeader title={isEditMode ? 'Skip Date ' : 'Skip Date'} onClose={onClose} />
                                <div className="relative py-6 px-4 bg-white">
                                    <form
                                        onSubmit={formik.handleSubmit}
                                        className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black"
                                    >
                                        <div className="mt-4 col-lg-12">
                                            <label className="form-label">
                                                Select Skip Date
                                                <span className="text-danger">*</span>
                                            </label>
                                            <div>
                                                <MultiDateRangePicker
                                                    selectedDates={selectedDates}
                                                    onChange={handleDateChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:col-span-2 mt-3">
                                            <button type="submit" className="btn btn-primary">
                                                {isEditMode ? 'Update' : 'Save'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SkipStationModal;
