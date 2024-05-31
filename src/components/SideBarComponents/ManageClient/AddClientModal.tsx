import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../CrudModal/AddModalHeader';
import getValidationSchema, { getClientValidationSchema } from '../../FormikFormTools/ValidationSchema';
import FormikInput from '../../FormikFormTools/FormikInput';
import FormikSelect from '../../FormikFormTools/FormikSelect';
import { clientInitialValues } from '../../FormikFormTools/InitialValues';

interface RowData {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    client_code: string;
}
interface UserData {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    client_code: string;
    address: string;
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

interface RoleItem {
    id: number;
    role_name: string;
}

interface UserData {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    client_code: string;
}

const AddClientModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, getData, onSubmit, isEditMode, userId }) => {
    useEffect(() => {
        if (isEditMode) {
            fetchUserDetails(userId ? userId : '');
        }
    }, [isOpen, isEditMode, userId]);

    const fetchUserDetails = async (id: string) => {
        try {
            const response = await getData(`/client/detail?id=${id}`);
            if (response && response.data) {
                const userData: UserData = response.data?.data;
                console.log(userData, 'userData');
                formik.setValues({
                    first_name: userData.first_name || '',
                    last_name: userData.last_name || '',
                    email: userData.email || '',
                    client_code: userData.client_code || '',

                    address: userData.address || '',
                    password: '', // Password field should remain empty for security reasons
                });
            }
        } catch (error) {
            console.error('API error:', error);
        }
    };
    const formik = useFormik({
        initialValues: clientInitialValues,
        validationSchema: getClientValidationSchema(isEditMode),
        onSubmit: async (values, { resetForm }) => {
            try {
                await onSubmit(values, formik);
                onClose();
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
                                <AddModalHeader title={isEditMode ? 'Edit Client' : 'Add Client'} onClose={onClose} />
                                <div className="relative py-6 px-4 bg-white">
                                    <form onSubmit={formik.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                <FormikInput formik={formik} type="text" name="email" label="Email" placeholder="Email" />
                                                {!isEditMode && <FormikInput formik={formik} type="password" name="password" label="Password" placeholder="Password" />}

                                                <FormikInput formik={formik} type="text" name="first_name" label="First Name" placeholder="First Name" />
                                                <FormikInput formik={formik} type="text" name="last_name" label="Last Name" placeholder="Last Name" />
                                                <FormikInput formik={formik} type="text" name="client_code" label="Client Code" placeholder="Client Code" />
                                                <FormikInput formik={formik} type="number" name="phone_number" isRequired={false} label="Phone Number" placeholder="Phone Number" />
                                                <FormikInput formik={formik} type="text" name="address" label="Address" placeholder="Address" />

                                                {/* <FormikSelect
                                                    formik={formik}
                                                    name="financial_start_month"
                                                    label="Financial Start Month"
                                                    options={monthOptions.map((item) => ({ id: item.id, name: item.name }))}
                                                    className="form-select text-white-dark"
                                                />
                                                <FormikSelect
                                                    formik={formik}
                                                    name="financial_end_month"
                                                    label="Financial End Month"
                                                    options={monthOptions.map((item) => ({ id: item.id, name: item.name }))}
                                                    className="form-select text-white-dark"
                                                />
                                                     <FormikSelect
                                                    formik={formik}
                                                    name="role"
                                                    label="Role"
                                                    options={RoleList.map((item) => ({ id: item.id, name: item.role_name }))}
                                                    className="form-select text-white-dark"
                                                /> */}
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

export default AddClientModal;
