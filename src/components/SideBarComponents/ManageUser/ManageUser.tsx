import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import IconDollarSignCircle from '../../Icon/IconDollarSignCircle';
import IconUser from '../../Icon/IconUser';
import IconHome from '../../Icon/IconHome';
import LoaderImg from '../../../utils/Loader';

import useHandleError from '../../../hooks/useHandleError';
import { setPageTitle } from '../../../store/themeConfigSlice';
import useApiErrorHandler from '../../../hooks/useHandleError';
import { IRootState } from '../../../store';
import withApiHandler from '../../../utils/withApiHandler';

interface ManageUserProps {
    isLoading: boolean; // Define the type of the loading prop
    fetchedData: any; // Define the type of the fetchedData prop
    getData: (url: string, id?: string, params?: any) => Promise<any>;
    postData: (url: string, body: any, navigatePath?: string) => Promise<any>;
}

const ManageUser: React.FC<ManageUserProps> = ({ postData, getData, isLoading }) => {
    const dispatch = useDispatch();
    const { data, error } = useSelector((state: IRootState) => state?.data);
    const isProfileUpdatePermissionAvailable = data?.permissions?.includes('profile-update-profile');
    const isUpdatePasswordPermissionAvailable = data?.permissions?.includes('profile-update-password');
    const isSettingsPermissionAvailable = data?.permissions?.includes('config-setting');
    const handleError = useHandleError();
    const [tabs, setTabs] = useState<string>('home');
    const toggleTabs = (name: string) => {
        setTabs(name);
    };

    let storedTab = localStorage.getItem('activeUserSetting');
    useEffect(() => {
        if (storedTab) {
            setTabs(storedTab);
        }
    }, [storedTab]);

    const handleApiError = useApiErrorHandler(); // Use the hook here

    console.log(tabs, 'tabs');

    const FetchConfigSetting = async () => {
        try {
            const response = await getData(`/config-setting`);

            if (response && response.data && response.data.data) {
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error); // Use the hook here to handle the error
            console.error('API error:', error);
        }
    };

    return (
        <>
            {isLoading ? <LoaderImg /> : null}
            <div>
                <ol className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4">
                        <span>Manage User</span>
                    </li>
                </ol>

                <div className="pt-5"></div>
            </div>
        </>
    );
};

export default withApiHandler(ManageUser);
