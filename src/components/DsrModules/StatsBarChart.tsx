import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ApexData {
  name: string;
  data: number[];
  color?: string;
}

interface BarChartProps {
  series: ApexData[];
  categories: string[];
  height?: number;
  title?: string;
  subtitle?: string;
  yaxisTitle?: string;
}

const StatsBarChart: React.FC<BarChartProps> = ({
  series,
  categories,
  height = 350,
  title,
  subtitle,
  yaxisTitle = 'Value',
}) => {

console.log(series, "series");
console.log(categories, "series");

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar', // Specify type as 'bar'
      height: height,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    colors: series?.map((s) => s.color || '#000'),
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      title: {
        text: yaxisTitle,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };

  return (
    <div>
      {title && <h4>{title}</h4>}
      {subtitle && <h6>{subtitle}</h6>}
      <ReactApexChart
        options={chartOptions}
        series={series}
        type="bar"
        height={height}
      />
    </div>
  );
};

export default StatsBarChart;
