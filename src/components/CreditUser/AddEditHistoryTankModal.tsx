import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../SideBarComponents/CrudModal/AddModalHeader';
import FormikSelect from '../FormikFormTools/FormikSelect';
import FormikInput from '../FormikFormTools/FormikInput';
import useErrorHandler from '../../hooks/useHandleError';
import { credituserInitialValues } from '../FormikFormTools/InitialValues';
import { credituserValidationSchema } from '../FormikFormTools/ValidationSchema';
import * as Yup from 'yup';
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


interface AddEditHistoryTankModalProps {
    isOpen: boolean;
    onClose: () => void;
    getData: (url: string) => Promise<any>;
    onSubmit: (values: any, formik: any) => Promise<void>;
    isEditMode: boolean;
    userId?: string | null;
    editUserData?: Partial<RowData> | null;
    tankList?: tankList;
    stationdata?: any;
}




type tankList = {
    fuels: [];
    pumps: [];
};

const AddEditHistoryTankModal: React.FC<AddEditHistoryTankModalProps> = ({ isOpen, onClose, getData, onSubmit, isEditMode, userId, stationdata }) => {
    const handleApiError = useErrorHandler();
    const [clients, setClients] = useState<Client[]>([]);

    console.log(stationdata, "stationdata");

    useEffect(() => {
        if (isOpen) {
            formik.resetForm()
            if (localStorage.getItem('superiorRole') === 'Client') {
                const clientId = localStorage.getItem('superiorId');
                if (clientId) {
                    // Simulate the change event to call handleClientChange
                    handleClientChange({ target: { value: clientId } } as React.ChangeEvent<HTMLSelectElement>);
                }
            }

            if (isEditMode) {
                fetchUserDetails(userId ? userId : '');
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

    const fetchUserDetails = async (id: string) => {
        try {
            const response = await getData(`/credit-user/detail?id=${id}`);
            if (response && response.data) {
                const userData: any = response.data?.data;
                formik.setValues(userData);
            }
        } catch (error) {
            handleApiError(error);
        }
    };




    const editCloseCheck = () => {
        if (isEditMode) {
            formik.resetForm();
        }
        onClose();
    };
    const credituserHistoryInitialValues = {
        notes: '',
        station_id: '',
        t_date: '',
        amount: '',
    };



    const credituserHistoryValidationSchema = (isEditMode: boolean) => {
        return Yup.object().shape({

            notes: Yup.string()
                .required('Notes is required')
                .matches(/^[^\s]/, 'cannot start with a space'),
            t_date: Yup.string()
                .required('Transaction Date is required'),
            station_id: Yup.string()
                .required('Station is required'),
            amount: Yup.string()
                .required('Amount is required')
                .matches(/^[^\s]/, 'cannot start with a space'),
        });
    };

    const formik = useFormik({
        initialValues: credituserHistoryInitialValues,
        validationSchema: credituserHistoryValidationSchema(isEditMode),
        onSubmit: async (values, { resetForm }) => {
            try {
                await onSubmit(values, formik);

            } catch (error) {
                handleApiError(error);
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
                                <AddModalHeader title={isEditMode ? 'Edit Add Credit' : 'Add  Credit'} onClose={editCloseCheck} />
                                <div className="relative py-6 px-4 bg-white">
                                    <form onSubmit={formik.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">

                                                <FormikSelect
                                                    formik={formik}
                                                    name="station_id"
                                                    label="Station Name"
                                                    options={stationdata?.map((item: any) => ({ id: item.id, name: item.name }))}
                                                    className="form-select text-white-dark"
                                                // onChange={handleSiteChange}
                                                />


                                                <FormikInput formik={formik} type="number" name="amount" label="Amount" />

                                                <FormikInput formik={formik} type="date" name="t_date" label="Transaction  date" />

                                                <FormikInput formik={formik} type="text" name="notes" label="Notes" />



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

export default AddEditHistoryTankModal;
