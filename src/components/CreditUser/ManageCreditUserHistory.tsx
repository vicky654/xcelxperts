import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import AddEditStationTankModal from './AddEditCreditUser';
import * as Yup from 'yup';
import { IRootState } from '../../store';
import FormikSelect from '../FormikFormTools/FormikSelect';
import { useFormik } from 'formik';
import AddEditHistoryTankModal from './AddEditHistoryTankModal';

interface ManageSiteProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
}

interface RowData {
    id: string; // Change type from number to string
    name: string;
    phone: string;

    amount: string;
    notes: string;
    t_date: string;
    created_date: string;
    status: number;

}

interface RoleItem {
    id: number;
    client_name: string;
}

const ManageCreditUserHistory: React.FC<ManageSiteProps> = ({ postData, getData, isLoading }) => {
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

    const isAddPermissionAvailable = UserPermissions?.includes('credituser-update');
    const isListPermissionAvailable = UserPermissions?.includes('credituser-list');
    const isEditPermissionAvailable = UserPermissions?.includes('credituser-edit');
    const isHistorySettingPermissionAvailable = UserPermissions?.includes('credituser-history');
    const isDeletePermissionAvailable = UserPermissions?.includes('credituser-delete');
    const isAssignAddPermissionAvailable = UserPermissions?.includes('credituser-assign-permission');

    const anyPermissionAvailable = isEditPermissionAvailable || isDeletePermissionAvailable || isAssignAddPermissionAvailable;
    const { id } = useParams<{ id: string }>();
    useEffect(() => {


        GetUserList(id)


    }, []);

    const handleSuccess = () => {
        GetUserList(id);
    };

    const handlePageChange = (newPage: any) => {
        setCurrentPage(newPage);
    };
    const { toggleStatus } = useToggleStatus();


    const { customDelete } = useCustomDelete();
    // const handleDelete = (id: any) => {
    //     const formData = new FormData();
    //     formData.append('id', id);
    //     customDelete(postData, 'credit-user/delete', formData, handleSuccess);
    // };

    const columns: any = [
        {
            name: 'Amount',
            selector: (row: RowData) => row.amount,
            sortable: false,
            width: '30%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.amount}</h6>
                    </div>
                </div>
            ),
        },

        {
            name: 'Notes',
            selector: (row: RowData) => row.notes,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.notes}</h6>
                    </div>
                </div>
            ),
        },

        {
            name: 'Transaction Date',
            selector: (row: RowData) => row.t_date,
            sortable: false,
            width: '20%',
            cell: (row: RowData) => (
                <div className="d-flex" style={{ cursor: 'default' }}>
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.t_date}</h6>
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
        // {
        //     name: 'Status',
        //     selector: (row: RowData) => row.status,
        //     sortable: false,
        //     width: '10%',
        //     cell: (row: RowData) => (
        //         <>
        //             {isEditPermissionAvailable && (
        //                 <>
        //                     <Tippy content={<div>Status</div>} placement="top">
        //                         {row.status === 1 || row.status === 0 ? <CustomSwitch checked={row.status === 1} onChange={() => toggleActive(row)} /> : <div className="pointer">Unknown</div>}
        //                     </Tippy>
        //                 </>
        //             )}
        //         </>
        //     ),
        // },
        // anyPermissionAvailable
        //     ? {
        //         name: 'Actions',
        //         selector: (row: RowData) => row.id,
        //         sortable: false,
        //         width: '10%',
        //         cell: (row: RowData) => (
        //             <span className="text-center">
        //                 <div className="flex items-center justify-center">
        //                     <div className="inline-flex">
        //                         {isEditPermissionAvailable && (
        //                             <>
        //                                 <Tippy content="Edit">
        //                                     <button type="button" onClick={() => openModal(row?.id)}>
        //                                         <i className="pencil-icon fi fi-rr-file-edit"></i>
        //                                     </button>
        //                                 </Tippy>
        //                             </>
        //                         )}
        //                         {isDeletePermissionAvailable && (
        //                             <>
        //                                 <Tippy content="Delete">
        //                                     <button onClick={() => handleDelete(row.id)} type="button">
        //                                         <i className="icon-setting delete-icon fi fi-rr-trash-xmark"></i>
        //                                     </button>
        //                                 </Tippy>
        //                             </>
        //                         )}
        //                         {isHistorySettingPermissionAvailable && (
        //                             <>
        //                                 <Tippy content="Delete">
        //                                     <button onClick={() => handleDelete(row.id)} type="button">
        //                                         <i className="fi fi-tr-rectangle-history-circle-plus"></i>
        //                                     </button>
        //                                 </Tippy>
        //                             </>
        //                         )}
        //                     </div>
        //                 </div>
        //             </span>
        //         ),
        //     }
        //     : null,
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

            formData.append('amount', values.amount);
            formData.append('notes', values.notes);
            formData.append('t_date', values.t_date);


            if (id) {
                formData.append('credit_user_id', id);
            }

            const url = isEditMode && userId ? `/credit-user/add-credit` : `/credit-user/add-credit`;
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




    const GetUserList = async (id: any) => {

        try {
            const response = await getData(`credit-user/history?credit_user_id=${id}`);
            // const response = await getData(`credit-user/list`);
            if (response && response.data && response.data.data) {
                setData(response.data.data?.history?.listing);
            } else {
                throw new Error('No data available in the response');
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
                        <Link to="/manage-users/credit-users" className="text-primary hover:underline">
                            Credit Users
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Credit Users History</span>
                    </li>
                </ul>

                {isAddPermissionAvailable && (
                    <button type="button" className="btn btn-dark " onClick={() => setIsModalOpen(true)}>
                        Add Credit
                    </button>
                )}
            </div>
            <AddEditHistoryTankModal getData={getData} isOpen={isModalOpen} onClose={closeModal} onSubmit={handleFormSubmit} isEditMode={isEditMode} userId={userId} />

            <div className=" mt-6">
                <div className="panel h-full xl:col-span-3">
                    <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                        <h5 className="font-semibold text-lg dark:text-white-light"> Credit Users</h5>
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
            {data?.length > 0 && lastPage > 1 && <CustomPagination currentPage={currentPage} lastPage={lastPage} handlePageChange={handlePageChange} />}
        </>
    );
};

export default withApiHandler(ManageCreditUserHistory);
