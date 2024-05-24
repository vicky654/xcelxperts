import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { fetchData } from '../store/dataSlice';

const PrivateRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isLoggedIn = Boolean(localStorage.getItem('token'));
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        // Dispatch the fetchData thunk action creator directly
        // dispatch(fetchData());
    }, [dispatch]); // Include dispatch as a dependency

    if (!isLoggedIn) {
        return <Navigate to="/auth/cover-login" state={{ from: location }} />;
    }

    return <>{children}</>;
};

export default PrivateRouter;
