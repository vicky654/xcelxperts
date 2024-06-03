import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useFormik } from 'formik';
import * as Yup from "yup";
import useErrorHandler from '../../hooks/useHandleError';
import { useNavigate } from 'react-router-dom';
import withApiHandler from '../../utils/withApiHandler';

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

interface CustomInputProps {
    isOpen: boolean;
    isLoading: boolean;
    onClose: () => void;
    isRtl?: boolean; // If needed
    getData: (url: string, id?: string, params?: any) => Promise<any>;
    onApplyFilters: any;
    FilterValues: any;
    showClientInput?: boolean;
    showEntityInput?: boolean;
    showStationInput?: boolean;
    validationSchema: any;
    layoutClasses: any;
}




const CustomInput: React.FC<CustomInputProps> = ({
    getData,
    isLoading,
    onApplyFilters,
    showClientInput = true,
    showEntityInput = true,
    showStationInput = true,
    validationSchema,
    layoutClasses = 'flex-1 grid grid-cols-1 sm:grid-cols-2',
}) => {
    const { data } = useSelector((state: IRootState) => state.data);
    const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
    const auth = useSelector((state: IRootState) => state.auth);

    const handleApiError = useErrorHandler();
    const navigate = useNavigate();

    // const validationSchema = Yup.object({
    //     company_id: showEntityInput ? Yup.string().required("Entity is required") : Yup.mixed().notRequired(),
    //     client_id: isNotClient && showClientInput
    //         ? Yup.string().required("Client is required")
    //         : Yup.mixed().notRequired(),
    // });

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
        validationSchema: validationSchema,
        onSubmit: (values) => {
            onApplyFilters(values);
            localStorage.setItem("testing", JSON.stringify(values));
        },
        validateOnChange: true,
        validateOnBlur: true,
    });

    useEffect(() => {
        if (showClientInput) fetchClientList();
    }, [showClientInput]);

    const fetchClientList = async () => {
        try {
            const response = await getData('/common/client-list');
            const clients = response.data.data;
            formik.setFieldValue('clients', clients);
        } catch (error) {
            handleApiError(error);
        }
    };

    const fetchCompanyList = async (clientId: string) => {
        try {
            const response = await getData(`common/company-list?client_id=${clientId}`);
            formik.setFieldValue('companies', response.data.data);
        } catch (error) {
            handleApiError(error);
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

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const clientId = e.target.value;
        formik.setFieldValue('client_id', clientId);
        if (clientId) {
            fetchCompanyList(clientId);
            const selectedClient = formik.values.clients.find(client => client.id === clientId);
            formik.setFieldValue('client_name', selectedClient?.client_name || "");
            formik.setFieldValue('companies', selectedClient?.companies || []);
            formik.setFieldValue('sites', []);
            formik.setFieldValue('company_id', "");
            formik.setFieldValue('site_id', "");
        } else {
            formik.setFieldValue('client_name', "");
            formik.setFieldValue('companies', []);
            formik.setFieldValue('sites', []);
            formik.setFieldValue('company_id', "");
            formik.setFieldValue('site_id', "");
        }
    };

    const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const companyId = e.target.value;
        formik.setFieldValue('company_id', companyId);
        if (companyId) {
            if (showStationInput) {
                fetchSiteList(companyId);
            }
            const selectedCompany = formik.values.companies.find(company => company.id === companyId);
            formik.setFieldValue('company_name', selectedCompany?.company_name || "");
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
        const selectedSiteData = formik.values.sites.find(site => site.id === selectedSiteId);
        if (selectedSiteData) {
            formik.setFieldValue("site_name", selectedSiteData.site_name);
        } else {
            formik.setFieldValue("site_name", "");
        }
    };




    return (
        <div className="p-5">
            <form onSubmit={formik.handleSubmit}>
                <div className="flex flex-col sm:flex-row">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {showClientInput && localStorage.getItem("superiorRole") !== "Client" && (
                            <div className={formik.submitCount ? (formik.errors.client_id ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="client_id">Client <span className="text-danger">*</span></label>
                                <select
                                    id="client_id"
                                    onChange={handleClientChange}
                                    value={formik.values.client_id}
                                    onBlur={formik.handleBlur}
                                    className="form-select text-white-dark">
                                    <option value="">Select a Client</option>
                                    {formik.values.clients.length > 0 ? (
                                        formik.values.clients.map(item => (
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
                        )}

                        {showEntityInput && (
                            <div className={formik.submitCount ? (formik.errors.company_id ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="company_id">Entity<span className="text-danger">*</span></label>
                                <select
                                    id="company_id"
                                    onChange={handleCompanyChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.company_id}
                                    className="form-select text-white-dark">
                                    <option value="">Select a Entity</option>
                                    {formik.values.companies.length > 0 ? (
                                        formik.values.companies.map(company => (
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
                        )}

                        {showStationInput && (
                            <div className={formik.submitCount ? (formik.errors.site_id ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="site_id">Station</label>
                                <select
                                    id="site_id"
                                    onChange={handleSiteChange}
                                    value={formik.values.site_id}
                                    onBlur={formik.handleBlur}
                                    className="form-select text-white-dark">
                                    <option value="">Select a Station</option>
                                    {formik.values.sites.length > 0 ? (
                                        formik.values.sites.map(site => (
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
                        )}

                        <div className="sm:col-span-2 mt-3">
                            <button type="submit" className="btn btn-primary">
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CustomInput;
