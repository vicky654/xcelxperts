import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import withApiHandler from '../../../utils/withApiHandler';
import LoaderImg from '../../../utils/Loader';
import useErrorHandler from '../../../hooks/useHandleError';
import 'tailwindcss/tailwind.css';

interface PermissionData {
    id: string;
    name: string;
    display_name: string;
    checked: boolean;
}

interface Permissions {
    [key: string]: {
        names: PermissionData[];
    };
}

interface FormData {
    roleName: string;
    selectedPermissions: string[];
}

const validationSchema = Yup.object().shape({
    roleName: Yup.string().required('Role name is required'),
    selectedPermissions: Yup.array().min(1, 'Select at least one permission').required('Select at least one permission'),
});

interface AddEditRolesProps {
    isLoading: boolean;
    getData: (url: string) => Promise<any>;
    postData: (url: string, body: any) => Promise<any>;
}

const AddEditRolesComponent: React.FC<AddEditRolesProps> = ({ getData, isLoading, postData }) => {
    const handleApiError = useErrorHandler();
    const [permissions, setPermissions] = useState<Permissions>({});
    const [initialValues] = useState<FormData>({
        roleName: '',
        selectedPermissions: [],
    });
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchRoleDetail(id);
        } else {
            fetchData();
        }
    }, [id]);

    const fetchRoleDetail = async (id: any) => {
        try {
            const response = await getData(`/role/detail/${id}`);
            if (response && response.data) {
                const roleDetail = response.data?.data;
                formik.setFieldValue('roleName', roleDetail.name);
                const selectedPermissions = filterCheckedPermissions(roleDetail.permissions);
                formik.setFieldValue('selectedPermissions', selectedPermissions);
                setPermissions(roleDetail.permissions);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const filterCheckedPermissions = (permissions: any) => {
        const checkedPermissions = Object.values(permissions)
            .flatMap((category: any) => category.names)
            .filter((name: any) => name.checked)
            .map((name: any) => name.name);
        return checkedPermissions;
    };

    const fetchData = async () => {
        try {
            const response = await getData(`/getPermissions`);
            if (response && response.data && response.data.data) {
                setPermissions(response.data.data);
            } else {
                throw new Error('No data available in the response');
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleFormSubmit = async (values: FormData) => {
        try {
            const formData: any = {
                name: values.roleName,
                permissions: values.selectedPermissions,
            };

            const postDataUrl = id ? `/role/update` : '/role/create';

            if (id) {
                formData.role_id = id;
            }

            await postData(postDataUrl, formData);
            handleSuccess();
        } catch (error) {
            handleApiError(error);
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleFormSubmit,
    });

    const handlePermissionSelect = (id: string, checked: boolean) => {
        const selectedPermissions = [...formik.values.selectedPermissions];

        if (checked && !selectedPermissions.includes(id)) {
            selectedPermissions.push(id);
        } else {
            const index = selectedPermissions.indexOf(id);
            if (index !== -1) {
                selectedPermissions.splice(index, 1);
            }
        }

        formik.setFieldValue('selectedPermissions', selectedPermissions);
    };

    const handleSectionSelect = (sectionName: string, checked: boolean) => {
        const sectionPermissionIds = permissions[sectionName].names.map((perm) => perm.name);
        const selectedPermissions = [...formik.values.selectedPermissions];

        if (checked) {
            sectionPermissionIds.forEach((permId) => {
                if (!selectedPermissions.includes(permId)) {
                    selectedPermissions.push(permId);
                }
            });
        } else {
            sectionPermissionIds.forEach((permId) => {
                const index = selectedPermissions.indexOf(permId);
                if (index !== -1) {
                    selectedPermissions.splice(index, 1);
                }
            });
        }

        formik.setFieldValue('selectedPermissions', selectedPermissions);
    };

    const handleClearForm = () => {
        formik.resetForm();
    };

    const handleSuccess = () => {
        navigate('/manage-roles/roles');
    };

    return (
        <>
            {isLoading && <LoaderImg />}
            <div className="panel mt-6">
                <div className="flex justify-between items-center mb-4">
                    <ul className="flex space-x-2">
                        <li>
                            <Link to="/" className="text-primary hover:underline">
                                Dashboard
                            </Link>
                        </li>
                        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                            <span>Roles</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
                                Role Name
                            </label>
                            <input
                                id="roleName"
                                name="roleName"
                                type="text"
                                className="form-input flex-1"
                                placeholder="Role Name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.roleName}
                            />
                            {formik.touched.roleName && formik.errors.roleName && <p className="mt-2 text-sm text-red-600">{formik.errors.roleName}</p>}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {Object.keys(permissions).map((sectionName, index) => (
                                <div key={sectionName} className="boxminheight gradient-blue-to-blue" >
                                    <div className="flex items-center heading-div gradient-blue-to-blue">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={formik.values.selectedPermissions.some((permId) => permissions[sectionName].names.some((perm) => perm.name === permId))}
                                            onChange={(e) => handleSectionSelect(sectionName, e.target.checked)}
                                        />
                                        <span
                                            className="ml-2 font-medium cursor-pointer"
                                            onClick={(e) =>
                                                handleSectionSelect(
                                                    sectionName,
                                                    !formik.values.selectedPermissions.some((permId) => permissions[sectionName].names.some((perm) => perm.name === permId))
                                                )
                                            }
                                        >
                                            {sectionName}
                                        </span>
                                    </div>

                                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 p-2">
                                        {permissions[sectionName].names.map((perm) => (
                                            <div key={perm.name} className="flex items-center">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`perm-${perm.name}`}
                                                    name="selectedPermissions"
                                                    value={perm.name}
                                                    checked={formik.values.selectedPermissions.includes(perm.name)}
                                                    onChange={(e) => handlePermissionSelect(perm.name, e.target.checked)}
                                                />
                                                <label className="ml-2" htmlFor={`perm-${perm.name}`} style={{ cursor: 'pointer' }}>
                                                    {perm.display_name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                               </div>
                               
                            ))}
                                 {formik.touched.selectedPermissions && formik.errors.selectedPermissions && <div className="text-red-600 mt-1">{formik.errors.selectedPermissions}</div>}
                                
                        </div>
                        <div className="text-end mt-4">
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {id ? 'Update Role' : 'Add Role'}
                            </button>
                            <button
                                type="button"
                                className="bg-red-600 text-white px-4 py-2 ml-4 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                onClick={handleClearForm}
                            >
                                Clear 
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

const AddEditRoles = withApiHandler(AddEditRolesComponent);

export default AddEditRoles;
