import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import IconHome from '../../components/Icon/IconHome';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import IconUser from '../../components/Icon/IconUser';
import IconPhone from '../../components/Icon/IconPhone';
import IconLinkedin from '../../components/Icon/IconLinkedin';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconFacebook from '../../components/Icon/IconFacebook';
import IconGithub from '../../components/Icon/IconGithub';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IRootState } from '../../store';
import withApiHandler from '../../utils/withApiHandler';
import useHandleError from '../../hooks/useHandleError';
import { AxiosError } from 'axios';
import { showMessage } from '../../utils/errorHandler';
import LoaderImg from '../../utils/Loader';



interface AccountSettingProps {
    isLoading: boolean; // Define the type of the loading prop
    fetchedData: any; // Define the type of the fetchedData prop
    getData: (url: string, id?: string, params?: any) => Promise<any>;
    postData: (url: string, body: any, navigatePath?: string) => Promise<any>;
}




const AccountSetting: React.FC<AccountSettingProps> = ({ postData, getData, isLoading }) => {
    const dispatch = useDispatch();
    const { data, error } = useSelector((state: IRootState) => state?.data);
    const handleError = useHandleError();


    useEffect(() => {
        dispatch(setPageTitle('Account Setting'));
    });

    useEffect(() => {
        formik.setFieldValue("first_name", data?.first_name)
        formik.setFieldValue("last_name", data?.last_name)
        formik.setFieldValue("email", data?.email)
    }, [data])

    const [tabs, setTabs] = useState<string>('home');
    const toggleTabs = (name: string) => {
        setTabs(name);
    };


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


    const formik = useFormik<FormValues>({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
        },
        validationSchema: Yup.object({
            first_name: Yup.string()
                .min(3, 'First name must be at least 3 characters')
                .required('First name Is Required'),
            last_name: Yup.string()
                .min(3, 'Last name must be at least 3 characters')
                .required('Last name Is Required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email Is Required'),
        }),
        onSubmit: async (values) => {
            console.log(values);
            const formData = new FormData();
            formData.append("first_name", values.first_name);
            formData.append("last_name", values.last_name);
            try {

                const response = await postData(`/update-profile`, formData,)

                // const data: ResponseData = await response.json();

                if (response.ok) {
                    // SuccessAlert(Array.isArray(data.message) ? data.message.join(" ") : data.message);
                    useNavigate()("/dashboard");
                    // setSubmitting(false);
                } else {
                    const errorMessage = Array.isArray(data.message)
                        ? data.message.join(" ")
                        : data.message;
                    // ErrorAlert(errorMessage);
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

            if (response.ok) {
                SuccessAlert(Array.isArray(data.message) ? data.message.join(" ") : data.message);
                useNavigate()("/dashboard");
                // setSubmitting(false);
            } else {
                const errorMessage = Array.isArray(data.message)
                    ? data.message.join(" ")
                    : data.message;

                ErrorAlert(errorMessage);
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
                .required('Current password Is Required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Password Is Required'),
            password_confirmation: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password Is Required'),
        }),


        onSubmit: async (values) => {
            console.log(values);
            try {
                const formData = new FormData();
                formData.append("old_password", values.old_password);
                formData.append("password", values.password);
                formData.append("password_confirmation", values.password_confirmation);

                const response = await postData(`/update/password`, formData,)

                const data = await response.json();


                console.log(data, "datadata");


                if (response.ok) {
                    localStorage.clear();
                    setTimeout(() => {
                        window.location.replace("/");
                    }, 500);
                    // SuccessAlert(data.message);
                    // setLoading(false);
                } else {
                    const errorMessage = Array.isArray(data.message)
                        ? data.message.join(" ")
                        : data.message;

                }
            } catch (error) {

                console.log(error, "errorerror");
                useHandleError()
            }
        },
    });

    console.log(data, "dataaa");
    console.log(formik?.values, "formik values");


    return (


        <>

            {isLoading ? <LoaderImg /> : null}
            <div>
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="#" className="text-primary hover:underline">
                            Users
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>Account Settings</span>
                    </li>
                </ul>
                <div className="pt-5">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Settings</h5>
                    </div>
                    <div>
                        <ul className="sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('home')}
                                    className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'home' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconHome />
                                    Home
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('payment-details')}
                                    className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'payment-details' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconUser className="w-5 h-5" />
                                    Update Password
                                </button>
                            </li>
                            <li className="inline-block">
                                <button
                                    onClick={() => toggleTabs('danger-zone')}
                                    className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'danger-zone' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconPhone />
                                    Mobile App Authentication
                                </button>
                            </li>
                            {/* <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('payment-details')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'payment-details' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconDollarSignCircle />
                                Payment Details
                            </button>
                        </li>
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('preferences')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'preferences' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconUser className="w-5 h-5" />
                                Preferences
                            </button>
                        </li>
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('danger-zone')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'danger-zone' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconPhone />
                                Danger Zone
                            </button>
                        </li> */}
                        </ul>
                    </div>
                    {tabs === 'home' ? (
                        <div>
                            <form onSubmit={formik.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                <h6 className="text-lg font-bold mb-5">General Information</h6>
                                <div className="flex flex-col sm:flex-row">
                                    <div className="ltr:sm:mr-4 rtl:sm:ml-4 w-full sm:w-2/12 mb-5">
                                        <img src="/assets//images/profile-34.jpeg" alt="img" className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover mx-auto" />
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className={formik.submitCount ? (formik.errors.first_name ? 'has-error' : 'has-success') : ''}>
                                            <label htmlFor="first_name">First Name </label>
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
                                            <label htmlFor="last_name">Last Name </label>
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
                                            <label htmlFor="email">Email </label>
                                            <input
                                                name="email"
                                                type="email"
                                                id="email"
                                                placeholder="Enter Email "
                                                readOnly
                                                className="form-input readonly_input "
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
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    ) : (
                        ''
                    )}
                    {tabs === 'payment-details' ? (
                        <div>
                            <form onSubmit={formik2.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                <h6 className="text-lg font-bold mb-5">Update Password</h6>
                                <div className="flex flex-col sm:flex-row">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-5">
                                        <div className={formik2.submitCount ? (formik2.errors.old_password ? 'has-error' : 'has-success') : ''}>
                                            <label htmlFor="old_password">Current Password </label>
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
                                            <label htmlFor="password">New Password </label>
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
                                            <label htmlFor="password_confirmation">Confirm Password </label>
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
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    ) : (
                        ''
                    )}
                    {tabs === 'preferences' ? (
                        <div className="switch">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                                <div className="panel space-y-5">
                                    <h5 className="font-semibold text-lg mb-4">Choose Theme</h5>
                                    <div className="flex justify-around">
                                        <div className="flex">
                                            <label className="inline-flex cursor-pointer">
                                                <input className="form-radio ltr:mr-4 rtl:ml-4 cursor-pointer" type="radio" name="flexRadioDefault" defaultChecked />
                                                <span>
                                                    <img className="ms-3" width="100" height="68" alt="settings-dark" src="/assets/images/settings-light.svg" />
                                                </span>
                                            </label>
                                        </div>

                                        <label className="inline-flex cursor-pointer">
                                            <input className="form-radio ltr:mr-4 rtl:ml-4 cursor-pointer" type="radio" name="flexRadioDefault" />
                                            <span>
                                                <img className="ms-3" width="100" height="68" alt="settings-light" src="/assets/images/settings-dark.svg" />
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="panel space-y-5">
                                    <h5 className="font-semibold text-lg mb-4">Activity data</h5>
                                    <p>Download your Summary, Task and Payment History Data</p>
                                    <button type="button" className="btn btn-primary">
                                        Download Data
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="panel space-y-5">
                                    <h5 className="font-semibold text-lg mb-4">Public Profile</h5>
                                    <p>
                                        Your <span className="text-primary">Profile</span> will be visible to anyone on the network.
                                    </p>
                                    <label className="w-12 h-6 relative">
                                        <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1" />
                                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                    </label>
                                </div>
                                <div className="panel space-y-5">
                                    <h5 className="font-semibold text-lg mb-4">Show my email</h5>
                                    <p>
                                        Your <span className="text-primary">Email</span> will be visible to anyone on the network.
                                    </p>
                                    <label className="w-12 h-6 relative">
                                        <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox2" />
                                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white  dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                    </label>
                                </div>
                                <div className="panel space-y-5">
                                    <h5 className="font-semibold text-lg mb-4">Enable keyboard shortcuts</h5>
                                    <p>
                                        When enabled, press <span className="text-primary">ctrl</span> for help
                                    </p>
                                    <label className="w-12 h-6 relative">
                                        <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox3" />
                                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white  dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                    </label>
                                </div>
                                <div className="panel space-y-5">
                                    <h5 className="font-semibold text-lg mb-4">Hide left navigation</h5>
                                    <p>
                                        Sidebar will be <span className="text-primary">hidden</span> by default
                                    </p>
                                    <label className="w-12 h-6 relative">
                                        <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox4" />
                                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white  dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                    </label>
                                </div>
                                <div className="panel space-y-5">
                                    <h5 className="font-semibold text-lg mb-4">Advertisements</h5>
                                    <p>
                                        Display <span className="text-primary">Ads</span> on your dashboard
                                    </p>
                                    <label className="w-12 h-6 relative">
                                        <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox5" />
                                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white  dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                    </label>
                                </div>
                                <div className="panel space-y-5">
                                    <h5 className="font-semibold text-lg mb-4">Social Profile</h5>
                                    <p>
                                        Enable your <span className="text-primary">social</span> profiles on this network
                                    </p>
                                    <label className="w-12 h-6 relative">
                                        <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox6" />
                                        <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white  dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                    </label>
                                </div>
                            </div>
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
