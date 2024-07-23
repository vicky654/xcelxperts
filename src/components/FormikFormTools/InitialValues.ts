import { boolean } from "yup";

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

interface Station {
  station_name: string;
  id: string;
  name: string;

}

interface SelectedStation {
  label: string;
  value: string;

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
  phone_number: '',

};
export const companyInitialValues = {
  company_name: '',
  company_code: '',
  website: '',
  company_details: '',
  address: '',
  client_id: '',
  entity_name: '',
  entity_details: '',
  entity_code: '',
  start_month: '',
  end_month: '',
};


export const chargesInitialValues = {
  charge_name: '',
  charge_code: '',

};
export const fuelcategoryInitialValues = {
  category_name: '',
  code: '',

};
export const BankInitialValues = {
  name: '',


};
export const lubricantInitialValues = {
  name: '',
  size: '',


};
export const fuelsubcategoryInitialValues = {
  sub_category_name: '',
  fuel_category_id: '',
  code: '',


};
export const deductionsInitialValues = {
  deduction_code: '',
  deduction_name: '', // Add deduction_name here

};


export const stationInitialValues = {
  first_name: '',
  show_summary: '',
  data_import_types: '',
  drs_upload_status: '',
  client_id: '',
  company_id: '',
  last_name: '',
  station_code: '',
  station_name: '',
  station_display_name: '',
  station_address: '',
  start_date: '',
  security_amount: '',
  role: '',
  email: '',
  password: '',
  phone_number: '',
  clients: [] as Client[],
  entities: [] as Entity[],
  sites: [] as Station[],
  consider_fuel_sale: '',
  contact_person : '',
  logo: '',
  file: null as File | null,

};

export const stationSettingInitialValues = {
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
  cards: [] as Client[],
  fuels: [] as Client[],
  reports: [] as Client[],
  dataEntryCard: [] as Client[],
  charges: [] as Client[],
  deductions: [] as Client[],
  entities: [] as Entity[],
  sites: [] as Station[],
};

export const supplierInitialValues = {
  supplier_name: '',
  supplier_code: '', // Add deduction_name here
  logo: '',
  file: null as File | null,

};
export const cardInitialValues = {
  card_name: '',
  card_code: '',
  logo: '',
  file: null as File | null,
};


export const stationTankInitialValues = {
  client_id: '',
  entity_id: '',
  station_id: '',
  tank_name: '',
  tank_code: '',
  fuel_id: '',
  status: '',
  capacity : '',
  clients: [] as Client[],
  entities: [] as Entity[],
  sites: [] as Station[],
  tankList: {} as any,
  pumps: {} as any,
};
export const stationBankInitialValues = {
  client_id: '',
  entity_id: '',
  station_id: '',
  bank_id: '',
  account_no: '',
  status: '',
  clients: [] as Client[],
  entities: [] as Entity[],
  sites: [] as Station[],
  tankList: {} as any,
  
};
export const credituserInitialValues = {
  client_id: '',
  name: '',
  phone_number: '',
  max_amount: '',


};

export const stationPumpInitialValues = {
  client_id: '',
  entity_id: '',
  station_id: '',
  code: '',
  name: '',
  fuel_id: '',
  status: '',
  clients: [] as Client[],
  entities: [] as Entity[],
  sites: [] as Station[],
  tankList: {} as any,
  pumps: {} as any,
};

export const stationNozzleInitialValues = {
  client_id: '',
  entity_id: '',
  station_id: '',
  name: '',
  code: '',
  tank_name: '',
  tank_code: '',
  fuel_id: '',
  status: '',
  clients: [] as Client[],
  entities: [] as Entity[],
  sites: [] as Station[],
  tankList: {} as any,
  pumps: {} as any,
};

export const ReportsTankInitialValues = {
  client_id: '',
  entity_id: '',
  station_id: '',
  tank_name: '',
  tank_code: '',
  fuel_id: '',
  status: '',
  toggle: true,
  clients: [] as Client[],
  entities: [] as Entity[],
  sites: [] as Station[],
  reports: [] as Station[],
  months: [] as Station[],
  tankList: {} as any,
};

export const stationFuelPurchaseInitialValues = {

  client_id: "",
  company_id: "",
  station_id: "",
  start_date1: "",
  platts: "",
  developmentfuels: "",
  dutty: "",
  exvat: "",
  vat: "",
  total: "",
  premium: "",
  fuel_name: "",
  entity_id: '',
  tank_name: '',
  tank_code: '',
  ex_vat_price: '',
  fuel_id: '',
  status: '',
  vat_percentage_rate: '',
  clients: [] as Client[],
  entities: [] as Entity[],
  sites: [] as Station[],
  stations: [] as Station[],
  selectedStations: [],
  tankList: {} as any,
};

export default {
  userInitialValues,
  clientInitialValues,
  stationInitialValues,
  chargesInitialValues,
  deductionsInitialValues,
  stationTankInitialValues,
  fuelsubcategoryInitialValues,
  BankInitialValues,
  lubricantInitialValues,
  stationBankInitialValues
};
