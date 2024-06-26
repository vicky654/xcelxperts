import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import DataTable from 'react-data-table-component';
import LoaderImg from '../../../utils/Loader';
import { setPageTitle } from '../../../store/themeConfigSlice';
import withApiHandler from '../../../utils/withApiHandler';
import 'tippy.js/dist/tippy.css';
import ErrorHandler from '../../../hooks/useHandleError';
import noDataImage from '../../../assets/noDataFoundImage/noDataFound.png'; // Import the image
import { useFormik } from 'formik';
import { Card } from 'react-bootstrap';

interface ManageSiteProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    // onSubmit: (values: any, formik: any) => Promise<void>;
}
interface row {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    // onSubmit: (values: any, formik: any) => Promise<void>;
}


interface RouteParams {
    id: string; // Adjust the type according to your route configuration
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
}


interface CardRow {
    checked: boolean;
    card_name: string;
    charge_name: string;
    charge_value: string;
    deduction_value: string;
    deduction_name: string;
    drs_card_name: string;
    fuel_name: string;
    report_name: string;
    // Add other properties as needed
    // e.g., id: number;
}

interface Card {
    id: string;
    checked: boolean;
    charge_value?: string; // Optional property for charge value
    deduction_value?: number; // Optional property for deduction value
}

interface FormValues {
    id: string;
    station_name: string;
    cards: Card[];
    dataEntryCard: Card[];
    fuels: Card[];
    reports: Card[];
    charges: Card[];
    deductions: {
        id: string;
        deduction_value: number;
    }[];
}

// Assuming stationSettingInitialValues has this structure
const stationSettingInitialValues: FormValues = {
    id: '', // You can assign an initial value if needed
    station_name: '', // You can assign an initial value if needed
    cards: [], // Assuming cards is an array of Card objects
    dataEntryCard: [],
    fuels: [],
    reports: [],
    charges: [],
    deductions: [],
};


const StationSetting: React.FC<ManageSiteProps> = ({ postData, getData, isLoading }) => {
    const [data, setData] = useState<RowData[]>([]);
    const dispatch = useDispatch();
    const handleApiError = ErrorHandler();
    const [currentPage, setCurrentPage] = useState(1);
    const { id } = useParams();
    const navigate = useNavigate();

    // Define the type of id
    let station_id: any = id; // Assuming id is a string

    useEffect(() => {
        fetchData();
        dispatch(setPageTitle('Alternative Pagination Table'));
    }, [dispatch, currentPage]);


    const formik = useFormik<FormValues>({
        initialValues: stationSettingInitialValues,
        // validationSchema: getStationValidationSchema(isEditMode),
        onSubmit: async (values, { resetForm }) => {
            try {

                const formData = new FormData();

                formData.append(`id`, station_id);

                formik?.values?.cards?.forEach((card, index) => {
                    if (card.checked) {
                        formData.append(`cards[${index}]`, card.id);
                    }
                });
                formik?.values?.dataEntryCard?.forEach((card, index) => {
                    if (card.checked) {
                        formData.append(`data_entry_card_id[${index}]`, card.id);
                    }
                });

                formik?.values?.fuels?.forEach((card, index) => {
                    if (card.checked) {
                        formData.append(`fuels[${index}]`, card.id);
                    }
                });
                formik?.values?.reports?.forEach((card, index) => {
                    if (card.checked) {
                        formData.append(`reports[${index}]`, card.id);
                    }
                });


                formik?.values?.charges?.forEach((card: any, index) => {
                    if (card.checked) {
                        formData.append(`charges[${index}]`, card.id);
                        formData.append(`charge_amount[${card.id}]`, card.charge_value);
                    }
                });
                formik?.values?.deductions?.forEach((card: any, index) => {
                    if (card.checked) {
                        formData.append(`deductions[${index}]`, card.id);
                        formData.append(`deduction_amount[${card.id}]`, card.deduction_value);
                    }
                });

                const url = `station/update-setting`;
                const navigationpath: string = '/manage-stations/station'
                const response = await postData(url, formData,);


                console.log(response, "test");

                if (response) {
                    navigate("/manage-stations/station")
                }

            } catch (error) {
                console.error('Submit error:', error);
                throw error; // Rethrow the error to be handled by the caller
            }
        },
    });

    const fetchData = async () => {
        try {
            const response = await getData(`/station/get-setting-list/${id}`);
            if (response && response.data && response.data.data) {
                setData(response.data.data);
                formik.setValues(response.data.data)
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
            // console.error('API error:', error);
        }
    };

    const CardsModelColumn: any = [
        {
            name: "Select",
            selector: "checked",
            sortable: false,
            center: true,
            width: "20%",
            cell: (row: CardRow, index: number) => (
                <div>
                    <input
                        type="checkbox"
                        id={`checked-${index}`}
                        name={`cards[${index}].checked`}
                        className="pointer form-check-input table-checkbox-input"
                        checked={
                            row?.checked ?? false
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {/* Error handling code */}
                </div>
            ),
        },
        {
            name: "Assign Card Model",
            selector: (row: CardRow) => row.card_name,
            sortable: false,
            width: "80%",
            cell: (row: CardRow) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.card_name}</h6>
                    </div>
                </div>
            ),
        },
    ];
    const dataEntryCardColumn: any = [
        {
            name: "Select",
            selector: "checked",
            sortable: false,
            center: true,
            width: "20%",
            cell: (row: CardRow, index: number) => (
                <div>
                    <input
                        type="checkbox"
                        id={`checked-${index}`}
                        name={`dataEntryCard[${index}].checked`}
                        className="pointer form-check-input table-checkbox-input"
                        checked={
                            row?.checked ?? false
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
            ),
        },
        {
            name: "Data Entry Card Model",
            selector: (row: CardRow) => row.drs_card_name,
            sortable: false,
            width: "80%",
            cell: (row: CardRow) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.drs_card_name}</h6>
                    </div>
                </div>
            ),
        },
    ];
    const fuelsColumn: any = [
        {
            name: "Select",
            selector: "checked",
            sortable: false,
            center: true,
            width: "20%",
            cell: (row: CardRow, index: number) => (
                <div>
                    <input
                        type="checkbox"
                        id={`fuels-${index}`}
                        name={`fuels[${index}].checked`}
                        className="pointer form-check-input table-checkbox-input"
                        checked={
                            row?.checked ?? false
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
            ),
        },
        {
            name: "Fuels Card Model",
            selector: (row: CardRow) => row.fuel_name,
            sortable: false,
            width: "80%",
            cell: (row: CardRow) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.fuel_name}</h6>
                    </div>
                </div>
            ),
        },
    ];
    const reportsColumn: any = [
        {
            name: "Select",
            selector: "checked",
            sortable: false,
            center: true,
            width: "20%",
            cell: (row: CardRow, index: number) => (
                <div>
                    <input
                        type="checkbox"
                        id={`checked-${index}`}
                        name={`reports[${index}].checked`}
                        className="pointer form-check-input table-checkbox-input"
                        checked={
                            row?.checked ?? false
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
            ),
        },
        {
            name: "Reports Card Model",
            selector: (row: CardRow) => row.report_name,
            sortable: false,
            width: "80%",
            cell: (row: CardRow) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.report_name}</h6>
                    </div>
                </div>
            ),
        },
    ];


    const chargesColumns: any = [
        {
            name: "Select",
            selector: "checked",
            sortable: false,
            center: true,
            width: "20%",
            cell: (row: CardRow, index: number) => (
                <div>
                    <input
                        type="checkbox"
                        id={`checked-${index}`}
                        name={`charges[${index}].checked`}
                        className="pointer form-check-input table-checkbox-input"
                        checked={
                            row?.checked ?? false
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {/* Error handling code */}
                </div>
            ),
        },
        {
            name: "Charges Card Modal",
            width: "40%",
            selector: (row: CardRow,) => row.charge_name,
            sortable: false,
            cell: (row: CardRow, index: number) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.charge_name}</h6>
                    </div>
                </div>
            ),
        },

        {
            name: "Amount",
            selector: (row: CardRow,) => row.charge_value,
            sortable: false,
            width: "40%",
            center: true,
            cell: (row: CardRow, index: number) => (
                <div>
                    <input
                        type="number"
                        id={`charge_value-${index}`}
                        name={`charges[${index}].charge_value`}
                        className=" form-input "
                        value={row?.charge_value ?? 0}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
            ),
        },
    ];
    const deductionsColumns: any = [
        {
            name: "Select",
            selector: "checked",
            sortable: false,
            center: true,
            width: "20%",
            cell: (row: CardRow, index: number) => (
                <div>
                    <input
                        type="checkbox"
                        id={`checked-${index}`}
                        name={`deductions[${index}].checked`}
                        className="pointer form-check-input table-checkbox-input"
                        checked={
                            row?.checked ?? false
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {/* Error handling code */}
                </div>
            ),
        },
        {
            name: "Deductions Card Modal",
            width: "40%",
            selector: (row: CardRow,) => row.deduction_name,
            sortable: false,
            cell: (row: CardRow, index: number) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.deduction_name}</h6>
                    </div>
                </div>
            ),
        },

        {
            name: "Amount",
            selector: (row: CardRow,) => row.charge_value,
            sortable: false,
            width: "40%",
            center: true,
            cell: (row: CardRow, index: number) => (
                <div>
                    <input
                        type="number"
                        id={`charge_value-${index}`}
                        name={`deductions[${index}].deduction_value`}
                        className=" form-input "
                        value={row?.deduction_value ?? 0}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
            ),
        },
    ];


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
                        <span>Stations</span>
                    </li>
                </ul>


            </div>

            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light "> {formik?.values?.station_name} Station</h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        {/* <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} /> */}
                    </div>
                </div>

                <form onSubmit={formik.handleSubmit} className="p-4 mb-5 bg-white dark:bg-black">
                    <div className="grid xl:grid-cols-3 gap-6 mb-6">
                        <div
                            className='panel h-full xl:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                            <h6 className="px-3 mb-3 font-semibold text-md dark:text-white-light bg-gray-100 py-4 ">Assign Card</h6>
                            {formik?.values?.cards?.length > 0 ? (
                                <>
                                    <div className="module-height">
                                        <DataTable
                                            className=" table-striped table-hover table-bordered table-compact"
                                            columns={CardsModelColumn}
                                            data={formik?.values?.cards}
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
                        <div className='panel h-full xl:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                            <h6 className="px-3 mb-3 font-semibold text-md dark:text-white-light bg-gray-100 py-4">Data Entry Card</h6>
                            {formik?.values?.dataEntryCard?.length > 0 ? (
                                <>
                                    <div className="module-height">
                                        <DataTable
                                            className=" table-striped table-hover table-bordered table-compact"
                                            columns={dataEntryCardColumn}
                                            data={formik?.values?.dataEntryCard}
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
                        <div
                            className='panel h-full xl:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                            <h6 className="px-3 mb-3 font-semibold text-md dark:text-white-light bg-gray-100 py-4">Fuels Card</h6>
                            {formik?.values?.fuels?.length > 0 ? (
                                <>
                                    <div className="module-height">
                                        <DataTable
                                            className=" table-striped table-hover table-bordered table-compact"
                                            columns={fuelsColumn}
                                            data={formik?.values?.fuels}
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
                        <div className='panel h-full xl:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                            <h6 className="px-3 mb-3 font-semibold text-md dark:text-white-light bg-gray-100 py-4">Reports Card</h6>
                            {formik?.values?.reports?.length > 0 ? (
                                <>
                                    <div className="module-height">
                                        <DataTable
                                            className=" table-striped table-hover table-bordered table-compact"
                                            columns={reportsColumn}
                                            data={formik?.values?.reports}
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
                        <div className='panel h-full xl:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                            <h6 className="px-3 mb-3 font-semibold text-md dark:text-white-light bg-gray-100 py-4">Charges Card</h6>
                            {formik?.values?.cards?.length > 0 ? (
                                <>
                                    <div className="module-height">
                                        <DataTable
                                            className=" table-striped table-hover table-bordered table-compact"
                                            columns={chargesColumns}
                                            data={formik?.values?.charges}
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
                        <div className='panel h-full xl:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                            <h6 className="px-3 mb-3 font-semibold text-md dark:text-white-light bg-gray-100 py-4">Deductions</h6>
                            {formik?.values?.deductions?.length > 0 ? (
                                <>
                                    <div className="module-height">
                                        <DataTable
                                            className=" table-striped table-hover table-bordered table-compact"
                                            columns={deductionsColumns}
                                            data={formik?.values?.deductions}
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


                    <div className="sm:col-span-2 mt-3 text-end">
                        <button type="submit" className="btn btn-primary ">
                            Update
                        </button>
                    </div>

                </form>

            </div>
        </>
    );
};

export default withApiHandler(StationSetting);