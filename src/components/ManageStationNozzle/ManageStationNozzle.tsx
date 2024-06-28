import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import DataTable from 'react-data-table-component';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import noDataImage from '../../assets/noDataFoundImage/noDataFound.png'; // Import the image
import useErrorHandler from '../../hooks/useHandleError';
import useToggleStatus from '../../utils/ToggleStatus';
import useCustomDelete from '../../utils/customDelete';
import CustomSwitch from '../FormikFormTools/CustomSwitch';
import LoaderImg from '../../utils/Loader';
import CustomPagination from '../../utils/CustomPagination';
import withApiHandler from '../../utils/withApiHandler';
import * as Yup from 'yup';
import AddEditStationNozzleModal from './AddEditStationNozzleModal';
import CustomInput from '../ManageStationTank/CustomInput';

interface ManageStationNozzleProps {
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
    station: string;
    code: string;
    name: string;
    fuel_name: string;
    station_code: string;
    station_address: string;
    getData: any;
}

const ManageStationNozzle: React.FC<ManageStationNozzleProps> = ({ postData, getData, isLoading }) => {
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
    let storedKeyItems: any = localStorage.getItem("stationNozzle") || '[]';
    let storedKeyName: any = "stationNozzle";

    const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
    useEffect(() => {
        const storedData = localStorage.getItem(storedKeyName);

        if (storedData) {
            handleApplyFilters(JSON.parse(storedData));
        }

    }, [currentPage]);
    const handleSuccess = () => {
        handleApplyFilters(JSON.parse(storedKeyItems));
    };

    const handlePageChange = (newPage: any) => {
        setCurrentPage(newPage);
    };

    const fetchData = async () => {

    };
    const { toggleStatus } = useToggleStatus();
    const toggleActive = (row: RowData) => {
        const formData = new FormData();
        formData.append('id', row.id.toString());
        formData.append('status', (row.status === 1 ? 0 : 1).toString());
        toggleStatus(postData, '/station/nozzle/update-status', formData, handleSuccess);
    };
    const { customDelete } = useCustomDelete();

    const handleDelete = (id: any) => {
        const formData = new FormData();
        formData.append('id', id);
        customDelete(postData, 'station/nozzle/delete', formData, handleSuccess);
    };

    const isEditPermissionAvailable = true; // Placeholder for permission check
    const isDeletePermissionAvailable = true; // Placeholder for permission check
    const isAddonPermissionAvailable = true; // Placeholder for permission check

    const anyPermissionAvailable = isEditPermissionAvailable || isAddonPermissionAvailable || isDeletePermissionAvailable;

    const columns: any = [
        {
            name: 'Nozzle Name',
            selector: (row: RowData) => row.name,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Nozzal Code',
            selector: (row: RowData) => row.code,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.code}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Fuel Name',
            selector: (row: RowData) => row.fuel_name,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.fuel_name}</h6>
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
            selector: (row: RowData) => row.status,
            sortable: false,
            width: '10%',
            cell: (row: RowData) => (
                <Tippy content={<div>Status</div>} placement="top">
                    {row.status === 1 || row.status === 0 ? (
                        <CustomSwitch checked={row.status === 1} onChange={() => toggleActive(row)} />
                    ) : (
                        <div className="pointer" >
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
                                {/* <div className="dropdown">
                                      <Dropdown
                                          btnClassName="btn btn-success dropdown-toggle"
                                          button={
                                              <>
                                                  Action
                                                  <span>
                                                      <IconCaretDown className="ltr:ml-1 rtl:mr-1 inline-block" />
                                                  </span>
                                              </>
                                          }
                                      >
                                          <ul className="!min-w-[170px]">
                                              <li>
                                                  <button type="button">Edit</button>
                                              </li>
                                              <li>
                                                  <button type="button" onClick={() => handleDelete(row.id)}>
                                                      Delete
                                                  </button>
                                              </li>
                                          </ul>
                                      </Dropdown>
                                  </div> */}

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

            formData.append('code', values.code);
            formData.append('name', values.name);
            formData.append('status', values.status);
            formData.append('station_id', values.station_id);
            formData.append('client_id', values.client_id);
            formData.append('entity_id', values.entity_id);
            formData.append('station_pump_id', values.station_pump_id);
            formData.append('fuel_id', values.fuel_id);

            if (userId) {
                formData.append('id', userId);
            }

            const url = isEditMode && userId ? `/station/nozzle/update` : `/station/nozzle/create`;
            const response = await postData(url, formData);

            if (response) {

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
        try {
            const response = await getData(`/station/nozzle/list?station_id=${values.station_id}`);
            if (response && response.data && response.data.data) {
                setData(response.data.data);
                // setCurrentPage(response.data.data?.currentPage || 1);
                // setLastPage(response.data.data?.lastPage || 1);
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
        entity_id: Yup.string().required("Entity is required"),
        client_id: isNotClient
            ? Yup.string().required("Client is required")
            : Yup.mixed().notRequired(),
        station_id: Yup.string().required('Station is required'),
    });

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
                        <span>Stations Nozzle</span>
                    </li>
                </ul>

                <button type="button" className="btn btn-dark " onClick={() => setIsModalOpen(true)}>
                    Add Station Nozzle
                </button>
            </div>
            <AddEditStationNozzleModal getData={getData} isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} isEditMode={isEditMode} userId={userId} />

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
                            validationSchema={validationSchemaForCustomInput}
                            layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-1 gap-5"
                            isOpen={false}
                            onClose={function (): void {
                                throw new Error('Function not implemented.');
                            }}
                            showDateInput={false}
                            // storedKeyItems={storedKeyItems}
                            storedKeyName={storedKeyName}
                        />


                    </div>
                    <div className='panel h-full xl:col-span-3'>
                        <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                            <h5 className="font-semibold text-lg dark:text-white-light"> Stations Nozzle</h5>
                            <div className="ltr:ml-auto rtl:mr-auto">
                                {/* <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} /> */}
                            </div>
                        </div>
                        {data?.length > 0 ? (
                            <>
                                <div className="datatables">
                                    <DataTable
                                        className=" table-striped table-hover table-bordered table-compact"
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

export default withApiHandler(ManageStationNozzle);