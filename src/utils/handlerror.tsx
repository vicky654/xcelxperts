import showMessage from '../hooks/showMessage';

const handleError = (error: any, navigate: (path: string) => void) => {
    if (error.response && error.response.status === 401) {
        navigate('/login');
        showMessage('Invalid access token', 'error');
        localStorage.clear();
    } else if (error.response && error.response.data?.status_code === '403') {
        navigate('/errorpage403');
    } else {
        const errorMessage = Array.isArray(error.response?.data?.message) ? error.response?.data?.message.join(' ') : error.response?.data?.message;
        showMessage(errorMessage || 'An unexpected error occurred', 'error');
    }
};
export { handleError };
