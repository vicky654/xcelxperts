import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../SideBarComponents/CrudModal/AddModalHeader';
import FormikSelect from '../FormikFormTools/FormikSelect';
import FormikInput from '../FormikFormTools/FormikInput';
import useErrorHandler from '../../hooks/useHandleError';
import { stationNozzleInitialValues } from '../FormikFormTools/InitialValues';
import { getStationNozzleValidationSchema } from '../FormikFormTools/ValidationSchema';


interface Client {
    id: string;
    client_name: string;
    full_name: string;
    entities: Entity[];
}

interface Entity {
    id: string;
    entity_name: string;
}

interface Site {
    id: string;
    site_name: string;
}

interface RowData {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role: any;
}

interface Fuel {
    id: string;
    fuel_name: string;
}

interface TankList {
    fuels: Fuel[];
}

interface FormValues {
    client_id: string;
    entity_id: string;
    station_id: string;
    tank_name: string;
    tank_code: string;
    fuel_id: string;
    status: string;
    clients: Client[];
    entities: Entity[];
    // sites: Station[];
    tankList: TankList; // Add tankList here
}

interface UserData {
    id: string;
    client_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role: string;
    role_id: string;
    status: number;
    work_flow: number;
    clients: any[];
}

interface AddEditStationNozzleModalProps {
    isOpen: boolean;
    station_id: any;
    onClose: () => void;
    // getData: (url: string) => Promise<any>;
    getData: (url: string) => Promise<any>;
    onSubmit: (values: any, formik: any) => Promise<void>;
    isEditMode: boolean;
    userId?: string | null;
    editUserData?: Partial<RowData> | null;
}

interface RoleItem {
    id: number;
    role_name: string;
}

// interface UserData {
//     first_name: string;
//     last_name: string;
//     email: string;
//     phone_number: string;
//     role: string;
//     password: string;
// }
type StationStatusOption = {
    id: string;
    name: string;
};
type tankList = {
    fuels: [];
    pumps: [];
};

const AddEditStationNozzleModal: React.FC<AddEditStationNozzleModalProps> = ({ isOpen, onClose, getData, onSubmit, isEditMode, userId, station_id }) => {

    const handleApiError = useErrorHandler();

    useEffect(() => {
        if (isOpen) {
            formik.resetForm()
            if (station_id) {
                fetchFuelNameList(station_id);
                formik.setFieldValue("station_id", station_id)
            }

            if (isEditMode) {
                fetchUserDetails(userId ? userId : '');
            }
        }
    }, [isOpen, isEditMode, userId]);








    const fetchUserDetails = async (id: string) => {
        try {
            const response = await getData(`/station/nozzle/${id}`);
            if (response && response.data) {
                const userData: any = response.data?.data;
                formik.setFieldValue('code', userData.code);
                formik.setFieldValue('name', userData.name);
                formik.setFieldValue('station_id', userData.station_id);
                formik.setFieldValue('fuel_id', userData?.tank_id);
            }
        } catch (error) {
            handleApiError(error);
        }
    };








    const fetchFuelNameList = async (siteId: string) => {
        try {
            const response = await getData(`getTanks?station_id=${siteId}`);
            formik.setFieldValue('tankList', response?.data);
        } catch (error) {
            handleApiError(error)
        }
    };

    const formik = useFormik({
        initialValues: stationNozzleInitialValues,
        validationSchema: getStationNozzleValidationSchema(isEditMode),
        onSubmit: async (values, { resetForm }) => {
            try {
                await onSubmit(values, formik);
            } catch (error) {
                console.error('Submit error:', error);
                throw error; // Rethrow the error to be handled by the caller
            }
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
                                <AddModalHeader title={isEditMode ? 'Edit Station Nozzle' : 'Add Station Nozzle'} onClose={onClose} />
                                <div className="relative py-6 px-4 bg-white">
                                    <form onSubmit={formik.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">



                                                <FormikSelect
                                                    formik={formik}
                                                    name="fuel_id"
                                                    label=" Station Tank"
                                                    options={formik.values.tankList?.data?.map((item: any) => ({ id: item.id, name: item.name }))}
                                                    className="form-select text-white-dark"
                                                // onChange={handleSiteChange}
                                                />




                                                <FormikInput formik={formik} type="text" name="code" label="Nozzle Code" placeholder="Nozzle Code"

                                                    readOnly={isEditMode ? true : false}
                                                />

                                                <FormikInput formik={formik} type="text" name="name" label="Nozzle Name" placeholder="Nozzle Name" />




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

export default AddEditStationNozzleModal;