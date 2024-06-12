import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import LoaderImg from '../../../utils/Loader';
import { setPageTitle } from '../../../store/themeConfigSlice';
import withApiHandler from '../../../utils/withApiHandler';
import 'tippy.js/dist/tippy.css';
import ErrorHandler from '../../../hooks/useHandleError';
import noDataImage from '../../../assets/noDataFoundImage/noDataFound.jpg'; // Import the image

interface ManageUserProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
}

interface AddonData {
    id: string;
    name: string;
    checked: boolean;
}

const ManageUser: React.FC<ManageUserProps> = ({ postData, getData, isLoading }) => {
    const [data, setData] = useState<AddonData[]>([]);
    const dispatch = useDispatch();
    const handleApiError = ErrorHandler();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        fetchData();
        dispatch(setPageTitle('Alternative Pagination Table'));
    }, [dispatch]);

    const fetchData = async () => {
        try {
            const response = await getData(`/addon/assigned?id=${id}`);
            if (response && response.data) {
                console.log(response.data, 'response.data');
                setData(response.data?.data);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        }
    };
    const formik = useFormik({
        initialValues: {
            addons: data?.map((addon) => ({ id: addon.id, name: addon.name, checked: addon.checked })),
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                await postData(`/addon/assign`, { id, addons: values.addons });
                fetchData();
            } catch (error) {
                handleApiError(error);
            }
        },
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
                        <span>Users</span>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Assign Addons</span>
                    </li>
                </ul>
            </div>

            <div className="panel mt-6">
                <div className="btn-dark p-2 mb-3" >
                    <h5 className="font-semibold text-lg dark:text-white-light">Assign Addons</h5>
                  
                </div>

                {data.length > 0 ? (
                    <form onSubmit={formik.handleSubmit}>
                        {formik.values.addons.map((addon, index) => (
                            <div key={addon.id} className="mb-4">
                                <div >
                                    <input type="checkbox" name={`addons[${index}].checked`} checked={addon.checked} onChange={formik.handleChange}     className="form-check-input" />
                                    {" "} <span className="checkbox-title" > {addon.name}</span>
                                </div>
                            </div>
                        ))}
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </form>
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
        </>
    );
};

export default withApiHandler(ManageUser);
