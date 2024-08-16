import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../../SideBarComponents/CrudModal/AddModalHeader';
import FormikSelect from '../../FormikFormTools/FormikSelect';
import FormikInput from '../../FormikFormTools/FormikInput';
import useErrorHandler from '../../../hooks/useHandleError';
import { credituserInitialValues, stcokLossInitialValues } from '../../FormikFormTools/InitialValues';

import { MultiSelect } from 'react-multi-select-component';
import { Col } from 'react-bootstrap';
import { credituserValidationSchema, StocklossValidationSchema } from '../../FormikFormTools/ValidationSchema';

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
    name: string;
}

interface RowData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: any;
}


interface AddEditStockLossProps {
    isOpen: boolean;
    onClose: () => void;
    getData: (url: string) => Promise<any>;
    onSubmit: (values: any, formik: any) => Promise<void>;
    isEditMode: boolean;
    userId?: string | null;
    station?: string | null;
    editUserData?: Partial<RowData> | null;
    tankList?: tankList;
}




type tankList = {
    fuels: [];
    pumps: [];
};

const AddEditStockLoss: React.FC<AddEditStockLossProps> = ({ isOpen, onClose, getData, onSubmit, isEditMode, userId, station }) => {
    const handleApiError = useErrorHandler();



    useEffect(() => {
        if (isOpen) {
            formik.resetForm()


            if (isEditMode) {
                fetchUserDetails(userId ? userId : '');
                // FetchClientList();
            }
            if (station) {
                formik.setFieldValue('station_id', station)
                fetchSiteList(station)
            }

        }
    }, [isOpen, isEditMode, userId]);



    const fetchSiteList = async (companyId: string) => {
        try {
            const response = await getData(`station/fuel/list?station_id=${station}`);
            formik.setFieldValue('sites', response.data?.data?.fuels);

        } catch (error) {
            handleApiError(error);
        }
    };
    const fetchUserDetails = async (id: string) => {
        try {
            const response = await getData(`/station/config-stock-loss/${id}`);
            if (response && response.data) {
                const userData: any = response.data?.data;
                const reports: any[] = response.data?.data?.fuels || [];

                const checkedReports = reports
                    .filter((report) => report.checked)
                    .map((report) => ({
                        value: report.id,
                        label: report.name,
                    }));
                // client_id: '',
                // name: '',
                // phone_number: '',
                // max_amount: '',
                // selectedStations: [],
                formik.setFieldValue("selectedStations", checkedReports);
                formik.setFieldValue('sites', userData?.fuels);

                formik.setFieldValue("name", userData?.name);

                formik.setFieldValue("max_amount", userData?.value);

                // formik.setValues(userData);
            }
        } catch (error) {
            handleApiError(error);
        }
    };




    const editCloseCheck = () => {
        if (isEditMode) {
            formik.resetForm();
        }
        onClose();
    };

    const formik = useFormik({
        initialValues: stcokLossInitialValues,
        validationSchema: StocklossValidationSchema(isEditMode),
        onSubmit: async (values, { resetForm }) => {
            try {
                await onSubmit(values, formik);

            } catch (error) {
                handleApiError(error);
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
                                <AddModalHeader title={isEditMode ? 'Edit Stock Loss Configuration' : 'Add Stock Loss Configuration'} onClose={editCloseCheck} />
                                <div className="relative py-6 px-4 bg-white">
                                    <form onSubmit={formik.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                <FormikInput formik={formik} type="text" name="name" label=" Name" />

                                                <FormikInput formik={formik} type="number" name="max_amount" label="Value(%)" placeholder='Value(%)' />
                                                <Col lg={6} md={6}>
                                                    <label className="form-label ">
                                                        Select Fuels
                                                        <span className="text-danger">*</span>
                                                    </label>
                                                    <MultiSelect
                                                        value={formik.values.selectedStations}
                                                        onChange={(selectedStations: any) => formik.setFieldValue('selectedStations', selectedStations)}
                                                        // value={selected}
                                                        // onChange={setSelected}
                                                        labelledBy="Select Fuels.."
                                                        options={formik.values?.sites?.map((item) => ({ value: item.id, label: item.name }))}

                                                    />

                                                    {formik.errors.selectedStations && formik.touched.selectedStations && (
                                                        <div className="text-danger">{formik?.errors?.selectedStations}</div>
                                                    )}
                                                </Col>


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

export default AddEditStockLoss;
