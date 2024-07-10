import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useErrorHandler from '../../../hooks/useHandleError';
import { CommonDataEntryProps } from '../../commonInterfaces';
import LoaderImg from '../../../utils/Loader';

interface SummaryProps {
  stationId: string | null;
  startDate: string | null;
}

const Summary: React.FC<CommonDataEntryProps> = ({ stationId, startDate, postData, getData, isLoading }) => {
  const [data, setData] = useState<any>({ takings: {}, banking: {}, charges: {} });
  const [summaryRemarks, setSummaryRemarks] = useState<string | null>(null);
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

  const submitsummary = async (values: any) => {
    try {
      const formData = new FormData();

      // Append takings data
      Object.keys(data?.takings).forEach((key) => {
        formData.append(`takings.${key}`, data?.takings[key]);
      });

      // Append banking data
      Object.keys(data?.banking).forEach((key) => {
        formData.append(`banking.${key}`, data?.banking[key]);
      });

      // Append charges data
      Object.keys(data?.charges).forEach((key) => {
        formData.append(`charges.${key}`, data?.charges[key]);
      });

      if (stationId && startDate) {
        formData.append('drs_date', startDate);
        formData.append('station_id', stationId);
      }

      // Append other fields
      formData.append('cash_difference', data?.cash_difference);
      formData.append('variance', data?.variance);
      formData.append('remarks', values?.Remarks);

      const url = `data-entry/dayend`;

      const isSuccess = await postData(url, formData);
      if (isSuccess) {
        if (stationId && startDate) {
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
      <div className="container mx-auto px-4">
        <h1 className="text-lg font-semibold mb-4">Summary{startDate ? `(${startDate})` : ''}</h1>
        <div className="flex justify-center">
          <div className="w-full">
          <div className="mb-8">
              <h1 className="text-lg font-bold">SUMMARY OF CHARGES</h1>
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                  {Object.keys(data?.charges).map((item, index) => (
                    <div key={index} className="flex justify-between py-2">
                      <p className="font-semibold">{capitalizeFirstLetter(item)}</p>
                      <p>{data?.charges[item]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-8">
              <h1 className="text-lg font-bold">SUMMARY OF TAKINGS</h1>
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                  {Object.keys(data?.takings).map((item, index) => (
                    <div key={index} className="flex justify-between py-2">
                      <p className="font-semibold">{capitalizeFirstLetter(item)}</p>
                      <p>{data?.takings[item]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

      

            <div className="mb-8">
              <h1 className="text-lg font-bold">SUMMARY OF BANKING</h1>
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                  {Object.keys(data?.banking).map((item, index) => (
                    <div key={index} className="flex justify-between py-2">
                      <p className="font-semibold">{capitalizeFirstLetter(item)}</p>
                      <p>{data?.banking[item]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-lg font-bold">Remarks</h1>
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                  {/* <div className="flex justify-between py-2">
                    <p className="font-semibold">Cash Difference</p>
                    <p>{data?.cash_difference}</p>
                  </div> */}

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
                        submitsummary(values);
                        console.log(values, 'columnIndex');
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
