import React from 'react';
import './FuelTable.css'; // Import your CSS file here

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
    fuel_stocks: FuelStocks;
}

// FuelTable component
const FuelTable: React.FC<FuelTableProps> = ({ fuel_stocks }) => {
    const headers = fuel_stocks?.labels;

    // Extract rows from the remaining items in each array
    const rows = Object.keys(fuel_stocks)
        .filter(key => key !== 'labels') // Exclude 'labels'
        .map((key) => (
            <tr key={key}>
                <td>{fuel_stocks[key as keyof FuelStocks][0]}</td>
                {fuel_stocks[key as keyof FuelStocks].slice(1)?.map((value, index) => (
                    <td key={index}>{value}</td>
                ))}
            </tr>
        ));

    return (
        <div>
            <h3>Fuel Stocks Table</h3>
            <table>
                <thead>
                    <tr>
                        {headers?.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    );
};

// Example usage with data passed from parent
interface DynamicTableProps {
    data: FuelStocks;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data }) => {
    return (
        <div>
            <FuelTable fuel_stocks={data} />
        </div>
    );
};

export default DynamicTable;
