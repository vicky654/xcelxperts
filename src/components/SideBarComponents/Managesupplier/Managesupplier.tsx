import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import LoaderImg from '../../../utils/Loader';
import { setPageTitle } from '../../../store/themeConfigSlice';
import withApiHandler from '../../../utils/withApiHandler';
import CustomSwitch from '../../FormikFormTools/CustomSwitch';
import useToggleStatus from '../../../utils/ToggleStatus';
import useCustomDelete from '../../../utils/customDelete';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import CustomPagination from '../../../utils/CustomPagination';
import ErrorHandler from '../../../hooks/useHandleError';
import noDataImage from '../../../assets/AuthImages/noDataFound.png';
import AddEditManagesupplier from './AddEditManagesupplier';
import { IRootState } from '../../../store';
import SearchBar from '../../../utils/SearchBar';
interface ManagesupplierProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    // onSubmit: (values: any, formik: any) => Promise<void>;
}

interface RowData {
    id: string;
    supplier_name: string;
    supplier_code: string;
    created_date: string;
    supplier_logo: string;
    supplier_status: number;
}

const Managesupplier: React.FC<ManagesupplierProps> = ({ postData, getData, isLoading }) => {
    const [data, setData] = useState<RowData[]>([]);
    const dispatch = useDispatch();
    const handleApiError = ErrorHandler();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserData, setEditUserData] = useState<Partial<RowData> | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // Assuming userId is a string
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const navigate = useNavigate();
    const [showFilterOptions, setShowFilterOptions] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    // useEffect(() => {
    //     fetchData();

    // }, [searchTerm, currentPage]);
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        // Perform search logic here
       
    };

    const handleReset = () => {
        setSearchTerm('');
        // Perform reset logic here
        
    };
    useEffect(() => {
        fetchData();
        dispatch(setPageTitle('Alternative Pagination Table'));
    }, [dispatch, currentPage, searchTerm]);
    const handleSuccess = () => {
        fetchData();
    };

    const handlePageChange = (newPage: any) => {
        setCurrentPage(newPage);
    };


    const fetchData = async () => {
        try {
            // const response = await getData(`/supplier/list?page=${currentPage}`);
            let apiUrl = `/supplier/list?page=${currentPage}`;
            if (searchTerm) {
                apiUrl += `&search_keywords=${searchTerm}`;
            }
            const response = await getData(apiUrl);

            if (response && response.data && response.data.data) {
                setData(response.data.data?.suppliers);
                setCurrentPage(response.data.data?.currentPage || 1);
                setLastPage(response.data.data?.lastPage || 1);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
            //   handleApiError(error);
        }
    };
    const { toggleStatus } = useToggleStatus();
    const toggleActive = (row: RowData) => {
        const formData = new FormData();
        formData.append('id', row.id.toString());
        formData.append('status', (row.supplier_status === 1 ? 0 : 1).toString());
        toggleStatus(postData, '/supplier/update-status', formData, handleSuccess);
    };
    const { customDelete } = useCustomDelete();

    const handleDelete = (id: any) => {
        const formData = new FormData();
        formData.append('id', id);
        customDelete(postData, 'supplier/delete', formData, handleSuccess);
    };


    const UserPermissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);

    const isAddPermissionAvailable = UserPermissions?.includes("supplier-create");
    const isListPermissionAvailable = UserPermissions?.includes("supplier-list");
    const isEditPermissionAvailable = UserPermissions?.includes("supplier-edit");
    const isEditSettingPermissionAvailable = UserPermissions?.includes("supplier-setting");
    const isDeletePermissionAvailable = UserPermissions?.includes("supplier-delete");
    const isAssignAddPermissionAvailable = UserPermissions?.includes("supplier-assign-permission");

    const anyPermissionAvailable = isEditPermissionAvailable || isDeletePermissionAvailable;

    const columns: any = [
        // Other columns
        {
            name: 'Supplier Name',
            selector: (row: RowData) => row.supplier_name,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{`${row.supplier_name}`}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Supplier Code',
            selector: (row: RowData) => row.supplier_code,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{`${row.supplier_code}`}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Supplier Logo',
            selector: (row: RowData) => row.supplier_code,
            sortable: false,
            width: '15%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className="mt-0 mt-sm-2 d-block">
                        {/* Assuming row.logo contains the URL of the image */}
                        <img style={{ width: "60px", height: "40px" }} src={row.supplier_logo} alt="Logo" className="img-fluid" />
                        {/* If you want to display the URL as text */}
                        {/* <h6 className="mb-0 fs-14 fw-semibold">{row.logo}</h6> */}
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
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{`${row.created_date}`}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Status',
            selector: (row: RowData) => row.supplier_status,
            sortable: false,
            width: '15%',
            cell: (row: RowData) => (
                <>

                    {isEditPermissionAvailable && <>
                        <Tippy content={<div>Status</div>} placement="top">
                            {row.supplier_status === 1 || row.supplier_status === 0 ? (
                                <CustomSwitch checked={row.supplier_status === 1} onChange={() => toggleActive(row)} />
                            ) : (
                                <div className="pointer" onClick={() => toggleActive(row)}>
                                    Unknown
                                </div>
                            )}
                        </Tippy>
                    </>}

                </>
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

    // supplier/detail?id=${selectedRowId}
    const openModal = async (id: string) => {
        try {
            setIsModalOpen(true);
            setIsEditMode(true);
            setUserId(id);
        } catch (error) {
            console.error('Error fetching supplier details:', error);
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

            formData.append('supplier_name', values.supplier_name);
            formData.append('supplier_code', values.supplier_code);
            formData.append('status', "1");
            if (values.file) {
                formData.append('logo', values.file);
            }
            if (userId) {
                formData.append('id', userId);
            }

            const url = isEditMode && userId ? `/supplier/update` : `/supplier/create`;
            const isSuccess = await postData(url, formData);
            if (isSuccess) {
                handleSuccess();
                closeModal();
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
                        <Link to="/" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Suppliers</span>
                    </li>
                </ul>

                {isAddPermissionAvailable && <>
                    <button type="button" className="btn btn-dark " onClick={() => setIsModalOpen(true)}>
                        Add Supplier
                    </button>
                </>}

            </div>
            <AddEditManagesupplier getData={getData} isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} isEditMode={isEditMode} userId={userId} />

            <div className="panel mt-6">
                {/* <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light"> Suppliers</h5>
                </div> */}

                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5 spacebetween">
                    <h5 className="font-semibold text-lg dark:text-white-light">Suppliers</h5>
                    {showFilterOptions && (
                        <SearchBar
                            onSearch={handleSearch}
                            onReset={handleReset}
                            hideReset={Boolean(searchTerm)}
                            placeholder="Enter search term..."
                        />
                    )}
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

export default withApiHandler(Managesupplier);
