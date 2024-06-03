
interface Client {
  id: string;
  client_name: string;
  full_name: string;
  entities: Entity[];
}
interface Entity {
  id: string;
  entity_name: string;
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
  company_name: '',
  company_code: '',
  website: '',
  company_details: '',
  address: '',
  client_id: '',
  start_month: '',
  end_month: '',
};


export const chargesInitialValues = {
  charge_name: '',
  charge_code: '',

};
export const deductionsInitialValues = {
  deduction_code: '',
  deduction_name: '', // Add deduction_name here

};


export const stationInitialValues = {
  first_name: '',
  data_import_types: '',
  drs_upload_status: '',
  client_id: '',
  company_id: '',
  last_name: '',
  role: '',
  email: '',
  password: '',
  phone_number: '',
  clients: [] as Client[],
  entities: [] as Entity[],
  sites: [] as Site[],
};

export default {
  userInitialValues,
  clientInitialValues,
  stationInitialValues,
  chargesInitialValues,
  deductionsInitialValues,
};
