import React, { useEffect, useState } from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
// import { MultiSelect } from "react-multi-select-component";

import { useSelector } from "react-redux";
import { handleError } from "../../../utils/errorHandler";

interface Props {
  addshowModal: boolean;
  AddCloseModal: () => void;
  onSubmit: (values: any, isChecked: boolean, selected: any[]) => void;
  getData: (url: string) => Promise<any>;
}

const AdduserModal: React.FC<Props> = ({
  addshowModal,
  AddCloseModal,
  onSubmit,
  getData,
}) => {
  const [selected, setSelected] = useState<any[]>([]);
  const [roleitems, setRoleItems] = useState<any[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [selectRole, setSelectRole] = useState<any[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("+44");

  const countryCodes = [
    { code: "+1", name: "United States", flag: "🇺🇸", shortName: "USA" },
    { code: "+64", name: "United Kingdom", flag: "🇬🇧", shortName: "UK" },
    { code: "+61", name: "Australia", flag: "🇦🇺", shortName: "AUS" },
    { code: "+49", name: "Germany", flag: "🇩🇪", shortName: "GER" },
    { code: "+33", name: "France", flag: "🇫🇷", shortName: "FRA" },
    { code: "+91", name: "India", flag: "🇮🇳", shortName: "IND" },
    { code: "+86", name: "China", flag: "🇨🇳", shortName: "CHN" },
    { code: "+55", name: "Brazil", flag: "🇧🇷", shortName: "BRA" },
    { code: "+81", name: "Japan", flag: "🇯🇵", shortName: "JPN" },
  ];

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountryCode(e.target.value);
  };

  const handleSendMailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  useEffect(() => {
    handleFetchData();
    fetchRoleList();
  }, []);

  const handleFetchData = async () => {
    try {
      const response = await getData("/common/client-list");
      if (response && response.data && response.data.data) {
        setSelectRole(response.data.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const fetchRoleList = async () => {
    try {
      const response = await getData("/roles");
      if (response && response.data && response.data.data) {
        setRoleItems(response.data.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      await onSubmit(values, isChecked, selected);
      resetForm();
      AddCloseModal();
    } catch (error:any) {
      handleError(error);
    }
  };

  const options = selectRole?.map((site) => ({
    label: site?.full_name,
    value: site?.id,
  }));

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
          <Formik
            initialValues={{
              first_name: "",
              role: "",
              last_name: "",
              email: "",
              password: "",
              send_mail: "1",
              work_flow: "",
              phone_number: "",
              selected_country_code: "+44",
            }}
            validationSchema={Yup.object({
              first_name: Yup.string()
                .max(20, "Must be 20 characters or less")
                .required("First Name is required"),
              role: Yup.string().required("Role is required"),
              last_name: Yup.string().required("Last Name is required"),
              email: Yup.string().required("Email is required").email("Invalid email format"),
              password: Yup.string().required("Password is required"),
              phone_number: Yup.string()
                .matches(/^[0-9]{10}$/, "Phone number must be a 10-digit number")
                .required("Phone Number is required"),
            })}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, isSubmitting, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-4">
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                      First Name<span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      autoComplete="off"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.first_name && touched.first_name ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      id="first_name"
                      name="first_name"
                      placeholder="First Name"
                    />
                    <ErrorMessage
                      component="div"
                      className="text-sm text-red-500"
                      name="first_name"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                      Last Name<span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      autoComplete="off"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.last_name && touched.last_name ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      id="last_name"
                      name="last_name"
                      placeholder="Last Name"
                    />
                    <ErrorMessage
                      component="div"
                      className="text-sm text-red-500"
                      name="last_name"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                      Phone Number<span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <Field
                        as="select"
                        value={selectedCountryCode}
                        onChange={handleCountryCodeChange}
                        className="mt-1 block w-24 border-r-0 px-3 py-2 border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        {countryCodes.map((country, index) => (
                          <option key={index} value={country.code}>
                            {`${country.code} (${country.shortName})`}
                          </option>
                        ))}
                      </Field>
                      <Field
                        type="number"
                        className={`mt-1 block flex-1 w-full px-3 py-2 border ${
                          errors.phone_number && touched.phone_number ? "border-red-500" : "border-gray-300"
                        } rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        id="phone_number"
                        name="phone_number"
                        placeholder="Phone Number"
                      />
                    </div>
                    <ErrorMessage
                      component="div"
                      className="text-sm text-red-500"
                      name="phone_number"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      autoComplete="off"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.email && touched.email ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      id="email"
                      name="email"
                      placeholder="Email"
                    />
                    <ErrorMessage
                      component="div"
                      className="text-sm text-red-500"
                      name="email"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password<span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="password"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.password && touched.password ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    id="password"
                    name="password"
                    placeholder="Password"
                  />
                  <ErrorMessage
                    component="div"
                    className="text-sm text-red-500"
                    name="password"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role<span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.role && touched.role ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    id="role"
                    name="role"
                  >
                    <option value="">Select a Role</option>
                    {roleitems ? (
                      roleitems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.role_name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No Role</option>
                    )}
                  </Field>
                  <ErrorMessage
                    component="div"
                    className="text-sm text-red-500"
                    name="role"
                  />
                </div>
                {localStorage.getItem("superiorRole") !== "Client" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Select Client<span className="text-red-500">*</span></label>
                    {/* <MultiSelect
                      value={selected}
                      onChange={setSelected}
                      labelledBy="Select Client"
                      disableSearch={true}
                      options={options}
                      hasSelectAll={false}
                    /> */}
                  </div>
                )}
                {localStorage.getItem("role") === "Client" && (
                  <div className="mb-4">
                    <label htmlFor="work_flow" className="block text-sm font-medium text-gray-700">
                      Work Routine Notification
                    </label>
                    <Field
                      as="select"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.work_flow && touched.work_flow ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      id="work_flow"
                      name="work_flow"
                    >
                      <option value="">Select a Work Flow</option>
                      <option value="1">Enable</option>
                      <option value="0">Disable</option>
                    </Field>
                    <ErrorMessage
                      component="div"
                      className="text-sm text-red-500"
                      name="work_flow"
                    />
                  </div>
                )}
                <div className="mb-4 flex items-center">
                  <label className="block text-sm font-medium text-gray-700">Send Welcome Email</label>
                  <div className="ml-2 flex items-center">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleSendMailChange}
                      className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                    />
                    <span className="ml-2 text-sm text-gray-600">Yes</span>
                  </div>
                  <ErrorMessage
                    component="div"
                    className="text-sm text-red-500"
                    name="send_mail"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Link
                  to="#"
                  className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
                  onClick={() => AddCloseModal()}
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="ml-4 px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                  disabled={isSubmitting}
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  </div>
);
};

export default AdduserModal;
