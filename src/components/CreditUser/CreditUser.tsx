import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import noDataImage from '../../assets/AuthImages/noDataFound.png'; // Import the image
import useErrorHandler from '../../hooks/useHandleError';
import useToggleStatus from '../../utils/ToggleStatus';
import useCustomDelete from '../../utils/customDelete';
import CustomSwitch from '../FormikFormTools/CustomSwitch';
import LoaderImg from '../../utils/Loader';
import CustomPagination from '../../utils/CustomPagination';
import withApiHandler from '../../utils/withApiHandler';
import AddEditStationTankModal from './AddEditCreditUser';
import * as Yup from 'yup';
import { IRootState } from '../../store';
import FormikSelect from '../FormikFormTools/FormikSelect';
import { useFormik } from 'formik';
import { Badge } from 'react-bootstrap';
import Dropdown from '../Dropdown';
import IconHorizontalDots from '../Icon/IconHorizontalDots';
import SearchBar from '../../utils/SearchBar';

interface ManageSiteProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
}

interface RowData {
    id: string; // Change type from number to string
    name: string;
    phone: string;
    t_type: string;

    created_date: string;
    status: number;

}

interface RoleItem {
    id: number;
    client_name: string;
}

const CreditUser: React.FC<ManageSiteProps> = ({ postData, getData, isLoading }) => {
    const [data, setData] = useState<RowData[]>([]);
    const dispatch = useDispatch();
    const handleApiError = useErrorHandler();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserData, setEditUserData] = useState<Partial<RowData> | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // Assuming userId is a string
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [isNotClient] = useState(localStorage.getItem('superiorRole') !== 'Client');
    const [RoleList, setRoleList] = useState<RoleItem[]>([]);
    const UserPermissions = useSelector((state: IRootState) => state?.data?.data?.permissions || []);

    const [showFilterOptions, setShowFilterOptions] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    // useEffect(() => {
    //     fetchData();

    // }, [searchTerm, currentPage]);

    const isAddPermissionAvailable = UserPermissions?.includes('credituser-create');
    const isListPermissionAvailable = UserPermissions?.includes('credituser-list');
    const isEditPermissionAvailable = UserPermissions?.includes('credituser-edit');
    const isHistorySettingPermissionAvailable = UserPermissions?.includes('credituser-history');
    const isDeletePermissionAvailable = UserPermissions?.includes('credituser-delete');
    const isAssignAddPermissionAvailable = UserPermissions?.includes('credituser-assign-permission');

    const anyPermissionAvailable = isEditPermissionAvailable || isDeletePermissionAvailable || isAssignAddPermissionAvailable;
    const storedKeyName = "stationTank";


    useEffect(() => {

        if (localStorage.getItem("superiorRole") === "Client") {
            const clientId = localStorage.getItem("superiorId");
            if (clientId) {
                formik.setFieldValue("client_id", clientId)
                GetUserList(clientId)
                // Simulate the change event to call handleClientChange
                // handleClientChange({ target: { value: clientId } } as React.ChangeEvent<HTMLSelectElement>);
            }
        }

        FetchRoleList();
    }, [currentPage]);
    // useEffect(() => {
    //     const storedKeyName = localStorage.getItem("stationTank");
      

    //     if (localStorage.getItem("CreditUserID")) {
    //         const clientId = localStorage.getItem("CreditUserID");
    //         if (clientId) {
    //             formik.setFieldValue("client_id", clientId)
    //             GetUserList(clientId)
    //         }
    //     }

    // }, [currentPage]);


    useEffect(() => {
        const storedDataString = localStorage.getItem(storedKeyName);
        
    
        if (storedDataString) {
          try {
            const storedData = JSON.parse(storedDataString);
            
    
            // Check for the existence of `start_month` or other necessary properties
            // if (storedData.start_date) {
            //   handleApplyFilters(storedData);
            // }


            if (storedData?.client_id) {
                formik.setFieldValue("client_id", storedData.client_id)
                GetUserList(storedData.client_id)
            }
          } catch (error) {
            console.error("Error parsing stored data", error);
          }
        }
      }, [dispatch]);


    const handleSuccess = () => {
        localStorage.setItem("CreditUserID", formik?.values?.client_id)
        GetUserList(formik?.values?.client_id);
    };

    const handlePageChange = (newPage: any) => {
        setCurrentPage(newPage);
    };
    const { toggleStatus } = useToggleStatus();

    const toggleActive = (row: RowData) => {
        const formData = new FormData();
        formData.append('id', row.id.toString());
        formData.append('status', (row.status === 1 ? 0 : 1).toString());
        toggleStatus(postData, '/credit-user/update-status', formData, handleSuccess);
    };
    const { customDelete } = useCustomDelete();
    const handleDelete = (id: any) => {
        const formData = new FormData();
        formData.append('id', id);
        customDelete(postData, 'credit-user/delete', formData, handleSuccess);
    };

    const columns: any = [
        {
            name: 'User Name',
            selector: (row: RowData) => row.name,
            sortable: false,
            width: '25%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.name}
                        </h6>
                    </div>
                </div>
            ),
        },
  
        {
            name: 'Phone Number',
            selector: (row: RowData) => row.phone,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.phone}</h6>
                    </div>
                </div>
            ),
        },

        {
            name: 'Created Date',
            selector: (row: RowData) => row.created_date,
            sortable: false,
            width: '25%',
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
            width: '15%',
            cell: (row: RowData) => (
                <>
                    {isEditPermissionAvailable && (
                        <>
                            <Tippy content={<div>Status</div>} placement="top">
                                {row.status === 1 || row.status === 0 ? <CustomSwitch checked={row.status === 1} onChange={() => toggleActive(row)} /> : <div className="pointer">Unknown</div>}
                            </Tippy>
                        </>
                    )}
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

                            <div className="dropdown">
                                <Dropdown button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}>
                                    <ul>

                                        <li>
                                            {isEditPermissionAvailable && (

                                                <button type="button" onClick={() => openModal(row?.id)}>
                                                    <i className="setting-icon fi fi-rr-file-edit "></i> Edit
                                                </button>

                                            )}
                                        </li>
                                        <li>
                                            {isDeletePermissionAvailable && (

                                                <button onClick={() => handleDelete(row.id)} type="button">
                                                    <i className="icon-setting delete-icon fi fi-rr-trash-xmark"></i> Delete
                                                </button>

                                            )}
                                        </li>
                                        <li>
                                            {isHistorySettingPermissionAvailable && (

                                                <button onClick={() => handleHistory(row?.id)} type="button">
                                                    <i className="fi fi-ts-file-medical-alt"></i>Check History
                                                </button>

                                            )}
                                        </li>

                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                    </span>
                ),
            }
            : null,

    ];

    const openModal = async (id: string) => {
        try {
            setIsModalOpen(true);
            setIsEditMode(true);
            setUserId(id);
        } catch (error) {
            handleApiError(error);
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

            formData.append('phone', values.phone);
            formData.append('name', values.name);
            formData.append('max_amount', values.max_amount);
            formData.append('client_id', values.client_id);

            if (userId) {
                formData.append('id', userId);
            }

            const url = isEditMode && userId ? `/credit-user/update` : `/credit-user/create`;
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

    const FetchRoleList = async () => {
        try {
            const response = await getData('/getClients');
            if (response && response.data && response.data.data) {


                setRoleList(response.data.data);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const validationSchemaForCustomInput = Yup.object().shape({
        client_id: isNotClient ? Yup.string().required('Client is required') : Yup.mixed().notRequired(),
    });

    const initialValues = {
        client_id: '', // Initial value for client_id
    };

    const formik = useFormik({
        initialValues,
        validationSchema: validationSchemaForCustomInput,
        onSubmit: async (values: any, { resetForm }) => {
            try {
                // Handle form submission logic here
                GetUserList(values?.client_id);

            } catch (error) {
                handleApiError(error);
                throw error; // Rethrow the error to be handled by the caller
            }
        },
    });

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        // Perform search logic here
       
    };

    const handleReset = () => {
        setSearchTerm('');
        // Perform reset logic here
        
    };
    useEffect(() => {
        const ID = localStorage.setItem("CreditUserID", formik?.values?.client_id)


        if (formik?.values?.client_id) {
            GetUserList(formik?.values?.client_id);
        }


    }, [searchTerm]);



    const GetUserList = async (id: any) => {

        try {


            let apiUrl = `/credit-user/list?client_id=${id}&page=${currentPage}`;
            if (searchTerm) {
                apiUrl += `&search_keywords=${searchTerm}`;
            }
            const response = await getData(apiUrl);

            // const response = await getData(`credit-user/list?client_id=${id}&page=${currentPage}`);
            // const response = await getData(`credit-user/list`);
            if (response && response.data && response.data.data) {
                localStorage.setItem("CreditUserID", id)
                setCurrentPage(response.data.data?.currentPage || 1);
                setLastPage(response.data.data?.lastPage || 1);
                setData(response.data.data?.creditUsers);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const navigate = useNavigate();
    const handleHistory = (id: any) => {
        navigate(`/manage-users/credit-usersHistory/${id}`);

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
                        <span>Credit Users</span>
                    </li>
                </ul>

                {isAddPermissionAvailable && (
                    <button type="button" className="btn btn-dark " onClick={() => setIsModalOpen(true)}>
                        Add Credit User
                    </button>
                )}
            </div>
            <AddEditStationTankModal getData={getData} isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} isEditMode={isEditMode} userId={userId} />

            <div className=" mt-6 ">
                <div
                    className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-1 mb-6'
                >
                    {
                        localStorage.getItem("superiorRole") !== "Client" && (
                            <div className="panel h-full flex flex-col justify-between">
                                {/* className="panel h-full " */}
                                <form onSubmit={formik.handleSubmit} className="flex-1 flex flex-col justify-between">
                                    <div className="flex flex-col sm:flex-row flex-1">
                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-1 gap-5">
                                            <FormikSelect
                                                formik={formik}
                                                name="client_id"
                                                label="Client"
                                                options={RoleList.map((item) => ({ id: item.id, name: item.client_name }))}
                                                className="form-select text-white-dark"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2 mt-6 flex justify-end ">
                                        <button type="submit" className="btn btn-primary ">
                                            Apply
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )
                    }

                    <div className="panel h-full xl:col-span-3">
                        <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5 spacebetween">
                            <h5 className="font-semibold text-lg dark:text-white-light">Credit Users</h5>
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
                                     {data?.length > 0 && lastPage > 1 && <CustomPagination currentPage={currentPage} lastPage={lastPage} handlePageChange={handlePageChange} />}
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
           
        </>
    );
};

export default withApiHandler(CreditUser);
