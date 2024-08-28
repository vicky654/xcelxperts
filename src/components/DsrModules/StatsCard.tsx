import React from 'react';

interface CardProps {
  label: string;
  value: string;
  symbol: any;
  profit: any;
  capacity: string;
  currency: string;
  selectedTab: string;
}

const StatsCard: React.FC<CardProps> = ({ label, value, symbol, profit, capacity, currency, selectedTab }) => {
  return (
    <div className="panel h-full xl:col-span-2 firstbox">
      <div className="flex justify-between">
        <div style={{ color: "#fff" }} className="ltr:mr-1 rtl:ml-1 text-md font-semibold">
          {label}
        </div>
      </div>
      <div className="flex items-center mt-2">
        <div style={{ color: "#fff" }} className="font-bold text-3xl ltr:mr-3 rtl:ml-3">
          {(selectedTab === 'Fuel Variance' || selectedTab === 'Fuel Delivery') ? capacity : currency} {value}
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
    </div>
  );
};

export default StatsCard;
