import React, { useEffect, useState } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import AddModalHeader from '../CrudModal/AddModalHeader';
import MultiDateRangePicker from '../../../utils/MultiDateRangePicker';
import { MultiSelect } from 'react-multi-select-component';
import { Col, FormGroup } from 'react-bootstrap';
import FormikSelect from '../../FormikFormTools/FormikSelect';

interface RowData {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role: any;
}

interface AssignManagerModalProps {
    isOpen: boolean;
    dataList: any;
    onClose: () => void;
    getData: (url: string) => Promise<any>;
    onSubmit: (values: any, formik: any) => Promise<void>;
    isEditMode: boolean;
    userId?: string | null;
    editUserData?: Partial<RowData> | null;
}



interface Reports {
    report_name: string;
    id: string;
    name: string;
    checked: boolean;

}
interface Users {

    id: string;
    user_name: string;

}
const AssignManagerModal: React.FC<AssignManagerModalProps> = ({
    isOpen,
    onClose,
    getData,
    dataList,
    onSubmit,
    isEditMode,
    userId,
}) => {
    const holidayInitialValues = {
        sites: [] as Reports[],
        users: [] as Users[],
        user_id: '',
        selectedStations: [],
    };
    const AssignMannagerValidations = (isEditMode: boolean) => {
        return Yup.object().shape({

            selectedStations: Yup.array().min(1, 'At least one Reports must be selected').required('Stations are required'),
            // client_id: Yup.string().required('Client is required'),
            user_id: Yup.string().required('User are required'),

        });
    };
    const formik = useFormik({
        initialValues: holidayInitialValues,
        validationSchema: AssignMannagerValidations(isEditMode),
        onSubmit: async (values) => {
            try {
                console.log(values, "selectedDates");
                await onSubmit(values, formik);
            } catch (error) {
                console.error('Submit error:', error);
                throw error; // Rethrow the error to be handled by the caller
            }
        },
    });


    // useEffect(() => {
    //     formik.resetForm()
    //     if (isEditMode) {
    //         fetchUserDetails(userId ? userId : '');
    //     }
    // }, [isOpen, isEditMode, userId]);

    const fetchUserDetails = async (id: string) => {
        try {
            const response = await getData(`/station/manager/detail/${id}`);
            if (response && response.data) {
                // const userData: UserData = response.data?.data;
                console.log(response.data, " response.data");
                console.log(response.data?.data?.reports, "response.data?.data?.reports");
                formik.setFieldValue('sites', response.data?.data?.reports);
                formik.setFieldValue('users', response.data?.data?.users);
                formik.setFieldValue('user_id', response.data?.data?.user_id);
                const reports: any[] = response.data?.data?.reports || [];
                // Filter reports with checked: true
                const checkedReports = reports
                    .filter((report) => report.checked)
                    .map((report) => ({
                        value: report.id,
                        label: report.report_name,
                    }));

                console.log(checkedReports, "checkedReports");
                formik.setFieldValue("selectedStations", checkedReports);
                // formik.setValues(response.data?.data)


            }
        } catch (error) {
            console.error('API error:', error);
        }
    };


    useEffect(() => {
        if (isOpen && !isEditMode) {
            formik.resetForm()
            formik.setFieldValue('sites', dataList.reports);
            formik.setFieldValue('users', dataList.users);
            // formik.resetForm();

        }
        if (isOpen && isEditMode) {
            fetchUserDetails(userId ? userId : '')
            // console.log(isEditMode, "isEditModeddd");
        }
    }, [isOpen, isEditMode, userId]);

    console.log(dataList, "values");
    console.log(formik.values?.sites, "columnIndexd");
    return (
        <div
            className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                    onClick={onClose}
                ></div>

                <section
                    className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
                        } duration-300 ease-in-out`}
                >
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 w-full">
                                <AddModalHeader title={isEditMode ? 'Assign Station Mannager ' : 'Assign Station Mannager'} onClose={onClose} />
                                <div className="relative py-6 px-4 bg-white">
                                    <form
                                        onSubmit={formik.handleSubmit}
                                        className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black"
                                    >
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                <Col lg={4} md={6}>
                                                    <label className="form-label ">
                                                        Select Stations
                                                        <span className="text-danger">*</span>
                                                    </label>
                                                    <MultiSelect
                                                        value={formik.values.selectedStations}
                                                        onChange={(selectedStations: any) => formik.setFieldValue('selectedStations', selectedStations)}
                                                        // value={selected}
                                                        // onChange={setSelected}
                                                        labelledBy="Select Stations.."
                                                        options={formik.values?.sites?.map((item) => ({ value: item.id, label: item.report_name }))}
                                                    />

                                                    {formik.errors.selectedStations && formik.touched.selectedStations && (
                                                        <div className="text-danger">{formik?.errors?.selectedStations}</div>
                                                    )}
                                                </Col>
                                                <Col lg={4} md={6}>
                                                    <FormikSelect
                                                        formik={formik}
                                                        name="user_id"
                                                        label="User"
                                                        options={formik.values?.users?.map((item: any) => ({ id: item.id, name: item.user_name }))}
                                                        className="form-select text-white-dark"
                                                    // onChange={handleSiteChange}
                                                    />
                                                </Col>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-2 mt-3">
                                            <button type="submit" className="btn btn-primary">
                                                {isEditMode ? 'Update' : 'Save'}
                                            </button>
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

export default AssignManagerModal;
