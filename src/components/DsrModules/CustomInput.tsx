import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useFormik } from 'formik';
import useErrorHandler from '../../hooks/useHandleError';
import { useNavigate } from 'react-router-dom';
import FormikInput from '../FormikFormTools/FormikInput';

interface Client {
    id: string;
    client_name: string;
    companies: Company[];
}

interface Company {
    entity_name: string;
    id: string;
    // entity_name: string;
}

interface Site {
    name: string;
    id: string;
    site_name: string;
}

interface CustomInputProps {
    isOpen: boolean;
    smallScreen?: boolean;
    isLoading: boolean;
    onClose: () => void;
    isRtl?: boolean; // If needed
    getData: (url: string, id?: string, params?: any) => Promise<any>;
    onApplyFilters: any;
    FilterValues: any;
    showClientInput?: boolean;
    showEntityInput?: boolean;
    showStationInput?: boolean;
    showStationValidation?: boolean;
    showDateValidation?: boolean;
    showDateInput?: boolean;
    validationSchema: any;
    layoutClasses: any;
    storedKeyName?: any;
    fullWidthButton?: boolean;
    showMonthInput?: boolean; // New prop
}

const CustomInput: React.FC<CustomInputProps> = ({
    getData,
    isLoading,
    onApplyFilters,
    showClientInput = true,
    showEntityInput = true,
    showStationInput = true,
    smallScreen = false,
    showStationValidation,
    showDateInput = true,
    fullWidthButton = true,
    validationSchema,
    storedKeyName,
    layoutClasses = 'flex-1 grid grid-cols-1 sm:grid-cols-1 gap-5',
    showMonthInput = false, // Default to false
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
            start_date: "",
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
            if (parsedData.entity_id) {
                fetchSiteList(parsedData.entity_id);
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
        <div className="">

            {!smallScreen && (
                <h5 className="font-semibold text-lg dark:text-white-light mb-3"> Apply Filters</h5>
            )}
            <form onSubmit={formik.handleSubmit}>
                <div className="flex flex-col sm:flex-row">
                    <div className={`${layoutClasses}`}>
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
                            <div className={formik.submitCount ? (formik.errors.entity_id ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="entity_id">Entity<span className="text-danger">*</span></label>
                                <select
                                    id="entity_id"
                                    onChange={handleCompanyChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.entity_id}
                                    className="form-select text-white-dark">
                                    <option value="">Select an Entity</option>
                                    {formik.values.companies.length > 0 ? (
                                        formik.values.companies.map(company => (
                                            <option key={company.id} value={company.id}>
                                                {company.entity_name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No Entity</option>
                                    )}
                                </select>
                                {formik.submitCount ? formik.errors.entity_id ? <div className="text-danger mt-1">{formik.errors.entity_id}</div> : "" : null}
                            </div>
                        )}

                        {showStationInput && (
                            <div className={formik.submitCount ? (formik.errors.station_id ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="station_id">Station <span className="text-danger">{showStationValidation ? '*' : ''}</span></label>
                                <select
                                    id="station_id"
                                    value={formik.values.station_id}
                                    onChange={handleSiteChange}
                                    onBlur={formik.handleBlur}
                                    className="form-select text-white-dark">
                                    <option value="">Select a Station</option>
                                    {formik.values.sites.length > 0 ? (
                                        formik.values.sites.map(site => (
                                            <option key={site.id} value={site.id}>
                                                {site.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No Station</option>
                                    )}
                                </select>
                                {formik.submitCount ? formik.errors.station_id ? <div className="text-danger mt-1">{formik.errors.station_id}</div> : "" : null}
                            </div>
                        )}

                        {showDateInput && (
                            <FormikInput
                                label="Date"
                                name="start_date"
                                type="date"
                                placeholder="Select a Date"
                                className="form-input text-white-dark"
                                formik={formik}
                                datepopup={!smallScreen}
                            />
                        )}

                        {showMonthInput && (
                            <FormikInput
                                label="Month"
                                name="start_month"
                                type="month"
                                placeholder="Select a Month"
                                className="form-input text-white-dark"
                                formik={formik}
                                datepopup={!smallScreen}
                            />
                        )}
                    </div>
                </div>
                <div className={`btn-group mt-4 w-full ${fullWidthButton ? 'w-full' : ''}`}>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary  w-full">
                        Apply
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CustomInput;
