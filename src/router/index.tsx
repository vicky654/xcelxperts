import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { routes } from './routes';
import PrivateRouter from './PrivateRouter';

const finalRoutes = routes.map((route) => {
    return {
        ...route,
        element: route.layout === 'blank'
            ? <BlankLayout>{route.element}</BlankLayout>
            : <PrivateRouter><DefaultLayout>{route.element}
                {/* withApiHandler({route.element}) */}
            </DefaultLayout></PrivateRouter>,
    };
});

const router = createBrowserRouter(finalRoutes);

export default router;
