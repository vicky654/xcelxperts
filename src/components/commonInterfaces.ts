// commonInterfaces.ts
export interface CommonDataEntryProps {
    stationId: string | null;
    startDate: string | null;
    isLoading: boolean;
    itemDeleted?: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    applyFilters: (values: any) => Promise<void>;
    onDeleteSuccess?: () => void; // Optional function prop

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
  

  export interface IFuel {
    name: string;
    value: number;
    volume: number;
    volume_status: string;
    volume_percentage: number;
    value_status: string;
    value_percentage: number;
}

export interface ISalesVolume {
    sales_volume: number;
    status: string;
    percentage: number;
}

export interface ISalesValue {
    sales_value: number;
    status: string;
    percentage: number;
}

export interface IProfit {
    profit: number;
    status: string;
    percentage: number;
}

export interface IStock {
    value: number;
    volume: number;
    volume_status: string;
    volume_percentage: number;
    value_status: string;
    value_percentage: number;
    fuel: IFuel[];
}

export interface ILineGraph {
    labels: string[];
    series: { name: string; data: number[] }[];
    colors: string[];
}

export interface IPiGraph {
    labels: string[];
    colors: string[];
    series: number[];
}

export interface IBasicDetails {
    station_name: string;
    client_name: string;
    entity_name: string;
}

export interface IAppContextData {
    sales_volume: ISalesVolume;
    sales_value: ISalesValue;
    profit: IProfit;
    stock: IStock;
    line_graph: ILineGraph;
    pi_graph: IPiGraph;
    basic_details: IBasicDetails;
}

export interface IAppContext extends IAppContextData {
    setAppData: React.Dispatch<React.SetStateAction<IAppContextData>>;
}
