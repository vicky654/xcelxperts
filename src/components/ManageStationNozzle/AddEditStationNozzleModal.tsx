import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../SideBarComponents/CrudModal/AddModalHeader';
import FormikSelect from '../FormikFormTools/FormikSelect';
import FormikInput from '../FormikFormTools/FormikInput';
import FormikTextArea from '../FormikFormTools/FormikTextArea';
import { activeInactiveOption } from '../../pages/constants';
import useErrorHandler from '../../hooks/useHandleError';
import { stationInitialValues, stationNozzleInitialValues, stationTankInitialValues } from '../FormikFormTools/InitialValues';
import { getStationNozzleValidationSchema, getStationTankValidationSchema, getStationValidationSchema } from '../FormikFormTools/ValidationSchema';
import withApiHandler from '../../utils/withApiHandler';


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

interface Fuel {
    id: string;
    fuel_name: string;
}

interface TankList {
    fuels: Fuel[];
}

interface FormValues {
    client_id: string;
    entity_id: string;
    station_id: string;
    tank_name: string;
    tank_code: string;
    fuel_id: string;
    status: string;
    clients: Client[];
    entities: Entity[];
    // sites: Station[];
    tankList: TankList; // Add tankList here
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

interface AddEditStationNozzleModalProps {
    isOpen: boolean;
    onClose: () => void;
    // getData: (url: string) => Promise<any>;
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
type tankList = {
    fuels: [];
    pumps: [];
};

const AddEditStationNozzleModal: React.FC<AddEditStationNozzleModalProps> = ({ isOpen, onClose, getData, onSubmit, isEditMode, userId }) => {
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

    const fetchSiteList = async (companyId: string) => {
        try {
            const response = await getData(`common/station-list?company_id=${companyId}`);
            formik.setFieldValue('sites', response.data.data);
        } catch (error) {
            handleApiError(error);
        }
    };


    const fetchUserDetails = async (id: string) => {
        try {
            const response = await getData(`/station/nozzle/${id}`);
            if (response && response.data) {
                const userData: any = response.data?.data;
                formik.setValues(userData)
                FetchClientList()
                fetchEntityList(userData?.client_id)
                fetchSiteList(userData?.entity_id)
                fetchFuelNameList(userData?.station_id)
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
            fetchSiteList(entityId);
            const selectedEntity = formik.values.entities.find((entity: Entity) => entity.id === entityId);
            formik.setFieldValue('entity_name', selectedEntity?.entity_name || "");
            formik.setFieldValue('sites', []);
            formik.setFieldValue('tankList', "");
        } else {
            formik.setFieldValue('entity_name', "");
            formik.setFieldValue('sites', []);
            formik.setFieldValue('site_id', "");
            formik.setFieldValue('site_name', "");
            formik.setFieldValue('tankList', "");
        }
    };

    // const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const companyId = e.target.value;
    //     formik.setFieldValue('company_id', companyId);
    //     if (companyId) {
    //         fetchSiteList(companyId);
    //         const selectedCompany = formik.values.companies.find((company: Company) => company.id === companyId);
    //         formik.setFieldValue('company_name', selectedCompany?.company_name || "");
    //         formik.setFieldValue('sites', []);
    //     } else {
    //         formik.setFieldValue('company_name', "");
    //         formik.setFieldValue('sites', []);
    //         formik.setFieldValue('site_id', "");
    //         formik.setFieldValue('site_name', "");
    //     }
    // };


    const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSiteId = e.target.value;
        formik.setFieldValue("site_id", selectedSiteId);
        formik.setFieldValue('tankList', "");
        const selectedSiteData = formik.values.sites.find((site) => site.id === selectedSiteId);
        fetchFuelNameList(selectedSiteId)
        if (selectedSiteData) {
            formik.setFieldValue("site_name", selectedSiteData.site_name);
        } else {
            formik.setFieldValue("site_name", "");
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
    const fetchFuelNameList = async (siteId: string) => {
        try {
            const response = await getData(`station/fuel/list?station_id=${siteId}`);
            formik.setFieldValue('tankList', response.data.data);
        } catch (error) {
            handleApiError(error)
        }
    };

    const formik = useFormik({
        initialValues: stationNozzleInitialValues,
        validationSchema: getStationNozzleValidationSchema(isEditMode),
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
                                <AddModalHeader title={isEditMode ? 'Edit Station Nozzle' : 'Add Station Nozzle'} onClose={onClose} />
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
                                                    name="station_id"
                                                    label="Station"
                                                    options={formik.values.sites?.map((item) => ({ id: item.id, name: item.station_name }))}
                                                    className="form-select text-white-dark"
                                                    onChange={handleSiteChange}
                                                />

                                                <FormikSelect
                                                    formik={formik}
                                                    name="fuel_id"
                                                    label=" Station Fuel"
                                                    options={formik.values.tankList?.fuels?.map((item: any) => ({ id: item.id, name: item.fuel_name }))}
                                                    className="form-select text-white-dark"
                                                // onChange={handleSiteChange}
                                                />

                                                <FormikSelect
                                                    formik={formik}
                                                    name="status"
                                                    label="Nozzle Status"
                                                    options={activeInactiveOption.map((item) => ({ id: item.id, name: item.name }))}
                                                    className="form-select text-white-dark"
                                                    isRequired={true}
                                                />

                                                <FormikSelect
                                                    formik={formik}
                                                    name="station_pump_id"
                                                    label="Station Pump  Name"
                                                    options={formik.values.tankList?.pumps?.map((item: any) => ({ id: item.id, name: item.pump_name }))}
                                                    className="form-select text-white-dark"
                                                // onChange={handleSiteChange}
                                                />

                                                <FormikInput formik={formik} type="text" name="code" label="Nozzle Code" placeholder="Nozzle Code"

                                                    readOnly={isEditMode ? true : false}
                                                />

                                                <FormikInput formik={formik} type="text" name="name" label="Nozzle Name" placeholder="Nozzle Name" />




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

export default AddEditStationNozzleModal;