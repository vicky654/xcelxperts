import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../CrudModal/AddModalHeader';
import FormikInput from '../../FormikFormTools/FormikInput';
import FormikSelect from '../../FormikFormTools/FormikSelect';
import { userInitialValues } from '../../FormikFormTools/InitialValues';
import { getUserValidationSchema } from '../../FormikFormTools/ValidationSchema';
import useErrorHandler from '../../../hooks/useHandleError';

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



const UserAddonModal: React.FC<AddonsModalProps> = ({ isOpen, onClose, getData, onSubmit, userId }) => {
  
    const [data, setData] = useState<AddonData[]>([]);
    const [name, setname] = useState('');
    const handleApiError = useErrorHandler();
    useEffect(() => {
        if(userId){
            fetchData();
        }
        
    }, [userId]);

    const fetchData = async () => {
        try {
            const response = await getData(`/addon/assigned?id=${userId}`);
            if (response && response.data) {
                setname(response.data?.data?.name);
                setData(response.data?.data?.addons);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        }
    };

console.log(name, "name");
 
    const formik = useFormik({
        initialValues: {
            addons: data.map((addon) => ({ id: addon.id, name: addon.name, checked: addon.checked })),
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
                                <AddModalHeader title="Assign User Addon" onClose={onClose} />
                                <div className="relative py-6 px-4 bg-white">
                                    <form onSubmit={formik.handleSubmit}>
                                        {formik.values.addons.map((addon: any, index: any) => (
                                            <div key={addon.id} className="mb-4">
                                                <label className="labelclick">
                                                    <input type="checkbox" name={`addons[${index}].checked`} checked={addon.checked} onChange={formik.handleChange} className="form-check-input" />
                                                    <span className="checkbox-title">{addon.name}</span>
                                                </label>
                                            </div>
                                        ))}
                                        <button type="submit" className="btn btn-primary">
                                            Assign
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserAddonModal;
