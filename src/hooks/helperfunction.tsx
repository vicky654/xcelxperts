// helperFunctions.tsx

import * as Yup from 'yup';
import { FormikErrors } from 'formik';

export const validateForm = async (values: any, validationSchema: Yup.ObjectSchema<any>): Promise<FormikErrors<any>> => {
  try {
    await validationSchema.validate(values, { abortEarly: false });
    console.log('No validation errors'); // Log message when no errors
    return {}; // Return an empty object when no errors
  } catch (err:any) {
    const errors = err.inner.reduce((acc: any, error: any) => {
      acc[error.path] = error.message;
      return acc;
    }, {});
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    // console.error('Validation errors:', errors); // Log errors to console
    return errors; // Return errors object
  }
};
