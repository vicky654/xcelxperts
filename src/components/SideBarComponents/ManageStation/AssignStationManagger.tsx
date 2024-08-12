import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import LoaderImg from '../../../utils/Loader';
import { setPageTitle } from '../../../store/themeConfigSlice';
import withApiHandler from '../../../utils/withApiHandler';
import useToggleStatus from '../../../utils/ToggleStatus';
import useCustomDelete from '../../../utils/customDelete';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import CustomPagination from '../../../utils/CustomPagination';
import ErrorHandler from '../../../hooks/useHandleError';
import noDataImage from '../../../assets/AuthImages/noDataFound.png'; // Import the image
import { IRootState } from '../../../store';
import AssignManagerModal from './AssignManagerModal';

interface ManageSiteProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    // onSubmit: (values: any, formik: any) => Promise<void>;
}

interface RowData {
    id: string; // Change type from number to string
    reports: string;
    manager_name: string;
    entity_name: string;
    role: string;
    addons: string;
    created_date: string;
    status: number;
    station_status: number;
    station_name: string;
    station_code: string;
    station_address: string;
}

const AssignStationManagger: React.FC<ManageSiteProps> = ({ postData, getData, isLoading }) => {
    const [data, setData] = useState<RowData[]>([]);
    const [dataList, setdataList] = useState<any[]>([]);
    const dispatch = useDispatch();
    const handleApiError = ErrorHandler();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserData, setEditUserData] = useState<Partial<RowData> | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // Assuming userId is a string
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const navigate = useNavigate();
    const { id } = useParams();
    const [stationname, setstationname] = useState("");
    useEffect(() => {
        fetchData(id);
        dispatch(setPageTitle('Alternative Pagination Table'));
    }, [dispatch, currentPage, id]);
    const handleSuccess = () => {
        fetchData(id);
    };

    const handlePageChange = (newPage: any) => {
        setCurrentPage(newPage);
    };

    const fetchData = async (id: any) => {
        try {
            // const response = await getData(`/skip-date/list?station_id=${id}&page=${currentPage}`);
            const response = await getData(`/station/manager/${id}?page=${currentPage}`);
            // station/skip-date/list?station_id=VEttejdBRlRMWDRnUTdlRkdLK1hrZz0

            if (response && response.data && response.data.data) {
                setstationname(response.data.data?.station_name);
                setdataList(response.data.data || []);
                setData(response.data.data?.managers || []);
                setCurrentPage(response.data.data?.currentPage || 1);
                setLastPage(response.data.data?.lastPage || 1);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        }
    };



    const { customDelete } = useCustomDelete();

    const handleDelete = (id: any) => {
        const formData = new FormData();
        formData.append('id', id);
        customDelete(postData, 'station/manager/delete', formData, handleSuccess);
    };


    const UserPermissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);


    const isAddPermissionAvailable = UserPermissions?.includes("skipdate-create");
    const isEditPermissionAvailable = UserPermissions?.includes("skipdate-edit");

    const isDeletePermissionAvailable = UserPermissions?.includes("skipdate-delete");
    const isAssignAddPermissionAvailable = UserPermissions?.includes("skipdate-assign-permission");

    const anyPermissionAvailable = isEditPermissionAvailable || isDeletePermissionAvailable || isAssignAddPermissionAvailable;
    const openModal = async (id: string) => {
        try {
            setIsModalOpen(true);
            setIsEditMode(true);
            setUserId(id);

        } catch (error) {
            handleApiError(error);
        }
    };
    const columns: any = [
        {
            name: 'Manager',
            selector: (row: RowData) => row.manager_name,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.manager_name}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Role',
            selector: (row: RowData) => row.role,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.role}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Reports',
            selector: (row: RowData) => row.reports,
            sortable: false,
            width: '50%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.reports}</h6>
                    </div>
                </div>
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
                                {isEditPermissionAvailable && <>
                                    <Tippy content="Edit">
                                        <button type="button" onClick={() => openModal(row?.id)}>
                                            <i className="pencil-icon fi fi-rr-file-edit"></i>
                                        </button>
                                    </Tippy>

                                </>}
                                {isDeletePermissionAvailable && <>
                                    <Tippy content="Delete">
                                        <button onClick={() => handleDelete(row.id)} type="button">
                                            <i className="icon-setting delete-icon fi fi-rr-trash-xmark"></i>
                                        </button>
                                    </Tippy>
                                </>}
                            </div>
                        </div>
                    </span>
                ),
            }
            : null,
    ];


    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditUserData(null);
    };
    const handleFormSubmit = async (values: any) => {
        try {
            const formData = new FormData();
            formData.append('user_id', values?.user_id);
            // Append userId if available
            if (id) {
                formData.append('station_id', id);
            }

            const skipDates = values?.selectedStations || [];

            if (skipDates.length === 0) {
             
                return; // Early exit if skip_date is empty
            }



            // Convert skipDates to the desired format and append to formData
            skipDates.forEach((selectedItem: any, index: any) => {
                formData.append(`reports[${index}]`, selectedItem.value);
            });

            // Determine the URL for submission
            // const url = isEditMode && userId ? `/station/update` : `/station/create`;
            const url = `/station/manager/assign`;

            // Submit the form data using your postData function
            const response = await postData(url, formData);

            // Handle the response
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

    return (
        <>
            {isLoading && <LoaderImg />}
            <div className="flex justify-between items-center">
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/dashboard" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <Link to="/manage-stations" className="text-primary hover:underline">
                            Stations
                        </Link>

                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span> Station Manager</span>
                    </li>
                </ul>

                {isAddPermissionAvailable && <>
                    <button type="button" className="btn btn-dark " onClick={() => setIsModalOpen(true)}>
                        Assign Station Mannager
                    </button>

                </>}
            </div>
            <AssignManagerModal getData={getData} dataList={dataList} isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} isEditMode={isEditMode} userId={userId}

            />

            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light"> Station Managers {stationname && `(${stationname})`}</h5>
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
            {data?.length > 0 && lastPage > 1 && <CustomPagination currentPage={currentPage} lastPage={lastPage} handlePageChange={handlePageChange} />}
        </>
    );
};

export default withApiHandler(AssignStationManagger);
