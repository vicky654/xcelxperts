import React from 'react';

interface CardProps {
  label: string;
  value: string;
  symbol: any;
  profit: any;
  TabData: any;
  capacity: string;
  currency: string;
  selectedTab: string;
  // prevMonthProfit: string; // Assuming you have this data passed in as a prop
}

const StatsCard: React.FC<CardProps> = ({ label, value, symbol, profit, capacity, currency, selectedTab, TabData }) => {

  // console.log(TabData, "TabData");

  return (
    <div className="panel h-full xl:col-span-2 firstbox">
      <div className="flex justify-between">
        <div style={{ color: "#fff" }} className="ltr:mr-1 rtl:ml-1 text-md font-semibold">
          {label}
        </div>
      </div>
      <div className="flex items-center mt-2">
        <div style={{ color: "#fff" }} className="font-bold text-3xl ltr:mr-3 rtl:ml-3">

          {selectedTab === 'Lube Sales'
            ? `Amount: ${currency} ${value}`
            : `${(selectedTab === 'Fuel Variance' || selectedTab === 'Fuel Delivery') ? capacity : currency} ${value}`}

        </div>

        {profit !== null && (
          <div className="badge bg-white">
            <div className="flex items-center space-x-1">
              {symbol === 'UP' && <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i>}
              {symbol === 'DOWN' && <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i>}
              <span
                className="font-semibold"
                style={{
                  color: symbol === 'UP'
                    ? '#37a40a'
                    : symbol === 'DOWN'
                      ? 'red'
                      : '#000'
                }}
              >
                {profit}%
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Displaying previous month's profit only for Lube Sales */}
      {/* {selectedTab === 'Lube Sales' && (
        <div className="flex items-center mt-2">
          <div style={{ color: "#fff" }} className="font-bold text-3xl ltr:mr-3 rtl:ml-3">
            {`Previous Month Profit: ${currency} ${TabData?.profit_total}`}
          </div>
        </div>
      )}
      
      <div className="flex items-center mt-2">
        <div style={{ color: "#fff" }} className="font-bold text-3xl ltr:mr-3 rtl:ml-3">

          {selectedTab === 'Lube Sales'
            ? `Profit: ${currency} ${TabData?.profit_total}`
            : `${(selectedTab === 'Fuel Variance' || selectedTab === 'Fuel Delivery') ? capacity : currency} ${TabData?.value}`}

        </div>

        {profit !== null && (
          <div className="badge bg-white">
            <div className="flex items-center space-x-1">
              {TabData?.profitSymbol === 'UP' && <i style={{ color: "#37a40a" }} className="fi fi-tr-chart-line-up"></i>}
              {TabData?.profitSymbol === 'DOWN' && <i style={{ color: "red" }} className="fi fi-tr-chart-arrow-down"></i>}
              <span
                className="font-semibold"
                style={{
                  color: TabData?.profitSymbol === 'UP'
                    ? '#37a40a'
                    : TabData?.profitSymbol === 'DOWN'
                      ? 'red'
                      : '#000'
                }}
              >
                {profit}%
              </span>
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default StatsCard;
