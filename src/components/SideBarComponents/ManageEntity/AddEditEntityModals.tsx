import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import AddModalHeader from '../CrudModal/AddModalHeader';
import FormikInput from '../../FormikFormTools/FormikInput';
import FormikSelect from '../../FormikFormTools/FormikSelect';
import { getEntitiesValidationSchema } from '../../FormikFormTools/ValidationSchema';
import { monthOptions } from '../../../pages/constants'; // Assuming UserData interface is in the same file as ManageUser
import { companyInitialValues } from '../../FormikFormTools/InitialValues';

interface AddEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  getData: (url: string) => Promise<any>;
  onSubmit: (values: any, formik: any) => Promise<void>;
  isEditMode: boolean;
  userId?: string | null;
  clientId?: string | null; // Use Partial<UserData> if only some fields are to be updated
}

const AddEditEntityModals: React.FC<AddEntityModalProps> = ({
  isOpen,
  onClose,
  getData,
  onSubmit,
  isEditMode,
  userId,
  clientId,
}) => {
  const [clientList, setClientList] = useState<any[]>([]); // Adjust ClientList type as needed

  useEffect(() => {
    if (isOpen) {
      if (localStorage.getItem("superiorRole") === "Client") {
        const clientId = localStorage.getItem("superiorId");
        if (clientId) {
          formik.setFieldValue("client_id", clientId)
          // Simulate the change event to call handleClientChange
          // handleClientChange({ target: { value: clientId } } as React.ChangeEvent<HTMLSelectElement>);
          // fetchUserDetails(userId, clientId);
        }
      } else {
        fetchClientList();
      }
      if (isEditMode && userId && clientId) {
        fetchUserDetails(userId, clientId);
      }
    }
  }, [isOpen, isEditMode, userId, clientId]);

  const fetchClientList = async () => {
    try {
      const response = await getData('/common/client-list');
      if (response?.data?.data) {
        setClientList(response.data.data);
      }
    } catch (error) {
      console.error('API error:', error);
    }
  };

  const fetchUserDetails = async (id: string, clientId: string) => {
    try {
      const response = await getData(`/entity/detail?id=${id}&client_id=${clientId}`);
      if (response?.data?.data) {
        const userData: any = response.data.data;
        formik.setValues({
          company_name: userData.company_name || '',
          company_code: userData.company_code || '',
          company_details: userData.company_details || '',
          client_id: userData.client_id || '',
          entity_name: userData.entity_name || '',
          entity_code: userData.entity_code || '',
          website: userData.website || '',
          address: userData.address || '',
          entity_details: userData.entity_details || '',
          start_month: userData.start_month || '',
          end_month: userData.end_month || '',
        });
      }
    } catch (error) {
      console.error('API error:', error);
    }
  };


  const formik = useFormik({
    initialValues: companyInitialValues,
    validationSchema: getEntitiesValidationSchema(isEditMode),
    onSubmit: async (values, { resetForm }) => {
      try {
        await onSubmit(values, formik);
        onClose();
      } catch (error) {
        console.error('Submit error:', error);
        throw error; // Rethrow the error to be handled by the caller
      }
    },
  });

  return (
    <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>

        <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out`}>
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="flex-1 w-full">
                <AddModalHeader title={isEditMode ? 'Edit Entity' : 'Add Entity'} onClose={onClose} />
                <div className="relative py-6 px-4 bg-white">
                  <form onSubmit={formik.handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                    <div className="flex flex-col sm:flex-row">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">

                        {!isEditMode && localStorage.getItem("superiorRole") !== "Client" &&
                          <FormikSelect
                            formik={formik}
                            name="client_id"
                            label="Client"
                            options={clientList.map((item) => ({ id: item.id, name: item.client_name }))}
                            className="form-select text-white-dark"
                            isRequired={true}
                          />}

                        <FormikInput formik={formik} type="text" name="entity_name" label="Entity Name" placeholder="Entity Name" />
                        <FormikInput formik={formik} type="text" name="entity_code" label="Entity Code" placeholder="Entity Code" />
                        <FormikInput formik={formik} type="text" name="website" label="Website" placeholder="Website" />
                        <FormikInput formik={formik} type="text" name="address" label="Address" placeholder="Address" />
                        <FormikInput formik={formik} type="text" name="entity_details" label="Entity Details" placeholder="Entity Details" />

                        <FormikSelect
                          formik={formik}
                          name="start_month"
                          label="Start Month"
                          options={monthOptions.map((item) => ({ id: item.id, name: item.name }))}
                          className="form-select text-white-dark"
                          isRequired={true}
                        />
                        <FormikSelect
                          formik={formik}
                          name="end_month"
                          label="End Month"
                          options={monthOptions.map((item) => ({ id: item.id, name: item.name }))}
                          className="form-select text-white-dark"
                          isRequired={true}
                        />

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

export default AddEditEntityModals;
