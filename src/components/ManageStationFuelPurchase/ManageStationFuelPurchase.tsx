import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import DataTable from 'react-data-table-component';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import noDataImage from '../../assets/noDataFoundImage/noDataFound.jpg'; // Import the image
import useErrorHandler from '../../hooks/useHandleError';
import { setPageTitle } from '../../store/themeConfigSlice';
import useToggleStatus from '../../utils/ToggleStatus';
import useCustomDelete from '../../utils/customDelete';
import CustomSwitch from '../FormikFormTools/CustomSwitch';
import IconTrashLines from '../Icon/IconTrashLines';
import IconPencil from '../Icon/IconPencil';
import LoaderImg from '../../utils/Loader';
import AddEditStationModal from '../SideBarComponents/ManageStation/AddEditStationModal';
import CustomPagination from '../../utils/CustomPagination';
import withApiHandler from '../../utils/withApiHandler';
import * as Yup from 'yup';
import CustomInput from '../ManageStationTank/CustomInput';
import AddEditStationFuelPurchaseModal from './AddEditStationFuelPurchaseModal';
import { useFormik } from 'formik';
import { stationSettingInitialValues } from '../FormikFormTools/InitialValues';

interface ManageStationFuelPurchaseProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    // onSubmit: (values: any, formik: any) => Promise<void>;
}
interface FormValues {
    data: any;
    // isLoading: boolean;
    // getData: (url: string) => Promise<any>;
    // postData: (url: string, body: any) => Promise<any>;
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
}

interface ColData {
    id: string; // Change type from number to string
    fuel_name: string; // Change type from number to string
    platts_price: string; // Change type from number to string

}

const ManageStationFuelPurchase: React.FC<ManageStationFuelPurchaseProps> = ({ postData, getData, isLoading }) => {
    const [data, setData] = useState<RowData[]>([]);
    const dispatch = useDispatch();
    const handleApiError = useErrorHandler();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserData, setEditUserData] = useState<Partial<RowData> | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // Assuming userId is a string
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const navigate = useNavigate();
    const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
    let storedKeyItems = localStorage.getItem("stationPurchase") || '[]';
    let storedKeyName = "stationPurchase";


    useEffect(() => {
        const storedData = localStorage.getItem(storedKeyName);

        if (storedData) {
            handleApplyFilters(JSON.parse(storedData));
        }
        // fetchData();
        dispatch(setPageTitle('Alternative Pagination Table'));
    }, [dispatch, currentPage]);
    const handleSuccess = () => {
        // fetchData();
    };

    const handlePageChange = (newPage: any) => {
        setCurrentPage(newPage);
    };

    const formik = useFormik<FormValues>({
        // initialValues: stationSettingInitialValues,
        initialValues: {
            data: undefined
        },
        // validationSchema: getStationValidationSchema(isEditMode),
        onSubmit: async (values, { resetForm }) => {
            try {

                console.log(values, "values");


                // const formData = new FormData();

                // formData.append(`id`, station_id);

                // formik?.values?.cards?.forEach((card, index) => {
                //     if (card.checked) {
                //         formData.append(`cards[${index}]`, card.id);
                //     }
                // });
                // formik?.values?.dataEntryCard?.forEach((card, index) => {
                //     if (card.checked) {
                //         formData.append(`data_entry_card_id[${index}]`, card.id);
                //     }
                // });

                // formik?.values?.fuels?.forEach((card, index) => {
                //     if (card.checked) {
                //         formData.append(`fuels[${index}]`, card.id);
                //     }
                // });
                // formik?.values?.reports?.forEach((card, index) => {
                //     if (card.checked) {
                //         formData.append(`reports[${index}]`, card.id);
                //     }
                // });


                // formik?.values?.charges?.forEach((card: any, index) => {
                //     if (card.checked) {
                //         formData.append(`charges[${index}]`, card.id);
                //         formData.append(`charge_amount[${card.id}]`, card.charge_value);
                //     }
                // });
                // formik?.values?.deductions?.forEach((card: any, index) => {
                //     if (card.checked) {
                //         formData.append(`deductions[${index}]`, card.id);
                //         formData.append(`deduction_amount[${card.id}]`, card.deduction_value);
                //     }
                // });

                // const url = `station/update-setting`;
                // const navigationpath: string = '/manage-stations/station'
                // const response = await postData(url, formData,);


                // console.log(response, "test");

                // if (response) {
                //     navigate("/manage-stations/station")
                // }

            } catch (error) {
                console.error('Submit error:', error);
                throw error; // Rethrow the error to be handled by the caller
            }
        },
    });



    const fetchData = async () => {
        try {
            const response = await getData(`/site/tank/list?page=${currentPage}`);
            if (response && response.data && response.data.data) {
                // setData(response.data.data?.Stations);
                // setCurrentPage(response.data.data?.currentPage || 1);
                // setLastPage(response.data.data?.lastPage || 1);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);

        }
    };
    const { toggleStatus } = useToggleStatus();
    const toggleActive = (row: RowData) => {
        const formData = new FormData();
        formData.append('id', row.id.toString());
        formData.append('station_status', (row.station_status === 1 ? 0 : 1).toString());
        toggleStatus(postData, '/station/update-status', formData, handleSuccess);
    };
    const { customDelete } = useCustomDelete();

    const handleDelete = (id: any) => {
        const formData = new FormData();
        formData.append('id', id);
        customDelete(postData, 'station/delete', formData, handleSuccess);
    };

    const isEditPermissionAvailable = true; // Placeholder for permission check
    const isDeletePermissionAvailable = true; // Placeholder for permission check
    const isAddonPermissionAvailable = true; // Placeholder for permission check

    const anyPermissionAvailable = isEditPermissionAvailable || isAddonPermissionAvailable || isDeletePermissionAvailable;

    const columns: any = [
        {
            name: "FUEL NAME",
            selector: (row: ColData) => row.fuel_name,
            sortable: false,
            width: "12.5%",
            center: true,
            cell: (row: ColData) => (
                <span className="text-muted fs-15 fw-semibold text-center">
                    {row.fuel_name !== undefined ? `${row.fuel_name}` : ""}
                </span>
            ),
        },
        {
            name: "PLATTS",
            selector: (row: ColData) => row.platts_price,
            sortable: false,
            width: "12.5%",
            center: true,

            cell: (row: ColData, index: number) => (
                <div>
                    <input
                        type="number"
                        id={`platts_price-${index}`}
                        name={`data[${index}].platts_price`}
                        className="table-input form-input"
                        step="0.01"
                        value={
                            formik?.values?.data && formik.values.data[index]?.platts_price
                        }
                        onChange={formik.handleChange}
                        onBlur={(e) => {
                            formik.handleBlur(e);
                            calculateSum(index);
                        }}
                    />
                </div>
            ),
        },
        {
            name: "PREMIUM",

            selector: (row: any) => row.premium_price,
            sortable: false,
            width: "12.5%",
            center: true,

            cell: (row: any, index: any) =>
                row.fuel_name === "Total" ? (
                    <h4 className="bottom-toal">{row.premium_price}</h4>
                ) : (
                    <div>
                        <input
                            type="number"
                            step="0.01"
                            id={`premium_price-${index}`}
                            name={`data[${index}].premium_price`}
                            className="table-input form-input"
                            value={
                                formik?.values?.data && formik.values.data[index]?.premium_price
                            }
                            onChange={formik.handleChange}
                            onBlur={(e) => {
                                formik.handleBlur(e);
                                calculateSum(index);
                            }}
                        />
                        {/* Error handling code */}
                    </div>
                ),
        },
        {
            name: "	DEVELOPMENT FUELS ",
            selector: (row: any) => row.development_fuels_price,
            sortable: false,
            width: "12.5%",
            center: true,

            cell: (row: any, index: any) =>
                row.fuel_name === "Total" ? (
                    <h4 className="bottom-toal">{row.development_fuels_price}</h4>
                ) : (
                    <div>
                        <input
                            type="number"
                            step="0.01"
                            id={`development_fuels_price-${index}`}
                            name={`data[${index}].development_fuels_price`}
                            className="table-input form-input"
                            value={
                                formik?.values?.data &&
                                formik.values.data[index]?.development_fuels_price
                            }
                            onChange={formik.handleChange}
                            onBlur={(e) => {
                                formik.handleBlur(e);
                                calculateSum(index);
                            }}
                        />
                        {/* Error handling code */}
                    </div>
                ),
        },
        {
            name: "DUTY ",
            selector: (row: any) => row.duty_price,
            sortable: false,
            width: "12.5%",
            center: true,

            cell: (row: any, index: any) =>
                row.fuel_name === "Total" ? (
                    <h4 className="bottom-toal">{row.duty_price}</h4>
                ) : (
                    <div>
                        <input
                            type="number"
                            step="0.01"
                            id={`duty_price-${index}`}
                            name={`data[${index}].duty_price`}
                            className="table-input form-input"
                            value={
                                formik?.values?.data && formik.values.data[index]?.duty_price
                            }
                            onChange={formik.handleChange}
                            onBlur={(e) => {
                                formik.handleBlur(e);
                                calculateSum(index);
                            }}
                        />
                        {/* Error handling code */}
                    </div>
                ),
        },

        {
            name: "EX VAT",
            selector: (row: any) => row.ex_vat_price,
            sortable: false,
            width: "12.5%",
            center: true,

            cell: (row: any, index: any) =>
                row.fuel_name === "Total" ? (
                    <h4 className="bottom-toal">{row.ex_vat_price}</h4>
                ) : (
                    <div>
                        <input
                            type="number"
                            step="0.01"
                            id={`ex_vat_price-${index}`}
                            name={`data[${index}].ex_vat_price`}
                            className="table-input readonly form-input"
                            value={
                                formik?.values?.data && formik.values.data[index]?.ex_vat_price
                            }
                            onChange={formik.handleChange}
                            readOnly
                            onBlur={formik.handleBlur}
                        />
                        {/* Error handling code */}
                    </div>
                ),
        },
        {
            name: "VAT %",
            selector: (row: any) => row.vat_percentage_rate,
            sortable: false,
            width: "12.5%",
            center: true,

            cell: (row: any, index: any) =>
                row.fuel_name === "Total" ? (
                    <h4 className="bottom-toal">{row.vat_percentage_rate}</h4>
                ) : (
                    <div>
                        <input
                            type="number"
                            step="0.01"
                            id={`vat_percentage_rate-${index}`}
                            name={`data[${index}].vat_percentage_rate`}
                            className="table-input form-input"
                            value={
                                formik?.values?.data &&
                                formik.values.data[index]?.vat_percentage_rate
                            }
                            onChange={formik.handleChange}
                            onBlur={(event) => {
                                formik.handleBlur(event);
                                sendEventWithName1(event, "vat_percentage_rate", index); // Call sendEventWithName1 with the event, name, and index parameters
                            }}
                        />
                        {/* Error handling code */}
                    </div>
                ),
        },
        {
            name: "TOTAL",
            selector: (row: any) => row.total,
            sortable: false,
            width: "12.5%",
            center: true,

            cell: (row: any, index: any) =>
                row.fuel_name === "Total" ? (
                    <h4 className="bottom-toal">{row.total}</h4>
                ) : (
                    <div>
                        <input
                            type="number"
                            id={`total-${index}`}
                            name={`data[${index}].total`}
                            className="table-input readonly form-input"
                            value={formik?.values?.data && formik.values.data[index]?.total}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            readOnly
                        />
                        {/* Error handling code */}
                    </div>
                ),
        },

        // ... remaining columns
    ];

    const openModal = async (id: string) => {
        try {
            setIsModalOpen(true);
            setIsEditMode(true);
            setUserId(id);

        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditUserData(null);
    };

    const handleFormSubmit = async (values: any) => {

        console.log(values, "handleFormSubmit ");

        try {
            const formData = new FormData();

            formData.append("platts_price", values.platts);
            formData.append("premium_price", values.premium);
            formData.append("development_fuels_price", values.developmentfuels);
            formData.append("duty_price", values.dutty);
            formData.append("vat_percentage_rate", values.vat);
            formData.append("ex_vat_price", values.exvat);
            formData.append("total", values.total);
            formData.append("date", values.start_date1);
            formData.append("fuel_id", values.fuel_name);
            // values.sites.forEach((site, index) => {
            //   formData.append(`station_id[${index}]`, site.id);
            // });
            // const selectedSiteIds = selected?.map((site) => site.value);

            // selectedSiteIds?.forEach((id, index) => {
            //     formData.append(`station_id[${index}]`, id);
            // });

            if (userId) {
                formData.append('id', userId);
            }

            const url = isEditMode && userId ? `/site/fuel/purchase-price/update` : `/site/fuel/purchase-price/add`;
            const response = await postData(url, formData);

            if (response && response.status_code == 200) {

                handleSuccess();
                closeModal();
            } else {
                console.error('Form submission failed:', response.statusText);
            }
        } catch (error) {
            handleApiError(error);
        }
    };
    const handleApplyFilters = async (values: any) => {
        console.log(values, "handleApplyFilters");

        const apiURL = `station/fuel/purchase-price?client_id=${values.client_id}&entity_id=${values.entity_id}&station_id=${values?.station_id}&date=${values.start_date}`

        try {
            const response = await getData(apiURL);
            if (response && response.data && response.data.data) {
                formik.setValues(response.data.data)
                setData(response.data.data);
                const { data } = response;
                if (data) {
                    setData(data?.data);
                    const formValues = data?.data.map((item: any) => {
                        return {
                            id: item.id,
                            fuel_name: item.fuel_name,
                            platts_price: item.platts_price,
                            premium_price: item.premium_price,
                            development_fuels_price: item.development_fuels_price,
                            duty_price: item.duty_price,
                            vat_percentage_rate: item.vat_percentage_rate,
                            ex_vat_price: item.ex_vat_price,
                            total: item.total,
                        };
                    });

                    formik.setFieldValue("data", formValues);
                }
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);

        }
    };
    const filterValues = async (values: any) => {
        console.log(values, "filterValues");
    };
    console.log(data, "data");
    console.log(formik?.values, "data formik in purchase");

    const validationSchemaForCustomInput = Yup.object({
        client_id: isNotClient
            ? Yup.string().required("Client is required")
            : Yup.mixed().notRequired(),
        entity_id: Yup.string().required("Entity is required"),
        station_id: Yup.string().required('Station is required'),
        start_date: Yup.string().required('Start Date is required'),
    });

    console.log(data, "data");


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
                        <span>Stations Fuel Purchase</span>
                    </li>
                </ul>

                <button type="button" className="btn btn-dark gradient-blue-to-blue" onClick={() => setIsModalOpen(true)}>
                    Add Station Fuel Purchase
                </button>
            </div>
            <AddEditStationFuelPurchaseModal getData={getData} isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} isEditMode={isEditMode} userId={userId} />

            <div className=" mt-6">
                <div className="grid xl:grid-cols-4 gap-6 mb-6">
                    <div className='panel h-full '>



                        <CustomInput
                            getData={getData}
                            isLoading={isLoading}
                            onApplyFilters={handleApplyFilters}
                            FilterValues={filterValues}
                            showClientInput={true}  // or false
                            showEntityInput={true}  // or false
                            showStationInput={true} // or false
                            showStationValidation={true} // or false
                            showDateValidation={true} // or false
                            validationSchema={validationSchemaForCustomInput}
                            layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-1 gap-5"
                            isOpen={false}
                            onClose={function (): void {
                                throw new Error('Function not implemented.');
                            }}
                            showDateInput={true}
                            // storedKeyItems={storedKeyItems}
                            storedKeyName={storedKeyName}
                        />
                        {/* <CustomInput
                            getData={getData}
                            isLoading={isLoading}
                            onApplyFilters={handleApplyFilters}
                            FilterValues={filterValues}
                            showClientInput={true}  // or false
                            showEntityInput={true}  // or false
                            showStationInput={true} // or false
                            showDateInput={true} // or false
                            validationSchema={validationSchemaForCustomInput}
                            layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-1 gap-5"
                            isOpen={false}
                            onClose={function (): void {
                                throw new Error('Function not implemented.');
                            }}
                        /> */}


                    </div>
                    <div className='panel h-full xl:col-span-3'>
                        <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                            <h5 className="font-semibold text-lg dark:text-white-light"> Stations Fuel Purchase</h5>
                            <div className="ltr:ml-auto rtl:mr-auto">
                                {/* <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} /> */}
                            </div>
                        </div>
                        {data?.length > 0 ? (
                            <>


                                <div className="datatables">
                                    <DataTable
                                        className="whitespace-nowrap table-striped table-hover table-bordered table-compact"
                                        columns={columns}
                                        data={data}
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
            {data?.length > 0 && lastPage > 1 && <CustomPagination currentPage={currentPage} lastPage={lastPage} handlePageChange={handlePageChange} />}
        </>
    );
};

export default withApiHandler(ManageStationFuelPurchase);

function calculateSum(index: number) {
    throw new Error('Function not implemented.');
}


function sendEventWithName1(event: React.FocusEvent<HTMLInputElement, Element>, arg1: string, index: any) {
    throw new Error('Function not implemented.');
}
