import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../CrudModal/AddModalHeader';
import { chargestValidationSchema, deductionstValidationSchema } from '../../FormikFormTools/ValidationSchema';
import FormikInput from '../../FormikFormTools/FormikInput';
import { chargesInitialValues, deductionsInitialValues } from '../../FormikFormTools/InitialValues';

interface RowData {
    deduction_code: string;
    deduction_status: string;
    deduction_name: string;
}

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    getData: (url: string) => Promise<any>;
    onSubmit: (values: any, formik: any) => Promise<void>;
    isEditMode: boolean;
    userId?: string | null;
    editUserData?: Partial<RowData> | null;
}

interface UserData {
    id: string;
    deduction_code: string;
    deduction_status: string;
    deduction_name: string;
}

const AddEditManageCharges: React.FC<AddUserModalProps> = ({ isOpen, onClose, getData, onSubmit, isEditMode, userId }) => {
    useEffect(() => {
        formik.resetForm()
        if (isEditMode) {
            fetchUserDetails(userId ? userId : '');
        }
    }, [isOpen, isEditMode, userId]);

    const fetchUserDetails = async (id: string) => {
        try {
            const response = await getData(`/deduction/${id}`);
            if (response && response.data) {
                const userData: UserData = response.data?.data;

                formik.setValues({
                    deduction_name: userData.deduction_name || '',
                    deduction_code: userData.deduction_code || '',
                });
            }
        } catch (error) {
            console.error('API error:', error);
        }
    };
    const formik = useFormik({
        initialValues: deductionsInitialValues,
        validationSchema: deductionstValidationSchema(isEditMode),
        onSubmit: async (values, { resetForm }) => {
            try {
                await onSubmit(values, formik);
            } catch (error) {
                console.error('Submit error:', error);
                throw error; // Rethrow the error to be handled by the caller
            }
        },
    });

    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>

                <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 w-full">
                                <AddModalHeader title={isEditMode ? 'Edit Expenses' : 'Add Expenses'} onClose={onClose} />
                                <div className="relative py-6 px-4 bg-white">
                                    <form onSubmit={formik.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                <FormikInput formik={formik} type="text" name="deduction_code" placeholder='Expenses Code' label='Expenses Code' readOnly={isEditMode ? true : false} />
                                                <FormikInput formik={formik} type="text" name="deduction_name" placeholder='Expenses Name' label='Expenses Name' />

                                                <div className="sm:col-span-2 mt-3">
                                                    <button type="submit" className="btn btn-primary">
                                                        {isEditMode ? 'Update' : 'Save'}
                                                    </button>
                                                </div>
                                            </div>
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

export default AddEditManageCharges;
