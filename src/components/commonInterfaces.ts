// commonInterfaces.ts
export interface CommonDataEntryProps {
    stationId: string | null;
    startDate: string | null;
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    applyFilters: (values: any) => Promise<void>;
}

export interface DataProps {
    series: number[];
    labels: string[];
  }
  
  export interface SalesByCategoryOptions {
    chart: {
      type: string;
      height: number;
      fontFamily: string;
    };
    dataLabels: {
      enabled: boolean;
    };
    stroke: {
      show: boolean;
      width: number;
      colors: string;
    };
    colors: string[];
    legend: {
      position: string;
      horizontalAlign: string;
      fontSize: string;
      markers: {
        width: number;
        height: number;
        offsetX: number;
      };
      height: number;
      offsetY: number;
    };
    plotOptions: {
      pie: {
        donut: {
          size: string;
          background: string;
          labels: {
            show: boolean;
            name: {
              show: boolean;
              fontSize: string;
              offsetY: number;
            };
            value: {
              show: boolean;
              fontSize: string;
              color?: string;
              offsetY: number;
              formatter: (val: number) => string | number;
            };
            total: {
              show: boolean;
              label: string;
              color: string;
              fontSize: string;
              formatter: (w: any) => string | number;
            };
          };
        };
      };
    };
    labels: string[];
    states: {
      hover: {
        filter: {
          type: string;
          value: number;
        };
      };
      active: {
        filter: {
          type: string;
          value: number;
        };
      };
    };
  }
  