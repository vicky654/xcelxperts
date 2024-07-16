import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoaderImg from '../../utils/Loader';
import withApiHandler from '../../utils/withApiHandler';
import useToggleStatus from '../../utils/ToggleStatus';
import useCustomDelete from '../../utils/customDelete';
import 'tippy.js/dist/tippy.css';
import ErrorHandler from '../../hooks/useHandleError';
import FormikSelect from '../FormikFormTools/FormikSelect';
import FormikInput from '../FormikFormTools/FormikInput';
import { useFormik } from 'formik';
import { ReportsTankInitialValues } from '../FormikFormTools/InitialValues';
import { Col } from 'react-bootstrap';
import { MultiSelect } from 'react-multi-select-component';

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
    name: string;
}
interface Station {
    id: string;
    name: string;
}



interface ManageSiteProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    // onSubmit: (values: any, formik: any) => Promise<void>;
}

interface RowData {
    id: string; // Change type from number to string
    full_name: string;
    role: string;
    addons: string;
    created_date: string;
    status: number;
    station_status: number;
    station_name: string;
    station_code: string;
    station_address: string;
}

const ManageReports: React.FC<ManageSiteProps> = ({ postData, getData, isLoading }) => {
    const [data, setData] = useState<RowData[]>([]);
    const dispatch = useDispatch();
    const handleApiError = ErrorHandler();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserData, setEditUserData] = useState<Partial<RowData> | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // Assuming userId is a string
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const navigate = useNavigate();
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        fetchData();
        // FetchClientList()

        if (localStorage.getItem("superiorRole") === "Client") {
            const clientId = localStorage.getItem("superiorId");
            if (clientId) {
                // formik.setFieldValue("client_id", clientId)
                // Simulate the change event to call handleClientChange
                handleClientChange({ target: { value: clientId } } as React.ChangeEvent<HTMLSelectElement>);
                // fetchUserDetails(userId, clientId);
            }
        } else {
            FetchClientList();
        }


    }, [dispatch, currentPage]);
    const handleSuccess = () => {
        fetchData();
    };

    const handlePageChange = (newPage: any) => {
        setCurrentPage(newPage);
    };

    const fetchData = async () => {
        try {
            const response = await getData(`/station/list?page=${currentPage}`);
            if (response && response.data && response.data.data) {
                setData(response.data.data?.Reports);
                setCurrentPage(response.data.data?.currentPage || 1);
                setLastPage(response.data.data?.lastPage || 1);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
            //   handleApiError(error);
        }
    };
    const { toggleStatus } = useToggleStatus();

    const { customDelete } = useCustomDelete();

    const handleDelete = (id: any) => {
        const formData = new FormData();
        formData.append('id', id);
        customDelete(postData, 'station/delete', formData, handleSuccess);
    };

    const isEditPermissionAvailable = true; // Placeholder for permission check
    const isDeletePermissionAvailable = true; // Placeholder for permission check
    const isAddonPermissionAvailable = true; // Placeholder for permission check

    const anyPermissionAvailable = isEditPermissionAvailable || isAddonPermissionAvailable || isDeletePermissionAvailable;


    // station/detail?id=${selectedRowId}
    const openModal = async (id: string) => {
        try {
            setIsModalOpen(true);
            setIsEditMode(true);
            setUserId(id);
            // const response = await getData(`/station/detail?id=${id}`)`);
            // const response = await getData(`/station/detail?id=${id}`);
            // if (response && response.data) {
            //     setUserId(id)
            //     setEditUserData(response.data);
            // }
        } catch (error) {
            handleApiError(error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditUserData(null);
    };

    const handleFormSubmit = async (values: any) => {
        try {
            const formData = new FormData();

            formData.append('client_id', values.client_id);
            formData.append('entity_id', values.entity_id);
            formData.append('data_import_type_id', values.data_import_type_id);
            formData.append('security_amount', values.security_amount);
            formData.append('start_date', values.start_date);
            formData.append('station_address', values.station_address);
            formData.append('station_code', values.station_code);
            formData.append('station_display_name', values.station_display_name);
            formData.append('station_name', values.station_name);
            formData.append('station_status', values.station_status);
            formData.append('supplier_id', values.supplier_id);
            if (userId) {
                formData.append('id', userId);
            }

            const url = isEditMode && userId ? `/station/update` : `/station/create`;
            const isSuccess = await postData(url, formData);
            if (isSuccess) {
                handleSuccess();
                closeModal();
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const formik = useFormik({
        initialValues: ReportsTankInitialValues,
        // validationSchema: getStationTankValidationSchema(isEditMode),
        onSubmit: async (values, { resetForm }) => {
            try {
                // const formData = new FormData();

                // formData.append("report", values.report_code);

                // formData.append("report", values.report_code);
                // if (localStorage.getItem("superiorRole") !== "Client") {
                //     formData.append("client_id", values.client_id);
                // } else {
                //     formData.append("client_id", localStorage.getItem("superiorId"));
                // }
                // formData.append("entity_id", values.entity_id);
                // formData.append("from_date", values.from_date);
                // formData.append("to_date", values.to_date);

                let clientIDCondition = "";
                if (localStorage.getItem("superiorRole") !== "Client") {
                    clientIDCondition = `client_id=${values.client_id}&`;
                } else {
                    clientIDCondition = `client_id=${localStorage.getItem("superiorId")}&`;
                }
                if (
                    selected === undefined ||
                    selected === null ||
                    (Array.isArray(selected) && selected.length === 0)
                ) {
                    // ErrorToast("Please select at least one site");
                }

                // Assuming you have an array of selected values in the 'selected' state
                // const selectedSiteIds = selected?.map((site) => site.value);
                // const selectedSiteIdParams = selectedSiteIds
                //     .map((id) => `station_id[]=${id}`)
                //     .join("&");

                // Now 'selectedSiteIdParams' contains the query parameter string for selected site IDs



                // const commonParams = values.toggle
                //     ? `/report/${values.report_code}?${clientIDCondition}entity_id=${values.entity_id}&${selectedSiteIdParams}&from_date=${values.from_date}&to_date=${values.to_date}`
                //     : `/report/${values.report_code}?${clientIDCondition}entity_id=${values.entity_id}&${selectedSiteIdParams}&month=${values.month}`;


            } catch (error) {
                handleApiError(error);
                // Set the submission state to false if an error occurs
            }
        },
    });

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

    const FetchReportList = async (id: string) => {
        try {
            const response = await getData(`client/reportlist?client_id=${id}`);

            const { data } = response;
            if (data) {


                formik.setFieldValue('months', response?.data?.data?.months);
                formik.setFieldValue('reports', response?.data?.data?.reports);

                // setReportList(response?.data);
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
            handleApiError(error);
        }
    };

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const clientId = e.target.value;
        formik.setFieldValue('client_id', clientId);
        if (clientId) {
            fetchEntityList(clientId);
            FetchReportList(clientId)
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

    // const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const companyId = e.target.value;
    //     formik.setFieldValue('entity_id', companyId);
    //     if (companyId) {
    //         fetchSiteList(companyId);
    //         const selectedCompany = formik.values.companies.find((company: Company) => company.id === companyId);
    //         formik.setFieldValue('company_name', selectedCompany?.company_name || "");
    //         formik.setFieldValue('sites', []);
    //     } else {
    //         formik.setFieldValue('company_name', "");
    //         formik.setFieldValue('sites', []);
    //         formik.setFieldValue('station_id', "");
    //         formik.setFieldValue('site_name', "");
    //     }
    // };


    const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSiteId = e.target.value;
        formik.setFieldValue("station_id", selectedSiteId);
        formik.setFieldValue('tankList', "");
        const selectedSiteData = formik.values.sites.find((site) => site.id === selectedSiteId);

        if (selectedSiteData) {
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





    return (
        <>
            {isLoading && <LoaderImg />}
            <div className="flex justify-between items-center">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Reports</span>
                    </li>
                </ul>


            </div>

            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light"> Reports</h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        {/* <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} /> */}

                    </div>
                </div>
                <form onSubmit={formik.handleSubmit}
                //  className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black"
                >
                    <div className="">
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                            {localStorage.getItem("superiorRole") !== "Client" &&
                                <FormikSelect
                                    formik={formik}
                                    name="client_id"
                                    label="Client"
                                    options={formik.values?.clients?.map((item) => ({ id: item.id, name: item.full_name }))}
                                    className="form-select text-white-dark"
                                    onChange={handleClientChange}
                                />}

                            <FormikSelect
                                formik={formik}
                                name="entity_id"
                                label="Entity"
                                options={formik.values.entities?.map((item) => ({ id: item.id, name: item.entity_name }))}
                                className="form-select text-white-dark"
                                onChange={handleEntityChange}
                            />
                            <Col lg={4} sm={12} md={6}>
                                <label className="form-label ">
                                    Select Stations
                                    <span className="text-danger">*</span>
                                </label>
                                <MultiSelect
                                    value={selected}
                                    onChange={setSelected}
                                    labelledBy="Select Stations"
                                    options={formik.values.sites?.map((item) => ({ value: item.id, label: item?.name }))}

                                /></Col>
                            <FormikSelect
                                formik={formik}
                                name="report_code"
                                label="Report"
                                options={formik.values?.reports?.map((item: any) => ({ id: item.report_code, name: item.report_name }))}
                                className="form-select text-white-dark"

                            // onChange={handleSiteChange}
                            />


                            {formik.values.toggle ?
                                <>

                                    <FormikInput formik={formik} type="date" name="from_date" label="From Date" />

                                    <FormikInput formik={formik} type="date" name="to_date" label="To Date" />
                                </>
                                : <>

                                    <FormikSelect
                                        formik={formik}
                                        name="month"
                                        label="Months"
                                        options={formik.values?.months?.map((item: any) => ({ id: item.value, name: item.full_display }))}
                                        className="form-select text-white-dark"
                                    // onChange={handleSiteChange}
                                    />

                                </>

                            }


                            <div className=' flex items-end'>
                                <Col lg={12} md={12}>
                                    <div className="mt-2 sm:grid-cols-1 ">
                                        <label className="w-12 h-6 relative">
                                            <input
                                                type="checkbox"
                                                className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                checked={formik.values.toggle}
                                                onChange={() => formik.setFieldValue('toggle', !formik.values.toggle)}
                                            />
                                            <span className={`outline_checkbox block h-full rounded-full transition-all duration-300 ${formik.values.toggle ? 'bg-primary border-primary' : 'bg-[#9ca3af] border-[#9ca3af]'}`}>
                                                <span className={`absolute bottom-1 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${formik.values.toggle ? 'bg-white left-7' : 'bg-white left-1'}`}>
                                                    {formik.values.toggle ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8f95a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check">
                                                            <path d="M20 6L9 17l-5-5" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                                                            <path d="M18 6L6 18M6 6l12 12" />
                                                        </svg>
                                                    )}
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                </Col>
                            </div>






                            {/* <FormikSelect
                                formik={formik}
                                name="status"
                                label="Tank Status"
                                options={activeInactiveOption.map((item) => ({ id: item.id, name: item.name }))}
                                className="form-select text-white-dark"
                                isRequired={true}
                            /> */}

                            <div className="sm:col-span-2 mt-3">
                                <button type="submit" className="btn btn-primary">
                                    {isEditMode ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
        </>
    );
};

export default withApiHandler(ManageReports);