import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import DataTable from 'react-data-table-component';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import noDataImage from '../../assets/noDataFoundImage/noDataFound.png'; // Import the image
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
import AddEditStationFuelSellingModal from './AddEditStationFuelSellingModal';

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
    useEffect(() => {
        fetchData();
    }, [currentPage]);
    const handleSuccess = () => {
        fetchData();
    };

    const handlePageChange = (newPage: any) => {
        setCurrentPage(newPage);
    };



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
            name: 'Station Name',
            selector: (row: RowData) => row.station_name,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.station_name}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Station Code',
            selector: (row: RowData) => row.station_code,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.station_code}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Station Address',
            selector: (row: RowData) => row.station_address,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.station_address}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Created Date',
            selector: (row: RowData) => row.created_date,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex" style={{ cursor: 'default' }}>
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Status',
            selector: (row: RowData) => row.station_status,
            sortable: false,
            width: '10%',
            cell: (row: RowData) => (
                <Tippy content={<div>Status</div>} placement="top">
                    {row.station_status === 1 || row.station_status === 0 ? (
                        <CustomSwitch checked={row.station_status === 1} onChange={() => toggleActive(row)} />
                    ) : (
                        <div className="pointer" onClick={() => toggleActive(row)}>
                            Unknown
                        </div>
                    )}
                </Tippy>
            ),
        },
        anyPermissionAvailable
            ? {
                name: 'Actions',
                selector: (row: RowData) => row.id,
                sortable: false,
                width: '10%',
                cell: (row: RowData) => (
                    <span className="text-center">
                        <div className="flex items-center justify-center">
                            <div className="inline-flex">


                                <Tippy content="Edit">
                                    <button type="button" onClick={() => openModal(row?.id)}>
                                        <i className="pencil-icon fi fi-rr-file-edit"></i>
                                    </button>
                                </Tippy>
                                <Tippy content="Delete">
                                    <button onClick={() => handleDelete(row.id)} type="button">
                                        <i className="icon-setting delete-icon fi fi-rr-trash-xmark"></i>
                                    </button>
                                </Tippy>
                            </div>
                        </div>
                    </span>
                ),
            }
            : null,
    ];
    // station/detail?id=${selectedRowId}
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
        try {
            const formData = new FormData();

            formData.append('status', values.status);
            formData.append('tank_name', values.tank_name);
            formData.append('site_id', values.station_id);
            formData.append('fuel_id', values.fuel_id);
            formData.append('tank_code', values.tank_code);

            if (userId) {
                formData.append('id', userId);
            }

            const url = isEditMode && userId ? `/site/tank/update` : `/site/tank/create`;
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
        console.log(values, "handleApplyFilters");

        const apiURL = `site/fuel-price?client_id=${values.client_id}&company_id=${values.company_id}&drs_date=${values.start_date}`

        try {
            const response = await getData(apiURL);
            if (response && response.data && response.data.data) {
                setData(response.data.data);
                setCurrentPage(response.data.data?.currentPage || 1);
                setLastPage(response.data.data?.lastPage || 1);
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

    const validationSchemaForCustomInput = Yup.object({
        entity_id: Yup.string().required("Entity is required"),
        client_id: isNotClient
            ? Yup.string().required("Client is required")
            : Yup.mixed().notRequired(),
        // client_id: Yup.string().required('Client is required'),
        // company_id: Yup.string().required('Entity is required'),
        // site_id: Yup.string().required('Station is required'),
    });

    function handleInputChange(id: string, value: string): void {
        throw new Error('Function not implemented.');
    }

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

                {/* <button type="button" className="btn btn-dark " onClick={() => setIsModalOpen(true)}>
                    Add Station Fuel Sale
                </button> */}
            </div>
            {/* <AddEditStationFuelSellingModal getData={getData} isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} isEditMode={isEditMode} userId={userId} /> */}

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
                            showDateInput={true} // or false
                            validationSchema={validationSchemaForCustomInput}
                            layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-1 gap-5"
                            isOpen={false}
                            onClose={function (): void {
                                throw new Error('Function not implemented.');
                            }}
                        />


                    </div>
                    <div className='panel h-full xl:col-span-3'>
                        <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                            <h5 className="font-semibold text-lg dark:text-white-light"> Stations Fuel Sale</h5>
                            <div className="ltr:ml-auto rtl:mr-auto">
                                {/* <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} /> */}
                            </div>
                        </div>
                        {data?.listing?.length > 0 ? (
                            <>

                                <table>
                                    <thead>
                                        <tr key={"header"}>
                                            {data?.head_array?.map((shop: any) => (
                                                <td className="text-center">{shop}</td>
                                            ))}
                                        </tr>
                                        {/* <tr>
                                            <th className="ltr:rounded-l-md rtl:rounded-r-md">Name</th>
                                            <th >Gross Sales</th>
                                            <th >Net Sales</th>
                                            <th className="text-center">Total Transaction</th>
                                            <th className="text-center ltr:rounded-r-md rtl:rounded-l-md">Profit</th>
                                        </tr> */}
                                    </thead>
                                    <tbody>

                                        {data?.listing?.map((item: any) => (
                                            <tr className="fuelprice-tr" key={item?.id} style={{ padding: "0px" }}>
                                                <td className="whitespace-nowrap">
                                                    <span
                                                        className={
                                                            item?.link_clickable
                                                                ? "text-muted fs-15 fw-semibold text-center fuel-site-name"
                                                                : "text-muted fs-15 fw-semibold text-center"
                                                        }
                                                    // onClick={item?.link_clickable ? () => handleModalOpen(item) : null}
                                                    >
                                                        {item?.site_name} <span className="itemcount">{item?.count}</span>
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap">
                                                    <span className="text-muted fs-15 fw-semibold text-center">
                                                        {item?.time}
                                                    </span>
                                                </td>

                                                {Array.isArray(item?.fuels) &&
                                                    item.fuels.map((fuel: any, index: any) => (
                                                        <td key={index} className="whitespace-nowrap">
                                                            {Array.isArray(fuel) ? (
                                                                <input type="text" className="table-input readonly" readOnly />
                                                            ) : (
                                                                <input
                                                                    type="number"
                                                                    step="0.010"
                                                                    className={`table-input ${fuel?.status === "UP"
                                                                        ? "table-inputGreen"
                                                                        : fuel?.status === "DOWN"
                                                                            ? "table-inputRed"
                                                                            : ""
                                                                        } ${!fuel?.is_editable ? "readonly" : ""}`}
                                                                    value={fuel?.price}
                                                                    readOnly={!fuel?.is_editable}
                                                                    id={fuel?.id}
                                                                    onChange={(e) =>
                                                                        handleInputChange(e.target.id, e.target.value)
                                                                    }
                                                                />
                                                            )}
                                                        </td>
                                                    ))}
                                            </tr>
                                            // <tr key={shop.id}>
                                            //     <td className="whitespace-nowrap">{shop?.name}</td>
                                            //     <td className="whitespace-nowrap">{shop?.gross_sales}</td>
                                            //     <td className="whitespace-nowrap">{shop?.nett_sales}</td>
                                            //     <td className="text-center">{shop?.total_transactions}</td>
                                            //     <td className="text-center">
                                            //         <span className="badge bg-success/20 text-success rounded-full hover:top-0">{shop?.profit}</span>
                                            //     </td>
                                            // </tr>
                                        ))}
                                    </tbody>
                                </table>
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

export default withApiHandler(ManageStationFuelSelling);