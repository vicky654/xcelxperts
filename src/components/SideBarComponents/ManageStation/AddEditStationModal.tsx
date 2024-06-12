import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../CrudModal/AddModalHeader';
import { getStationValidationSchema } from '../../FormikFormTools/ValidationSchema';
import { stationInitialValues } from '../../FormikFormTools/InitialValues';
import FormikInput from '../../FormikFormTools/FormikInput';
import FormikSelect from '../../FormikFormTools/FormikSelect';
import useErrorHandler from '../../../hooks/useHandleError';
import FormikTextArea from '../../FormikFormTools/FormikTextArea';
import { activeInactiveOption } from '../../../pages/constants';


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
    phone_number: string;
    role: any;
}
interface UserData {
    id: string;
    client_id: string;
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

// interface UserData {
//     first_name: string;
//     last_name: string;
//     email: string;
//     phone_number: string;
//     role: string;
//     password: string;
// }
type StationStatusOption = {
    id: string;
    name: string;
};

const AddEditStationModal: React.FC<AddEditStationModalProps> = ({ isOpen, onClose, getData, onSubmit, isEditMode, userId }) => {
    const [RoleList, setRoleList] = useState<RoleItem[]>([]);
    const [ClientList, setClientList] = useState<any[]>([]); // Adjust ClientList type as needed
    const [commonDataList, setCommonDataList] = useState<any>(); // Adjust ClientList type as needed
    const handleApiError = useErrorHandler();

    useEffect(() => {
        if (isOpen) {
            FetchClientList();
            FetchCommonDataList();
            if (isEditMode) {
                fetchUserDetails(userId ? userId : '');
                // FetchClientList();
            }
        }
    }, [isOpen, isEditMode, userId]);

    // const FetchClientList = async () => {
    //     try {
    //         const response = await getData('/common/client-list');
    //         if (response && response.data && response.data.data) {
    //             setClientList(response.data.data);
    //         }
    //     } catch (error) {
    //         console.error('API error:', error);
    //     }
    // };
    const FetchCommonDataList = async () => {
        try {
            const response = await getData('/station/common-data-list');
            if (response && response.data && response.data.data) {
                setCommonDataList(response.data.data)
            }
        } catch (error) {
            console.error('API error:', error);
        }
    };

    const FetchClientList = async () => {
        try {
            const response = await getData('/common/client-list');
            const clients = response.data.data;
            formik.setFieldValue('clients', clients);
            // const clientId = localStorage.getItem("superiorId");
            // if (localStorage.getItem("superiorRole") !== "Client" && clientId) {
            //     formik.setFieldValue('client_id', clientId);
            //     const selectedClient = clients.find((client: Client) => client.id === clientId);
            //     if (selectedClient) {
            //         formik.setFieldValue('entities', selectedClient.entities);
            //     }
            // }
        } catch (error) {
            handleApiError(error)
        }
    };


    const fetchUserDetails = async (id: string) => {
        try {
            const response = await getData(`/station/detail?id=${id}`);
            if (response && response.data) {
                const userData: any = response.data?.data;

                formik.setValues(userData)
                FetchClientList()
                fetchEntityList(userData?.client_id)
            }
        } catch (error) {
            console.error('API error:', error);
        }
    };

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const clientId = e.target.value;
        formik.setFieldValue('client_id', clientId);
        if (clientId) {
            fetchEntityList(clientId);
            const selectedClient = formik.values.clients.find((client: Client) => client.id === clientId);
            formik.setFieldValue('client_name', selectedClient?.client_name || "");
            formik.setFieldValue('entities', selectedClient?.entities || []);
            formik.setFieldValue('sites', []);
            formik.setFieldValue('entity_id', "");
            formik.setFieldValue('site_id', "");
        } else {
            formik.setFieldValue('entity_id', "");
            formik.setFieldValue('site_id', "");
            formik.setFieldValue('client_name', "");
            formik.setFieldValue('entities', []);
            formik.setFieldValue('sites', []);
            formik.setFieldValue('entity_name', "");
            formik.setFieldValue('site_name', "");
        }
    };

    const handleEntityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const entityId = e.target.value;
        formik.setFieldValue('entity_id', entityId);
        if (entityId) {
            // fetchSiteList(entityId);
            const selectedEntity = formik.values.entities.find((entity: Entity) => entity.id === entityId);
            formik.setFieldValue('entity_name', selectedEntity?.entity_name || "");
            formik.setFieldValue('sites', []);
        } else {
            formik.setFieldValue('entity_name', "");
            formik.setFieldValue('sites', []);
            formik.setFieldValue('site_id', "");
            formik.setFieldValue('site_name', "");
        }
    };


    const fetchEntityList = async (clientId: string) => {
        try {
            const response = await getData(`common/entity-list?client_id=${clientId}`);
            formik.setFieldValue('entities', response.data.data);
        } catch (error) {
            handleApiError(error)
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

    console.log(formik?.values, "formik valuess");





    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>

                <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 w-full">
                                <AddModalHeader title={isEditMode ? 'Edit Station' : 'Add Station'} onClose={onClose} />
                                <div className="relative py-6 px-4 bg-white">
                                    <form onSubmit={formik.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">


                                                <FormikSelect
                                                    formik={formik}
                                                    name="client_id"
                                                    label="Client"
                                                    options={formik.values?.clients?.map((item) => ({ id: item.id, name: item.full_name }))}
                                                    className="form-select text-white-dark"
                                                    onChange={handleClientChange}
                                                />

                                                <FormikSelect
                                                    formik={formik}
                                                    name="entity_id"
                                                    label="Entity"
                                                    options={formik.values.entities?.map((item) => ({ id: item.id, name: item.entity_name }))}
                                                    className="form-select text-white-dark"
                                                    onChange={handleEntityChange}
                                                />
                                                <FormikSelect
                                                    formik={formik}
                                                    name="supplier_id"
                                                    label="Suppliers "
                                                    options={commonDataList?.suppliers?.map((item: any) => ({ id: item?.id, name: item?.supplier_name }))}
                                                    className="form-select text-white-dark"
                                                />

                                                <FormikInput formik={formik} type="text" name="station_code" label="Station Code" placeholder="Station Code"
                                                    readOnly={isEditMode ? true : false}
                                                />

                                                <FormikInput formik={formik} type="text" name="station_name" label="Station Name" placeholder="Station Name" />
                                                <FormikInput formik={formik} type="text" name="station_display_name" label="Station Display Name" placeholder="Station Display Name" />

                                                <FormikSelect
                                                    formik={formik}
                                                    name="station_status"
                                                    label="Station Status"
                                                    options={activeInactiveOption.map((item) => ({ id: item.id, name: item.name }))}
                                                    className="form-select text-white-dark"
                                                    isRequired={true}
                                                />


                                                <FormikInput formik={formik} type="date" name="start_date" label="Start Date" placeholder="Start Date" />

                                                {/* <FormikSelect
                                                    formik={formik}
                                                    name="drs_upload_status"
                                                    label="DRS Upload Status"
                                                    options={activeInactiveOption.map((item) => ({ id: item.id, name: item.name }))}
                                                    className="form-select text-white-dark"
                                                /> */}



                                                <FormikTextArea formik={formik} name="station_address" label="Station Address" placeholder="Station Address" />
                                                <FormikSelect
                                                    formik={formik}
                                                    name="data_import_type_id"
                                                    label="Data Import Types"
                                                    options={commonDataList?.data_import_types?.map((item: any) => ({ id: item?.id, name: item?.import_type_name }))}
                                                    className="form-select text-white-dark"
                                                />

                                                <FormikInput formik={formik} type="number" name="security_amount" label="Security Amount" placeholder="Security Amount" />




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