import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../SideBarComponents/CrudModal/AddModalHeader';
import FormikSelect from '../FormikFormTools/FormikSelect';
import FormikInput from '../FormikFormTools/FormikInput';
import useErrorHandler from '../../hooks/useHandleError';
import { stationFuelPurchaseInitialValues } from '../FormikFormTools/InitialValues';
import { getStationFuelPurchaseValidationSchema } from '../FormikFormTools/ValidationSchema';
import { Col } from 'react-bootstrap';
import { MultiSelect } from 'react-multi-select-component';


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
    tankList: tankList;
}

interface AddEditStationFuelPurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    getData: (url: string) => Promise<any>;
    onSubmit: (values: any, formik: any) => Promise<void>;
    isEditMode: boolean;
    userId?: string | null;
    editUserData?: Partial<RowData> | null;
    tankList?: tankList;
}

interface RoleItem {
    id: number;
    role_name: string;
}

type StationStatusOption = {
    id: string;
    name: string;
};
type tankList = {
    fuels: [];
    pumps: [];
};

const AddEditStationFuelPurchaseModal: React.FC<AddEditStationFuelPurchaseModalProps> = ({ isOpen, onClose, getData, onSubmit, isEditMode, userId }) => {
    const [fuelSubCategory, setFuelSubCategory] = useState([]);
    const [SumTotal, setTotal] = useState<any>(); // Adjust ClientList type as needed
    const [commonDataList, setCommonDataList] = useState<any>(); // Adjust ClientList type as needed
    const handleApiError = useErrorHandler();
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        if (isOpen) {
            formik.resetForm()
            setFuelSubCategory([])
            setSelected([])
            setTotal("")
            FetchClientList();
            FetchFuelSubCategoryList();
            FetchCommonDataList();

            if (localStorage.getItem("superiorRole") === "Client") {
                const clientId = localStorage.getItem("superiorId");
                if (clientId) {
                    // Simulate the change event to call handleClientChange
                    handleClientChange({ target: { value: clientId } } as React.ChangeEvent<HTMLSelectElement>);
                }
            } else {
                FetchClientList();
            }

            if (isEditMode) {
                fetchUserDetails(userId ? userId : '');
            }
        }
    }, [isOpen, isEditMode, userId]);





    const FetchCommonDataList = async () => {
        try {
            const response = await getData('/getStation/data');
            if (response && response.data && response.data.data) {
                setCommonDataList(response.data.data)
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const FetchFuelSubCategoryList = async () => {
        try {
            const response = await getData('/fuel/subcategory');
            if (response && response.data && response.data.data) {
                setFuelSubCategory(response.data.data)
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const FetchClientList = async () => {
        try {
            const response = await getData('/getClients');
            const clients = response.data.data;
            formik.setFieldValue('clients', clients);
            // const clientId = localStorage.getItem("superiorId");
            // if (localStorage.getItem("superiorRole") !== "Client" && clientId) {
            //     formik.setFieldValue('client_id', clientId);
            //     const selectedClient = clients.find((client: Client) => client.id === clientId);
            //     if (selectedClient) {
            //         formik.setFieldValue('entities', selectedClient.entities);
            //     }
            // }
        } catch (error) {
            handleApiError(error)
        }
    };

    const fetchSiteList = async (companyId: string) => {
        try {
            const response = await getData(`getStations?entity_id=${companyId}`);
            formik.setFieldValue('sites', response.data.data);
        } catch (error) {
            handleApiError(error);
        }
    };


    const fetchUserDetails = async (id: string) => {
        try {
            const response = await getData(`/station/detail?id=${id}`);
            if (response && response.data) {
                const userData: any = response.data?.data;
                formik.setValues(userData)
                FetchClientList()
                fetchEntityList(userData?.client_id)
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const clientId = e.target.value;
        formik.setFieldValue('client_id', clientId);
        if (clientId) {
            fetchEntityList(clientId);
            const selectedClient = formik.values.clients.find((client: Client) => client.id === clientId);
            formik.setFieldValue('client_name', selectedClient?.client_name || "");
            formik.setFieldValue('entities', selectedClient?.entities || []);
            formik.setFieldValue('sites', []);
            formik.setFieldValue('entity_id', "");
            formik.setFieldValue('station_id', "");
        } else {
            formik.setFieldValue('entity_id', "");
            formik.setFieldValue('station_id', "");
            formik.setFieldValue('client_name', "");
            formik.setFieldValue('entities', []);
            formik.setFieldValue('sites', []);
            formik.setFieldValue('entity_name', "");
            formik.setFieldValue('site_name', "");
        }
    };

    const handleEntityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const entityId = e.target.value;
        formik.setFieldValue('entity_id', entityId);
        if (entityId) {
            fetchSiteList(entityId);
            const selectedEntity = formik.values.entities.find((entity: Entity) => entity.id === entityId);
            formik.setFieldValue('entity_name', selectedEntity?.entity_name || "");
            formik.setFieldValue('sites', []);
            formik.setFieldValue('tankList', "");
        } else {
            formik.setFieldValue('entity_name', "");
            formik.setFieldValue('sites', []);
            formik.setFieldValue('station_id', "");
            formik.setFieldValue('site_name', "");
            formik.setFieldValue('tankList', "");
        }
    };

    const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSiteId = e.target.value;
        formik.setFieldValue("station_id", selectedSiteId);
        formik.setFieldValue('tankList', "");
        const selectedSiteData = formik.values.sites.find((site) => site.id === selectedSiteId);
        fetchFuelNameList(selectedSiteId)
        if (selectedSiteData) {
            formik.setFieldValue("site_name", selectedSiteData.name);
        } else {
            formik.setFieldValue("site_name", "");
        }
    };


    const fetchEntityList = async (clientId: string) => {
        try {
            const response = await getData(`getEntities?client_id=${clientId}`);
            formik.setFieldValue('entities', response.data.data);
        } catch (error) {
            handleApiError(error)
        }
    };
    const fetchFuelNameList = async (siteId: string) => {
        try {
            const response = await getData(`station/fuel/list?station_id=${siteId}`);
            formik.setFieldValue('tankList', response.data.data);
        } catch (error) {
            handleApiError(error)
        }
    };

    const formik = useFormik({
        initialValues: stationFuelPurchaseInitialValues,
        validationSchema: getStationFuelPurchaseValidationSchema(isEditMode),
        onSubmit: async (values, { resetForm }) => {
            try {
              
                await onSubmit(values, selected);
                // onClose();
            } catch (error) {
                throw error; // Rethrow the error to be handled by the caller
            }
        },
    });



 

    const handleFieldChange = (
        fieldName: string,
        value: any
    ) => {
        const numericValue: number = parseFloat(value);
    
        // Update the field value in Formik
        formik.setFieldValue(fieldName, numericValue);
    
        if (fieldName === 'platts') {
            // Update ex_vat_price when platts is changed
            const vatPercentageRate = parseFloat(formik.values.vat_percentage_rate || '0');
            const calculatedExVatPrice = calculateExVatPrice(numericValue, vatPercentageRate);
            formik.setFieldValue('ex_vat_price', value);
        }
    
        if (fieldName === 'vat_percentage_rate') {
            // Update vat_percentage_rate
            const vatPercentageRate = numericValue;
    
            // Calculate the total based on the current platts value
            const plattsValue = parseFloat(formik.values.platts || '0');
            const calculatedTotal = plattsValue * (1 + vatPercentageRate / 100);
            
            // Set the computed total value
            formik.setFieldValue('total', calculatedTotal.toFixed(2));
        }
    };
    
    // Utility function to calculate ex_vat_price from platts_price and vat_percentage_rate
    const calculateExVatPrice = (platts: number, vatPercentage: number) => {
        return platts / (1 + vatPercentage / 100);
    };
    


    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>

                <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 w-full">
                                <AddModalHeader title={isEditMode ? 'Edit Fuel Purchase Price' : 'Add Fuel Purchase Price'} onClose={onClose} />
                                <div className="relative py-6 px-4 bg-white">
                                    <form onSubmit={formik.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">



                                                {localStorage.getItem("superiorRole") !== "Client" &&
                                                    <FormikSelect
                                                        formik={formik}
                                                        name="client_id"
                                                        label="Client"
                                                        options={formik.values?.clients?.map((item) => ({ id: item.id, name: item.full_name }))}
                                                        className="form-select text-white-dark"
                                                        onChange={handleClientChange}
                                                    />
                                                }


                                                <FormikSelect
                                                    formik={formik}
                                                    name="entity_id"
                                                    label="Entity"
                                                    options={formik.values.entities?.map((item) => ({ id: item.id, name: item.entity_name }))}
                                                    className="form-select text-white-dark"
                                                    onChange={handleEntityChange}
                                                />


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
                                                        options={formik.values?.sites?.map((item) => ({ value: item.id, label: item.name }))}
                                                    />

                                                    {formik.errors.selectedStations && formik.touched.selectedStations && (
                                                        <div className="text-danger">{formik?.errors?.selectedStations}</div>
                                                    )}
                                                </Col>



                                                <FormikInput formik={formik} type="date" name="date" label="Start Date" placeholder="Start Date" />

                                                <FormikSelect
                                                    formik={formik}
                                                    name="fuel_id"
                                                    label="Fuel Name"
                                                    options={fuelSubCategory?.map((item: any) => ({ id: item.id, name: item.sub_category_name }))}
                                                    className="form-select text-white-dark"
                                                // onChange={handleSiteChange}
                                                />

                                                {/* <FormikInput formik={formik} type="number" name="platts" label='Price' placeholder='Price'
                                                   onChange={(e) => handleFieldChange(formik.setFieldValue, formik.values, 0, 'platts_price', e.target.value)}
                                                  
                                                    onBlur={sendEventWithName} /> */}


                                                {/* <FormikInput formik={formik} type="number" onBlur={sendEventWithName} name="development_fuels_price" label="Development Fuels " placeholder="Development Fuels" />

                                                <FormikInput formik={formik} type="number" name="duty_price" onBlur={sendEventWithName} />
                                                <FormikInput formik={formik} type="number" onBlur={sendEventWithName} name="premium" /> */}

                                                <div className={formik.submitCount && formik.errors.platts ? 'has-error' : formik.submitCount ? 'has-success' : ''}>
                                                    <label htmlFor="platts">
                                                        Price
                                                        <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        name="platts"
                                                        type="Number"
                                                        id="platts"
                                                        placeholder="  Price"
                                                        className={`form-input `}
                                                        onChange={(e) => handleFieldChange('platts', e.target.value)}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.platts}
                                                    />
                                                    {formik.submitCount > 0 && formik.errors.platts && formik.touched.platts && (
                                                        <div className="text-danger mt-1">{formik.errors.platts}</div>
                                                    )}
                                                </div>
                                                <div className={formik.submitCount && formik.errors.ex_vat_price ? 'has-error' : formik.submitCount ? 'has-success' : ''}>
                                                    <label htmlFor="ex_vat_price">
                                                        Ex. Vat. Price
                                                        <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        name="ex_vat_price"
                                                        type="Number"
                                                        id="ex_vat_price"
                                                        placeholder="  Ex. Vat. Price"
                                                        className={`form-input readonly`}
                                                        onChange={(e) => handleFieldChange('ex_vat_price', e.target.value)}

                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.ex_vat_price}
                                                    />
                                                    {formik.submitCount > 0 && formik.errors.ex_vat_price && formik.touched.ex_vat_price && (
                                                        <div className="text-danger mt-1">{formik.errors.ex_vat_price}</div>
                                                    )}
                                                </div>
                                                <div className={formik.submitCount && formik.errors.vat_percentage_rate ? 'has-error' : formik.submitCount ? 'has-success' : ''}>
                                                    <label htmlFor="vat_percentage_rate">
                                                        Vat Percentage Rate
                                                        <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        name="vat_percentage_rate"
                                                        type="Number"
                                                        id="vat_percentage_rate"

                                                        placeholder="Vat Percentage Rate"
                                                        className={`form-input`}
                                                        onChange={(e) => handleFieldChange('vat_percentage_rate', e.target.value)}


                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.vat_percentage_rate}
                                                    />
                                                    {formik.submitCount > 0 && formik.errors.vat_percentage_rate && formik.touched.vat_percentage_rate && (
                                                        <div className="text-danger mt-1">{formik.errors.vat_percentage_rate}</div>
                                                    )}
                                                </div>



                                                {/* <FormikInput formik={formik} type="number" name="vat_percentage_rate" onBlur={sendEventWithName1} /> */}


                                                <FormikInput formik={formik} type="number" name="total" readOnly={false} />


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

export default AddEditStationFuelPurchaseModal;