import React, { useEffect, useState } from 'react';
import AddModalHeader from '../SideBarComponents/CrudModal/AddModalHeader';
import useErrorHandler from '../../hooks/useHandleError';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { currency } from '../../utils/CommonData';

interface AddonsModalProps {
    isOpen: boolean;
    onClose: () => void;
    getData: (url: string) => Promise<any>;
    stationId: string | null;
    startDate: string | null;
}

const staticTabs = [
    'Varience-accumulation',
    'Fuel Sales',
    'Charges',
    'Deductions',
    'Payments',
    'Credit Sales',



];
const tabKeyMap: { [key: string]: string } = {
    'Varience-accumulation': 'varience-accumulation',
    'Fuel Sales': 'fuel-sales',
    'Charges': 'charges',
    'Deductions': 'deductions',
    'Payments': 'payments',
    'Credit Sales': 'credit-sales',


};
interface TabData {
    labels: string[];
    data: string[];
    total: string;
    listing: { id: string; date: string; amount: string; variance: string; balance: string }[];
}
const DataEntryStats: React.FC<AddonsModalProps> = ({ isOpen, onClose, getData, stationId, startDate }) => {
    const [selectedTab, setSelectedTab] = useState<string>('Varience-accumulation');
    const [labels, setLabels] = useState<string[]>([]);
    const [data, setData] = useState<string[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [deductions, setDeductions] = useState<string[]>([]);
    const [tabData, setTabData] = useState<TabData>({
        labels: [],
        data: [],
        total: '0.00',
        listing: []
    });
    const handleApiError = useErrorHandler();
 console.log(isOpen, "isOpen");

useEffect(()=>{
if(isOpen){

    handleTabClick('Varience-accumulation')
}

},[isOpen])

    const handleTabClick = async (tabName: string) => {
        try {
            const key = tabKeyMap[tabName];
            const response = await getData(`/stats/${key}?station_id=${stationId}&drs_date=${startDate}`);
            if (response && response.data) {
                setSelectedTab(tabName);
                setTabData(response.data?.data);
                console.log(response.data?.data?.labels, "columnIndex");
                setLabels(Array.isArray(response.data?.data?.labels) ? response.data?.data?.labels : []);
                setData(Array.isArray(response.data?.data) ? response.data?.data : []);
                setTotal(typeof response.data?.data?.total === 'number' ? response.data?.data?.total : 0);
                setDeductions(Array.isArray(response.data?.data?.deductions) ? response.data?.data?.deductions : []);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {

            handleApiError(error);
        }
    };


    const salesByCategory = tabData;
    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>
                <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 w-full">
                                <AddModalHeader title="Data Entry Stats" onClose={onClose} />
                                <div className="relative py-6 px-4 bg-white">
                                    <ul className="flex flex-wrap font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 overflow-y-auto">
                                        {staticTabs.map((tabName) => (
                                            <li key={tabName} className="w-1/8 inline-block" style={{ minWidth: "100px" }}>
                                                <button
                                                    onClick={() => handleTabClick(tabName)}
                                                    className={`flex gap-2 border-b border-transparent hover:border-primary hover:text-primary ${selectedTab === tabName ? 'border-primary c-border-primary' : ''}`}
                                                    style={{ color: 'currentColor' }}
                                                >
                                                    <i className={`fi fi-rr-${tabName.toLowerCase().replace(/\s/g, '-')}`}></i>
                                                    {tabName}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    {/* <h2 className="text-lg font-semibold">{selectedTab}</h2> */}
                                    <div className="p-2" style={{padding:"10px"}}>
                                        <h2 className="text-lg font-semibold">{selectedTab}</h2>
                                        <div className="">
                                            {selectedTab !== 'Varience-accumulation' && (
                                                <ul className="divide-y divide-gray-200">
                                                    <li className="flex justify-between p-2 bg-gray-200">
                                                        <p className="font-semibold">Date</p>
                                                        <p className="font-semibold">Amount</p>
                                                    </li>
                                                    {tabData?.listing.map((item, index) => (
                                                        <li key={index} className="flex justify-between py-2 hover:bg-gray-100">
                                                            <p className="font-semibold">{item?.date}</p>
                                                            <p>{currency} {item?.amount} </p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {selectedTab === 'Varience-accumulation' && (
                                                <ul className="divide-y divide-gray-200">
                                                    <li className="flex justify-between py-2 bg-gray-200">
                                                        <p className="font-semibold">Date</p>
                                                        <p className="font-semibold">Variance</p>
                                                        <p className="font-semibold">Balance</p>
                                                    </li>
                                                    {tabData?.listing.map((item, index) => (
                                                        <li key={item?.id} className="flex justify-between py-2 hover:bg-gray-100">
                                                            <p>{item?.date}</p>
                                                            <p>{item?.variance}</p>
                                                            <p>{item?.balance}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>



                                        {selectedTab !== 'Varience-accumulation' && (
                                            <div className="panel h-full mt-4">
                                                <div className="flex items-center mb-5">
                                                    <h5 className="font-semibold text-lg dark:text-white-light"> {selectedTab} Graph Stats</h5>
                                                </div>
                                                <div>
                                                    <ReactApexChart
                                                        series={salesByCategory?.data?.map(amount => parseFloat(amount))}
                                                        options={{
                                                            chart: {
                                                                type: 'donut',
                                                                height: 400,
                                                            },
                                                            labels: salesByCategory?.labels,
                                                            legend: {
                                                                position: 'bottom',
                                                                horizontalAlign: 'center',
                                                                fontSize: '14px',
                                                                markers: {
                                                                    width: 10,
                                                                    height: 10,
                                                                    offsetX: -2,
                                                                },
                                                                height: 50,
                                                                offsetY: 20,
                                                            },
                                                            dataLabels: {
                                                                enabled: false,
                                                            },
                                                        }}
                                                        type="donut"
                                                        height={460}
                                                    />

                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DataEntryStats;
