import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../CrudModal/AddModalHeader';
import { AssignlubricantValidation, lubricantValidation } from '../../FormikFormTools/ValidationSchema';
import FormikInput from '../../FormikFormTools/FormikInput';
import { AssignlubricantInitialValues, lubricantInitialValues } from '../../FormikFormTools/InitialValues';
import FormikSelect from '../../FormikFormTools/FormikSelect';
import ErrorHandler from '../../../hooks/useHandleError';
interface RowData {
    size: string;
    status: string;
    name: string;
}
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
    size: string;
    status: string;
    name: string;
}

const AssignLubricants: React.FC<AddUserModalProps> = ({ isOpen, onClose, getData, onSubmit, isEditMode, userId }) => {

    useEffect(() => {
        formik.resetForm()
        if (
            isOpen
        ) {
            if (localStorage.getItem("superiorRole") === "Client") {
                const clientId = localStorage.getItem("superiorId");
                if (clientId) {
                    handleClientChange({ target: { value: clientId } } as React.ChangeEvent<HTMLSelectElement>);

                }
            } else {
                FetchClientList();
            }
        }


    }, [isOpen]);

    const formik = useFormik({
        initialValues: AssignlubricantInitialValues,
        validationSchema: AssignlubricantValidation(isEditMode),
        onSubmit: async (values, { resetForm }) => {
            try {
                await onSubmit(values, formik);
            } catch (error) {
                throw error; // Rethrow the error to be handled by the caller
            }
        },
    });
    const handleApiError = ErrorHandler();

    const FetchClientList = async () => {
        try {
            const response = await getData('/getClients');
            const clients = response.data.data;
            formik.setFieldValue('clients', clients);

        } catch (error) {
            handleApiError(error)
        }
    };

    const FetchReportList = async (id: string) => {
        try {
            const response = await getData(`lubricant/assigned?station_id=${id}`);

            const { data } = response;
            if (data) {
                formik.setFieldValue('lubricants', data?.data);
                console.log(data?.data, "data");
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const fetchSiteList = async (companyId: string) => {
        try {
            const response = await getData(`getStations?entity_id=${companyId}`);
            formik.setFieldValue('sites', response.data.data);
        } catch (error) {
            handleApiError(error);
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
            formik.setFieldValue('station_id', "");
        } else {
            formik.setFieldValue('entity_id', "");
            formik.setFieldValue('station_id', "");
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
            formik.setFieldValue('station_id', "");
            formik.setFieldValue('site_name', "");
            formik.setFieldValue('tankList', "");
        }
    };



    const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSiteId = e.target.value;
        formik.setFieldValue("station_id", selectedSiteId);
        formik.setFieldValue('tankList', "");
        const selectedSiteData = formik.values.sites.find((site) => site.id === selectedSiteId);

        if (selectedSiteId && selectedSiteData) {
            FetchReportList(selectedSiteId)
            formik.setFieldValue("site_name", selectedSiteData.name);
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
    const handleCheckboxChange = (index: any) => {
        // Update the `checked` status in the lubricants array
        const updatedLubricants = formik.values.lubricants?.map((lubricant, i) =>
            i === index ? { ...lubricant, checked: !lubricant.checked } : lubricant
        );
        formik.setFieldValue("lubricants", updatedLubricants);
    };

    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>

                <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 w-full">
                                <AddModalHeader title="Assign Lubricants" onClose={onClose} />
                                <div className="relative py-6 px-4 bg-white">
                                    <form onSubmit={formik.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                                                {/* Client Field */}
                                                {localStorage.getItem("superiorRole") !== "Client" && (
                                                    <div className="col-span-2">
                                                        <FormikSelect
                                                            formik={formik}
                                                            name="client_id"
                                                            label="Client"
                                                            options={formik.values?.clients?.map((item) => ({ id: item.id, name: item.full_name }))}
                                                            className="form-select text-white-dark"
                                                            onChange={handleClientChange}
                                                        />
                                                    </div>
                                                )}

                                                {/* Entity Field */}
                                                <div className="col-span-2">
                                                    <FormikSelect
                                                        formik={formik}
                                                        name="entity_id"
                                                        label="Entity"
                                                        options={formik.values.entities?.map((item) => ({ id: item.id, name: item.entity_name }))}
                                                        className="form-select text-white-dark"
                                                        onChange={handleEntityChange}
                                                    />
                                                </div>

                                                {/* Station Field */}
                                                <div className="col-span-2">
                                                    <FormikSelect
                                                        formik={formik}
                                                        name="station_id"
                                                        label="Station"
                                                        options={formik.values.sites?.map((item) => ({ id: item.id, name: item.name }))}
                                                        className="form-select text-white-dark"
                                                        onChange={handleSiteChange}
                                                    />
                                                </div>

                                                {formik.values.lubricants?.length > 0 && (
                                                    <>
                                                        {/* Lubricants Section Heading */}
                                                        <div className="col-span-full">
                                                            <div className="flex items-center heading-div gradient-blue-to-blue mt-4">
                                                                Assign Lubricants
                                                            </div>
                                                        </div>

                                                        {/* Lubricants Checkbox List */}
                                                        {formik.values.lubricants?.map((lubricant, index) => (
                                                            <div key={lubricant?.id} className="col-span-2">
                                                                <label className='flex items-center'>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        name={`lubricants[${index}].checked`}
                                                                        checked={lubricant?.checked}
                                                                        onChange={() => handleCheckboxChange(index)}
                                                                    />
                                                                    <span className="ml-2 font-medium cursor-pointer">
                                                                        {lubricant?.lubricant_name}
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </>
                                                )}




                                                {/* Submit Button */}
                                                <div className='col-span-full'>
                                                    <div className="text-end col-span-2">
                                                        <button type="submit" className="btn  btn-primary ">
                                                            Assign
                                                        </button>
                                                    </div></div>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section >
            </div >
        </div >
    );
};

export default AssignLubricants;
