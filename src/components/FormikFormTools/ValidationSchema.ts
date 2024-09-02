import * as Yup from 'yup';
const phoneNumberRegex = /^[0-9]+$/; // Regex to ensure only numeric values

// Define your validation schema and use `isEditMode` to conditionally apply validations
export const getUserValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        first_name: Yup.string()
            .min(3, 'First Name must be at least 3 characters') // Corrected to 3 characters
            .matches(/^[^\s]/, 'cannot start with a space')
            .required('First Name is required'),
        last_name: Yup.string()
            .min(3, 'Last Name must be at least 3 characters') // Corrected to 3 characters
            .matches(/^[^\s]/, 'cannot start with a space')
            .required('Last Name is required'),
        email: Yup.string()
            .email('Invalid Email Format') // Added email format validation
            .matches(/^[^\s]/, 'cannot start with a space')
            .required('Email is required'),
        password: isEditMode
            ? Yup.string()
            : Yup.string()
                  .matches(/^[^\s]/, 'cannot start with a space')
                  .required('Password is Required'),
        phone_number: Yup.string()
            .matches(phoneNumberRegex, 'Phone number must only contain digits')
            .min(10, 'Phone number must be exactly 10 characters')
            .matches(/^[^\s]/, 'cannot start with a space')
            .max(10, 'Phone number must be exactly 10 characters')
            .test('is-positive', 'Phone number cannot be negative', (value) => {
                if (value) {
                    return !/^-[0-9]+$/.test(value); // Ensure no negative sign
                }
                return true; // If no value is provided, it passes the test (handled by required check)
            })
            .required('Phone number is required'),
        role: Yup.string()
            .required('Role is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
    });
};
export const getClientValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        first_name: Yup.string()
            .min(3, 'First Name must be at least 3 characters') // Corrected to 3 characters
            .matches(/^[^\s]/, 'cannot start with a space')
            .required('First Name is required'),
        last_name: Yup.string()
            .min(3, 'Last Name must be at least 3 characters') // Corrected to 3 characters
            .matches(/^[^\s]/, 'cannot start with a space')
            .required('Last Name is required'),
        email: Yup.string()
            .email('Invalid Email Format') // Added email format validation
            .matches(/^[^\s]/, 'cannot start with a space')
            .required('Email is required'),
        password: isEditMode
            ? Yup.string()
            : Yup.string()
                  .matches(/^[^\s]/, 'Password cannot start with a space')
                  .required('Password is Required'),
        phone_number: Yup.string()
            .matches(phoneNumberRegex, 'Phone number must only contain digits')
            .min(10, 'Phone number must be exactly 10 characters')
            .matches(/^[^\s]/, 'cannot start with a space')
            .max(10, 'Phone number must be exactly 10 characters')
            .test('is-positive', 'Phone number cannot be negative', (value) => {
                if (value) {
                    return !/^-[0-9]+$/.test(value); // Ensure no negative sign
                }
                return true; // If no value is provided, it passes the test (handled by required check)
            })
            .required('Phone number is required'),
        client_code: Yup.string().required('Client Code is required'),
        address: Yup.string().required('Address is required'),
    });
};
export const getStationValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        client_id: Yup.string()
            .required('Client is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        entity_id: Yup.string()
            .required('Entity is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        supplier_id: Yup.string()
            .required('Supplier is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        station_code: Yup.string()
            .required('Station Code is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        station_name: Yup.string()
            .required('Station Name is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        station_display_name: Yup.string()
            .required('Station Display Name is required')
            .matches(/^[^\s]/, 'cannot start with a space'),

        // data_import_type_id: Yup.string()
        //     .required('Data Import Type is required')
        //     .matches(/^[^\s]/, 'cannot start with a space'),
        start_date: Yup.string()
            .required('Start Date is required')
            .matches(/^[^\s]/, 'cannot start with a space'),

        station_address: Yup.string()
            .required('Station Address is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        // consider_fuel_sale: Yup.string()
        // .show_summaryrequired('Client is required')
        // .matches(/^[^\s]/, 'cannot start with a space'),
        consider_fuel_sale: Yup.string().required('Consider Fuel Sale is required'),
        com_type: Yup.string().required('Commission Type is required'),
        // file: Yup.string().required('Logo is required'),
        file: isEditMode
            ? Yup.string().nullable() // Allow null in edit mode
            : Yup.string().nullable().required('Logo is required'), // Allow null but require a value in non-edit mode

        show_summary: Yup.string().required('PDF Show Summary is required'),
        // phone_number: Yup.string().required('Consider Fuel Sale is required'),
        security_amount: Yup.string()
            .matches(/^\d+(\.\d{1,2})?$/, 'Security amount must be a valid number with up to two decimal places')
            .test('is-positive', 'Security amount cannot be negative', (value) => {
                if (value) {
                    return parseFloat(value) >= 0; // Ensure the value is non-negative
                }
                return true; // If no value is provided, it passes the test (handled by required check)
            })
            .required('Security amount is required'),
        // password: Yup.string()
        //     .required('Password is required'),
        // drs_upload_status: Yup.string().required('DRS Upload Status is required'),
    });
};

export const getEntitiesValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        entity_name: Yup.string()
            .min(3, 'Entity Name must be at least 3 characters') // Corrected to 3 characters
            .matches(/^[^\s]/, 'cannot start with a space')
            .required('Entity Name is required'),
        entity_code: Yup.string()
            .min(3, 'Entity Code must be at least 3 characters') // Corrected to 3 characters
            .matches(/^[^\s]/, 'cannot start with a space')
            .required('Entity Code is required'),
        website: Yup.string() // Added email format validation
            .matches(/^[^\s]/, 'cannot start with a space')
            .required('Website is required'),
        entity_details: Yup.string()
            .required('Entity Details is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        start_month: Yup.string()
            .required('Start Month is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        end_month: Yup.string()
            .required('End Month is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        client_id: Yup.string()
            .required('Client  is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        address: Yup.string()
            .required('Address is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
    });
};
export const chargestValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        charge_name: Yup.string()
            .required('Charge Name is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        charge_code: Yup.string()
            .required('Charge Code is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
    });
};
export const fuelcategoryValidation = (isEditMode: boolean) => {
    return Yup.object().shape({
        category_name: Yup.string()
            .required('Fuel category Name is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        code: Yup.string()
            .required('Fuel category Code is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
    });
};
export const BankValidation = (isEditMode: boolean) => {
    return Yup.object().shape({
        name: Yup.string()
            .required(' Name is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
    });
};
export const lubricantValidation = (isEditMode: boolean) => {
    return Yup.object().shape({
        name: Yup.string()
            .required(' Name is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        size: Yup.string()
            .required(' Size is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
    });
};
export const fuelsubcategoryValidation = (isEditMode: boolean) => {
    return Yup.object().shape({
        sub_category_name: Yup.string()
            .required('Fuel Sub category Name is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        fuel_category_id: Yup.string()
            .required('Fuel  category  is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        code: Yup.string()
            .required('Fuel Sub category Code is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
    });
};
export const supplierValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        supplier_name: Yup.string()
            .required('Supplier Name is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        supplier_code: Yup.string()
            .required('Supplier Code is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
    });
};
export const cardValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        card_name: Yup.string()
            .required('Card Name is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        card_code: Yup.string()
            .required('Card Code is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
    });
};
export const deductionstValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        deduction_name: Yup.string()
            .required('Expense Name is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        deduction_code: Yup.string()
            .required('Expense Code is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
    });
};

export const stationBankValidation = (isEditMode: boolean) => {
    return Yup.object().shape({
        account_no: Yup.string()
            .required('Account Number is required')
            .matches(/^[^\s]/, 'cannot start with a space'),

        bank_id: Yup.string()
            .required('Bank is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
    });
};

export const credituserValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        name: Yup.string()
            .required('Name is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        address: Yup.string()
            .required('Address is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        max_amount: Yup.string()
            .required('Value is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        selectedStations: Yup.array().min(1, 'At least one Fuel must be selected').required('Fuels are required'),
    });
};
export const StocklossValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        name: Yup.string()
            .required('Name is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        max_amount: Yup.string()
            .required('Value is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        selectedStations: Yup.array().min(1, 'At least one Fuel must be selected').required('Fuels are required'),
    });
};

export const getStationPumpValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        client_id: isEditMode
            ? Yup.string()
            : Yup.string()
                  .required('Client is required')
                  .matches(/^[^\s]/, 'cannot start with a space'),
        entity_id: isEditMode
            ? Yup.string()
            : Yup.string()
                  .required('Entity is required')
                  .matches(/^[^\s]/, 'cannot start with a space'),
        station_id: isEditMode
            ? Yup.string()
            : Yup.string()
                  .required('Station is required')
                  .matches(/^[^\s]/, 'cannot start with a space'),
        name: Yup.string()
            .required('Pump Name is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        code: Yup.string()
            .required('Pump Code is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
    });
};
export const getStationNozzleValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        fuel_id: Yup.string()
            .required('Station Tank is required')
            .matches(/^[^\s]/, 'cannot start with a space'),

        name: Yup.string()
            .required('Nozzle Name is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        code: Yup.string()
            .required('Nozzle Code is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
    });
};
export const StationTankValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        fuel_id: Yup.string()
            .required('Station Fuel is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        capacity: Yup.string()
            .required('Capacity is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        tank_name: Yup.string()
            .required('Tank Name is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
        tank_code: Yup.string()
            .required('Tank Code is required')
            .matches(/^[^\s]/, 'cannot start with a space'),
    });
};
export const CardValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        card_name: Yup.string().required('Card Name is required'),
        card_code: Yup.string().required('Card Code is required'),
    });
};
export const getStationFuelPurchaseValidationSchema = (isEditMode: boolean) => {
    return Yup.object().shape({
        client_id: Yup.string().required('Client is required'),
        entity_id: Yup.string().required('Entity is required'),
        selectedStations: Yup.array().min(1, 'At least one station must be selected').required('Stations are required'),
        // station_id: Yup.string().required('Station is required'),
        fuel_id: Yup.string().required('Fuel is required'),
        date: Yup.date().required('Start Date is required').min(new Date('2023-01-01'), 'Start Date cannot be before January 1, 2023'),
        platts: Yup.string().required('Platts is required'),
        // development_fuels_price: Yup.string().required('Development Fuels is required'),
        // duty_price: Yup.string().required('Dutty  is required'),
        vat_percentage_rate: Yup.number().required('Vat % is required').max(100, 'VAT percentage rate cannot be more than 100'),
        // premium: Yup.string().required('Premium is required'),
        total: Yup.string().required('Total is required'),
        ex_vat_price: Yup.string().required('Ex. Vat. Price is required'),
    });
};
export default {
    getUserValidationSchema,
    getClientValidationSchema,
    getStationValidationSchema,
    getEntitiesValidationSchema,
    chargestValidationSchema,
    supplierValidationSchema,
    stationBankValidation,
    getStationFuelPurchaseValidationSchema,
    CardValidationSchema,
    credituserValidationSchema,
    fuelcategoryValidation,
    BankValidation,
    lubricantValidation,
    StationTankValidationSchema,
};
