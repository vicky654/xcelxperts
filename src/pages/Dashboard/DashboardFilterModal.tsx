import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../../components/Icon/IconX';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import useHandleError from '../../hooks/useHandleError';
import withApiHandler from '../../utils/withApiHandler';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    isRtl?: boolean; // If needed
    getData: (url: string, id?: string, params?: any) => Promise<any>;
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

const DashboardFilterModal: React.FC<ModalProps> = ({ isOpen, onClose, isRtl = false, getData }) => {
    const { data, error } = useSelector((state: IRootState) => state.data);

    const handleError = useHandleError();

    const [selectedCompanyList, setSelectedCompanyList] = useState<Company[]>([]);
    const [myclientID, setMyClientID] = useState<string | null>(localStorage.getItem("superiorId"));
    const [myClientRole, setMyClientRole] = useState<string | null>(localStorage.getItem("superiorRole"));
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const [selectedClientId, setSelectedClientId] = useState<string>("");
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
    const [selectedSiteId, setSelectedSiteId] = useState<string>("");
    const [ClientList, setClientList] = useState<Client[]>([]);
    const [CompanyList, setCompanyList] = useState<Company[]>([]);
    const [SiteList, setSiteList] = useState<Site[]>([]);

    console.log(ClientList, "ClientListClientList");




    const token: string | null = localStorage.getItem("token");

    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });





    const fetchCommonListData = async () => {
        setIsLoading(true);
        try {
            const response = await getData(`/common/client-list`);
            // const response = await axiosInstance.get<Client[]>("/common/client-list");
            setIsLoading(true);
            const { data } = response;
            if (data && data.data) {
                setClientList(response.data?.data);
                const clientId = localStorage.getItem("superiorId");
                if (clientId) {
                    setSelectedClientId(clientId);
                    setSelectedCompanyList([]);
                    if (response?.data) {
                        const selectedClient = response?.data?.find((client: Client) => client.id === clientId);
                        if (selectedClient) {
                            setSelectedCompanyList(selectedClient.companies);
                        }
                    }
                }
            }
            setIsLoading(false);
        } catch (error) {
            console.error("API error:", error);
            setIsLoading(false);
        }
    };

    const GetCompanyList = async (values: string) => {
        setIsLoading(true);
        try {
            const response = await getData(`common/company-list?client_id=${values}`);
            setIsLoading(true);
            if (response) {
                setCompanyList(response?.data?.data);
            }
            setIsLoading(false);
        } catch (error) {
            handleError(error as AxiosError);
            console.error("API error:", error);
            setIsLoading(false);
        }
    };

    const GetSiteList = async (values: string) => {
        setIsLoading(true);
        try {
            const response = await getData(`common/site-list?company_id=${values}`);
            setIsLoading(true);
            if (response) {
                setSiteList(response?.data?.data);
            } else {
                throw new Error("No data available in the response");
            }
            setIsLoading(false);
        } catch (error) {
            handleError(error as AxiosError);
            console.error("API error:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const clientId = localStorage.getItem("superiorId");

        if (myClientRole !== "Client") {
            fetchCommonListData();
        } else {
            setTimeout(() => {
                GetCompanyList(myclientID || "");
                setSelectedClientId(myclientID || "");
            }, 500);
        }
        console.clear();
    }, [myclientID, myClientRole]);

    const formik = useFormik({
        initialValues: {
            client_id: "",
            client_name: "",
            company_id: "",
            company_name: "",
            site_id: "",
            site_name: "",
        },
        validationSchema: Yup.object({
            company_id: Yup.string().required("Company is required"),
        }),
        onSubmit: (values) => {
            // handlesubmitvalues(values);
        },
    });


    return (
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
                                <div className="flex flex-wrap">

                                    {localStorage.getItem("superiorRole") !== "Client" && (
                                        <div className="w-full lg:w-1/2 md:w-1/2 px-4">
                                            <div className="form-group mt-4">
                                                <label htmlFor="client_id" className="form-label">
                                                    Client
                                                </label>
                                                <select
                                                    className={`input101 ${formik.errors.client_id && formik.touched.client_id ? "is-invalid" : ""}`}
                                                    id="client_id"
                                                    name="client_id"
                                                    value={formik.values.client_id}
                                                    onChange={(e) => {
                                                        const selectedType = e.target.value;
                                                        if (selectedType) {
                                                            GetCompanyList(selectedType);
                                                            formik.setFieldValue("client_id", selectedType);
                                                            setSelectedClientId(selectedType);
                                                            setSiteList([]);
                                                            formik.setFieldValue("company_id", "");
                                                            formik.setFieldValue("site_id", "");
                                                            const selectedClient = ClientList?.find((client) => client.id === selectedType);
                                                            if (selectedClient) {
                                                                formik.setFieldValue("client_name", selectedClient?.client_name);
                                                            }
                                                        } else {
                                                            formik.setFieldValue("client_id", "");
                                                            formik.setFieldValue("company_id", "");
                                                            formik.setFieldValue("site_id", "");
                                                            setSiteList([]);
                                                            setCompanyList([]);
                                                        }
                                                    }}
                                                >
                                                    <option value="">Select a Client</option>
                                                    {ClientList && ClientList.length > 0 ? (
                                                        ClientList.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.client_name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option disabled>No Client</option>
                                                    )}
                                                </select>
                                                {formik.errors.client_id && formik.touched.client_id && (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.client_id}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="w-full lg:w-1/2 md:w-1/2 px-4">
                                        <div className="form-group mt-4">
                                            <label htmlFor="company_id" className="form-label">
                                                Company
                                                <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className={`input101 ${formik.errors.company_id && formik.touched.company_id ? "is-invalid" : ""}`}
                                                id="company_id"
                                                name="company_id"
                                                value={formik.values.company_id}
                                                onChange={(e) => {
                                                    const selectcompany = e.target.value;
                                                    if (selectcompany) {
                                                        GetSiteList(selectcompany);
                                                        formik.setFieldValue("site_id", "");
                                                        formik.setFieldValue("company_id", selectcompany);
                                                        setSelectedCompanyId(selectcompany);
                                                        const selectedCompanyData = CompanyList?.find((company) => company?.id === selectcompany);
                                                        if (selectedCompanyData) {
                                                            formik.setFieldValue("company_name", selectedCompanyData?.company_name);
                                                            formik.setFieldValue("company_id", selectedCompanyData?.id);
                                                        }
                                                    } else {
                                                        formik.setFieldValue("company_id", "");
                                                        formik.setFieldValue("site_id", "");
                                                        setSiteList([]);
                                                    }
                                                }}
                                            >
                                                <option value="">Select a Company</option>
                                                {selectedClientId && CompanyList.length > 0 ? (
                                                    <>
                                                        setSelectedCompanyId([])
                                                        {CompanyList.map((company) => (
                                                            <option key={company.id} value={company.id}>
                                                                {company.company_name}
                                                            </option>
                                                        ))}
                                                    </>
                                                ) : (
                                                    <option disabled>No Company</option>
                                                )}
                                            </select>
                                            {formik.errors.company_id && formik.touched.company_id && (
                                                <div className="invalid-feedback">
                                                    {formik.errors.company_id}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full lg:w-1/2 md:w-1/2 px-4">
                                        <div className="form-group mt-4">
                                            <label htmlFor="site_id" className="form-label">
                                                Site Name
                                            </label>
                                            <select
                                                className={`input101 ${formik.errors.site_id && formik.touched.site_id ? "is-invalid" : ""}`}
                                                id="site_id"
                                                name="site_id"
                                                value={formik.values.site_id}
                                                onChange={(e) => {
                                                    const selectedsite_id = e.target.value;
                                                    formik.setFieldValue("site_id", selectedsite_id);
                                                    setSelectedSiteId(selectedsite_id);
                                                    const selectedSiteData = SiteList.find((site) => site.id === selectedsite_id);
                                                    if (selectedSiteData) {
                                                        formik.setFieldValue("site_name", selectedSiteData.site_name);
                                                    }
                                                }}
                                            >
                                                <option value="">Select a Site</option>
                                                {CompanyList && SiteList.length > 0 ? (
                                                    SiteList.map((site) => (
                                                        <option key={site.id} value={site.id}>
                                                            {site.site_name}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option disabled>No Site</option>
                                                )}
                                            </select>
                                            {formik.errors.site_id && formik.touched.site_id && (
                                                <div className="invalid-feedback">
                                                    {formik.errors.site_id}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>

                                <div className="mt-8 flex items-center justify-end">
                                    <button onClick={onClose} type="button" className="btn btn-outline-danger">
                                        Discard
                                    </button>
                                    <button onClick={onClose} type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default withApiHandler(DashboardFilterModal);