import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import LoaderImg from '../../../utils/Loader';
import { setPageTitle } from '../../../store/themeConfigSlice';
import withApiHandler from '../../../utils/withApiHandler';
import 'tippy.js/dist/tippy.css';
import CustomPagination from '../../../utils/CustomPagination';
import ErrorHandler from '../../../hooks/useHandleError';
import noDataImage from '../../../assets/AuthImages/noDataFound.png'; // Import the image


interface ActivityLogsProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
    // onSubmit: (values: any, formik: any) => Promise<void>;
}

interface RowData {
    id: string; // Change type from number to string
    name: string;
    message: string;
    model: string;
    action: string;
    created_date: string;
    status: number;
}

const ActivityLogs: React.FC<ActivityLogsProps> = ({ postData, getData, isLoading }) => {
    const [data, setData] = useState<RowData[]>([]);
    const dispatch = useDispatch();
    const handleApiError = ErrorHandler();

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    useEffect(() => {
        fetchData();
        dispatch(setPageTitle('Alternative Pagination Table'));
    }, [dispatch, currentPage]);


    const handlePageChange = (newPage: any) => {
        setCurrentPage(newPage);
    };

    const fetchData = async () => {
        try {
            const response = await getData(`/activity/logs?page=${currentPage}`);
            if (response && response.data && response.data.data) {
                setData(response.data.data?.logs);
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


    const columns: any = [
        {
            name: 'Name',
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
            name: 'Model',
            selector: (row: RowData) => row.model,
            sortable: false,
            width: '15%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.model}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Message',
            selector: (row: RowData) => row.message,
            sortable: false,
            width: '30%',
            cell: (row: RowData) => (
                <div className="d-flex">
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.message}</h6>
                    </div>
                </div>
            ),
        },

        {
            name: 'Created Date',
            selector: (row: RowData) => row.created_date,
            sortable: false,
            width: '15%',
            cell: (row: RowData) => (
                <div className="d-flex" style={{ cursor: 'default' }}>
                    <div className=" mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: 'Actions',
            selector: (row: RowData) => row.status,
            sortable: false,
            width: '10%',
            cell: (row: RowData) => (
                <span className="text-muted fs-15 fw-semibold text-center" style={{ cursor: 'pointer' }}>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Action</Tooltip>}>
                        {row.action === '0' ? (
                            <button className="btn btn-success btn-sm" style={{ cursor: 'pointer' }}>
                                Insert
                            </button>
                        ) : row.action === '1' ? (
                            <button className="btn btn-info btn-sm">Update</button>
                        ) : row.action === '2' ? (
                            <button className="btn btn-danger btn-sm">Delete</button>
                        ) : row.action === '3' ? (
                            <button className="btn btn-dark  btn-sm">Assign</button>
                        ) : (
                            <button className="badge">Unknown</button>
                        )}
                    </OverlayTrigger>
                </span>
            ),
        },
        {
            name: 'Status',
            selector: (row: RowData) => row.status,
            sortable: false,
            width: '10%',
            cell: (row: RowData) => (
                <span className="text-muted fs-15 fw-semibold text-center py-2">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
                        {row?.status == 1 ? (
                            <button className="btn btn-success btn-sm">Success</button>
                        ) : row?.status == 0 ? (
                            <button className="btn btn-danger btn-sm">Error</button>
                        ) : (
                            <button className="badge">Unknown</button>
                        )}
                    </OverlayTrigger>
                </span>
            ),
        },

    ];

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
                        <span>Activity Logs</span>
                    </li>
                </ul>

            </div>

            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Activity Logs</h5>
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

export default withApiHandler(ActivityLogs);
