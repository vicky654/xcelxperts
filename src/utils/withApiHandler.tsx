import axios, { AxiosError, AxiosInstance } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { handleError } from './errorHandler';
import 'sweetalert2/dist/sweetalert2.min.css';

interface WithApiHandlerProps {
    fetchedData?: any;
    isLoading: boolean;
    apiError?: AxiosError | null;
    getData: (url: string, id?: string, params?: any) => Promise<any>;
    postData: (url: string, body: any, navigatePath: string) => Promise<any>;
    postedData?: any;
}

const withApiHandler = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const WithApiHandler: React.FC<Omit<P, keyof WithApiHandlerProps>> = (props) => {
        const [fetchedData, setFetchedData] = useState<any>(null);
        const [postedData, setPostedData] = useState<any>(null);
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [apiError, setApiError] = useState<AxiosError | null>(null);

        const navigate = useNavigate();



        const showMessage = (msg = '', type = 'success') => {
            const toast = Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 3000,
                customClass: { container: 'toast' },
            });
            // @ts-ignore
            toast.fire({
                icon: type,
                title: msg,
                padding: '10px 20px',
            });
        };

        const axiosInstance: AxiosInstance = axios.create({
            baseURL: import.meta.env.VITE_API_URL,
        });

        axiosInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        const getData = async (url: string, id?: string, params?: any): Promise<any> => {
            try {
                setIsLoading(true);
                const modifiedUrl = id ? `${url}/${id}` : url;
                const response = await axiosInstance.get(modifiedUrl, { params });

                if (response && response.data) {
                    const data = response.data;
                    setFetchedData(data);
                    setIsLoading(false);
                    return response;
                } else {
                    throw new Error('Invalid response');
                }
            } catch (error) {
                handleError(error as AxiosError);
                setApiError(error as AxiosError);
                setIsLoading(false);
                throw error;
            }
        };

        const postData = async (url: string, body: any, navigatePath: string): Promise<any> => {
            try {
                setIsLoading(true);
                const response = await axiosInstance.post(url, body);

                if (response && response.data) {
                    const data = response.data;
                    showMessage(data.message);
                    setPostedData(data);
                    setFetchedData(data);
                    setIsLoading(false);
                    navigate(navigatePath);
                    return data;
                } else {
                    throw new Error('Invalid response');
                }
            } catch (error) {
                setApiError(error as AxiosError);
                setIsLoading(false);
            }
        };

        return (
            <WrappedComponent
                fetchedData={fetchedData}
                isLoading={isLoading}
                apiError={apiError}
                getData={getData}
                postData={postData}
                postedData={postedData}
                {...(props as P)}
            />
        );
    };

    return WithApiHandler;
};

export default withApiHandler;
