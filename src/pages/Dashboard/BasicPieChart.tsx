import React, { useRef, useEffect, useState } from "react";
import ApexCharts from "apexcharts";

interface PieChartProps {
  data: {
    labels: string[];
    colors: string[];
    series: string[];
  };
}

const BasicPieChart: React.FC<PieChartProps> = ({ data }) => {
  const pieChartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<ApexCharts | null>(null);

  // Convert series data to numbers
  const seriesData = data?.series.map((value) => parseFloat(value));

  const getPieChartOptions = () => ({
    series: seriesData,
    chart: {
      height: 350,
      type: "pie",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    labels: data?.labels,
    colors: data?.colors,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 400,
          },
        },
      },
    ],
    stroke: {
      show: false,
    },
    legend: {
      position: "bottom",
    },
    theme: {
      mode: "light",
    },
  });

  useEffect(() => {
    if (pieChartRef.current) {
      const chart = new ApexCharts(pieChartRef.current, getPieChartOptions());
      chart.render();
      setChartInstance(chart);
    }

    return () => {
      chartInstance?.destroy();
    };
  }, []);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.updateOptions(getPieChartOptions());
    }
  }, [data]);

  return (
    <div ref={pieChartRef} className={`bg-white dark:bg-black rounded-lg`}></div>
  );
};

export default BasicPieChart;
