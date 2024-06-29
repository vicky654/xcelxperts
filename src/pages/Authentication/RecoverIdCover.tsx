import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import Dropdown from '../../components/Dropdown';
import { IRootState } from '../../store';
import i18next from 'i18next';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconMail from '../../components/Icon/IconMail';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import showMessage from '../../hooks/showMessage';
import LoaderImg from '../../utils/Loader';
interface FormValues {
    email: string;
}
const RecoverIdCover = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        dispatch(setPageTitle('Recover Id Box'));
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);
    const formik = useFormik<FormValues>({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
        }),
        onSubmit: async (values) => {
            await submitForm(values);
        },
    });
    const baseUrl = import.meta.env.VITE_API_URL;

    const submitForm = async (values: FormValues) => {
        setLoading(true)
        const { email } = values;

        const requestBody = {
            email,
        };

        try {
            const response = await fetch(`${baseUrl}/forgot/password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.ok && data) {
                showMessage('Password reset email sent successfully!', 'success');
                setLoading(false)
            } else {
                setLoading(false)
                const errorMessage = data?.message || 'Failed to reset password. Please try again.';
                showMessage(errorMessage, 'error');
                console.error('Error:', errorMessage);
            }
            setLoading(false)
        } catch (error) {
            showMessage('An unexpected error occurred. Please try again later.', 'error');
            console.error('Fetch Error:', error);
            setLoading(false)
        }
        setLoading(false)
    };
    const handleSuccess = () => {
        showMessage('Successfully recovered password!', 'success');
    };

    const handleError = () => {
        showMessage('Failed to recover password. Please try again.', 'error');
    };
    return (
        <>
            {loading ? <LoaderImg /> : null}
            <div>
                <div className="absolute inset-0">
                    <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
                </div>

                <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                    <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                    <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                    <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                    <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                    <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div  className="relative hidden w-full items-center justify-center bg-[linear-gradient(18deg,rgba(8,70,154,1)_0%,rgba(54,116,200,1)_62%,rgba(121,178,255,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]"><div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                            <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                            <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                                <Link to="/" className="w-48 block lg:w-60 ms-10" style={{background:"#fff",borderRadius:"5px"}}>
                                    <img src="/assets/images/AuthLogo.png" alt="Logo" className="w-full" />
                                </Link>
                                <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                                    <img src="/assets/images/auth/reset-password.svg" alt="Cover Image" className="w-full" />
                                </div>
                            </div>
                        </div>
                        <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                            {/* <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                                <Link to="/" className="w-8 block lg:hidden">
                                    <img src="/assets/images/logo.svg" alt="Logo" className="mx-auto w-10" />
                                </Link>
                                <div className="dropdown ms-auto w-max">
                                    <Dropdown
                                        offset={[0, 8]}
                                        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                        btnClassName="flex items-center gap-2.5 rounded-lg border border-white-dark/30 bg-white px-2 py-1.5 text-white-dark hover:border-primary hover:text-primary dark:bg-black"
                                        button={
                                            <>
                                                <div>
                                                    <img src={`/assets/images/flags/${flag.toUpperCase()}.svg`} alt="image" className="h-5 w-5 rounded-full object-cover" />
                                                </div>
                                                <div className="text-base font-bold uppercase">{flag}</div>
                                                <span className="shrink-0">
                                                    <IconCaretDown />
                                                </span>
                                            </>
                                        }
                                    >
                                        <ul className="!px-2 text-dark dark:text-white-dark grid grid-cols-2 gap-2 font-semibold dark:text-white-light/90 w-[280px]">
                                            {themeConfig.languageList.map((item: any) => {
                                                return (
                                                    <li key={item.code}>
                                                        <button
                                                            type="button"
                                                            className={`flex w-full hover:text-primary rounded-lg ${flag === item.code ? 'bg-primary/10 text-primary' : ''}`}
                                                            onClick={() => {
                                                                i18next.changeLanguage(item.code);
                                                                // setFlag(item.code);
                                                                setLocale(item.code);
                                                            }}
                                                        >
                                                            <img src={`/assets/images/flags/${item.code.toUpperCase()}.svg`} alt="flag" className="w-5 h-5 object-cover rounded-full" />
                                                            <span className="ltr:ml-3 rtl:mr-3">{item.name}</span>
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </Dropdown>
                                </div>
                            </div> */}
                            <div className="w-full max-w-[440px] lg:mt-16">
                                <div className="mb-7">

                                    <h1 className="mb-3 text-2xl font-bold !leading-snug dark:text-white"> Reset Password </h1>
                                    <p>Enter your email to Reset Password</p>
                                </div>
                                <form className="space-y-5" onSubmit={formik.handleSubmit}>
                                    <div>
                                        <label htmlFor="email">Email<span className="text-danger">*</span></label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="Enter Email"
                                                className={`form-input pl-10 placeholder:text-white-dark ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.email}
                                            />
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2">
                                                <IconMail fill={true} />
                                            </span>
                                        </div>
                                        {formik.touched.email && formik.errors.email ? <div className="text-red-500">{formik.errors.email}</div> : null}
                                    </div>
                                    <button type="submit" className="btn btn-dark !mt-6 w-full border-0 uppercase ">
                                    Reset Password
                                    </button>
                                    <div className="text-center dark:text-white">
                                        &nbsp;
                                        <Link to="/auth/cover-login" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                            Back To Login ?
                                        </Link>
                                    </div>
                                </form>
                            </div>
                            <p className="absolute bottom-6 w-full text-center dark:text-white">© {new Date().getFullYear()}.XcelXperts All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RecoverIdCover;
