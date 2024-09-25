import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoaderImg from '../../utils/Loader';
import withApiHandler from '../../utils/withApiHandler';
import 'tippy.js/dist/tippy.css';
import ErrorHandler from '../../hooks/useHandleError';
import FormikSelect from '../FormikFormTools/FormikSelect';
import FormikInput from '../FormikFormTools/FormikInput';
import { useFormik } from 'formik';
import { ReportsTankInitialValues } from '../FormikFormTools/InitialValues';
import { Col } from 'react-bootstrap';
import * as Yup from 'yup';
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





interface ManageSiteProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    // onSubmit: (values: any, formik: any) => Promise<void>;
}


const ManageReports: React.FC<ManageSiteProps> = ({ postData, getData, isLoading }) => {

    const dispatch = useDispatch();
    const handleApiError = ErrorHandler();
    const [userId, setUserId] = useState<string | null>(null); // Assuming userId is a string

    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const [toggle, setToggle] = useState(false);
    const [pdfisLoading, setpdfisLoading] = useState(false);

    useEffect(() => {


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


 



    const handleFormSubmit = async (values: any) => {
        setpdfisLoading(true)
        const selectedReport:any = formik.values.reports.find((report: any) => report.report_code == values?.report_code);

   
        
        
        try {
            // Construct common parameters
            const commonParams = toggle
                ? `/report/${values?.report_code}?station_id=${values?.station_id}&from_date=${values?.from_date}&to_date=${values?.to_date}`
                : `/report/${values?.report_code}?station_id=${values?.station_id}&month=${values?.month}`;
            const token = localStorage.getItem("token"); // Get the token from storage
            const apiUrl = `${import.meta.env.VITE_API_URL + commonParams}`;

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`, // Attach token in headers
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const contentType = response.headers.get('Content-Type');
            let fileExtension = 'xlsxs'; // Default to xlsx
            let fileName = 'SlrrReportdd'; // Default file name

            if (contentType) {
                if (contentType.includes('application/pdf')) {
                    fileExtension = 'pdf';
                } else if (contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                    fileExtension = 'xlsx';
                } else if (contentType.includes('text/csv')) {
                    fileExtension = 'csv';
                } else {
                    console.warn('Unsupported file type:', contentType);
                }
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));

            // Create a link and trigger a download
            const link = document.createElement('a');
            link.href = url;
      

        
            
            link.setAttribute('download', `${selectedReport?.report_name}.${fileExtension}`);
            document.body.appendChild(link);
            link.click();

            // Cleanup
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }

        } catch (error) {
            console.error('Error downloading the file:', error);
            handleApiError(error); // Handle any errors that occur
        } finally {
            setpdfisLoading(false)
        }
    };


    
    const ReportsValidationSchema = (toggle: boolean) => {
        return Yup.object().shape({
            client_id: Yup.string()
                .required('Client is required'),

            entity_id: Yup.string()
                .required('Entity is required'),

            station_id: Yup.string()
                .required('Station is required'),

            report_code: Yup.string()
                .required('Report is required'),

            // Conditional validation based on toggle
            to_date: Yup.string().when('toggle', {
                is: true,
                then: Yup.string().required('To Date is required'),
                otherwise: Yup.string().notRequired(),
            }),

            from_date: Yup.string().when('toggle', {
                is: true,
                then: Yup.string().required('From Date is required'),
                otherwise: Yup.string().notRequired(),
            }),

            month: Yup.string().when('toggle', {
                is: false,
                then: Yup.string().required('Month is required'),
                otherwise: Yup.string().notRequired(),
            }),
        });
    };
    const formik = useFormik({
        initialValues: ReportsTankInitialValues,
        validationSchema: ReportsValidationSchema(toggle),
        onSubmit: async (values, { resetForm }) => {
            handleFormSubmit(values);


        },
    });

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

            // http://192.168.1.112:4013/pro/v1/station/reportlist?station_id=OUNrS016Ym93czZsVzlMOHNkSE9hZz09


            const response = await getData(`station/reportlist?station_id=${id}`);

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


  

    return (
        <>
            {isLoading || pdfisLoading && <LoaderImg />}
            <div className="flex justify-between items-center">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/dashboard" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Reports</span>
                    </li>
                </ul>


            </div>

            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col  gap-5">
                    <h5 className="font-bold text-lg dark:text-white-light"> Reports</h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        {/* <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} /> */}

                    </div>
                </div>
                <form onSubmit={formik.handleSubmit}
                //  className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black"
                >

                    <div className=' flex items-end text-end'>
                        <Col lg={12} md={12}>
                            <div className="mt-2 sm:grid-cols-1 flexcenter ">
                                <span className="font-bold mr-2">
                                    Month
                                </span>
                                <label style={{ cursor: "pointer" }} className="w-12 h-6 relative ">
                                    <input
                                        type="checkbox"
                                        className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                        checked={formik.values.toggle}
                                        onChange={() => {
                                            setToggle(!toggle); // Update local state
                                            formik.setFieldValue('toggle', !formik.values.toggle); // Update Formik state
                                        }}
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
                                <span className="font-bold ms-2">
                                    Date
                                </span>
                            </div>
                        </Col>
                    </div>


                    <div className="">
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
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

                            <FormikSelect
                                formik={formik}
                                name="station_id"
                                label="Station"
                                options={formik.values.sites?.map((item) => ({ id: item.id, name: item.name }))}
                                className="form-select text-white-dark"
                                onChange={handleSiteChange}
                            />

                      
                            <FormikSelect
                                formik={formik}
                                name="report_code"
                                label="Report"
                                options={formik.values?.reports?.map((item: any) => ({ id: item.report_code, name: item.report_name }))}
                                className="form-select text-white-dark"
                            
                         
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
                                        label="Month"
                                        options={formik.values?.months?.map((item: any) => ({ id: item.value, name: item.full_display }))}
                                        className="form-select text-white-dark"
                                    // onChange={handleSiteChange}
                                    />

                                </>

                            }









                            {/* <FormikSelect
                                formik={formik}
                                name="status"
                                label="Tank Status"
                                options={activeInactiveOption.map((item) => ({ id: item.id, name: item.name }))}
                                className="form-select text-white-dark"
                                isRequired={true}
                            /> */}


                        </div>
                    </div>
                    <div className="sm:col-span-2 mt-3 flex">
                        <button type="submit" className="btn btn-primary">
                            Get Report
                        </button>
                        {/* {ReportUrl ? (
                            <button
                                type="button"
                                onClick={handleClick}
                                className="btn btn-success ms-2"
                            >
                                Download Report
                            </button>
                        ) : null} */}

                    </div>
                </form>

            </div>
        </>
    );
};

export default withApiHandler(ManageReports);