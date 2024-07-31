import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import LoaderImg from '../../../utils/Loader';
import { setPageTitle } from '../../../store/themeConfigSlice';
import withApiHandler from '../../../utils/withApiHandler';
import useCustomDelete from '../../../utils/customDelete';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import CustomPagination from '../../../utils/CustomPagination';
import ErrorHandler from '../../../hooks/useHandleError';
import noDataImage from '../../../assets/AuthImages/noDataFound.png'; // Import the image
import { IRootState } from '../../../store';
import SearchBar from '../../../utils/SearchBar';

interface ManageRolesProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
}

interface RowData {
    id: string;
    name: string;
    role: string;
    created_date: string;
}

const ManageRoles: React.FC<ManageRolesProps> = ({ postData, getData, isLoading }) => {
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
        console.log('Search Term:', term);
    };

    const handleReset = () => {
        setSearchTerm('');
        // Perform reset logic here
        console.log('Search Reset');
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

            let apiUrl = `/addon/list?page=${currentPage}`;
            if (searchTerm) {
                apiUrl += `&search_keywords=${searchTerm}`;
            }
            const response = await getData(apiUrl);


            // const response = await getData(`/addon/list?page=${currentPage}`);
            if (response && response.data && response.data.data) {
                setData(response.data.data?.addons);
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
        customDelete(postData, 'addons/delete', formData, handleSuccess);
    };

    const UserPermissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);

    const isAddPermissionAvailable = UserPermissions?.includes("addons-create");
    const isListPermissionAvailable = UserPermissions?.includes("addons-list");
    const isEditPermissionAvailable = UserPermissions?.includes("addons-edit");
    const isDeletePermissionAvailable = UserPermissions?.includes("addons-delete");
    const isAssignAddPermissionAvailable = UserPermissions?.includes("addons-assign-permission");

    const anyPermissionAvailable = isEditPermissionAvailable || isDeletePermissionAvailable || isAssignAddPermissionAvailable;

    const openEditRolePage = (id: string) => {
        navigate(`/manage-addons/edit-addon/${id}`);
    };
    const columns: any = [
        {
            name: 'Addon',
            selector: (row: RowData) => row.name,
            sortable: false,
            width: '40%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Created Date',
            selector: (row: RowData) => row.created_date,
            sortable: false,
            width: '40%',
            cell: (row: RowData) => (
                <div className="d-flex" style={{ cursor: 'default' }}>
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
                    </div>
                </div>
            ),
        },
        anyPermissionAvailable
            ? {
                name: 'Actions',
                selector: (row: RowData) => row.id,
                sortable: false,
                width: '20%',
                cell: (row: RowData) => (
                    <span className="text-center">
                        <div className="flex items-center justify-center">
                            <div className="inline-flex">
                                {' '}

                                {isEditPermissionAvailable && (
                                    <Tippy content="Edit">
                                        <button type="button" onClick={() => openEditRolePage(row?.id)}>
                                            <i className="pencil-icon fi fi-rr-file-edit"></i>
                                        </button>
                                    </Tippy>
                                )}


                                {isDeletePermissionAvailable && (
                                    <Tippy content="Delete">
                                        <button onClick={() => handleDelete(row.id)} type="button">
                                            <i className="icon-setting delete-icon fi fi-rr-trash-xmark"></i>
                                        </button>
                                    </Tippy>
                                )}


                            </div>
                        </div>
                    </span>
                ),
            }
            : null,
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
                        <span>Addons</span>
                    </li>
                </ul>
                {isAddPermissionAvailable && (
                    <button type="button" className="btn btn-dark " onClick={() => navigate('/manage-addons/add-addon')}>
                        Add Addon
                    </button>
                )}
            </div>

            <div className="panel mt-6">


                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5 spacebetween">
                    <h5 className="font-semibold text-lg dark:text-white-light">Addons</h5>
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

export default withApiHandler(ManageRoles);
