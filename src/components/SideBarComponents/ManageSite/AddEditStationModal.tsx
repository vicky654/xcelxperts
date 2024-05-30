import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../CrudModal/AddModalHeader';
import getValidationSchema, { getStationValidationSchema } from '../../FormikFormTools/ValidationSchema';
import initialValues, { stationInitialValues } from '../../FormikFormTools/InitialValues';
import FormikInput from '../../FormikFormTools/FormikInput';
import FormikSelect from '../../FormikFormTools/FormikSelect';
interface RowData {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role: any;
}
interface UserData {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role: string;
    role_id: string;
    status: number;
    work_flow: number;
    clients: any[];
}

interface AddEditStationModalProps {
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
    role: string;
    password: string;
}
type StationStatusOption = {
    id: string;
    name: string;
};

const AddEditStationModal: React.FC<AddEditStationModalProps> = ({ isOpen, onClose, getData, onSubmit, isEditMode, userId }) => {
    const [RoleList, setRoleList] = useState<RoleItem[]>([]);
    const [ClientList, setClientList] = useState<any[]>([]); // Adjust ClientList type as needed

    useEffect(() => {
        if (isOpen) {
            FetchClientList();
            if (isEditMode) {
                fetchUserDetails(userId ? userId : '');
            }
        }
    }, [isOpen, isEditMode, userId]);

    const FetchClientList = async () => {
        try {
            const response = await getData('/common/client-list');
            if (response && response.data && response.data.data) {
                setClientList(response.data.data);
            }
        } catch (error) {
            console.error('API error:', error);
        }
    };

    const FetchRoleList = async () => {
        try {
            const response = await getData('/roles');
            if (response && response.data && response.data.data) {
                setRoleList(response.data.data);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            console.error('API error:', error);
        }
    };
    const fetchUserDetails = async (id: string) => {
        try {
            const response = await getData(`/user/detail?id=${id}`);
            if (response && response.data) {
                const userData: UserData = response.data?.data;
                console.log(userData, 'userData');
                formik.setValues({
                    first_name: userData.first_name || '',
                    last_name: userData.last_name || '',
                    email: userData.email || '',
                    phone_number: userData.phone_number || '',
                    role: userData.role_id || '',
                    password: '', // Password field should remain empty for security reasons
                });

            }
        } catch (error) {
            console.error('API error:', error);
        }
    };
    const formik = useFormik({
        initialValues: stationInitialValues,
        validationSchema: getStationValidationSchema(isEditMode),
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

    const stationStatusOption: StationStatusOption[] = [
        {
            "id": "0",
            "name": "Deactive",
        },
        {
            "id": "1",
            "name": "Active",
        },
    ]

    console.log(formik?.values, "formik station values");


    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>

                <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 w-full">
                                <AddModalHeader title={isEditMode ? 'Edit User' : 'Add User'} onClose={onClose} />
                                <div className="relative py-6 px-4 bg-white">
                                    <form onSubmit={formik.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                <FormikInput formik={formik} type="text" name="station_name" label="Station Name" placeholder="Station Name" />
                                                <FormikInput formik={formik} type="text" name="station_code" label="Station Code" placeholder="Station Code" />
                                                <FormikInput formik={formik} type="text" name="station_display_name" label="Station Display Name" placeholder="Station Display Name" />
                                                <FormikInput formik={formik} type="textarea" name="station_address" label="Station Address" placeholder="Station Address" />
                                                <FormikInput formik={formik} type="text" name="security_amount" label="Security Amount" placeholder="Security Amount" />
                                                {!isEditMode && <FormikInput formik={formik} type="password" name="password" label="Password" placeholder="Password" />}
                                                <FormikInput formik={formik} type="date" name="start_date" label="Start Date" placeholder="Start Date" />

                                                <FormikSelect
                                                    formik={formik}
                                                    name="role"
                                                    label="Client"
                                                    options={ClientList.map((item) => ({ id: item.id, name: item.full_name }))}
                                                    className="form-select text-white-dark"
                                                />
                                                <FormikSelect
                                                    formik={formik}
                                                    name="station_status"
                                                    label="Station Status"
                                                    options={stationStatusOption.map((item) => ({ id: item.id, name: item.name }))}
                                                    className="form-select text-white-dark"
                                                />
                                                <FormikSelect
                                                    formik={formik}
                                                    name="drs_upload_status"
                                                    label="DRS Upload Status"
                                                    options={stationStatusOption.map((item) => ({ id: item.id, name: item.name }))}
                                                    className="form-select text-white-dark"
                                                />

                                                {/* left 
                                                ||! Text Input
                                                data_import_type_id
                                                supplier_id
                                                company_id
                                                */}
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

export default AddEditStationModal;