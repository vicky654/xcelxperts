
interface Client {
  id: string;
  client_name: string;
  full_name: string;
  companies: Company[];
}
interface Company {
  id: string;
  company_name: string;
}

interface Site {
  id: string;
  site_name: string;
}


export const userInitialValues = {
  first_name: '',
  last_name: '',
  role: '',
  email: '',
  password: '',
  phone_number: '',
};

// Initial values for client form
export const clientInitialValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  client_code: '',
  address: '',

};
export const companyInitialValues = {
  client_id: '',
      entity_name: '',
      entity_code: '',
      website: '',
      entity_details: '',
      start_month: '',
      end_month: '', // If editUserData is passed, it will override corresponding initialValues
      address: '',
};


export const stationInitialValues = {
  first_name: '',
  data_import_type_id: '',
  client_id: '',
  company_id: '',
  last_name: '',
  role: '',
  email: '',
  password: '',
  phone_number: '',
  clients: [] as Client[],
  companies: [] as Company[],
  sites: [] as Site[],
};

export default {
  userInitialValues,
  clientInitialValues,
  stationInitialValues,
};
