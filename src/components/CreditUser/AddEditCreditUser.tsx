import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../SideBarComponents/CrudModal/AddModalHeader';
import FormikSelect from '../FormikFormTools/FormikSelect';
import FormikInput from '../FormikFormTools/FormikInput';
import useErrorHandler from '../../hooks/useHandleError';
import { credituserInitialValues } from '../FormikFormTools/InitialValues';
import { credituserValidationSchema } from '../FormikFormTools/ValidationSchema';

interface Client {
    id: string;
    client_name: string;
    full_name: string;
    entities: Entity[];
}

interface Entity {
    id: string;
    entity_name: string;
}

interface Site {
    id: string;
    site_name: string;
}

interface RowData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: any;
}


interface AddEditStationTankModalProps {
    isOpen: boolean;
    onClose: () => void;
    getData: (url: string) => Promise<any>;
    onSubmit: (values: any, formik: any) => Promise<void>;
    isEditMode: boolean;
    userId?: string | null;
    editUserData?: Partial<RowData> | null;
    tankList?: tankList;
}




type tankList = {
    fuels: [];
    pumps: [];
};

const AddEditStationTankModal: React.FC<AddEditStationTankModalProps> = ({ isOpen, onClose, getData, onSubmit, isEditMode, userId }) => {
    const handleApiError = useErrorHandler();
    const [clients, setClients] = useState<Client[]>([]);
    useEffect(() => {
        if (isOpen) {
            if (localStorage.getItem('superiorRole') === 'Client') {
                const clientId = localStorage.getItem('superiorId');
                if (clientId) {
                    // Simulate the change event to call handleClientChange
                    handleClientChange({ target: { value: clientId } } as React.ChangeEvent<HTMLSelectElement>);
                }
            } else {
                FetchClientList();
            }

            if (isEditMode) {
                fetchUserDetails(userId ? userId : '');
                // FetchClientList();
            }
        }
    }, [isOpen, isEditMode, userId]);
    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const clientId = e.target.value;
        formik.setFieldValue('client_id', clientId);
        if (clientId) {
            const selectedClient = clients.find((client: Client) => client.id === clientId);
           
            formik.setFieldValue('client_name', selectedClient?.client_name || "");

        } else {

            formik.setFieldValue('client_name', "");

        }
    };
    const FetchClientList = async () => {
        try {
            const response = await getData('/getClients');
            const clients = response.data.data;
            console.log(response.data.data, "response.data.data");
            setClients(clients);
            // const clientId = localStorage.getItem("superiorId");
            // if (localStorage.getItem("superiorRole") !== "Client" && clientId) {
            //     formik.setFieldValue('client_id', clientId);
            //     const selectedClient = clients.find((client: Client) => client.id === clientId);
            //     if (selectedClient) {
            //         formik.setFieldValue('entities', selectedClient.entities);
            //     }
            // }
        } catch (error) {
            handleApiError(error);
        }
    };
    const fetchUserDetails = async (id: string) => {
        try {
            const response = await getData(`/credit-user/detail?id=${id}`);
            if (response && response.data) {
                const userData: any = response.data?.data;
                formik.setValues(userData);
                // FetchClientList()
                // fetchEntityList(userData?.client_id)
                // fetchSiteList(userData?.entity_id);
                // fetchFuelNameList(userData?.station_id)
            }
        } catch (error) {
            console.error('API error:', error);
        }
    };




    const editCloseCheck = () => {
        if (isEditMode) {
            formik.resetForm();
        }
        onClose();
    };

    const formik = useFormik({
        initialValues: credituserInitialValues,
        validationSchema: credituserValidationSchema(isEditMode),
        onSubmit: async (values, { resetForm }) => {
            try {
                await onSubmit(values, formik);
                editCloseCheck();
            } catch (error) {
                console.error('Submit error:', error);
                throw error; // Rethrow the error to be handled by the caller
            }
        },
    });


    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={editCloseCheck}></div>

                <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 w-full">
                                <AddModalHeader title={isEditMode ? 'Edit Credit User' : 'Add Credit User'} onClose={editCloseCheck} />
                                <div className="relative py-6 px-4 bg-white">
                                    <form onSubmit={formik.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                {!isEditMode && localStorage.getItem('superiorRole') !== 'Client' && (
                                                    <FormikSelect
                                                        formik={formik}
                                                        name="client_id"
                                                        label="Client"
                                                        options={clients?.map((item:any) => ({ id: item.id, name: item.full_name }))}
                                                        className="form-input"
                                                    />
                                                )}

                                                <FormikInput formik={formik} type="text" name="name" label="Credit User Name" />

                                                <FormikInput formik={formik} type="number" name="phone" label="Phone Number" />

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

export default AddEditStationTankModal;
