// import React, { useState } from "react";

// interface MonthYearInputProps {
//   onChange: (month: string, year: string) => void; // Callback function to handle filter changes
// }

// const MonthYearInput: React.FC<MonthYearInputProps> = ({ onChange }) => {
//   const [value, setValue] = useState<string>("");

//   // Handle input change
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = e.target.value;
//     setValue(newValue);

//     // Extract month and year from the value
//     const [year, month] = newValue.split("-");
//     if (month && year) {
//       onChange(month, year);
//     }
//   };

//   // Handle showing the date picker
//   const handleShowDate = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
//     (e.target as HTMLInputElement).showPicker();
//   };

//   return (
//     <div className="flex flex-col items-center">
//       {/* <label htmlFor="month-year" className="mb-2 text-lg font-medium text-gray-700">
//         Select Month and Year
//       </label> */}
//       <input
//         type="month"
//         id="month-year"
//         value={value}
//         // onClick={handleShowDate} // Pass function reference
//         onChange={handleChange}
//         className="w-64 px-3 py-2 mb-4 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//       />
//     </div>
//   );
// };

// export default MonthYearInput;

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
    console.log(newValue, "newValue");
  };
  const handleShowDate = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    (e.target as HTMLInputElement).showPicker();
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="month"
        id="month-year"
        value={value}
        onClick={handleShowDate}
        onChange={handleChange}
        className="w-64 px-3 py-2 mb-4 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default MonthYearInput;
