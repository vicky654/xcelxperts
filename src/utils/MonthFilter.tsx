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
    if (month && year) {
      onChange(month, year);
    } else {
      // Pass empty strings if month or year is missing
      onChange("", "");
    }
  };

  // Handle clearing the input
  const handleClear = () => {
    setValue("");
    onChange("", "");
  };

  // Handle showing the date picker
  const handleShowDate = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    (e.target as HTMLInputElement).showPicker();
  };

  return (
    <div className="">
      <input
        type="month"
        id="month-year"
        value={value}
        onClick={handleShowDate}
        onChange={handleChange}
        className="w-64 px-3 py-2 mb-4 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      {value && ( // Render clear button only if a value is selected
        <button
          onClick={handleClear}
          className="p-2 ms-2 text-white bg-red-500  hover:bg-red-600 focus:outline-none"
        >
          Clear Filter
        </button>
      )}
    </div>
  );
};

export default MonthYearInput;
