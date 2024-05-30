import * as Yup from 'yup';

export const validationSchema = Yup.object({
    first_name: Yup.string()
    .min(3, 'First Name must be at least 8 characters')
    .required('First Name Is Required'),
    last_name: Yup.string()
    .min(3, 'Last Name be at least 8 characters')
    .required('Last Name Is Required'),
    email: Yup.string()
    .required('Email Is Required'),
    password: Yup.string()
    .required('Password Is Required'),
    // phone_number: Yup.string()
    // .required('Phone Number Is Required'),
    role: Yup.string()
    .required('Role Is Required'),
});

export default validationSchema;
