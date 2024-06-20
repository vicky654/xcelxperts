import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';

interface Client {
    id: string;
    client_name: string;
    companies: Company[];
}

interface Company {
    id: string;
    company_name: string;
}

interface ClientEntityProps {
    getData: (url: string) => Promise<any>;
    handleClientChange: (clientId: string, clients: Client[]) => void;
    clients: Client[];
    client_id: string;
}

const ClientEntity: React.FC<ClientEntityProps> = ({ getData, handleClientChange, clients, client_id }) => {
    const formik = useFormikContext();

    const fetchClientList = async () => {
        try {
            const response = await getData('/getClients');
            const clients = response.data.data;
            formik.setFieldValue('clients', clients);
            const clientId = localStorage.getItem("superiorId");
            if (clientId) {
                formik.setFieldValue('client_id', clientId);
                handleClientChange(clientId, clients);
            }
        } catch (error) {
            console.error('API error:', error);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("superiorRole") !== "Client") {
            fetchClientList();
        }
    }, []);

    return (
        <div>
            <label htmlFor="client_id">Client</label>
            <select
                id="client_id"
                onChange={(e) => handleClientChange(e.target.value, clients)}
                value={client_id}
                className="form-select text-white-dark"
            >
                <option value="">Select a Client</option>
                {clients.length > 0 ? (
                    clients.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.client_name}
                        </option>
                    ))
                ) : (
                    <option disabled>No Client</option>
                )}
            </select>
        </div>
    );
};

export default ClientEntity;
