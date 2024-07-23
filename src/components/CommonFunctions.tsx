export const handleDownloadPdf = async (
  type: string,
  stationId: string | null,
  startDate: string | null,
  getData: (url: string) => Promise<any>,
  handleApiError: (error: any) => void
) => {
  try {
    const response = await getData(`/pdf/${type}?drs_date=${startDate}&station_id=${stationId}`);

    if (response && response.data?.data) {
      const pdfUrl = response.data?.data?.url;
      const fullUrl = `${process.env.REACT_APP_BASE_URL}${pdfUrl}`;
  

      // Open the PDF URL in a new tab
      window.open(fullUrl, "_blank", "noopener noreferrer");
    } else {
      throw new Error('No data available in the response');
    }
  } catch (error) {
    handleApiError(error);
  }
};
