import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { cardInitialValues } from '../../FormikFormTools/InitialValues';
import FormikInput from '../../FormikFormTools/FormikInput';
import { CardValidationSchema } from '../../FormikFormTools/ValidationSchema';
import AddModalHeader from '../CrudModal/AddModalHeader';

interface UserData {
    id: string;
    code: string;
    name: string;
    status: string;
    userData: string;
    file: File | null;
    logo: string;
}

interface AddEditManagesupplierProps {
    isOpen: boolean;
    onClose: () => void;
    getData: (url: string) => Promise<any>;
    onSubmit: (values: any, formik: any) => Promise<void>;
    isEditMode: boolean;
    userId?: string | null;
}

const AddEditManagesupplier: React.FC<AddEditManagesupplierProps> = ({ isOpen, onClose, getData, onSubmit, isEditMode, userId }) => {
    const [userData, setUserData] = useState<UserData>({
        id: '',
        code: '',
        name: '',
        status: '',
        userData: '',
        file: null,
        logo: '',
    });

    useEffect(() => {
        if (isEditMode) {
            fetchUserDetails(userId ?? '');
        }
        formik.resetForm();
    }, [isOpen, isEditMode, userId]);

    const fetchUserDetails = async (id: string) => {
        try {
            const response = await getData(`/card/${id}`);
            if (response && response.data) {
                const userData: UserData = response.data?.data;
                setUserData(userData);
                formik.setValues({
                    card_name: userData.name || '',
                    card_code: userData.code || '',
                    logo: userData.logo || '',
                    file: userData.file || null,
                });
            }
        } catch (error) {
            console.error('API error:', error);
        }
    };

    const formik = useFormik({
        initialValues: cardInitialValues,
        validationSchema: CardValidationSchema(isEditMode),
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
                                <AddModalHeader title={isEditMode ? 'Edit Cards' : 'Add Cards'} onClose={onClose} />

                                <div className="relative py-6 px-4 bg-white">
                                    <form onSubmit={formik.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                <FormikInput formik={formik} type="text" name="card_code" readOnly={isEditMode ? true : false} />
                                                <FormikInput formik={formik} type="text" name="card_name" />
                                                {/* <input type="text" name="logo" value={formik.values.logo} onChange={formik.handleChange} placeholder="Logo" className="input-field" /> */}
                                                <div>
                                                    <label htmlFor="file">File</label>
                                                    <input type="file" id="file" name="file" onChange={handleFileChange} />
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
