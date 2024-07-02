import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import 'tippy.js/dist/tippy.css';
import noDataImage from '../../assets/noDataFoundImage/noDataFound.png'; // Import the image
import useErrorHandler from '../../hooks/useHandleError';
import { setPageTitle } from '../../store/themeConfigSlice';
import LoaderImg from '../../utils/Loader';
import withApiHandler from '../../utils/withApiHandler';
import * as Yup from 'yup';
import CustomInput from '../ManageStationTank/CustomInput';
import AddEditStationFuelPurchaseModal from './AddEditStationFuelPurchaseModal';
import { useFormik } from 'formik';
import { MultiSelect } from 'react-multi-select-component';
import { FormGroup } from 'react-bootstrap';
import showMessage from '../../hooks/showMessage';
import { IRootState } from '../../store';

interface ManageStationFuelPurchaseProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    // onSubmit: (values: any, formik: any) => Promise<void>;
}
interface FormValues {
    start_date(arg0: string, start_date: any): unknown;
    length: number;
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
    const [stationData, setstationData] = useState<any>();
    const dispatch = useDispatch();
    const handleApiError = useErrorHandler();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserData, setEditUserData] = useState<Partial<RowData> | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // Assuming userId is a string
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
    let storedKeyName = "stationPurchase";






    useEffect(() => {
        const storedData = localStorage.getItem(storedKeyName);

        if (storedData) {
            setstationData(JSON.parse(storedData))
            handleApplyFilters(JSON.parse(storedData));
        }
        dispatch(setPageTitle('Alternative Pagination Table'));
    }, [dispatch, currentPage]);
    const handleSuccess = () => {
        // fetchData();
        const storedData = localStorage.getItem(storedKeyName);

        if (storedData) {
            setstationData(JSON.parse(storedData))
            handleApplyFilters(JSON.parse(storedData));
        }
    };





    const handlePageChange = (newPage: any) => {
        setCurrentPage(newPage);
    };

    const validationPurchaseSchema = Yup.object().shape({
        selected: Yup.array()
            .of(Yup.string()) // Assuming station IDs are strings; adjust as per your data type
            .min(1, 'Please select at least one station')
            .required('Please select at least one station'),
    });



    const formik = useFormik({
        initialValues: {} as any,
        // validationSchema: getStationValidationSchema(isEditMode),
        onSubmit: async (values, { resetForm }) => {
            try {
            } catch (error) {
                console.error('Submit error:', error);
                throw error; // Rethrow the error to be handled by the caller
            }
        },
    });





    const UserPermissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);

    const isAddPermissionAvailable = UserPermissions?.includes("fuel-purchase-add");
    const isListPermissionAvailable = UserPermissions?.includes("fuel-purchase-list");
    const isEditPermissionAvailable = UserPermissions?.includes("fuel-purchase-update");
    const isEditSettingPermissionAvailable = UserPermissions?.includes("fuel-purchase-setting");
    const isDeletePermissionAvailable = UserPermissions?.includes("fuel-purchase-delete");
    const isAssignAddPermissionAvailable = UserPermissions?.includes("fuel-purchase-assign-permission");


    const anyPermissionAvailable = isEditPermissionAvailable || isDeletePermissionAvailable;
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
                        name={`[${index}].platts_price`}
                        className="table-input form-input"
                        step="0.01"
                        value={row?.platts_price}
                        // value={
                        //     formik?.values && formik.values.[index]?.platts_price
                        // }
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
                            name={`[${index}].premium_price`}
                            className="table-input form-input"
                            value={row?.premium_price}
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
                            name={`[${index}].development_fuels_price`}
                            className="table-input form-input"
                            value={row?.development_fuels_price}
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
                            name={`[${index}].duty_price`}
                            className="table-input form-input"
                            value={row?.duty_price}
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
                            name={`[${index}].ex_vat_price`}
                            className="table-input readonly form-input"
                            value={row?.ex_vat_price}
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
                            name={`[${index}].vat_percentage_rate`}
                            className="table-input form-input"
                            value={row?.vat_percentage_rate}
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
                            value={row?.total}
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


    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditUserData(null);
    };

    const handleFormSubmit = async (values: any, selected: any) => {


        try {
            const formData = new FormData();

            formData.append("platts_price", values.platts);
            formData.append("premium_price", values.premium);
            formData.append("development_fuels_price", values.development_fuels_price);
            formData.append("duty_price", values.duty_price);
            formData.append("vat_percentage_rate", values.vat_percentage_rate);
            formData.append("ex_vat_price", values.ex_vat_price);
            formData.append("total", values.total);
            formData.append("date", values.date);
            formData.append("fuel_id", values.fuel_id);


            values?.selectedStations?.forEach((selected: any, index: any) => {
                formData.append(`station_id[${index}]`, selected.value);
            });
            if (userId) {
                formData.append('id', userId);
            }

            const url = isEditMode && userId ? `/station/fuel/purchase-price/update` : `/station/fuel/purchase-price/create`;
            const isSuccess = await postData(url, formData);
            if (isSuccess) {
                handleSuccess();
                closeModal();
            }
        } catch (error) {
            handleApiError(error);
        }
    };
    const handleApplyFilters = async (values: any) => {
        setSelected([])

        setstationData(values)

        const apiURL = `station/fuel/purchase-price?client_id=${values?.client_id}&entity_id=${values?.entity_id}&station_id=${values?.station_id}&date=${values?.start_date}`

        try {
            const response = await getData(apiURL);
            if (response && response.data && response.data.data) {
                if (response && response?.data) {
                    formik.setValues(response.data.data)
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

    const validationSchemaForCustomInput = Yup.object({
        client_id: isNotClient
            ? Yup.string().required("Client is required")
            : Yup.mixed().notRequired(),
        entity_id: Yup.string().required("Entity is required"),
        station_id: Yup.string().required('Station is required'),
        start_date: Yup.string().required('Start Date is required'),
    });


    const handleSubmitForm1 = async (event: any) => {
        event.preventDefault();
        if (
            selected === undefined ||
            selected === null ||
            (Array?.isArray(selected) && selected?.length === 0)
        ) {
            showMessage("Pleaseeeee select at least one site", 'error');
        }

        // Check if at least one site is selected
        if (!selected || selected?.length === 0) {
            showMessage("Please select at least one site", 'error');
            return; // Exit the function if no site is selected
        }


        try {
            const formData = new FormData();
            formik?.values?.forEach((obj: any) => {
                const id = obj.id;
                const platts_price = `platts_price[${id}]`;
                const premium_price = `premium_price[${id}]`;
                const development_fuels_price = `development_fuels_price[${id}]`;
                const duty_price = `duty_price[${id}]`;
                const vat_percentage_rate = `vat_percentage_rate[${id}]`;
                const total = `total[${id}]`;
                const ex_vat_price = `ex_vat_price[${id}]`;

                const platts_price_Value = obj.platts_price;
                const premium_price_discount = obj.premium_price;
                const development_fuels_price_nettValue = obj.development_fuels_price;
                const ex_vat_price_price = obj.ex_vat_price;
                const vat_percentage_rate_price = obj.vat_percentage_rate;

                const total_values = obj.total;
                const duty_price_salesValue = obj.duty_price;
                // const action = obj.action;

                formData.append(platts_price, platts_price_Value);
                formData.append(premium_price, premium_price_discount);
                formData.append(
                    development_fuels_price,
                    development_fuels_price_nettValue
                );
                formData.append(duty_price, duty_price_salesValue);
                formData.append(vat_percentage_rate, vat_percentage_rate_price);
                formData.append(ex_vat_price, ex_vat_price_price);
                formData.append(total, total_values);
            });

            const selectedSiteIds = selected?.map((site: any) => site.value);

            selectedSiteIds?.forEach((id: any, index: number) => {
                formData.append(`station_id[${index}]`, id);
            });

            formData.append("date", stationData?.start_date);

            const postDataUrl = "/station/fuel/purchase-price/update";

            await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
        } catch (error) {
            console.log(error); // Set the submission state to false if an error occurs
        }
    };
    const [selected, setSelected] = useState<any>([]);




    function calculateSum(index: number) {
        const plattsPrice =
            formik?.values && formik.values?.[index]?.platts_price;
        const developmentfuels_price =
            formik?.values &&
            formik.values?.[index]?.development_fuels_price;
        const dutyprice =
            formik?.values && formik.values?.[index]?.duty_price;
        const premiumPrice =
            formik?.values && formik.values?.[index]?.premium_price;

        if (
            plattsPrice !== undefined &&
            premiumPrice !== undefined &&
            developmentfuels_price !== undefined &&
            dutyprice !== undefined
        ) {
            const sum =
                (parseFloat(plattsPrice) +
                    parseFloat(premiumPrice) +
                    parseFloat(developmentfuels_price) +
                    parseFloat(dutyprice)) /
                100;

            const roundedSum = sum.toFixed(2);
            formik.setFieldValue(`[${index}].ex_vat_price`, roundedSum);
        }
    }
    const sendEventWithName1 = (event: any, name: any, index: number) => {
        const plattsValue =
            parseFloat(
                formik?.values && formik.values?.[index]?.vat_percentage_rate
            ) || 0;

        const SumTotal = parseFloat(
            formik?.values && formik.values?.[index]?.ex_vat_price
        );

        const sum = (SumTotal * plattsValue) / 100 + SumTotal;

        const roundedSum = Math.round(sum * 100) / 100; // Round to two decimal places
        const formattedSum = roundedSum.toFixed(2).padEnd(5, "0");

        formik.setFieldValue(`[${index}].total`, formattedSum);
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
                        <span>Stations Fuel Purchase</span>
                    </li>
                </ul>

                {isAddPermissionAvailable && <>
                    <button type="button" className="btn btn-dark " onClick={() => setIsModalOpen(true)}>
                        Add Station Fuel Purchase
                    </button>
                </>}


            </div>
            <AddEditStationFuelPurchaseModal getData={getData} isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} isEditMode={isEditMode} userId={userId} />

            <div className=" mt-6">
                <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6'>
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

                    </div>
                    <div className='panel h-full xl:col-span-3'>
                        <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                            <h5 className="font-semibold text-lg dark:text-white-light"> Stations Fuel Purchase</h5>
                            <div className="ltr:ml-auto rtl:mr-auto">
                                {/* <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} /> */}
                            </div>
                        </div>
                        {formik?.values?.length > 0 ? (
                            <>

                                <>
                                    <form onSubmit={handleSubmitForm1}>
                                        <div className=' my-4'>
                                            <FormGroup>
                                                <label className="form-label mt-4">
                                                    Select Stations
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <MultiSelect
                                                    value={selected}
                                                    onChange={setSelected}
                                                    labelledBy="Select Sites"
                                                    // disableSearch="true"
                                                    options={stationData?.sites?.map((item: any) => ({ value: item?.id, label: item?.name })) || []}
                                                />
                                            </FormGroup>
                                        </div>
                                        <div className="table-responsive deleted-table">
                                            <DataTable
                                                className=" table-striped table-hover table-bordered table-compact"
                                                columns={columns}
                                                data={formik?.values}
                                                noHeader
                                                defaultSortAsc={false}
                                                striped={true}
                                                persistTableHead
                                                highlightOnHover
                                                responsive={true}
                                            />
                                        </div>
                                        {isEditPermissionAvailable ? (
                                            <div className="d-flex justify-content-end mt-3 ">
                                                {data ? (
                                                    <>
                                                        <button className="btn btn-primary" type="submit">
                                                            Update
                                                        </button>
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </form>
                                </>
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

export default withApiHandler(ManageStationFuelPurchase);

function calculateSum(index: number) {
    throw new Error('Function not implemented.');
}


function sendEventWithName1(event: React.FocusEvent<HTMLInputElement, Element>, arg1: string, index: any) {
    throw new Error('Function not implemented.');
}
