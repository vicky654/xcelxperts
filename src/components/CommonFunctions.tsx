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
      console.log(response.data?.data, 'response.data?.data');

      // Get the PDF URL from the response data
      const pdfUrl = response.data?.data?.url;

     
      console.log(pdfUrl, 'fullUrl');
      console.log(response.data?.data?.url, 'response.data?.data?.url');

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
