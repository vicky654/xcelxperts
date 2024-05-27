import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const showMessage = (msg: string = '', type: string = 'error') => {
    const toast: any = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        customClass: { container: 'toast' },
    });
    toast.fire({
        icon: type === 'error' ? 'error' : 'success',
        title: msg,
        padding: '10px 20px',
    });
};

const useApiErrorHandler = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleApiError = useCallback((error: any) => {
        if (error.response) {
            const status = error.response.status;
            if (status === "401") {
                navigate('/auth/cover-login');
            } else {
                const message = error.response.data.message;
                showMessage(message, 'error');
                setErrorMessage(message);
            }
        } else if (error.request) {
            showMessage('Network Error. Please try again.', 'error');
            setErrorMessage('Network Error. Please try again.');
        } else {
            showMessage('An unexpected error occurred. Please try again later.', 'error');
            setErrorMessage('An unexpected error occurred. Please try again later.');
        }
    }, [navigate]);

    useEffect(() => {
        return () => {
            setErrorMessage(null);
        };
    }, []);

    return handleApiError;
};

export default useApiErrorHandler;
