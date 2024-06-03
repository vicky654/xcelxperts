import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useFormik } from 'formik';
import * as Yup from "yup";
import useHandleError from '../../hooks/useHandleError';
import withApiHandler from '../../utils/withApiHandler';
import LoaderImg from '../../utils/Loader';
import { useNavigate } from 'react-router-dom';
import useErrorHandler from '../../hooks/useHandleError';


interface FilterValues {
    client_id: string;
    company_id: string;
    site_id: string;
}

interface ModalProps {
    isOpen: boolean;
    isLoading: boolean;
    onClose: () => void;
    isRtl?: boolean; // If needed
    getData: (url: string, id?: string, params?: any) => Promise<any>;
    onApplyFilters: (values: FilterValues) => void;
}

interface Client {
    id: string;
    client_name: string;
    companies: Company[];
}

interface Company {
    id: string;
    company_name: string;
}

interface Site {
    id: string;
    site_name: string;
}

const DashboardFilterModal: React.FC<ModalProps> = ({ isOpen, onClose, isRtl = false, getData, isLoading, onApplyFilters }) => {
    const { data } = useSelector((state: IRootState) => state.data);
    const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
    const auth = useSelector((state: IRootState) => state.auth);

    


    const handleApiError = useErrorHandler();
    const navigate = useNavigate();

    




    const validationSchema = Yup.object({
        company_id: Yup.string().required("Station is required"),
        client_id: isNotClient
            ? Yup.string().required("Client is required")
            : Yup.mixed().notRequired(),
    });

    const formik = useFormik({
        initialValues: {
            client_id: "",
            client_name: "",
            company_id: "",
            company_name: "",
            site_id: "",
            site_name: "",
            clients: [] as Client[],
            companies: [] as Company[],
            sites: [] as Site[],
        },
        // validationSchema: Yup.object({
        //     company_id: Yup.string().required("Station is required"),
        // }),
        validationSchema: validationSchema,
        onSubmit: (values) => {
            onApplyFilters(values as FilterValues); // Type assertion to FilterValues
            

            // Store the form values in local storage
            localStorage.setItem("testing", JSON.stringify(values));

            // handlesubmitvalues(values);
        },
        validateOnChange: true,  // Validate on field change
        validateOnBlur: true,    // Validate on field blur
    });


  
    const fetchClientList = async () => {
        try {
            const response = await getData('/common/client-list');
            const clients = response.data.data;
            formik.setFieldValue('clients', clients);
            // const clientId = localStorage.getItem("superiorId");
            // if (clientId) {
            //     formik.setFieldValue('client_id', clientId);
            //     const selectedClient = clients.find((client: Client) => client.id === clientId);
            //     if (selectedClient) {
            //         formik.setFieldValue('companies', selectedClient.companies);
            //     }
            // }
        } catch (error) {
            handleApiError(error)
        }
    };

    const fetchCompanyList = async (clientId: string) => {
        try {
            const response = await getData(`common/company-list?client_id=${clientId}`);
            formik.setFieldValue('companies', response.data.data);
        } catch (error) {
            handleApiError(error)
        }
    };

    const fetchSiteList = async (companyId: string) => {
        try {
            const response = await getData(`common/site-list?company_id=${companyId}`);
            formik.setFieldValue('sites', response.data.data);
        } catch (error) {
            handleApiError(error);
        }
    };
    const storedData = localStorage.getItem("testing");


    useEffect(() => {
        if (!storedData) {
            if (localStorage.getItem("superiorRole") !== "Client") {
                fetchClientList();
                // formik.setValues(JSON.parse(localStorage.getItem("testing")))
            } else {
                fetchCompanyList(localStorage.getItem("superiorId") || "");
            }
        }


        // Check if there is any stored data
        if (storedData) {
            // Parse the stored data into an object
            const parsedData = JSON.parse(storedData);

            // Set the parsed data into Formik
            formik.setValues(parsedData);
        }
    }, []);

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const clientId = e.target.value;
        formik.setFieldValue('client_id', clientId);
        if (clientId) {
            fetchCompanyList(clientId);
            const selectedClient = formik.values.clients.find((client: Client) => client.id === clientId);
            formik.setFieldValue('client_name', selectedClient?.client_name || "");
            formik.setFieldValue('companies', selectedClient?.companies || []);
            formik.setFieldValue('sites', []);
            formik.setFieldValue('company_id', "");
            formik.setFieldValue('site_id', "");
        } else {
            formik.setFieldValue('company_id', "");
            formik.setFieldValue('site_id', "");
            formik.setFieldValue('client_name', "");
            formik.setFieldValue('companies', []);
            formik.setFieldValue('sites', []);
            formik.setFieldValue('company_name', "");
            formik.setFieldValue('site_name', "");
        }
    };

    const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const companyId = e.target.value;
        formik.setFieldValue('company_id', companyId);
        if (companyId) {
            fetchSiteList(companyId);
            const selectedCompany = formik.values.companies.find((company: Company) => company.id === companyId);
            formik.setFieldValue('company_name', selectedCompany?.company_name || "");
            formik.setFieldValue('sites', []);
        } else {
            formik.setFieldValue('company_name', "");
            formik.setFieldValue('sites', []);
            formik.setFieldValue('site_id', "");
            formik.setFieldValue('site_name', "");
        }
    };

    const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSiteId = e.target.value;
        formik.setFieldValue("site_id", selectedSiteId);
        const selectedSiteData = formik.values.sites.find((site) => site.id === selectedSiteId);
        if (selectedSiteData) {
            formik.setFieldValue("site_name", selectedSiteData.site_name);
        } else {
            formik.setFieldValue("site_name", "");
        }
    };


    return (
        <>
            {isLoading && <LoaderImg />}
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
                                className={`panel animate__animated my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark ${isRtl ? 'animate__fadeInLeft' : 'animate__fadeInRight'
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

                                    <form onSubmit={formik.handleSubmit} >
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                {localStorage.getItem("superiorRole") !== "Client" && (
                                                    <>
                                                        <div className={formik.submitCount ? (formik.errors.client_id ? 'has-error' : 'has-success') : ''}>
                                                            <label htmlFor="client_id">Client <span className="text-danger">*</span></label>
                                                            <select
                                                                id="client_id"
                                                                onChange={handleClientChange}
                                                                value={formik.values.client_id}
                                                                className="form-select text-white-dark">
                                                                <option value="">Select a Client</option>
                                                                {formik.values.clients.length > 0 ? (
                                                                    formik.values.clients.map((item) => (
                                                                        <option key={item.id} value={item.id}>
                                                                            {item.client_name}
                                                                        </option>
                                                                    ))
                                                                ) : (
                                                                    <option disabled>No Client</option>
                                                                )}
                                                            </select>
                                                            {formik.submitCount ? formik.errors.client_id ? <div className="text-danger mt-1">{formik.errors.client_id}</div> : "" : null}
                                                        </div>
                                                    </>
                                                )}

                                                <div className={formik.submitCount ? (formik.errors.company_id ? 'has-error' : 'has-success') : ''}>
                                                    <label htmlFor="company_id">Entity<span className="text-danger">*</span></label>
                                                    <select
                                                        id="company_id"
                                                        onChange={handleCompanyChange}
                                                        value={formik.values.company_id}
                                                        className="form-select text-white-dark">
                                                        <option value="">Select a Entity</option>
                                                        {formik.values.companies.length > 0 ? (
                                                            formik.values.companies.map((company) => (
                                                                <option key={company.id} value={company.id}>
                                                                    {company.company_name}
                                                                </option>
                                                            ))
                                                        ) : (
                                                            <option disabled>No Entity</option>
                                                        )}
                                                    </select>
                                                    {formik.submitCount ? formik.errors.company_id ? <div className="text-danger mt-1">{formik.errors.company_id}</div> : "" : null}
                                                </div>



                                                <div className={formik.submitCount ? (formik.errors.site_id ? 'has-error' : 'has-success') : ''}>
                                                    <label htmlFor="site_id">Station </label>
                                                    <select
                                                        id="site_id"
                                                        onChange={(e) => {
                                                            const selectedSiteId = e.target.value;
                                                            formik.setFieldValue("site_id", selectedSiteId);
                                                            const selectedSiteData = formik.values.sites.find((site) => site.id === selectedSiteId);
                                                            if (selectedSiteData) {
                                                                formik.setFieldValue("site_name", selectedSiteData.site_name);
                                                            }
                                                        }}
                                                        value={formik.values.site_id}
                                                        className="form-select text-white-dark">
                                                        <option value="">Select a Station </option>
                                                        {formik.values.sites.length > 0 ? (
                                                            formik.values.sites.map((site) => (
                                                                <option key={site.id} value={site.id}>
                                                                    {site.site_name}
                                                                </option>
                                                            ))
                                                        ) : (
                                                            <option disabled>No Station</option>
                                                        )}
                                                    </select>
                                                    {formik.submitCount ? formik.errors.site_id ? <div className="text-danger mt-1">{formik.errors.site_id}</div> : "" : null}
                                                </div>

                                                <div className="sm:col-span-2 mt-3">
                                                    <button type="submit" className="btn btn-primary"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default withApiHandler(DashboardFilterModal);
