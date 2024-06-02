
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

  // company_code: "",
  // company_name: "",
  // address: "",
  // start_month: "",
  // end_month: "",
  // website: "",
  // client_id: "",
  // company_details: "",


  company_name: '',
  company_code: '',
  website: '',
  company_details: '',
  address: '',
  client_id: '',
  start_month: '',
  end_month: '',
};


export const stationInitialValues = {
  first_name: '',
  data_import_types: '',
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
