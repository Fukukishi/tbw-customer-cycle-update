'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const cycleStateToDetails: { [key: string]: string } = {
  '1': 'Cycle 1 : Opp Gath',
  '2': 'Cycle 2 : Visit',
  '3': 'Cycle 3 : Solutioning',
  '4': 'Cycle 4 : WonDeal',
  '5': 'Cycle 5 : Decline',
};

export default function AddCustomerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    branch_code: '',
    branch_name: '',
    customer_name: '',
    cif: '',
    account_number: '',
    company_id: '',
    potential: '',
    current_balance: '',
    pipeline_type: '',
    entity_type: '',
    cycle_state: '',
    update_date: '',
    details: '',
    cycle_details: '',
    subregion_code: '',
    address: '',
    strategy: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCycleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setFormData(prev => ({
      ...prev,
      cycle_state: selected,
      cycle_details: cycleStateToDetails[selected] || '',
    }));
  };

  const handleStrategyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setFormData(prev => ({
      ...prev,
      strategy: selected,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert('Customer added');
      router.push('/dashboard');
    } else {
      alert('Failed to add customer');
    }
  };

  return (
    <div className="min-h-screen text-gray-800 bg-white p-8">
      <h1 className="text-2xl font-bold mb-6">Add New Customer</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Branch Code</label>
          <input
            type="text"
            name="branch_code"
            value={formData.branch_code}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Branch Name</label>
          <input
            type="text"
            name="branch_name"
            value={formData.branch_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Customer Name</label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">CIF</label>
          <input
            type="text"
            name="cif"
            value={formData.cif}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Account Number</label>
          <input
            type="text"
            name="account_number"
            value={formData.account_number}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Company ID</label>
          <input
            type="text"
            name="company_id"
            value={formData.company_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Potential</label>
          <input
            type="text"
            name="potential"
            value={formData.potential}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Current Balance</label>
          <input
            type="text"
            name="current_balance"
            value={formData.current_balance}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pipeline Type</label>
          <input
            type="text"
            name="pipeline_type"
            value={formData.pipeline_type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Entity Type</label>
          <input
            type="text"
            name="entity_type"
            value={formData.entity_type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subregion Code</label>
          <input
            type="text"
            name="subregion_code"
            value={formData.subregion_code}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Strategy</label>
          <select
            name="strategy"
            value={formData.strategy}
            onChange={handleStrategyChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select a strategy</option>
            <option value='Ekstensifikasi'>Ekstensifikasi</option>
            <option value='Intensifikasi'>Intensifikasi</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Details</label>
          <input
            type="text"
            name="details"
            value={formData.details}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cycle State</label>
          <select
            name="cycle_state"
            value={formData.cycle_state}
            onChange={handleCycleStateChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select a cycle</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cycle Details</label>
          <input
            type="text"
            name="cycle_details"
            value={formData.cycle_details}
            readOnly
            className="w-full border border-gray-300 rounded-md p-2 bg-gray-100"
          />
        </div>

        <div className="col-span-1 md:col-span-2 mt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
