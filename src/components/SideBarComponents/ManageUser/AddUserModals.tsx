import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
    const initialValues = {
        first_name: '',
        role: '',
        last_name: '',
        email: '',
        password: '',
        send_mail: '1',
        work_flow: '',
        phone_number: '',
        selected_country_code: '+44',
    };

    const validationSchema = Yup.object({
        first_name: Yup.string().max(20, 'Must be 20 characters or less').required('First Name is required'),
        role: Yup.string().required('Role is required'),
        last_name: Yup.string().required('Last Name is required'),
        email: Yup.string().required('Email is required').email('Invalid email format'),
        password: Yup.string().required('Password is required'),
        phone_number: Yup.string()
            .matches(/^[0-9]{10}$/, 'Phone number must be a 10-digit number')
            .required('Phone Number is required'),
        send_mail: Yup.string().required('Send Mail is required'),
        work_flow: Yup.string(),
        selected_country_code: Yup.string().required('Country Code is required'),
    });

    const onSubmit = async (values, { resetForm }) => {
        console.log(values);

        // Simulate API call or actual submission logic
        try {
            // Replace with actual API call
            const response = await fetch('/api/add-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                console.log('User added successfully');
                resetForm();
            } else {
                const data = await response.json();
                console.error('Error adding user:', data.message);
            }
        } catch (error) {
            console.error('An error occurred while adding user:', error);
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    return (
        <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>

                <section className={`absolute inset-y-0 right-0 pl-10  max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
                    <div className="relative w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 w-full">
                                {' '}
                                {/* Adjusted width here */}
                                <header className="px-6 py-4 bg-gray-100">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-medium leading-7 text-gray-900">Add User</h2>
                                        <button className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring" onClick={onClose}>
                                            <span className="sr-only">Close panel</span>
                                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </header>
                                <div className="relative py-6 px-4 bg-white">
                                    {/* Your form content goes here */}
                                    <form onSubmit={formik.handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                        <h2 className="text-lg font-bold mb-4">Add User</h2>
                                        <div className="mb-4">
                                            <label htmlFor="first_name" className="block text-gray-700 text-sm font-bold mb-2">
                                                First Name
                                            </label>
                                            <input
                                                id="first_name"
                                                name="first_name"
                                                type="text"
                                                placeholder="Enter first name"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.first_name}
                                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                                    formik.errors.first_name && formik.touched.first_name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {formik.errors.first_name && formik.touched.first_name && <div className="text-red-500 text-xs mt-1">{formik.errors.first_name}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="last_name" className="block text-gray-700 text-sm font-bold mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                id="last_name"
                                                name="last_name"
                                                type="text"
                                                placeholder="Enter last name"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.last_name}
                                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                                    formik.errors.last_name && formik.touched.last_name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {formik.errors.last_name && formik.touched.last_name && <div className="text-red-500 text-xs mt-1">{formik.errors.last_name}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                                                Email
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="Enter email"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.email}
                                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                                    formik.errors.email && formik.touched.email ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {formik.errors.email && formik.touched.email && <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                                                Password
                                            </label>
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                placeholder="Enter password"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.password}
                                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                                    formik.errors.password && formik.touched.password ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {formik.errors.password && formik.touched.password && <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                                                Role
                                            </label>
                                            <input
                                                id="role"
                                                name="role"
                                                type="text"
                                                placeholder="Enter role"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.role}
                                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                                    formik.errors.role && formik.touched.role ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {formik.errors.role && formik.touched.role && <div className="text-red-500 text-xs mt-1">{formik.errors.role}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="send_mail" className="block text-gray-700 text-sm font-bold mb-2">
                                                Send Mail
                                            </label>
                                            <select
                                                id="send_mail"
                                                name="send_mail"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.send_mail}
                                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                                    formik.errors.send_mail && formik.touched.send_mail ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            >
                                                <option value="1">Yes</option>
                                                <option value="0">No</option>
                                            </select>
                                            {formik.errors.send_mail && formik.touched.send_mail && <div className="text-red-500 text-xs mt-1">{formik.errors.send_mail}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="work_flow" className="block text-gray-700 text-sm font-bold mb-2">
                                                Work Flow
                                            </label>
                                            <input
                                                id="work_flow"
                                                name="work_flow"
                                                type="text"
                                                placeholder="Enter work flow"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.work_flow}
                                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                                    formik.errors.work_flow && formik.touched.work_flow ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {formik.errors.work_flow && formik.touched.work_flow && <div className="text-red-500 text-xs mt-1">{formik.errors.work_flow}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="phone_number" className="block text-gray-700 text-sm font-bold mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                id="phone_number"
                                                name="phone_number"
                                                type="text"
                                                placeholder="Enter phone number"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.phone_number}
                                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                                    formik.errors.phone_number && formik.touched.phone_number ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {formik.errors.phone_number && formik.touched.phone_number && <div className="text-red -500 text-xs mt-1">{formik.errors.phone_number}</div>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="selected_country_code" className="block text-gray-700 text-sm font-bold mb-2">
                                                Country Code
                                            </label>
                                            <input
                                                id="selected_country_code"
                                                name="selected_country_code"
                                                type="text"
                                                placeholder="Enter country code"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.selected_country_code}
                                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                                    formik.errors.selected_country_code && formik.touched.selected_country_code ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {formik.errors.selected_country_code && formik.touched.selected_country_code && (
                                                <div className="text-red-500 text-xs mt-1">{formik.errors.selected_country_code}</div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <button
                                                type="submit"
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                disabled={!formik.isValid || formik.isSubmitting}
                                            >
                                                {formik.isSubmitting ? 'Submitting...' : 'Submit'}
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

export default AddUserModal;
