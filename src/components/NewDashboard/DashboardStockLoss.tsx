import React, { useEffect, useState } from 'react';
import AddModalHeader from '../SideBarComponents/CrudModal/AddModalHeader';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import useErrorHandler from '../../hooks/useHandleError';
import { useFormik } from 'formik';
import { Col } from 'react-bootstrap';
import DynamicTable from './DynamicTable';
import noDataImage from '../../assets/AuthImages/noDataFound.png'; // Import the image
import SmallLoader from '../../utils/SmallLoader';
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
    const [RoleList, setRoleList] = useState<RoleItem[]>([]);
    const [dashboardLoading, setDashboardLoading] = useState<boolean>(false);
    let storedKeyName = "stationTank";
    const storedData = localStorage.getItem(storedKeyName);
    const reduxData = useSelector((state: IRootState) => state?.data?.data);
    const dispatch = useDispatch();
    const [fuelData, setFuelData] = useState<FuelStocks | null>(null);

    const handleApiError = useErrorHandler();


    const fetchCompanyList = async (clientId: string) => {
        try {
            const response = await getData(`getEntities?client_id=${clientId}`);
            const storedClientIdData = localStorage.getItem("superiorId");
            const futurepriceLog = {
                client_id: storedClientIdData,
                client_name: reduxData?.full_name,
                "companies": response.data.data,
            };



            localStorage.setItem(storedKeyName, JSON.stringify(futurepriceLog));
        } catch (error) {
            handleApiError(error);
        }
    };


    // useEffect(() => {
    //     if (storedData && reduxData?.role) {
    //         GetDashboardStats(JSON.parse(storedData));
    //     } else if (localStorage.getItem("superiorRole") === "Client" && reduxData?.role) {
    //         const storedClientIdData = localStorage.getItem("superiorId");
    //         if (storedClientIdData) {
    //             fetchCompanyList(storedClientIdData)

    //         }
    //     }
    // }, [dispatch, storedKeyName, reduxData,]); // Add any other dependencies needed here

    useEffect(() => {
        if (isOpen) {
            const storedData = localStorage.getItem(storedKeyName);

            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                } catch (error) {
                    console.error("Error parsing storedData:", error);
                }
            } else {
                console.log("No stored data found for key:", storedKeyName);
            }
        }
    }, [isOpen, userId,]); // Dependency array to run when isOpen or userId changes



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
                    const data = await response.data;
                    console.log(response?.data?.data, "response.data.data");
                    setFuelData(response.data.data.fuel_stocks);
                }
            } catch (error) {
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
    }, [formik?.values?.station_id])





    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>

                <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
                    <div className="relative w-screen max-w-md">
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
                                    <h2 className='font-bold text-lg mb-4'> Stock Loss</h2>

                                    {dashboardLoading && <LoaderImg />}
                                    {fuelData ? (
                                        <DynamicTable data={fuelData} />
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
