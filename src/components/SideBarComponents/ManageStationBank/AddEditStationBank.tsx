import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../../SideBarComponents/CrudModal/AddModalHeader';
import FormikSelect from '../../FormikFormTools/FormikSelect';
import FormikInput from '../../FormikFormTools/FormikInput';
import { stationBankInitialValues } from '../../FormikFormTools/InitialValues';
import { stationBankValidation } from '../../FormikFormTools/ValidationSchema';
import useErrorHandler from '../../../hooks/useHandleError';




interface RowData {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role: any;
}


interface AddEditStationTankModalProps {
    isOpen: boolean;
    onClose: () => void;
    getData: (url: string) => Promise<any>;
    onSubmit: (values: any, formik: any) => Promise<void>;
    isEditMode: boolean;
    userId?: string | null;
    editUserData?: Partial<RowData> | null;
    tankList?: any;
    station_id?: any;
}




const AddEditStationTankModal: React.FC<AddEditStationTankModalProps> = ({ isOpen, onClose, getData, onSubmit, isEditMode, userId, station_id }) => {

    const handleApiError = useErrorHandler();

    useEffect(() => {
        if (isOpen) {
            formik.resetForm()
            if (station_id) {
                formik.setFieldValue('station_id', station_id);
                fetchFuelNameList(station_id)
            }

            if (isEditMode) {
                fetchUserDetails(userId ? userId : '');
                // FetchClientList();
            }
        }
    }, [isOpen, isEditMode, userId]);







    const fetchUserDetails = async (id: string) => {
        try {
            const response = await getData(`/station/bank/${id}`);
            if (response && response.data) {
                const userData: any = response.data?.data;
                formik.setFieldValue('bank_id', userData?.bank_id);
                formik.setFieldValue('account_no', userData?.account_no);


            }
        } catch (error) {
            handleApiError(error);
        }
    };





    const fetchFuelNameList = async (siteId: string) => {
        try {
            const response = await getData(`getBanks`);
            formik.setFieldValue('tankList', response?.data);
        } catch (error) {
            handleApiError(error)
        }
    };

    const editCloseCheck = () => {
        if (isEditMode) {
            formik.resetForm()
        }
        onClose();
    }

    const formik = useFormik({
        initialValues: stationBankInitialValues,
        validationSchema: stationBankValidation(isEditMode),
        onSubmit: async (values, { resetForm }) => {
            try {
                await onSubmit(values, formik);
                editCloseCheck();
            } catch (error) {
               
                throw error; // Rethrow the error to be handled by the caller
            }
        },
    });




   
    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={editCloseCheck}></div>

                <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 w-full">
                                <AddModalHeader title={isEditMode ? 'Edit Station Bank' : 'Add Station Bank'} onClose={editCloseCheck} />
                                <div className="relative py-6 px-4 bg-white">
                                    <form onSubmit={formik.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">


                                                {<FormikSelect
                                                    formik={formik}
                                                    name="bank_id"
                                                    label="Bank Name"
                                                    options={formik.values.tankList?.data?.map((item: any) => ({ id: item.id, name: item.name }))}
                                                    className="form-select text-white-dark"
                                                // onChange={handleSiteChange}
                                                />
                                                }


                                                <FormikInput formik={formik} type="text" name="account_no" label="Account No" placeholder="Account No" />



                                                <div className="sm:col-span-2 mt-3">
                                                    <button type="submit" className="btn btn-primary">
                                                        {isEditMode ? 'Update' : 'Save'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
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

export default AddEditStationTankModal;