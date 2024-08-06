import React, { useState } from "react";

interface MonthYearInputProps {
  onChange: (month: string, year: string) => void; // Callback function to handle filter changes
}

const MonthYearInput: React.FC<MonthYearInputProps> = ({ onChange }) => {
  const [value, setValue] = useState<string>("");

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Extract month and year from the value
    const [year, month] = newValue.split("-");
    onChange(month, year);
  };

  return (
    <div className="flex flex-col items-center">
      {/* <label htmlFor="month-year" className="mb-2 text-lg font-medium text-gray-700">
        Select Month and Year
      </label> */}
      <input
        type="month"
        id="month-year"
        value={value}
        onChange={handleChange}
        className="w-64 px-3 py-2 mb-4 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default MonthYearInput;
