import React, { useEffect, useState } from 'react'
import FormikInput from '../FormikFormTools/FormikInput'
import { useFormik } from 'formik';
import withApiHandler from '../../utils/withApiHandler';
import { Link } from 'react-router-dom';
import noDataImage from '../../assets/AuthImages/noDataFound.png'; // Import the image
import useErrorHandler from '../../hooks/useHandleError';
import DataTable from 'react-data-table-component';
import LoaderImg from '../../utils/Loader';
import * as Yup from 'yup';
import showMessage from '../../hooks/showMessage';
import axios, { AxiosInstance } from 'axios';


interface AddEditManagesupplierProps {
    getData: (url: string) => Promise<any>;
    postedData?: any;
    isLoading?: boolean;
    postData: (url: string, body: any) => Promise<any>;
}

interface RowData {
    id: string;
    comment: string;
    incentive: string;
    volume: string;
}


const CalculateProfit: React.FC<AddEditManagesupplierProps> = ({ postedData, postData, getData, }) => {
    const [data, setData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleApiError = useErrorHandler(); // Use the error handler hook

    const validationSchema = Yup.object({
        delivery_volume: Yup.number()
            .required('Delivery volume is required')
    });

    const axiosInstance: AxiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
    });

    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const formik = useFormik({
        initialValues: {
            delivery_volume: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {


                const formData = new FormData();
                formData.append('delivery_volume', values.delivery_volume);
                const url = `/dashboard/calculate-profit`;
                // const response = await postData(url, formData);


                try {
                    setIsLoading(true);
                    const response = await axiosInstance.post(url, formData);

                    if (response && response.data) {
                        const data = response.data;
                        showMessage(data?.message, 'success');
                        setData(response?.data?.data);
                        setIsLoading(false);
                        return true; // Indicate success
                    } else {
                        throw new Error('Invalid response');
                    }
                } catch (error) {
                    setData([]);
                    handleApiError(error);
                    setIsLoading(false);
                    return false; // Indicate failure
                }
            } catch (error) {

                throw error; // Rethrow the error to be handled by the caller
            }
        },
    });


    const columns: any = [
        // Other columns
        {
            name: 'Slab',
            selector: (row: RowData) => row?.id,
            sortable: false,
            width: '10%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{`${row?.id}`}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Volume (Per Month)',
            selector: (row: RowData) => row?.volume,
            sortable: false,
            width: '25%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{`${row?.volume}`}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Incentive / KL',
            selector: (row: RowData) => row?.incentive,
            sortable: false,
            width: '25%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row?.incentive}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Comments',
            selector: (row: RowData) => row?.comment,
            sortable: false,
            width: '40%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{`${row?.comment ? row?.comment : "-"}`}</h6>
                    </div>
                </div>
            ),
        },



    ];


    return (
        <>{isLoading && <LoaderImg />}

            <div className="flex justify-between items-center">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/dashboard" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Calculate Profit</span>
                    </li>
                </ul>


            </div>




            <div className="mt-6">
                <form onSubmit={formik.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                    <div className="flex flex-col sm:flex-row">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-1 gap-5">
                            <FormikInput formik={formik} type="number" name="delivery_volume" />

                            <div className="sm:col-span-2 mt-3 flex items-center gap-2">
                                <button type="submit" className="btn btn-primary">
                                    Check
                                </button>

                                {data?.gross_profit && (<>
                                    <h5 className="font-bold text-lg dark:text-white-light">Gross Profit :   {data?.commission}  +  {data?.insentive} = {data?.gross_profit}</h5>
                                </>)}

                            </div>
                        </div>
                    </div>
                </form>



                {data?.gross_profit && (<>
                    <div className={`panel h-full `}>

                        <div className="flex md:items-center md:flex-row flex-col mb-5 spacebetween">

                            <h5 className="font-bold text-lg dark:text-white-light">Incentive Slabs</h5>

                        </div>


                        {/* Check if data is available */}
                        {data?.slabs?.length > 0 ? (
                            <>

                                <div className="datatables fixed-height-react-table">
                                    <DataTable
                                        className="table-striped table-hover table-bordered table-compact"
                                        columns={columns}
                                        data={data?.slabs}
                                        noHeader
                                        defaultSortAsc={false}
                                        striped={true}
                                        persistTableHead
                                        highlightOnHover
                                        responsive={true}
                                    />
                                </div>

                            </>
                        ) : (
                            <>
                                {/* Display image when no data is available */}
                                <img
                                    src={noDataImage} // Use the imported image directly as the source
                                    alt="no data found"
                                    className="all-center-flex nodata-image"
                                />
                            </>
                        )}
                    </div>

                </>)}







            </div>






        </>



    )
}

export default withApiHandler(CalculateProfit)