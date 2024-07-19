// import { getData } from 'path/to/api'; // Adjust the import path as necessary

export const handleDownloadPdf = async (
  type: string, 
  stationId: string | null, 
  startDate: string | null,
  getData: (url: string) => Promise<any>,
  handleApiError: (error: any) => void
) => {
  try {
    const response = await getData(`/pdf/${type}?drs_date=${startDate}&station_id=${stationId}`);
    if (response && response.data && response.data.data) {
      console.log(response.data.data, "response.data.data");
      // Handle response data as needed
    } else {
      throw new Error('No data available in the response');
    }
  } catch (error) {
    handleApiError(error);
  }
};
