import React, { useEffect, useState } from 'react';
import AddModalHeader from '../SideBarComponents/CrudModal/AddModalHeader';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import useErrorHandler from '../../hooks/useHandleError';







interface RoleItem {
    id: number;
    role_name: string;
}

const DashboardStockLoss: React.FC<any> = ({ isOpen, onClose, getData, userId }) => {
    const [RoleList, setRoleList] = useState<RoleItem[]>([]);
    const [dashboardLoading, setDashboardLoading] = useState<boolean>(false);
    let storedKeyName = "stationTank";
    const storedData = localStorage.getItem(storedKeyName);
    const reduxData = useSelector((state: IRootState) => state?.data?.data);
    const dispatch = useDispatch();
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
    useEffect(() => {

        if (storedData && reduxData?.role) {
            GetDashboardStats(JSON.parse(storedData));
        } else if (localStorage.getItem("superiorRole") === "Client" && reduxData?.role) {
            const storedClientIdData = localStorage.getItem("superiorId");
            if (storedClientIdData) {
                fetchCompanyList(storedClientIdData)

            }
        }

    }, [dispatch, storedKeyName, reduxData,]); // Add any other dependencies needed here

    useEffect(() => {
        if (isOpen) {
            const storedData = localStorage.getItem(storedKeyName);

            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    const { client_id, entity_id, station_id } = parsedData;
                    GetDashboardStats(parsedData)
                    console.log(client_id, entity_id, station_id, "storedData");
                } catch (error) {
                    console.error("Error parsing storedData:", error);
                }
            } else {
                console.log("No stored data found for key:", storedKeyName);
            }
        }
    }, [isOpen, userId]); // Dependency array to run when isOpen or userId changes



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
                if (response && response.data && response.data.data) {

                }
            } catch (error) {
                console.error("Error fetching dashboard stats", error);
            } finally {
                setDashboardLoading(false); // Stop loading after fetching
            }
        }
    };



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
