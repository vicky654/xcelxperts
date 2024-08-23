import React, { useState, useEffect, Fragment } from 'react'
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useFormik } from 'formik';
import useErrorHandler from '../../hooks/useHandleError';
import { useNavigate } from 'react-router-dom';
import FormikInput from '../FormikFormTools/FormikInput';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../Icon/IconX';
import FormikSelect from '../FormikFormTools/FormikSelect';
import LoaderImg from '../../utils/Loader';




interface Client {
    id: string;
    client_name: string;
    companies: Company[];
}

interface Company {
    // entity_name: string;
    id: string;
    entity_name: string;
}

interface Site {
    name: string;
    id: string;
    site_name: string;
}

interface NewDashboardFilterModalProps {
    isOpen: boolean;
    smallScreen?: boolean;
    isLoading: boolean;
    onClose: () => void;
    isRtl?: boolean; // If needed
    getData: (url: string, id?: string, params?: any) => Promise<any>;
    onApplyFilters: any;
    FilterValues?: any;
    showClientInput?: boolean;
    showEntityInput?: boolean;
    showStationInput?: boolean;
    showStationValidation?: boolean;
    showDateValidation?: boolean;
    showDateInput?: boolean;
    validationSchema: any;
    layoutClasses: any;
    storedKeyName?: any;
}




const NewDashboardFilterModal: React.FC<NewDashboardFilterModalProps> = ({
    getData,
    isLoading,
    onApplyFilters,
    showClientInput = true,
    smallScreen = false,
    showEntityInput = true,
    showStationInput = true,
    showStationValidation,
    showDateInput = true,
    validationSchema,
    storedKeyName,
    layoutClasses = `flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5`,
    onClose,
    isOpen,
}) => {
    const { data } = useSelector((state: IRootState) => state.data);
    const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
    const auth = useSelector((state: IRootState) => state.auth);

    const handleApiError = useErrorHandler();
    const navigate = useNavigate();



    const formik = useFormik({
        initialValues: {
            client_id: "",
            client_name: "",
            entity_id: "",
            entity_name: "",
            start_month: "",
            station_id: "",
            site_name: "",
            clients: [] as Client[],
            companies: [] as Company[],
            sites: [] as Site[],
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            onApplyFilters(values);
            localStorage.setItem(storedKeyName, JSON.stringify(values));
        },
        validateOnChange: true,
        validateOnBlur: true,
    });

    useEffect(() => {
        if (showClientInput) fetchClientList();
    }, [showClientInput]);

    useEffect(() => {
        const storedDataString = localStorage.getItem(storedKeyName);

        if (storedDataString) {
            // Parse the stored data into an object
            const parsedData = JSON.parse(storedDataString);

            // Set the parsed data into Formik
            formik.setValues(parsedData);

            // Check if station_id exists in parsedData
            if (parsedData?.entity_id) {
                fetchSiteList(parsedData?.entity_id);
            }
        }

        if (!storedDataString && localStorage.getItem("superiorRole") === "Client") {
            const clientId = localStorage.getItem("superiorId");
            if (clientId) {
                // Simulate the change event to call handleClientChange
                handleClientChange({ target: { value: clientId } } as React.ChangeEvent<HTMLSelectElement>);
            }
        }

    }, []); // Empty dependency array to run only on component mount



    const fetchClientList = async () => {
        try {
            const response = await getData('/getClients');
            const clients = response.data.data;
            formik.setFieldValue('clients', clients);
        } catch (error) {
            handleApiError(error);
        }
    };

    const fetchCompanyList = async (clientId: string) => {
        try {
            const response = await getData(`getEntities?client_id=${clientId}`);
            formik.setFieldValue('companies', response.data.data);
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
            fetchCompanyList(clientId);
            const selectedClient = formik.values.clients.find(client => client.id === clientId);
            formik.setFieldValue('client_name', selectedClient?.client_name || "");
            formik.setFieldValue('companies', selectedClient?.companies || []);
            formik.setFieldValue('sites', []);
            formik.setFieldValue('entity_id', "");
            formik.setFieldValue('station_id', "");
        } else {
            formik.setFieldValue('client_name', "");
            formik.setFieldValue('companies', []);
            formik.setFieldValue('sites', []);
            formik.setFieldValue('entity_id', "");
            formik.setFieldValue('station_id', "");
        }
    };

    const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const companyId = e.target.value;
        formik.setFieldValue('entity_id', companyId);
        if (companyId) {
            if (showStationInput) {
                fetchSiteList(companyId);
            }
            formik.setFieldValue('station_id', "");
            const selectedCompany = formik.values.companies.find(company => company.id === companyId);
            formik.setFieldValue('entity_name', selectedCompany?.entity_name || "");
        } else {
            formik.setFieldValue('entity_name', "");
            formik.setFieldValue('sites', []);
            formik.setFieldValue('station_id', "");
            formik.setFieldValue('site_name', "");
        }
    };

    const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSiteId = e.target.value;
        formik.setFieldValue("station_id", selectedSiteId);
        const selectedSiteData = formik.values.sites.find(site => site.id === selectedSiteId);
        formik.setFieldValue('station_name', selectedSiteData?.name || "");
        if (selectedSiteData) {
            formik.setFieldValue("site_name", selectedSiteData.site_name);
        } else {
            formik.setFieldValue("site_name", "");
        }
    };




    return (


        <>
            {isLoading ? <LoaderImg /> : ""}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" open={isOpen} onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div id="fadein_right_modal" className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <Dialog.Panel
                                className={`panel animate__animated my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark animate__fadeInRight
                                    }`}
                            >
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <h5 className="text-lg font-bold">
                                        Hii {data?.first_name}, Apply Filter
                                    </h5>
                                    <button onClick={onClose} type="button" className="text-white-dark hover:text-dark">
                                        <IconX />
                                    </button>
                                </div>

                                <div className="p-5">
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className="flex flex-col gap-5">
                                            <div className={`${layoutClasses}`}>
                                                {showClientInput && localStorage.getItem("superiorRole") !== "Client" && (
                                                    <>
                                                        <FormikSelect
                                                            formik={formik}
                                                            name="client_id"
                                                            label="Client"
                                                            options={formik.values.clients?.map((item: any) => ({ id: item.id, name: item.full_name }))}
                                                            className="form-input"
                                                            onChange={handleClientChange}
                                                        />
                                                    </>
                                                )}

                                                {showEntityInput && (
                                                    <>
                                                        <FormikSelect
                                                            formik={formik}
                                                            name="entity_id"
                                                            label="Entity"
                                                            options={formik?.values?.companies?.map((item: any) => ({ id: item.id, name: item.entity_name }))}
                                                            className="form-input"
                                                            onChange={handleCompanyChange}
                                                        />

                                                    </>
                                                )}
                                                {showStationInput && (
                                                    <>
                                                        <FormikSelect
                                                            formik={formik}
                                                            name="station_id"
                                                            label="Station"
                                                            options={formik?.values?.sites?.map((item: any) => ({ id: item.id, name: item.name }))}
                                                            className="form-input"
                                                            onChange={handleSiteChange}
                                                        />
                                                    </>
                                                )}

                                                {showDateInput && (
                                                    <FormikInput formik={formik} type="month" label="Month" name="start_month" />
                                                )}


                                            </div>

                                            <div>
                                                <button type="submit" className="btn btn-primary">
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    </form >
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>

    );
}

export default NewDashboardFilterModal;