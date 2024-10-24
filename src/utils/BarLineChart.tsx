import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface SeriesData {
  name: string;
  type: 'line' | 'bar'; 
  data: number[];
}

const BarLineChart: React.FC<{ ChartData: any }> = ({ ChartData }) => {
  if (!ChartData || !ChartData?.graphData || !ChartData?.graphData.series) {
    return <div>Loading chart data...</div>; // Show loading state until data is available
  }

  const series: SeriesData[] = Object.keys(ChartData.graphData?.series).map((key) => {
    const seriesItem = ChartData.graphData.series[key];
    return {
      name: seriesItem.name,
      type: seriesItem.type, // 'line' or 'bar'
      data: seriesItem.data.map(Number), // Convert string data to numbers
    };
  });

  const chartOptions: ApexOptions = {

    stroke: {
      curve: 'smooth', // Smooth curve for the line
      width: [0, 4], // Adjust the line width for the line series
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
      },
    },
    colors: ChartData.graphData.colors, // Set custom colors
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
    },
    xaxis: {
      categories: ChartData.graphData.labels || [], // Set the x-axis labels
    },
    yaxis: [
      {
        title: {
          text: '', // Adjust Y-axis title
        },
      },
    ],
    legend: {
      position: 'bottom',
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  return (
    <div className='panel h-full mt-4' style={{ border: "1px solid #ddd" }}>
      <h5 className="font-bold text-lg dark:text-white-light">Payable Salary Stats Chart</h5>
      <hr className='my-3'></hr>
      <ReactApexChart
        options={chartOptions}
        series={series}
 
      />
    </div>
  );
};

export default BarLineChart;
