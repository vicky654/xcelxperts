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



      // Open the PDF URL in a new tab using the full URL
      window.open(pdfUrl, '_blank', 'noopener noreferrer');
    } else {
      throw new Error('No data available in the response');
    }
  } catch (error) {
    // Handle API errors
    handleApiError(error);
  }
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
