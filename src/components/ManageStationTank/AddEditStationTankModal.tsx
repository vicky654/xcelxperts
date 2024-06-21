import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../SideBarComponents/CrudModal/AddModalHeader';
import FormikSelect from '../FormikFormTools/FormikSelect';
import FormikInput from '../FormikFormTools/FormikInput';
import useErrorHandler from '../../hooks/useHandleError';
import { stationTankInitialValues } from '../FormikFormTools/InitialValues';
import { getStationTankValidationSchema } from '../FormikFormTools/ValidationSchema';

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
    tankList: tankList;
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

const AddEditStationTankModal: React.FC<AddEditStationTankModalProps> = ({ isOpen, onClose, getData, onSubmit, isEditMode, userId }) => {

    const [commonDataList, setCommonDataList] = useState<any>(); // Adjust ClientList type as needed
    const handleApiError = useErrorHandler();

    useEffect(() => {
        if (isOpen) {
            if (localStorage.getItem("superiorRole") === "Client") {
                const clientId = localStorage.getItem("superiorId");
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




    const FetchClientList = async () => {
        try {
            const response = await getData('/getClients');
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
            const response = await getData(`getStations?company_id=${companyId}`);
            formik.setFieldValue('sites', response.data.data);
        } catch (error) {
            handleApiError(error);
        }
    };


    const fetchUserDetails = async (id: string) => {
        try {
            const response = await getData(`/station/tank/${id}`);
            if (response && response.data) {
                const userData: any = response.data?.data;
                formik.setValues(userData)
                // FetchClientList()
                // fetchEntityList(userData?.client_id)
                // fetchSiteList(userData?.entity_id);
                // fetchFuelNameList(userData?.station_id)
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
        if (selectedSiteId) {
            fetchFuelNameList(selectedSiteId)
        }
        if (selectedSiteData) {
            formik.setFieldValue("site_name", selectedSiteData.site_name);
        } else {
            formik.setFieldValue("site_name", "");
        }
    };


    const fetchEntityList = async (clientId: string) => {
        try {
            const response = await getData(`getEntities?client_id=${clientId}`);
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

    const editCloseCheck = () => {
        if (isEditMode) {
            formik.resetForm()
        }
        onClose();
    }

    const formik = useFormik({
        initialValues: stationTankInitialValues,
        validationSchema: getStationTankValidationSchema(isEditMode),
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

    const options5 = [
        { value: 'orange', label: 'Orange' },
        { value: 'white', label: 'White' },
        { value: 'purple', label: 'Purple' },
    ];


    console.log(formik?.values, "formik value");


    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={editCloseCheck}></div>

                <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 w-full">
                                <AddModalHeader title={isEditMode ? 'Edit Station Tank' : 'Add Station Tank'} onClose={editCloseCheck} />
                                <div className="relative py-6 px-4 bg-white">
                                    <form onSubmit={formik.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">

                                                {!isEditMode && localStorage.getItem("superiorRole") !== "Client" &&
                                                    <FormikSelect
                                                        formik={formik}
                                                        name="client_id"
                                                        label="Client"
                                                        options={formik.values?.clients?.map((item) => ({ id: item.id, name: item.full_name }))}
                                                        className="form-select text-white-dark"
                                                        onChange={handleClientChange}
                                                    />
                                                }


                                                {!isEditMode && <FormikSelect
                                                    formik={formik}
                                                    name="entity_id"
                                                    label="Entity"
                                                    options={formik.values.entities?.map((item) => ({ id: item.id, name: item.entity_name }))}
                                                    className="form-select text-white-dark"
                                                    onChange={handleEntityChange}
                                                />}
                                                {!isEditMode && <FormikSelect
                                                    formik={formik}
                                                    name="station_id"
                                                    label="Station"
                                                    options={formik.values.sites?.map((item) => ({ id: item.id, name: item.station_name }))}
                                                    className="form-select text-white-dark"
                                                    onChange={handleSiteChange}
                                                />
                                                }
                                                {!isEditMode && <FormikSelect
                                                    formik={formik}
                                                    name="fuel_id"
                                                    label="Fuel Name"
                                                    options={formik.values.tankList?.fuels?.map((item: any) => ({ id: item.id, name: item.fuel_name }))}
                                                    className="form-select text-white-dark"
                                                // onChange={handleSiteChange}
                                                />
                                                }


                                                <FormikInput formik={formik} type="text" name="tank_name" label="Tank Name" />

                                                <FormikInput formik={formik} type="text" name="tank_code" label="Tank Code"
                                                    readOnly={isEditMode ? true : false}
                                                />

                                           

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