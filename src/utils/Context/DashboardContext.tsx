import React, { createContext, useState, useEffect, FC, ReactNode } from 'react';
import { ISalesValue, ISalesVolume,IProfit, IStock, ILineGraph, IPiGraph, IBasicDetails } from '../../components/commonInterfaces';

export interface IAppContextData {
    sales_volume: ISalesVolume | null;
    sales_value: ISalesValue | null;
    profit: IProfit | null;
    stock: IStock | null;
    line_graph: ILineGraph | null;
    pi_graph: IPiGraph | null;
    basic_details: IBasicDetails | null;
}

export interface IAppContext extends IAppContextData {
    setAppData: React.Dispatch<React.SetStateAction<IAppContextData>>;
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
    });



    return (
        <AppContext.Provider value={{ ...appData, setAppData }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
