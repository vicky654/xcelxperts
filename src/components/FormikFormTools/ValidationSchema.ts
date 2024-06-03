import * as Yup from 'yup';

// Define your validation schema and use `isEditMode` to conditionally apply validations
export const getUserValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        first_name: Yup.string()
            .min(3, 'First Name must be at least 3 characters') // Corrected to 3 characters
            .required('First Name Is Required'),
        last_name: Yup.string()
            .min(3, 'Last Name must be at least 3 characters') // Corrected to 3 characters
            .required('Last Name Is Required'),
        email: Yup.string()
            .email('Invalid Email Format') // Added email format validation
            .required('Email Is Required'),
        password: Yup.string().when('isEditMode', {
            is: false, // Apply validation when `isEditMode` is false
            then: Yup.string().required('Password Is Required'),
            otherwise: Yup.string().notRequired(),
        }),
        phone_number: Yup.string()
        .min(10, 'Phone Number must be at least 10 characters')
          .required('Phone Number Is Required'),
        role: Yup.string().required('Role Is Required'),
    });
};
export const getClientValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        first_name: Yup.string()
            .min(3, 'First Name must be at least 3 characters') // Corrected to 3 characters
            .required('First Name Is Required'),
        last_name: Yup.string()
            .min(3, 'Last Name must be at least 3 characters') // Corrected to 3 characters
            .required('Last Name Is Required'),
        email: Yup.string()
            .email('Invalid Email Format') // Added email format validation
            .required('Email Is Required'),
        password: Yup.string().when('isEditMode', {
            is: false, // Apply validation when `isEditMode` is false
            then: Yup.string().required('Password Is Required'),
            otherwise: Yup.string().notRequired(),
        }),
        phone_number: Yup.string()
        .min(10, 'Phone Number must be at least 10 characters')
          .required('Phone Number Is Required'),

        client_code: Yup.string().required('Client Code Is Required'),
        address: Yup.string().required('Address Is Required'),
    });
};
export const getStationValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        client_id: Yup.string().required('Client Is Required'),
        // company_id: Yup.string()
        //     .required('Company Is Required'),
        supplier_id: Yup.string().required('Supplier Is Required'),
        station_code: Yup.string().required('Station Code Is Required'),
        station_name: Yup.string().required('Station Name Is Required'),
        station_display_name: Yup.string().required('Station Display Name Is Required'),
        station_status: Yup.string().required('Station Status Is Required'),
        data_import_type_id: Yup.string().required('Data Import Type Is Required'),
        start_date: Yup.string().required('Start Date Is Required'),

        station_address: Yup.string().required('Station Address Is Required'),
        security_amount: Yup.string().required('Security Amount Is Required'),
        // password: Yup.string()
        //     .required('Password Is Required'),
        drs_upload_status: Yup.string().required('DRS Upload Status Is Required'),

        // first_name: Yup.string()
        //     .min(3, 'First Name must be at least 3 characters') // Corrected to 3 characters
        //     .required('First Name Is Required'),
        // last_name: Yup.string()
        //     .min(3, 'Last Name must be at least 3 characters') // Corrected to 3 characters
        //     .required('Last Name Is Required'),
        // email: Yup.string()
        //     .email('Invalid Email Format') // Added email format validation
        //     .required('Email Is Required'),
        // password: Yup.string().when('isEditMode', {
        //     is: false, // Apply validation when `isEditMode` is false
        //     then: Yup.string().required('Password Is Required'),
        //     otherwise: Yup.string().notRequired(),
        // }),
        // phone_number: Yup.string()
        // .min(10, 'Phone Number must be at least 10 characters')
        //   .required('Phone Number Is Required'),
        // client_code: Yup.string().required('Client Code Is Required'),
        // address: Yup.string().required('Address Is Required'),

        // financial_end_month: Yup.string()
        // .required('Financial End Month Is Required'),
        // financial_start_month: Yup.string()
        // .required('Financial Start Month Is Required'),
    });
};

export const getEntitiesValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        entity_name: Yup.string()
            .min(3, 'Entity Name must be at least 3 characters') // Corrected to 3 characters
            .required('Entity Name Is Required'),
        entity_code: Yup.string()
            .min(3, 'Entity Code must be at least 3 characters') // Corrected to 3 characters
            .required('Entity Code Is Required'),
        website: Yup.string() // Added email format validation
            .required('Website Is Required'),
        entity_details: Yup.string().required('Entity Details Is Required'),
        start_month: Yup.string().required('Start Month Is Required'),
        end_month: Yup.string().required('End Month Is Required'),
        client_id: Yup.string().required('Client  Is Required'),
        address: Yup.string().required('Address Is Required'),
    });
};
export const chargestValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        charge_name: Yup.string().required('Charge Name Is Required'),
        charge_code: Yup.string().required('Charge Code Is Required'),
    });
};
export const supplierValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        supplier_name: Yup.string().required('Supplier Name Is Required'),
        supplier_code: Yup.string().required('Supplier Code Is Required'),
        
    });
};
export const deductionstValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        deduction_name: Yup.string().required('Deduction Name Is Required'),
        deduction_code: Yup.string().required('Deduction Code Is Required'),
    });
};


export const getStationTankValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        client_id: Yup.string().required('Client Is Required'),
        entity_id: Yup.string()
            .required('Entity Is Required'),
        station_id: Yup.string().required('Station Is Required'),
        tank_name: Yup.string().required('Tank Name Is Required'),
        tank_code: Yup.string().required('Tank Code Is Required'),
        status: Yup.string().required('Status Is Required'),
        fuel_id: Yup.string().required('Fuel Is Required'),
        status: Yup.string().required('Station Status Is Required'),
    });
};
export default {
    getUserValidationSchema,
    getClientValidationSchema,
    getStationValidationSchema,
    getEntitiesValidationSchema,
    chargestValidationSchema,
    supplierValidationSchema,
    getStationTankValidationSchema,
};
