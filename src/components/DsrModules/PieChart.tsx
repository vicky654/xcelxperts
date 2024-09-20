import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

interface PieChartProps {
  data: {
    labels: string[];
    data: string[];
  };
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null); // Ref for the chart container

  useEffect(() => {
    // Check if the data is valid before proceeding
    if (!data || !Array.isArray(data.labels) || !Array.isArray(data.data)) {
      console.error("Invalid data for PieChart", data);
      return;
    }

    if (!chartRef.current) return; // Ensure the ref is assigned

    const options: ApexCharts.ApexOptions = {
      series: data.data.map(Number), // Convert string array to number array
      chart: {
        width: 400,
        type: 'pie',
      },
      labels: data.labels,
      colors: ['#4361ee', '#805dca', '#00ab55', '#e7515a', '#e2a03f'],
      legend: {
        position: 'bottom',
      },
      responsive: [
        {
          breakpoint: 780,
          options: {
            chart: {
              width: 350,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    // Cleanup chart on component unmount
    return () => {
      chart.destroy();
    };
  }, [data]);

  // Fallback if data is missing or invalid
  if (!data || !Array.isArray(data.labels) || !Array.isArray(data.data)) {
    return <div>No data available to render the chart.</div>;
  }

  return <div ref={chartRef}></div>; // Attach the ref to the chart div
};

export default PieChart;
