// src/utils/errorHandler.ts

import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Show message function
export const showMessage = (msg = '', type = 'success') => {
    const toast: any = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        customClass: { container: 'toast' },
    });
    toast.fire({
        icon: type,
        title: msg,
        padding: '10px 20px',
    });
};

// Handle error function
export const handleError = (error: AxiosError) => {
    // const navigate = useNavigate();

    showMessage("yes error caught at tpop");

    if (error.response && error.response.status === 401) {
        // navigate('/auth/cover-login');
        showMessage('Invalid access token');
        localStorage.clear();
    } else if (error.response && error.response.data) {
        const responseData: { status_code?: string, message?: string | string[] } = error.response.data;

        if (responseData.status_code === '404') {
            showMessage("yes error caught");
            // navigate('/pages/error404');
        }
        else if (responseData.status_code === '500') {
            // navigate('/pages/error500');
        } else if (responseData.message) {
            const errorMessage = Array.isArray(responseData.message)
                ? responseData.message.join(' ')
                : responseData.message;

            if (errorMessage) {
                showMessage(errorMessage);
            }
        } else {
            showMessage('An error occurred.');
        }
    } else {
        showMessage('An error occurred.');
    }
};
