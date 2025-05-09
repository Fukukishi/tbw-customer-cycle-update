'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type Customer = {
    id: number;
    customer_name: string;
    branch_code: string;
    branch_name: string;
    cif: string;
    account_number: string;
    company_id: string;
    pipeline_type: string;
    entity_type: string;
    cycle_state: string;
    update_date: string;
    details: string;
    cycle_details: string;
    subregion_code: string;
    address: string;
    strategy:string;
};

export default function EditCustomerPage() {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState({
        cycle_state: '',
        cycle_details: '',
        details: '',
        address: ''
    });

    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    // cycle mapping
    const cycleStateToDetails: { [key: string]: string } = {
        '1': 'Cycle 1 : Opp Gath',
        '2': 'Cycle 2 : Visit',
        '3': 'Cycle 3 : Solutioning',
        '4': 'Cycle 4 : WonDeal',
        '5': 'Cycle 5 : Decline'
    }

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const res = await fetch(`/api/customers/${id}`);
                const data = await res.json();
                setCustomer(data);
                setFormData({
                cycle_state: data.cycle_state,
                cycle_details:data.cycle_details,
                details: data.details,
                address: data.address
                });
            } catch (err) {
            console.error('Failed to fetch customer', err);
            }
        };

        fetchCustomer();
    }, [id]);

    useEffect(() => {
        if (formData.cycle_state) {
            setFormData((prevData) => ({
                ...prevData,
                cycle_details: cycleStateToDetails[formData.cycle_state] || ''
            }));
        }
    }, [formData.cycle_state]);

    const handleUpdate = async () => {
        try {
            const res = await fetch(`/api/customers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('Customer updated!');
                router.push('/dashboard');
            } else {
                alert('Failed to update customer');
            }
        } catch (err) {
            console.error('Update failed', err);
        }
    };

    if (!customer) return <p>Loading...</p>;

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-4x1 bg-white rounded-lg shadow p8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Edit Customer: {customer.customer_name}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Field label="Branch Code" value={customer.branch_code} />
                    <Field label="Branch Name" value={customer.branch_name} />
                    <Field label="CIF" value={customer.cif} />
                    <Field label="Account Number" value={customer.account_number} />
                    <Field label="Company ID" value={customer.company_id} />
                    <Field label="Pipeline Type" value={customer.pipeline_type} />
                    <Field label="Entity Type" value={customer.entity_type} />
                    <Field label="Cycle Details" value={customer.cycle_details} />
                    <Field label="Update Date" value={new Date(customer.update_date).toLocaleString()} />
                    <Field label="Subregion Code" value={customer.subregion_code} />
                </div>

                {/* Editable fields */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">Cycle State</label>
                    <select
                        value={formData.cycle_state}
                        onChange={(e) => setFormData({ ...formData, cycle_state: e.target.value })}
                        className="text-gray-700 w-full border border-gray-300 rounded p-2"
                    >
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">Details</label>
                    <input
                        type='text'
                        value={formData.details || ''}
                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                        className="text-gray-700 w-full border border-gray-300 rounded p-2"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-1">Address</label>
                    <input
                        type="text"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="text-gray-700 w-full border border-gray-300 rounded p-2"
                    />
                </div>

                <button
                    onClick={handleUpdate}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
    }

    function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
        <label className="block text-sm font-medium text-gray-600">{label}</label>
        <input
            type="text"
            value={value}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-800"
        />
        </div>
    );
}
