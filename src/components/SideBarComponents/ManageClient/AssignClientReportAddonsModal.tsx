import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../CrudModal/AddModalHeader';
import useErrorHandler from '../../../hooks/useHandleError';
import noDataImage from '../../../assets/AuthImages/noDataFound.png'; // Import the image
import { string } from 'yup';

interface AddonsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: any) => Promise<void>;
    getData: (url: string) => Promise<any>;
    userId: string | null;
}

interface AddonData {
    id: string;
    name: string;
    checked: boolean;
}

interface FormValues {
    addons: AddonData[];
    client_id: string;
}

const AssignClientReportAddonsModal: React.FC<AddonsModalProps> = ({ isOpen, onClose, getData, onSubmit, userId }) => {
    const [data, setData] = useState<AddonData[]>([]);
    const [name, setname] = useState('');
    const handleApiError = useErrorHandler();
    useEffect(() => {
        if (userId) {
            formik.resetForm()
            fetchData();
        }
    }, [userId]);

    const fetchData = async () => {
        try {
            const response = await getData(`/client/assigned-report?client_id=${userId}`);
            if (response && response.data) {
                formik.setFieldValue("addons", response.data?.data)
                formik.setFieldValue("client_id", userId)
                // setname(response.data?.data?.name);
                // setData(response.data?.data?.addons);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        }
    };


    const formik = useFormik<FormValues>({
        initialValues: {
            addons: [],
            client_id: ""
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            await onSubmit(values);
            onClose();
        },
    });


    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>
                <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 w-full">
                                <AddModalHeader title={`Assign Reports ${name ? (name) : ''}`} onClose={onClose} />
                                <div className="relative py-6 px-4 bg-white">
                                    {formik?.values?.addons?.length > 0 ? (
                                        <form onSubmit={formik.handleSubmit}>
                                            {formik?.values?.addons?.map((addon: any, index) => (
                                                <div key={addon.id} className="mb-4">
                                                    <label className="labelclick">
                                                        <input type="checkbox" name={`addons[${index}].checked`} checked={addon.checked} onChange={formik.handleChange} className="form-check-input" />
                                                        <span className="checkbox-title">{addon.report_name}</span>
                                                    </label>
                                                </div>
                                            ))}
                                            <div className=' text-end'>
                                                <button type="submit" className="btn btn-primary">
                                                    Assign Reports
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <img
                                                src={noDataImage} // Use the imported image directly as the source
                                                alt="no data found"
                                                className="all-center-flex nodata-image"
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AssignClientReportAddonsModal;