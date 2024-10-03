export const handleDownloadPdf = async (
  type: string,
  stationId: string | null,
  startDate: string | null,
  getData: (url: string) => Promise<any>,
  handleApiError: (error: any) => void
) => {
  try {
    // Fetch data from the API
    const response = await getData(
      `/pdf/${type}?drs_date=${startDate}&station_id=${stationId}`
    );

    // Check if the response contains data
    if (response && response.data?.data) {
      const pdfUrl = response.data?.data?.url;
      window.open(pdfUrl, '_blank', 'noopener noreferrer');
    } else {
      throw new Error('No data available in the response');
    }
  } catch (error) {
    // Handle API errors
    handleApiError(error);
  }
};
export const StringFormatNumberCommon = (number: any) => {
  if (number == null || number === '') {
    return '0';
  }

  // Extract currency symbol if it's present
  const currencySymbol = typeof number === 'string' ? number.match(/[\D]+/g)?.[0].trim() : '';

  // Convert string to a number by removing non-numeric characters except for the decimal point
  const numericValue = typeof number === 'string'
    ? parseFloat(number.replace(/[^0-9.-]+/g, ''))  // Remove anything that's not a digit, decimal, or minus sign
    : number;

  // Check if the conversion resulted in a valid number
  if (isNaN(numericValue)) {
    return '0';
  }

  // Format the number with currency symbol
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(numericValue)); // Use absolute value for formatting

  // Prepare the output
  let output = `${currencySymbol ? currencySymbol + ' ' : ''}${formattedNumber}`;

  // Add the negative sign if the original number was negative
  if (numericValue < 0) {
    output = `${currencySymbol ? currencySymbol + ' ' : ''} ${formattedNumber}`; // Add the negative sign before the formatted number
  }

  return output.trim(); // Trim any excess whitespace
};
export const FormatNumberCommon = (number: any) => {
  if (number == null || number === '') {
    return '0';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'decimal',
    minimumFractionDigits: 2,  // Set to 2 for minimum decimal places
    maximumFractionDigits: 3,  // Set to 3 for maximum decimal places
  }).format(number);
};
