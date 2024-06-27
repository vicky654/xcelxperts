import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import IconHome from '../../components/Icon/IconHome';
import IconUser from '../../components/Icon/IconUser';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IRootState } from '../../store';
import withApiHandler from '../../utils/withApiHandler';
import useHandleError from '../../hooks/useHandleError';
import LoaderImg from '../../utils/Loader';
import useApiErrorHandler from '../../hooks/useHandleError';
import IconLockDots from '../../components/Icon/IconLockDots';
import { fetchStoreData } from '../../store/dataSlice';



interface AccountSettingProps {
    isLoading: boolean; // Define the type of the loading prop
    fetchedData: any; // Define the type of the fetchedData prop
    getData: (url: string, id?: string, params?: any) => Promise<any>;
    postData: (url: string, body: any, navigatePath?: string) => Promise<any>;
}


interface FormValues3 {
    date_format: string;
    pagination: string;
    auto_logout: string;
}

interface FormValues2 {
    old_password: string;
    password: string;
    password_confirmation: string;
}

interface FormValues {
    first_name: string,
    last_name: string,
    email: string,
}




const AccountSetting: React.FC<AccountSettingProps> = ({ postData, getData, isLoading }) => {
    const dispatch = useDispatch();
    const { data, error } = useSelector((state: IRootState) => state?.data);
    const isProfileUpdatePermissionAvailable = data?.permissions?.includes("profile-update-profile");
    const isUpdatePasswordPermissionAvailable = data?.permissions?.includes("profile-update-password");
    const isSettingsPermissionAvailable = data?.permissions?.includes("config-setting");
    const handleError = useHandleError();
    const navigate = useNavigate();
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

    useEffect(() => {
        dispatch(setPageTitle('Account Setting'));
    });

    useEffect(() => {
        formik.setFieldValue("first_name", data?.first_name)
        formik.setFieldValue("last_name", data?.last_name)
        formik.setFieldValue("email", data?.email)
    }, [data])


    useEffect(() => {
        if (isSettingsPermissionAvailable) {
            FetchConfigSetting()
        }
    }, [isSettingsPermissionAvailable])






    const FetchConfigSetting = async () => {
        try {
            const response = await getData(`/config-setting`);

            if (response && response.data && response.data.data) {
                formik3.setValues(response.data.data)
            } else {
                throw new Error("No data available in the response");
            }
        } catch (error) {
            handleApiError(error); // Use the hook here to handle the error
            console.error("API error:", error);
        }
    };


    const formik = useFormik<FormValues>({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
        },
        validationSchema: Yup.object({
            first_name: Yup.string()
                .min(3, 'First name must be at least 3 characters')
                .required('First name is required'),
            last_name: Yup.string()
                .min(3, 'Last name must be at least 3 characters')
                .required('Last name is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
        }),
        onSubmit: async (values) => {

            const formData = new FormData();
            formData.append("first_name", values.first_name);
            formData.append("last_name", values.last_name);
            try {

                const response = await postData(`/update-profile`, formData,)

                // const data: ResponseData = await response.json();



                if (response) {
                    const actionResult = await dispatch<any>(fetchStoreData()); // Dispatch the fetchStoreData thunk here
             
                    navigate("/")
                } else {
                    // Handle error
                }
            } catch (error) {
                // handleError(error)
                useHandleError()
                // ErrorAlert("An error occurred while updating the profile.");
            } finally {
                // setLoading(false);
                // setSubmitting(false);
            }
        },
    });

    const handleSubmit1 = async (
        values: FormValues,
        // setSubmitting: FormikHelpers<FormValues>['setSubmitting'],
        // setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        SuccessAlert: (message: string) => void,
        ErrorAlert: (message: string) => void
    ) => {
        // setLoading(true);
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("first_name", values.first_name);
        formData.append("last_name", values.last_name);

        try {

            const response = await postData(`/update-profile`, formData,)

            // const data: ResponseData = await response.json();

            if (response) {
                const actionResult = await dispatch<any>(fetchStoreData()); // Dispatch the fetchStoreData thunk here
         
                navigate("/")
            } else {
                // Handle error
            }
        } catch (error) {
            ErrorAlert("An error occurred while updating the profile.");
        } finally {
            // setLoading(false);
            // setSubmitting(false);
        }
    };

    const formik2 = useFormik<FormValues2>({
        initialValues: {
            old_password: '',
            password: '',
            password_confirmation: '',
        },
        validationSchema: Yup.object({
            old_password: Yup.string()
                .min(8, 'Current password must be at least 8 characters')
                .required('Current password is required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Password is required'),
            password_confirmation: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required'),
        }),


        onSubmit: async (values) => {

            try {
                const formData = new FormData();
                formData.append("old_password", values.old_password);
                formData.append("password", values.password);
                formData.append("password_confirmation", values.password_confirmation);

                const response = await postData(`/update/password`, formData,)

                // const data = await response.json();





                if (response) {
                    setTimeout(() => {
                        localStorage.clear()
                        window.location.replace('/auth/cover-login');
                    }, 500);
                } else {
                    const errorMessage = Array.isArray(data.message)
                        ? data.message.join(' ')
                        : data.message;
                    // Handle error message
                }
            } catch (error) {
                handleApiError(error);

            }
        },
    });

    const validationSchema = Yup.object({
        date_format: Yup.string().required('Date format is required'),
        pagination: Yup.string().required('Pagination is required'),
        auto_logout: Yup.string().required('Auto logout time is required'),
    });
    const formik3 = useFormik<FormValues3>({
        initialValues: {
            pagination: '',
            date_format: '',
            auto_logout: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            try {

                if (typeof values === "object") {
                    const keys = Object.keys(values);
                    const valuesArray = Object.values(values);

                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        const value = valuesArray[i];
                        const encodedKey = `key[${i}]`;
                        const encodedValue = `value[${i}]`;

                        formData.append(encodedKey, key);
                        formData.append(encodedValue, value);
                    }
                    const response = await postData(`/config-setting/update`, formData,)

                    if (response) {
                        const actionResult = await dispatch<any>(fetchStoreData()); // Dispatch the fetchStoreData thunk here
                        console.log('response:', actionResult);
                        navigate("/")
                    } else {
                        // Handle error
                    }
                }



            } catch (error) {
                // handleError(error)
                useHandleError()
                // ErrorAlert("An error occurred while updating the profile.");
            } finally {
                // setLoading(false);
                // setSubmitting(false);
            }
        },
    });



    return (

        <>

            {isLoading ? <LoaderImg /> : null}
            <div>
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">

                        <span>Account</span>
                    </li>
                </ul>
                <div className="pt-5">
                    {/* <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Settings</h5>
                    </div> */}
                    <div>
                        <ul className="sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">

                            {isProfileUpdatePermissionAvailable && (<>
                                <li className="inline-block">
                                    <button
                                        onClick={() => toggleTabs('home')}
                                        className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'home' ? '!border-primary text-primary' : ''}`}
                                    >
                                        <i className="fi fi-rr-house-chimney"></i>
                                        Edit Profile
                                    </button>
                                </li>
                            </>)}

                            {isUpdatePasswordPermissionAvailable && (<>

                                <li className="inline-block">
                                    <button
                                        onClick={() => toggleTabs('update-password')}
                                        className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'update-password' ? '!border-primary text-primary' : ''}`}
                                    >
                                        <i className="fi fi-rr-lock"></i>
                                        Update Password
                                    </button>
                                </li>
                            </>)}

                            {isSettingsPermissionAvailable && (<>
                                <li className="inline-block">
                                    <button
                                        onClick={() => toggleTabs('Settings')}
                                        className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'Settings' ? '!border-primary text-primary' : ''}`}
                                    >
                                        <i className="fi fi-rr-settings"></i>
                                        Settings
                                    </button>
                                </li>
                            </>)}


                        </ul>
                    </div>
                    {tabs === 'home' ? (
                        <div>
                            <form onSubmit={formik.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                <h6 className="text-lg font-bold mb-5">Edit Profile</h6>
                                <div className="flex flex-col sm:flex-row">

                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className={formik.submitCount ? (formik.errors.first_name ? 'has-error' : 'has-success') : ''}>
                                            <label htmlFor="first_name">First Name<span className="text-danger">*</span> </label>
                                            <input
                                                name="first_name" type="text" id="first_name" placeholder="Enter First Name"
                                                className="form-input"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.first_name}
                                            />
                                            {formik.submitCount ? (
                                                formik.errors.first_name ? (
                                                    <div className="text-danger mt-1">{formik.errors.first_name}</div>
                                                ) : (
                                                    ""
                                                )
                                            ) : null}
                                        </div>

                                        <div className={formik.submitCount ? (formik.errors.last_name ? 'has-error' : 'has-success') : ''}>
                                            <label htmlFor="last_name">Last Name<span className="text-danger">*</span> </label>
                                            <input
                                                name="last_name"
                                                type="text"
                                                id="last_name"
                                                placeholder="Enter Last Name"
                                                className="form-input"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.last_name}
                                            />
                                            {formik.submitCount ? formik.errors.last_name ? <div className="text-danger mt-1">{formik.errors.last_name}</div> : "" : null}
                                        </div>
                                        <div className={formik.submitCount ? (formik.errors.email ? 'has-error' : 'has-success') : ''}>
                                            <label htmlFor="email">Email<span className="text-danger">*</span> </label>
                                            <input
                                                name="email"
                                                type="email"
                                                id="email"
                                                placeholder="Enter Email "
                                                readOnly
                                                className="form-input  readonly"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.email}
                                            />
                                            {formik.submitCount ? formik.errors.email ? <div className="text-danger mt-1">{formik.errors.email}</div> : "" : null}
                                        </div>

                                        <div className="sm:col-span-2 mt-3">
                                            <button type="submit" className="btn btn-primary"
                                            // onClick={() => {
                                            //     if (Object.keys(formik.touched).length !== 0 && Object.keys(formik.errors).length === 0) {
                                            //         formik.handleSubmit();
                                            //     }
                                            // }}
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    ) : (
                        ''
                    )}
                    {tabs === 'update-password' ? (
                        <div>
                            <form onSubmit={formik2.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                <h6 className="text-lg font-bold mb-5">Update Password<span className="text-danger">*</span></h6>
                                <div className="flex flex-col sm:flex-row">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-5">
                                        <div className={formik2.submitCount ? (formik2.errors.old_password ? 'has-error' : 'has-success') : ''}>
                                            <label htmlFor="old_password">Current Password<span className="text-danger">*</span> </label>
                                            <input
                                                name="old_password" type="password" id="old_password" placeholder="Enter Current Password"
                                                className="form-input"
                                                onChange={formik2.handleChange}
                                                onBlur={formik2.handleBlur}
                                                value={formik2.values.old_password}
                                            />
                                            {formik2.submitCount ? (
                                                formik2.errors.old_password ? (
                                                    <div className="text-danger mt-1">{formik2.errors.old_password}</div>
                                                ) : (
                                                    ""
                                                )
                                            ) : null}
                                        </div>

                                        <div className={formik2.submitCount ? (formik2.errors.password ? 'has-error' : 'has-success') : ''}>
                                            <label htmlFor="password">New Password<span className="text-danger">*</span> </label>
                                            <input
                                                name="password"
                                                type="password"
                                                id="password"
                                                placeholder="Enter New Password"
                                                className="form-input"
                                                onChange={formik2.handleChange}
                                                onBlur={formik2.handleBlur}
                                                value={formik2.values.password}
                                            />
                                            {formik2.submitCount ? formik2.errors.password ? <div className="text-danger mt-1">{formik2.errors.password}</div> : "" : null}
                                        </div>
                                        <div className={formik2.submitCount ? (formik2.errors.password_confirmation ? 'has-error' : 'has-success') : ''}>
                                            <label htmlFor="password_confirmation">Confirm Password<span className="text-danger">*</span> </label>
                                            <input
                                                name="password_confirmation"
                                                type="password"
                                                id="password_confirmation"
                                                placeholder="Enter Confirm Password"
                                                className="form-input"
                                                onChange={formik2.handleChange}
                                                onBlur={formik2.handleBlur}
                                                value={formik2.values.password_confirmation}
                                            />
                                            {formik2.submitCount ? formik2.errors.password_confirmation ? <div className="text-danger mt-1">{formik2.errors.password_confirmation}</div> : "" : null}
                                        </div>

                                        <div className="sm:col-span-2 mt-3">
                                            <button type="submit" className="btn btn-primary"
                                            // onClick={() => {
                                            //     if (Object.keys(formik2.touched).length !== 0 && Object.keys(formik2.errors).length === 0) {
                                            //         formik2.handleSubmit();
                                            //     }
                                            // }}
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    ) : (
                        ''
                    )}
                    {tabs === 'Settings' ? (
                        <div>
                            <form onSubmit={formik3.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                <h6 className="text-lg font-bold mb-5">Update Settings</h6>
                                <div className="flex flex-col sm:flex-row">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-5">


                                        <div className={formik3.submitCount ? (formik3.errors.date_format ? 'has-error' : 'has-success') : ''}>
                                            <label htmlFor="date_format">Date Format<span className="text-danger">*</span></label>
                                            <select
                                                id="date_format"
                                                name="date_format"
                                                onChange={formik3.handleChange}
                                                value={formik3.values.date_format}
                                                className="form-select text-white-dark">
                                                <option value="">Select a date format</option>
                                                <option value="Y-m-d">YYYY-MM-DD</option>
                                                <option value="m-d-Y">MM-DD-YYYY</option>
                                                <option value="d-m-Y">DD-MM-YYYY</option>
                                            </select>
                                            {formik3.submitCount ? formik3.errors.date_format ? <div className="text-danger mt-1">{formik3.errors.date_format}</div> : "" : null}
                                        </div>

                                        <div className={formik3.submitCount ? (formik3.errors.pagination ? 'has-error' : 'has-success') : ''}>
                                            <label htmlFor="pagination">Pagination<span className="text-danger">*</span> </label>
                                            <input
                                                name="pagination"
                                                type="number"
                                                id="pagination"
                                                placeholder="Enter Pagination"
                                                className="form-input"
                                                onChange={formik3.handleChange}
                                                onBlur={formik3.handleBlur}
                                                value={formik3.values.pagination}
                                            />
                                            {formik3.submitCount ? formik3.errors.pagination ? <div className="text-danger mt-1">{formik3.errors.pagination}</div> : "" : null}
                                        </div>

                                        <div className={formik3.submitCount ? (formik3.errors.auto_logout ? 'has-error' : 'has-success') : ''}>
                                            <label htmlFor="auto_logout">Auto Logout (minutes)<span className="text-danger">*</span></label>
                                            <select
                                                id="auto_logout"
                                                onChange={formik3.handleChange}
                                                value={formik3.values.auto_logout}
                                                className="form-select text-white-dark">
                                                <option value="">Select an Auto Logout Time(minutes)</option>
                                                <option value="5">5 minutes</option>
                                                <option value="10">10 minutes</option>
                                                <option value="15">15 minutes</option>
                                                <option value="20">20 minutes</option>
                                                <option value="30">30 minutes</option>
                                            </select>
                                            {formik3.submitCount ? formik3.errors.auto_logout ? <div className="text-danger mt-1">{formik3.errors.auto_logout}</div> : "" : null}
                                        </div>



                                        <div className="sm:col-span-2 mt-3">
                                            <button type="submit" className="btn btn-primary"
                                            // onClick={() => {
                                            //     if (Object.keys(formik2.touched).length !== 0 && Object.keys(formik2.errors).length === 0) {
                                            //         formik2.handleSubmit();
                                            //     }
                                            // }}
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    ) : (
                        ''
                    )}
                    {tabs === 'danger-zone' ? (
                        <div className="switch">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="panel space-y-5">
                                    <h5 className="font-semibold text-lg mb-4">Purge Cache</h5>
                                    <p>Remove the active resource from the cache without waiting for the predetermined cache expiry time.</p>
                                    <button className="btn btn-secondary">Clear</button>
                                </div>
                                <div className="panel space-y-5">
                                    <h5 className="font-semibold text-lg mb-4">Deactivate Account</h5>
                                    <p>You will not be able to receive messages, notifications for up to 24 hours.</p>
                                    <label className="w-12 h-6 relative">
                                        <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox7" />
                                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                    </label>
                                </div>
                                <div className="panel space-y-5">
                                    <h5 className="font-semibold text-lg mb-4">Delete Account</h5>
                                    <p>Once you delete the account, there is no going back. Please be certain.</p>
                                    <button className="btn btn-danger btn-delete-account">Delete my account</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </>
    );
};

export default withApiHandler(AccountSetting);
