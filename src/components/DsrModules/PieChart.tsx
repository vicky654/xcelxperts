import React, { useEffect } from "react";
import ApexCharts from "apexcharts";

interface PieChartProps {
  data: {
    labels: string[];
    data: string[];
  };
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {

  useEffect(() => {
    const options: ApexCharts.ApexOptions = {
      series: data?.data?.map(Number), // Convert string array to number array
      chart: {
        width: 500,
        type: 'pie',
      },
      labels: data?.labels,
      colors: ['#4361ee', '#805dca', '#00ab55', '#e7515a', '#e2a03f'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 500,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

    // Cleanup chart on component unmount
    return () => {
      chart.destroy();
    };
  }, [data]);

  return <div id="chart"></div>;
};

export default PieChart;
