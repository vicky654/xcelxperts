import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import showMessage from './showMessage';

/**
 * Show a toast message using SweetAlert2.
 * @param msg The message to display.
 * @param type The type of the message (error or success).
 */


/**
 * Custom hook to handle API errors and display appropriate messages.
 * @returns A function to handle API errors.
 */
const useErrorHandler = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    /**
     * Handle API error responses.
     * @param error The error object.
     */
    const handleApiError = useCallback((error: any) => {
        if (error.response && error.response.data) {
            const { status_code, message, data } = error.response.data;
            if (status_code == 401) {
                navigate('/auth/cover-login');
                showMessage('Invalid access token', 'error');
                localStorage.clear();
            } else if (status_code == 403) {
                navigate('/errorpage403');
            } else {
                const errorMessage = message || 'An unexpected error occurred.';
                showMessage(errorMessage, 'error');
               
            }
        } 
    }, [navigate]);

    /**
     * Clear error message on unmount.
     */
    useEffect(() => {
        return () => {
            setErrorMessage(null);
        };
    }, []);

    return handleApiError;
};

export default useErrorHandler;
