import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isLoggedIn = Boolean(localStorage.getItem('token'));

    if (!isLoggedIn) {
        return <Navigate to="/auth/cover-login" state={{ from: location }} />;
    }

    return <>{children}</>;
};

export default PrivateRouter;
