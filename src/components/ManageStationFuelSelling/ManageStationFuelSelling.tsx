import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'tippy.js/dist/tippy.css';
import noDataImage from '../../assets/noDataFoundImage/noDataFound.png'; // Import the image
import useErrorHandler from '../../hooks/useHandleError';
import LoaderImg from '../../utils/Loader';
import withApiHandler from '../../utils/withApiHandler';
import * as Yup from 'yup';
import CustomInput from '../ManageStationTank/CustomInput';
import TableWithFormik from './TableWithFormik';

interface ManageStationFuelSellingProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    // onSubmit: (values: any, formik: any) => Promise<void>;
}

interface RowData {
    id: string; // Change type from number to string
    full_name: string;
    role: string;
    addons: string;
    created_date: string;
    status: number;
    station_status: number;
    station_name: string;
    station_code: string;
    station_address: string;
    getData: any;
    listing: any;
    head_array: any;
}

const ManageStationFuelSelling: React.FC<ManageStationFuelSellingProps> = ({ postData, getData, isLoading }) => {
    const [data, setData] = useState<RowData[] | any>([]);
    const handleApiError = useErrorHandler();
    const [formValues, setFormValues] = useState({
        client_id: '',
        entity_id: '',
        start_date: '',
    });
    let storedKeyItems: any = localStorage.getItem("fuelselling") || '[]';
    let storedKeyName = "fuelselling";
    const [isNotClient] = useState(localStorage.getItem('superiorRole') !== 'Client');

    useEffect(() => {
        const storedData = localStorage.getItem(storedKeyName);
        if (storedData) {
            handleApplyFilters(JSON.parse(storedData));
        }
    }, []);


    const handleSuccess = () => {
        handleApplyFilters(JSON.parse(storedKeyItems));
    };



    const handleApplyFilters = async (values: any) => {
        setFormValues({
            client_id: values.client_id,
            entity_id: values.entity_id,
            start_date: values.start_date,
        });
        const apiURL = `station/fuel-price?client_id=${values.client_id}&entity_id=${values.entity_id}&drs_date=${values.start_date}`;

        try {
            const response = await getData(apiURL);
            if (response && response.data && response.data.data) {
                setData(response.data.data);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        }
    };


    const validationSchemaForCustomInput = Yup.object({
        entity_id: Yup.string().required('Entity is required'),
        client_id: isNotClient ? Yup.string().required('Client is required') : Yup.mixed().notRequired(),
        start_date: Yup.string().required('Start Date is required'),
    });

    const handleFormSubmit = async (values: any) => {
        try {
            const formData = new FormData();

            // Iterate through each site in values
            Object.keys(values).forEach((siteId) => {
                const fuels = values[siteId];

                // Iterate through each fuel type within the site
                Object.keys(fuels).forEach((fuelId) => {
                    const price = fuels[fuelId];
                    const fieldKey = `fuels[${siteId}][${fuelId}]`;

                    // Ensure price is defined before appending
                    if (price !== undefined && price !== null) {
                        formData.append(fieldKey, price.toString());
                    } else {
                        console.warn(`Price for site ${siteId} and fuel ${fuelId} is undefined or null`);
                    }
                });
            });

            formData.append('client_id', formValues.client_id);
            formData.append('entity_id', formValues.entity_id);
            formData.append('drs_date', formValues.start_date);

            const postDataUrl = '/station/fuel-price/update';

            const isSuccess = await postData(postDataUrl, formData);


        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const filterValues = async (values: any) => {
        console.log(values, 'formValues');
    };


    return (
        <>
            {isLoading && <LoaderImg />}
            <div className="flex justify-between items-center">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Stations Fuel Sale</span>
                    </li>
                </ul>
            </div>

            <div className=" mt-6">
                <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6'>
                    <div className="panel h-full ">
                        <CustomInput
                            getData={getData}
                            isLoading={isLoading}
                            onApplyFilters={handleApplyFilters}
                            FilterValues={filterValues}
                            showClientInput={true} // or false
                            showEntityInput={true} // or false
                            showStationInput={false} // or false
                            showDateInput={true} // or false
                            validationSchema={validationSchemaForCustomInput}
                            layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-1 gap-5"
                            isOpen={false}
                            storedKeyName={storedKeyName}
                            onClose={function (): void {
                                throw new Error('Function not implemented.');
                            }}
                        />
                    </div>
                    <div className="panel h-full xl:col-span-3">
                        <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                            <h5 className="font-semibold text-lg dark:text-white-light"> Stations Fuel Sale</h5>
                            <div className="ltr:ml-auto rtl:mr-auto">
                                {/* <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} /> */}
                            </div>
                        </div>

                        {data?.listing?.length > 0 ? (
                            <>
                                <TableWithFormik data={data} onSubmit={handleFormSubmit} />
                            </>
                        ) : (
                            <>
                                <img
                                    src={noDataImage} // Use the imported image directly as the source
                                    alt="no data found"
                                    className="all-center-flex nodata-image"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default withApiHandler(ManageStationFuelSelling);
