import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useErrorHandler from '../../../hooks/useHandleError';
import { CommonDataEntryProps } from '../../commonInterfaces';
import LoaderImg from '../../../utils/Loader';
import { currency } from '../../../utils/CommonData';
import DataEntryStats from '../DashDataEntryStats';
import { handleDownloadPdf } from '../../CommonFunctions';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface SummaryProps {
  stationId: string | null;
  startDate: string | null;
}
interface SummaryRemarks {
  remarks: string | null;
  date: string;
  net_cash_due_banking: number;
  cash_operator: number;
  varience_accumulation: number;
  variance: number;
}
const Summary: React.FC<CommonDataEntryProps> = ({ stationId, startDate, postData, getData, isLoading, applyFilters }) => {
  const [data, setData] = useState<any>({ takings: {}, banking: {}, charges: {} });
  const [isUserAddonModalOpen, setIsUserAddonModalOpen] = useState(false);
  const [isdownloadpdf, setIsdownloadpdf] = useState(true);
  const [summaryRemarks, setSummaryRemarks] = useState<SummaryRemarks | null>(null);
  const navigate = useNavigate();
  const handleApiError = useErrorHandler();
  const openUserAddonModal = () => {
    setIsUserAddonModalOpen(true);

  };
  const closeUserAddonModal = () => {
    setIsUserAddonModalOpen(false);
  };
  useEffect(() => {
    if (stationId && startDate) {
      handleApplyFilters(stationId, startDate);
    }
  }, [stationId, startDate]);

  const handleApplyFilters = async (stationId: string | null, startDate: string | null) => {
    try {
      const response = await getData(`/data-entry/summary?drs_date=${startDate}&station_id=${stationId}`);
      if (response && response.data && response.data.data) {
        setIsdownloadpdf(response.data.data?.download_pdf);
        setData(response.data?.data);
        setSummaryRemarks(response.data.data?.remark);
      } else {
        throw new Error('No data available in the response');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const isSummaryRemarksNull = summaryRemarks === null;



  const submitsummary = async (values: any) => {
    try {
      const formData = new FormData();

      // Append specific fields
      formData.append('drs_date', startDate || '');
      formData.append('station_id', stationId || '');
      formData.append('total_fuel_sales', data?.takings?.total_fuel_sales || '');
      formData.append('total_lubes_sales', data?.takings?.total_lubes_sales || '');
      formData.append('total_deductions', data?.takings?.deductions || '');
      formData.append('total_charges', data?.takings?.total_charges || '');
      formData.append('total_sales', data?.takings.total_sales_value || ''); // Assuming total_sales is available in takings
      formData.append('total_credit_sales', data?.takings.total_credit_sales || '');
      formData.append('total_credit_card', data?.takings.total_credit_card || '');
      formData.append('net_cash_due_banking', data?.banking.net_cash_due_for_banking || '');
      formData.append('cash_operator', data?.banking?.cash_deposited || '');
      formData.append('varience_accumulation', data?.banking.varience_accumulation || '');
      // formData.append('varience_accumulation', data?.banking.variance_difference || '');
      formData.append('variance', data?.variance || '');
      formData.append('remarks', values?.Remarks || '');

      // Append other fields if needed
      // formData.append('cash_difference', data?.cash_difference || '');
      // formData.append('variance', data?.variance || '');
      // formData.append('remarks', values?.Remarks || '');

      const url = `data-entry/dayend`;

      const isSuccess = await postData(url, formData);
      if (isSuccess) {
        if (stationId && startDate) {
          applyFilters({ station_id: stationId, start_date: startDate, selectedCardName: "Summary" });
          handleApplyFilters(stationId, startDate);
        }
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/_/g, ' ');
  };


  return (
    <>
      {isLoading && <LoaderImg />}
      <div >

        {/* <div className='spacebetween'>
          <h1 className="text-lg font-semibold mb-4">Summary{startDate ? `(${startDate})` : ''}</h1>

          <button className='btn btn-primary' onClick={() => openUserAddonModal()}>View Stats</button>

        </div> */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="text-lg font-semibold mb-4 displaycanter">Summary{startDate ? `(${startDate})` : ''} {isdownloadpdf && (<span onClick={() => handleDownloadPdf('summary', stationId, startDate, getData, handleApiError)}>
            <OverlayTrigger placement="top" overlay={<Tooltip className="custom-tooltip" >Download Report</Tooltip>}>
              <i style={{ fontSize: "20px", color: "red", cursor: "pointer" }} className="fi fi-tr-file-pdf"></i>
            </OverlayTrigger>
          </span>)}
          </h1>

          {/* {isdownloadpdf  && (
                    <button
                        className='btn btn-primary'
                        onClick={() => handleDownloadPdf('summary', stationId, startDate, getData, handleApiError)}
                    >
                      Download Pdf   <i className="fi fi-tr-file-download"></i> 
                    </button>   )} */}
        </div>
        <div className="flex justify-center">
          <div className="w-full">
            {data?.charges && (
              <div className="mb-8  ">
                <h1 className="text-lg font-bold">SUMMARY OF INCOME</h1>

                <div className="p-2">
                  <ul className="divide-y divide-gray-200">
                    {Object.keys(data?.charges || {}).map((item, index) => (
                      <li key={index} className="flex justify-between py-2 hover:bg-gray-100">
                        <p className="font-semibold">{capitalizeFirstLetter(item)}</p>
                        <p>{currency} {data?.charges[item]}</p>
                      </li>
                    ))}
                  </ul>
                </div>


              </div>
            )}
            {data?.deductions && (
              <div className="mb-8  ">
                <h1 className="text-lg font-bold">SUMMARY OF EXPENSES</h1>

                <div className="p-2">
                  <ul className="divide-y divide-gray-200">
                    {Object.keys(data?.deductions || {}).map((item, index) => (
                      <li key={index} className="flex justify-between py-2 hover:bg-gray-100">
                        <p className="font-semibold">{capitalizeFirstLetter(item)}</p>
                        <p>{currency} {data?.deductions[item]}</p>
                      </li>
                    ))}
                  </ul>
                </div>


              </div>
            )}
            <DataEntryStats getData={getData} isOpen={isUserAddonModalOpen} onClose={closeUserAddonModal} startDate={startDate} stationId={stationId} />
            {data?.takings && (
              <div className="mb-8">
                <h1 className="text-lg font-bold">SUMMARY OF TAKINGS</h1>
                <div className="p-2">
                  <ul className="divide-y divide-gray-200">
                    {Object.keys(data?.takings).map((item, index) => (
                      <li key={index} className="flex justify-between py-2 hover:bg-gray-100">
                        <p className="font-semibold">{capitalizeFirstLetter(item)}</p>
                        <p>{currency} {data?.takings[item]}</p>
                      </li>
                    ))}
                  </ul>
                </div>


              </div>

            )}
            {data?.banking && (
              <div className="mb-8">
                <h1 className="text-lg font-bold">SUMMARY OF BANKING</h1>

                <div className="p-2">
                  <ul className="divide-y divide-gray-200">
                    {Object.keys(data?.banking).map((item, index) => (
                      <li key={index} className="flex justify-between py-2 hover:bg-gray-100">
                        <p className="font-semibold">{capitalizeFirstLetter(item)}</p>
                        <p>{currency} {data?.banking[item]}</p>
                      </li>
                    ))}
                  </ul>
                </div>


              </div>
            )}
            <div className="mb-8">
              <h1 className="text-lg font-bold">Remarks</h1>

              <div className="p-2">
                {/* <div className="flex justify-between py-2">
                    <p className="font-semibold">Cash Difference</p>
                    <p>{data?.cash_difference}</p>
                  </div> */}

                {isSummaryRemarksNull ? (
                  <Formik
                    initialValues={{ Remarks: '' }}
                    validationSchema={Yup.object().shape({
                      Remarks: Yup.string().required('*Remarks is required'),
                    })}
                    onSubmit={(values) => {
                      submitsummary(values);
                    }}
                  >
                    <Form>
                      <div className="">
                        <label htmlFor="Remarks" className="font-semibold">
                          Remarks<span className="text-red-600">*</span>
                        </label>
                        <br />
                        <Field as="textarea" id="Remarks" name="Remarks" className="w-full p-2 border rounded-md" />
                      </div>
                      <div className="text-red-600">
                        <ErrorMessage name="Remarks" component="div" />
                      </div>
                      {data.dayend === true && (
                        <div className="text-right mt-4">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md btn btn-primary"
                          >
                            Day End
                          </button>
                          <p className="text-sm text-gray-600 mt-2">
                            <span className="text-red-600">*</span>On clicking the Day End button, Day End process will
                            be completed and no modification will be allowed for the closed DRS
                          </p>
                        </div>
                      )}
                    </Form>
                  </Formik>
                ) : (
                  <>
                    <div className="flex justify-between py-2">
                      <p className="font-semibold">Remarks</p>
                      <p>{summaryRemarks?.remarks}</p>
                    </div>
                    {/* <p>{summaryRemarks?.remarks}</p> */}
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Summary;
