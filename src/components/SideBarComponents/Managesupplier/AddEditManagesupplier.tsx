import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../CrudModal/AddModalHeader';
import { supplierValidationSchema } from '../../FormikFormTools/ValidationSchema';
import FormikInput from '../../FormikFormTools/FormikInput';
import { supplierInitialValues } from '../../FormikFormTools/InitialValues';

interface RowData {
    supplier_code: string;
    supplier_status: string;
    supplier_name: string;
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
    supplier_code: string;
    supplier_status: string;
    supplier_name: string;
    file: null,
    logo: '',
}

const AddEditManagesupplier: React.FC<AddUserModalProps> = ({ isOpen, onClose, getData, onSubmit, isEditMode, userId }) => {
    useEffect(() => {
        formik.resetForm()
        if (isEditMode) {
            fetchUserDetails(userId ? userId : '');
        }
    }, [isOpen, isEditMode, userId]);

    const fetchUserDetails = async (id: string) => {
        try {
            const response = await getData(`/supplier/${id}`);
            if (response && response.data) {
                const userData: UserData = response.data?.data;

                formik.setValues({
                    supplier_name: userData.supplier_name || '',
                    supplier_code: userData.supplier_code || '',
                    logo: userData.logo || '',
                    file: userData.file || null,

                });
            }
        } catch (error) {
            console.error('API error:', error);
        }
    };
    const formik = useFormik({
        initialValues: supplierInitialValues,
        validationSchema: supplierValidationSchema(isEditMode),
        onSubmit: async (values, { resetForm }) => {
            try {
                await onSubmit(values, formik);
            } catch (error) {
                console.error('Submit error:', error);
                throw error; // Rethrow the error to be handled by the caller
            }
        },
    });
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        formik.setFieldValue('file', file);
        if (file) {
            formik.setFieldValue('file', file);
        }
    };
    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>

                <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 w-full">
                                <AddModalHeader title={isEditMode ? 'Edit Supplier' : 'Add Supplier'} onClose={onClose} />
                                <div className="relative py-6 px-4 bg-white">
                                    <form onSubmit={formik.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                <FormikInput formik={formik} type="text" name="supplier_code" readOnly={isEditMode ? true : false} />
                                                <FormikInput formik={formik} type="text" name="supplier_name" />
                                                <div>
                                                    <label htmlFor="file">File</label>
                                                    <input type="file" id="file" name="file" className='form-input' onChange={handleFileChange} />
                                                    {formik.errors.file ? <div className="error">{formik.errors.file}</div> : null}
                                                </div>
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

export default AddEditManagesupplier;
