import React from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import "react-multi-date-picker/styles/colors/red.css"; // Optional styling

interface MultiDateRangePickerProps {
  selectedDates: Date[]; // Array of selected dates
  onChange: (dates: Date[]) => void; // Callback to handle date change
}

const MultiDateRangePicker: React.FC<MultiDateRangePickerProps> = ({
  selectedDates,
  onChange,
}) => {
  return (
    <DatePicker
      multiple // Enable multiple date selection
      value={selectedDates.map((date) => new DateObject(date))} // Convert Date to DateObject
      onChange={(dates) => {
        // Convert DateObject[] to Date[]
        const convertedDates = (dates as DateObject[]).map((dateObject) =>
          dateObject.toDate()
        );
        onChange(convertedDates);
      }}
      format="YYYY-MM-DD"
      placeholder="Select Dates"
      className="form-input" // Optional className for styling
      numberOfMonths={2} // Show two months side by side
    />
  );
};

export default MultiDateRangePicker;
