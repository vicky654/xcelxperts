import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../SideBarComponents/CrudModal/AddModalHeader';
import BasicPieChart from '../../pages/Dashboard/BasicPieChart';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import noDataImage from '../../assets/AuthImages/noDataFound.png';


const EarningModal: React.FC<any> = ({ isOpen, onClose, getData, isEditMode, data }) => {





    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const revenueChart: any = {

        series: data?.line_graph?.series,
        options: {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            // colors: isDark ? ['#2196F3', '#E7515A', '#FF9800'] : ['#1B55E2', '#E7515A', '#FF9800'],
            series: data?.line_graph?.colors,
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: 6,
                        fillColor: '#1B55E2',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: 5,
                        fillColor: '#E7515A',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            labels: data?.line_graph?.labels,
            // labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    // formatter: (value: number) => {
                    //     return value / 1000 + 'K';
                    // },
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191E3A' : '#E0E6ED',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                yaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
        },
    };


    console.log(data, "data");

    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>

                <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 w-full">
                                <AddModalHeader title={isEditMode ? 'Total Earnings' : 'Total Earnings'} onClose={onClose} />

                                {!data ? (
                                    <h1 className='p-6 py-3 bg-danger text-white'>
                                        <i className="ph ph-faders-horizontal text-white"></i>   Please Apply Filters For View Graphs
                                    </h1>
                                ) : ""}


                                <div className="relative py-6 px-4 bg-white">
                                    <div className="grid xl:grid-cols-1  md:grid-cols-1 sm:grid-cols-1 gap-2 mb-6">
                                        <div className="panel h-full xl:col-span-2 ">
                                            <div className="flex items-center justify-between dark:text-white-light mb-5">
                                                <h5 className="font-bold text-lg">Total Earnings</h5>
                                            </div>

                                            <div className="relative">
                                                <div className="bg-white dark:bg-black  overflow-hidden">
                                                    {!data?.line_graph?.series ? (
                                                        <div className="flex justify-center items-center h-full p-4">
                                                            <img
                                                                src={noDataImage} // Use the imported image directly as the source
                                                                alt="No data found"
                                                                className="w-1/2 max-w-xs" // Adjust the width as needed
                                                            />
                                                        </div>
                                                    ) : (
                                                        <ReactApexChart series={data?.line_graph?.series} options={revenueChart?.options} type="area" height={325} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="panel h-full xl:col-span-1 ">
                                            <div className="flex items-center justify-between dark:text-white-light mb-5">
                                                <h5 className="font-bold text-lg dark:text-white-light">Payments Overview</h5>
                                            </div>

                                            <div className="relative">
                                                <div className="bg-white dark:bg-black  overflow-hidden">
                                                    {!data?.pi_graph?.labels ? (
                                                        <div className="flex justify-center items-center h-full p-4">
                                                            <img
                                                                src={noDataImage} // Use the imported image directly as the source
                                                                alt="No data found"
                                                                className="w-full max-w-xs" // Adjust the width as needed
                                                            />
                                                        </div>
                                                    ) : (
                                                        // <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} />

                                                        <BasicPieChart data={data?.pi_graph} />

                                                    )}
                                                </div>
                                            </div>

                                        </div>
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

export default EarningModal;
