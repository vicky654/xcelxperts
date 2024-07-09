import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import LoaderImg from '../../../utils/Loader';
import useErrorHandler from '../../../hooks/useHandleError';
import withApiHandler from '../../../utils/withApiHandler';
import { CommonDataEntryProps } from '../../commonInterfaces';
interface SummaryProps {
  stationId: string | null;
  startDate: string | null;
}


const Summary: React.FC<CommonDataEntryProps> = ({ stationId, startDate, postData, getData }) => {
  const [data, setData] = useState<any>({ takings: {}, banking: {} });
  const [summaryRemarks, setSummaryRemarks] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const handleApiError = useErrorHandler();
  useEffect(() => {
      if (stationId && startDate) {
          handleApplyFilters(stationId, startDate);
      }
  }, [stationId, startDate]);
  const handleApplyFilters = async (stationId: string | null, startDate: string | null) => {
      try {
          const response = await getData(`/data-entry/summary?drs_date=${startDate}&station_id=${stationId}`);
          if (response && response.data && response.data.data) {
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

  return (
    <>
      {/* {isLoading && <LoaderImg />} */}
      <div className="container mx-auto px-4">
        <div className="flex justify-center ">
          <div className="w-full ">
            <div className="mb-8">
              <h1 className="text-lg font-bold ">SUMMARY OF TAKINGS</h1>
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                  {Object.keys(data.takings).map((item, index) => (
                    <div key={index} className="flex justify-between py-2">
                      <p className="font-semibold">{item.replace(/_/g, ' ')}</p>
                      <p>{data.takings[item]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-lg font-bold ">SUMMARY OF BANKING</h1>
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                  {Object.keys(data.banking).map((item, index) => (
                    <div key={index} className="flex justify-between py-2">
                      <p className="font-semibold">{item.replace(/_/g, ' ')}</p>
                      <p>{data.banking[item]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-lg font-bold ">Cash Difference</h1>
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between py-2">
                    <p className="font-semibold">Cash Difference</p>
                    <p>{data.cash_difference}</p>
                  </div>

                  {!isSummaryRemarksNull ? (
                    <div className="flex justify-between py-2">
                      <p className="font-semibold">Remarks</p>
                      <p>{summaryRemarks}</p>
                    </div>
                  ) : (
                    <Formik
                      initialValues={{ Remarks: '' }}
                      validationSchema={Yup.object().shape({
                        Remarks: Yup.string().required('*Remarks is required'),
                      })}
                      onSubmit={(values) => {
                        console.log(values, "columnIndex");
                      }}
                    >
                      <Form>
                        <div className="">
                          <label htmlFor="Remarks" className="font-semibold">
                            Remarks<span className="text-red-600">*</span>
                          </label>
                          <br/>
                          <Field as="textarea" id="Remarks" name="Remarks" className="w-full p-2 border rounded-md" />
                        </div>
                        <div className="text-red-600">
                          <ErrorMessage name="Remarks" component="div" />
                        </div>
                        {data.dayend === true && (
                          <div className="text-right mt-4">
                            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md btn btn-primary">
                              Day End
                            </button>
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="text-red-600">*</span>On clicking the Day End button, Day End process will be completed and no modification will be allowed for the closed DRS
                            </p>
                          </div>
                        )}
                      </Form>
                    </Formik>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Summary;
