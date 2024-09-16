import React from 'react';
import './FuelTable.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

// Define the FuelStocks interface
interface FuelStocks {
    labels: string[];
    opening: string[];
    delivery: string[];
    stock: string[];
    closing: string[];
    dip_sales: string[];
    sales: string[];
    profit: string[];
    permissible: string[];
    loss: string[];
    stock_loss: string[];
    rate: string[];
    amount: string[];
}

// Define the props for the FuelTable component
interface FuelTableProps {
    fuel_stocks: any;
    TableData: any;
}

// FuelTable component
const FuelTable: React.FC<FuelTableProps> = ({ fuel_stocks, TableData }) => {
    const headers = fuel_stocks?.[0];
    const updated_fuel_stocks = fuel_stocks?.slice(1);

    const rows = Object?.keys(updated_fuel_stocks)
        .filter(key => key !== 'labels') // Exclude 'labels'
        .map((key) => (
            <tr key={key}>
                <td>{updated_fuel_stocks[key as keyof FuelStocks][0]}</td>
                {updated_fuel_stocks[key as keyof FuelStocks].slice(1)?.map((value: any, index: any) => (
                    <td key={index}>{value}</td>
                ))}
            </tr>
        ));

    console.log(headers, "headers");
    return (
        <div>
            <table>
                <thead>
                    <tr className='bg-gray-200'>
                        {headers?.map((header: any, index: any) => (
                            <th className='bg-gray-200' key={index}>{header}</th>
                        ))}
                    </tr>

                </thead>
                <tbody>
                    {rows}
                    <tr style={{ backgroundColor: 'rgba(28, 139, 51, 0.35)', color: 'rgb(0, 0, 0)', fontWeight: 'bold' }}>
                        <td colSpan={fuel_stocks?.[0].length - 1}>Total</td>
                        <td>
                            <OverlayTrigger
                                placement="top"
                                
                                overlay={<Tooltip id="tooltip-opening-stock" className='ModalTooltip'>Total Details</Tooltip>}
                            >
                                <span>{TableData?.total}  <span><i className="fi fi-sr-comment-info pointer"></i></span></span>
                            </OverlayTrigger>
                           
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>
    );
};

// Example usage with data passed from parent
interface DynamicTableProps {
    data: FuelStocks;
    TableData: any
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data, TableData }) => {
    return (
        <div>
            <FuelTable fuel_stocks={data} TableData={TableData} />
        </div>
    );
};

export default DynamicTable;
