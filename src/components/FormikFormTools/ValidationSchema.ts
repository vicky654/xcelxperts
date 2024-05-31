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

        client_code: Yup.string().required('Client Code Is Required'),
        address: Yup.string().required('Address Is Required'),
    });
};
export const getStationValidationSchema = (isEditMode: boolean) => {
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
        // phone_number: Yup.string()
        // .min(10, 'Phone Number must be at least 10 characters')
        //   .required('Phone Number Is Required'),
        client_code: Yup.string().required('Client Code Is Required'),
        address: Yup.string().required('Address Is Required'),
        // role: Yup.string()
        //   .required('Role Is Required'),
        // financial_end_month: Yup.string()
        // .required('Financial End Month Is Required'),
        // financial_start_month: Yup.string()
        // .required('Financial Start Month Is Required'),
    });
};
export const getEntitiesValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        entity_name: Yup.string()
            .min(3, 'First Name must be at least 3 characters') // Corrected to 3 characters
            .required('First Name Is Required'),
        entity_code: Yup.string()
            .min(3, 'Last Name must be at least 3 characters') // Corrected to 3 characters
            .required('Last Name Is Required'),
        website: Yup.string() // Added email format validation
            .required('Email Is Required'),
        entity_details: Yup.string().required('Email Is Required'),
        start_month: Yup.string().required('Email Is Required'),
        end_month: Yup.string().required('Email Is Required'),
        client_id: Yup.string().required('Client Code Is Required'),
        address: Yup.string().required('Address Is Required'),
    });
};
export default {
    getUserValidationSchema,
    getClientValidationSchema,
    getStationValidationSchema,
    getEntitiesValidationSchema,
};
