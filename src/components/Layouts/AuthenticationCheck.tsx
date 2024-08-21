import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';
import { IRootState } from '../../store';
import withApiHandler from '../../utils/withApiHandler';
import axios from 'axios';
import LoaderImg from '../../utils/Loader';
interface ManageUserProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
}


const AuthenticationCheck: React.FC<ManageUserProps> = ({ postData, getData, isLoading }) => {


    const navigate = useNavigate()


    const fetchLists = async () => {
        try {
            const response = await getData('/detail');
            if (response?.data?.data) {
                navigate("/dashboard")
                // setCommonListData(response.data.data);
            } else {
                navigate("/login")
                throw new Error('No data available in the response');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const { response } = error;
                if (response) {
                    if (response.status === 401) {
                        setTimeout(() => {
                            window.location.replace('/login');
                            localStorage.clear();
                        }, 2000);
                    } else if (response.status === 403) {
                        // Handle 403 error if needed
                    } else if (response.data && response.data.message) {
                        const errorMessage = Array.isArray(response.data.message)
                            ? response.data.message.join(' ')
                            : response.data.message;

                        if (errorMessage) {
                            // ErrorToast(errorMessage);
                        }
                    } else {
                        // ErrorToast("An error occurred.");
                    }
                } else {
                    // ErrorToast("Failed to fetch data from API.");
                }
            }

        }
    };

    useEffect(() => {
        fetchLists()
    }, [])


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Error 404'));
    });
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);

    return (
        <>
        {isLoading ? <LoaderImg /> : null}
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
            <div className="px-6 py-16 text-center font-semibold before:container before:absolute before:left-1/2 before:-translate-x-1/2 before:rounded-full before:bg-[linear-gradient(180deg,#4361EE_0%,rgba(67,97,238,0)_50.73%)] before:aspect-square before:opacity-10 md:py-20">
                <div className="relative">
                    <img
                        src={isDark ? '/assets/images/error/maintenence-dark.svg' : '/assets/images/error/maintenence-dark.svg'}
                        alt="404"
                        className="mx-auto -mt-10 w-full max-w-xs object-cover md:-mt-14 md:max-w-xl"
                    />
                    {/* <p className="mt-5 text-base dark:text-white">The page you requested was not found!</p>
                    <Link  to="/dashboard"  className="btn btn-gradient mx-auto !mt-7 w-max border-0 uppercase shadow-none">
                        Home
                    </Link> */}
                </div>
            </div>
        </div>
        </>
    );
};
export default withApiHandler(AuthenticationCheck);

