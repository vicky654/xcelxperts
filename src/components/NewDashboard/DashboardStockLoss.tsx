import React, { useEffect, useState } from 'react';
import AddModalHeader from '../SideBarComponents/CrudModal/AddModalHeader';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import useErrorHandler from '../../hooks/useHandleError';
import { useFormik } from 'formik';
import { Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DynamicTable from './DynamicTable';
import noDataImage from '../../assets/AuthImages/noDataFound.png'; // Import the image
import LoaderImg from '../../utils/Loader';
import { handleDownloadPdf } from '../CommonFunctions';

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
    station_name: string;
}





interface RoleItem {
    id: number;
    role_name: string;
}
interface FuelStocks {
    labels: string[];
    opening: string[];
    delivery: string[];
    stock: string[];
    closing: string[];
    dip_sales: string[];
    sales: string[];
    profit: string[];
    permissible: string[];
    loss: string[];
    stock_loss: string[];
    rate: string[];
    amount: string[];
}
const DashboardStockLoss: React.FC<any> = ({ isOpen, onClose, getData, userId }) => {

    const [filters, setFilters] = useState<any>();
    const [dashboardLoading, setDashboardLoading] = useState<boolean>(false);
    let storedKeyName = "stationTank";

    const [fuelData, setFuelData] = useState<FuelStocks | null>(null);
    const [TableData, setTableData] = useState<any | undefined>(undefined);
    const [pdfisLoading, setpdfisLoading] = useState(false);
    const handleApiError = useErrorHandler();







    useEffect(() => {
        if (isOpen) {

            const storedData = localStorage.getItem(storedKeyName);
            if (storedData) {
                let parsedData = JSON.parse(storedData);
                formik.setValues(parsedData)
                setFilters(parsedData)
                // handleApplyFilters(parsedData);
            }
        }
    }, [isOpen])


    useEffect(() => {
        if (isOpen) {
            if (filters?.station_id && filters?.client_id && filters.company_id) {
                // GetDashboardStats(filters); //Call the api 
                setFilters(filters)
            }
        }
    }, [filters?.station_id]);



    const GetDashboardStats = async (filters: any) => {
        const { client_id, entity_id, station_id } = filters;
        if (client_id) {
            try {
                setDashboardLoading(true);  // Start loading for dashboard
                const queryParams = new URLSearchParams();
                if (client_id) queryParams.append('client_id', client_id);
                if (entity_id) queryParams.append('entity_id', entity_id);
                if (station_id) queryParams.append('station_id', station_id);

                const queryString = queryParams.toString();
                const response = await getData(`dashboard/stock-loss?${queryString}`);
                if (response && response.data) {
                    formik.setFieldValue("drsDate", response.data.data.drsDate)
                    formik.setFieldValue("month", response.data.data.month)
                    setTableData(response?.data?.data)
                    setFuelData(response.data.data.fuel_stocks);
                }
            } catch (error) {
                setTableData(null)
                setFuelData(null);
                console.error("Error fetching dashboard stats", error);
            } finally {
                setDashboardLoading(false); // Stop loading after fetching
            }
        }
    };


    const formik = useFormik({
        initialValues: {
            client_id: "",
            client_name: "",
            company_id: "",
            company_name: "",
            start_month: "",
            station_id: "",
            drsDate: "",
            month: "",
            station_name: "",
            clients: [] as Client[],
            companies: [] as Company[],
            sites: [] as Site[],
        },
        onSubmit: (values) => {

        },
    });

    const handleSiteChange = (e: any) => {
        const selectedSiteId = e.target.value;
        formik.setFieldValue("station_id", selectedSiteId);
        const selectedSiteData = formik?.values?.sites?.find(site => site?.id === selectedSiteId);
        formik.setFieldValue('station_name', selectedSiteData?.name || "");

    };





    useEffect(() => {
        if (isOpen) {
            setFilters(formik?.values)
            if (formik?.values?.station_id) {
                GetDashboardStats(formik?.values)
            } else {
                setFuelData(null)
            }
        }
    }, [formik?.values?.station_id, isOpen])
    useEffect(() => {
        if (formik?.values?.station_id === '' || formik?.values?.station_id === undefined) {
            setFuelData(null);
        }
    }, [isOpen]);
    
    const Permissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);

    const isReportGeneratePermissionAvailable = Permissions?.includes('report-generate');




    const DownloadExcelFile = async () => {
        setpdfisLoading(true)
        try {
            // Construct common parameters
            const commonParams = `/report/slrr?station_id=${formik?.values?.station_id}&month=${formik.values?.month}`;
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
            const contentDisposition = response.headers.get('Content-Disposition');
            if (contentDisposition && contentDisposition.includes('filename=')) {
                const matches = /filename="?([^";]+)"?/.exec(contentDisposition);
                // Check if matches is not null and has at least one capturing group
                if (matches && matches[1]) {
                    fileName = matches[1];
                }
            }


            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));

            // Create a link and trigger a download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `SlrrReport.${fileExtension}`); // Set filename dynamically based on file type


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







    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>

                <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
                    <div className="relative w-screen  max-w-xl">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 w-full">
                                <AddModalHeader title="Stock Loss" onClose={onClose} />
                                <div className="relative py-6 px-4 bg-white">

                                    {formik?.values?.sites?.length > 0 && (<>
                                        <Col lg={12}>
                                            <div className={`form-group`}>
                                                <label htmlFor="station_id" className='mb-2'>
                                                    Station <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    id="station_id"
                                                    name="station_id"
                                                    onChange={(e) => {
                                                        formik.handleChange(e);
                                                        handleSiteChange(e); // If you have additional logic to handle
                                                    }}
                                                    onBlur={formik.handleBlur}
                                                    value={formik?.values?.station_id}
                                                    className="input101 form-input"
                                                >
                                                    <option key={""} value="">Please Select Site</option>
                                                    {formik?.values?.sites?.map((item) => (
                                                        <option key={item.id} value={item.id}>
                                                            {item?.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {formik.touched.station_id && formik.errors.station_id && (
                                                    <div className="text-danger mt-1">{formik.errors.station_id}</div>
                                                )}
                                            </div>
                                        </Col>
                                    </>)}

                                </div>
                                <div className="relative py-0 px-4 bg-white">
                                    <h2 className='font-bold text-lg mb-4 flexspacebetween' > Stock Loss  {TableData?.day_end_date ? ` (${TableData.day_end_date})` : ''}

                                        <div>
                                            {isReportGeneratePermissionAvailable && formik?.values?.station_id && fuelData &&
                                                (<span onClick={DownloadExcelFile}>
                                                    {isReportGeneratePermissionAvailable && (<>
                                                        <OverlayTrigger placement="top" overlay={<Tooltip className="custom-tooltip ModalTooltip" >Download Excel Report</Tooltip>}>
                                                            <i style={{ fontSize: "20px", color: "green", cursor: "pointer" }} className="fi fi-tr-file-excel"></i>
                                                        </OverlayTrigger>
                                                    </>)}

                                                </span>)}
                                            {formik?.values?.station_id && fuelData &&
                                                (<span onClick={() => handleDownloadPdf('stock-bill', formik?.values?.station_id, formik.values?.drsDate, getData, handleApiError)}>
                                                    {formik?.values?.station_id && (<>
                                                        <OverlayTrigger placement="top" overlay={<Tooltip className="custom-tooltip ModalTooltip" >Download PDF Report</Tooltip>}>
                                                            <i style={{ fontSize: "20px", color: "red", cursor: "pointer" }} className="fi fi-tr-file-pdf"></i>
                                                        </OverlayTrigger>
                                                    </>)}

                                                </span>)}

                                        </div>

                                    </h2>

                                    {dashboardLoading && <LoaderImg />}
                                    {(fuelData && (formik?.values?.station_id || filters?.station_id)) ? (
                                        <DynamicTable data={fuelData} TableData={TableData} />
                                    ) : (
                                        <div className="all-center-flex">
                                            <img src={noDataImage} alt="No data found" className="nodata-image" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DashboardStockLoss;
