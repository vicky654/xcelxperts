import React, { createContext, useState, FC, ReactNode } from 'react';
import { ISalesValue, ISalesVolume, IProfit, IStock, ILineGraph, IPiGraph, IBasicDetails, DashboardSelectedClient, DashboardSelectedEntity, DashboardSelectedStation } from '../../components/commonInterfaces';

// Define the data structure for the context
export interface IAppContextData {
    sales_volume: ISalesVolume | null;
    sales_value: ISalesValue | null;
    profit: IProfit | null;
    stock: IStock | null;
    line_graph: ILineGraph | null;
    pi_graph: IPiGraph | null;
    basic_details: IBasicDetails | null;
    selectedClient?: DashboardSelectedClient; // Add if needed
    selectedEntity?: DashboardSelectedEntity; // Add if needed
    selectedStation?: DashboardSelectedStation; // Add if needed
}

export interface IAppContext extends IAppContextData {
    setAppData: React.Dispatch<React.SetStateAction<IAppContextData>>;
    setSelectedClient: (client: DashboardSelectedClient | undefined) => void;
    setSelectedEntity: (entity: DashboardSelectedEntity | undefined) => void;
    setSelectedStation: (station: DashboardSelectedStation | undefined) => void;
}

const AppContext = createContext<IAppContext>({} as IAppContext);

interface AppContextProviderProps {
    children: ReactNode;
}

export const AppContextProvider: FC<AppContextProviderProps> = ({ children }) => {
    const [appData, setAppData] = useState<IAppContextData>({
        sales_volume: null,
        sales_value: null,
        profit: null,
        stock: null,
        line_graph: null,
        pi_graph: null,
        basic_details: null,
        selectedClient: undefined,
        selectedEntity: undefined,
        selectedStation: undefined,
    });

    const setSelectedClient = (client: DashboardSelectedClient | undefined) => {
        setAppData(prevData => ({ ...prevData, selectedClient: client }));
    };

    const setSelectedEntity = (entity: DashboardSelectedEntity | undefined) => {
        setAppData(prevData => ({ ...prevData, selectedEntity: entity }));
    };

    const setSelectedStation = (station: DashboardSelectedStation | undefined) => {
        setAppData(prevData => ({ ...prevData, selectedStation: station }));
    };
    return (
        <AppContext.Provider value={{ ...appData, setAppData, setSelectedClient, setSelectedEntity, setSelectedStation }}>
        {children}
    </AppContext.Provider>
    );
};

export default AppContext;
