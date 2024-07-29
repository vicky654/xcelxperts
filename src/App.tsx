import { PropsWithChildren, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store, { IRootState } from './store';
import { toggleRTL, toggleTheme, toggleLocale, toggleMenu, toggleLayout, toggleAnimation, toggleNavbar, toggleSemidark } from './store/themeConfigSlice';
import { fetchStoreData } from './store/dataSlice';
import '@flaticon/flaticon-uicons/css/all/all.css';
import { useNavigate } from 'react-router-dom';

function App({ children }: PropsWithChildren) {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(fetchStoreData() as any);
        }
        // console.clear()
    }, []);

    useEffect(() => {
        dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme));
        dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
        dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout));
        dispatch(toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass));
        dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation));
        dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar));
        dispatch(toggleLocale(localStorage.getItem('i18nextLng') || themeConfig.locale));
        dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark));
    }, [dispatch, themeConfig.theme, themeConfig.menu, themeConfig.layout, themeConfig.rtlClass, themeConfig.animation, themeConfig.navbar, themeConfig.locale, themeConfig.semidark]);
    // const [isTokenValid, setIsTokenValid] = useState(true);
    // const navigate = useNavigate();
  
    // // Example token (you would fetch this from storage or context)
    // const token = localStorage.getItem('token');
  
    // console.log('Fetched token from localStorage:', token);
  
    // // Function to check token validity with the API
    // const validateToken = async () => {
    //   console.log('Validating token...');
  
    //   try {
    //     const response = await fetch('detail', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
  
    //     console.log('Received response from API:', response);
  
    //     const data = await response.json();
  
    //     console.log('Parsed response data:', data);
  
    //     if (data.isValid) {
    //       console.log('Token is valid');
    //       setIsTokenValid(true);
    //     } else {
    //       console.log('Token is invalid');
    //       setIsTokenValid(false);
    //     }
    //   } catch (error) {
    //     console.error('Token validation failed:', error);
    //     setIsTokenValid(false);
    //   }
    // };
  
    // const handleVisibilityChange = () => {
    //   console.log('Visibility state changed:', document.visibilityState);
  
    //   if (document.visibilityState === 'visible') {
    //     console.log('Tab is now visible, validating token...');
    //     validateToken();
    //   }
    // };
  
    // // Set up the event listener for visibility change
    // useEffect(() => {
    //   console.log('Setting up visibilitychange event listener');
    //   document.addEventListener('visibilitychange', handleVisibilityChange);
  
    //   // Clean up event listener on component unmount
    //   return () => {
    //     console.log('Cleaning up visibilitychange event listener');
    //     document.removeEventListener('visibilitychange', handleVisibilityChange);
    //   };
    // }, []); // Empty dependency array to set up once on mount
  
    // // Redirect or render UI based on token validity
    // if (!isTokenValid) {
    //   console.log('Token is not valid, navigating to login');
    //   navigate(`/`);
    // }
  
    // console.log('Token is valid, rendering app content');
  

    return (
        <div


            className={`${(store.getState().themeConfig.sidebar && 'toggle-sidebar') || ''} ${themeConfig.menu} ${themeConfig.layout} ${themeConfig.rtlClass
                } horizontal main-section antialiased relative font-nunito text-sm font-normal`}
        // className="
        //  horizontal full ltr main-section antialiased relative font-nunito text-sm font-normal"
        >
            {children}
        </div>
    );
}

export default App;
