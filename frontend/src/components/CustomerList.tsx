'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { exportToExcel } from '@/utils/exportToExcel';


export interface Customer {
    id: number;
    branch_code: string;
    branch_name: string;
    customer_name: string;
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
    strategy: string;
}

const CustomerList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<{ area_name: string; area_code: string } | null>(null);
    const [selectedStrategy, setSelectedStrategy] = useState<string>('');
    const filteredCustomers = selectedStrategy
    ? customers.filter((c) => c.strategy === selectedStrategy)
    : customers;



    // Fetch all data initially
    useEffect(() => {
        const fetchUserAndCustomers = async () => {
            try {
                const res = await fetch('/api/me');
                if (!res.ok) throw new Error('Failed to fetch user');
                const data = await res.json();
                setUser(data);
    
                // Now fetch customers using the retrieved area_code
                const customerRes = await fetch(`/api/customers?area_code=${data.area_code}`, {
                    credentials: 'include'
                });
                if (!customerRes.ok) throw new Error(`Failed to fetch: ${customerRes.status}`);
                const customers = await customerRes.json();
                setCustomers(customers);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
    
        setLoading(true);
        fetchUserAndCustomers();
    }, []);
    
    const handleExport = () => {
        try {
            exportToExcel(filteredCustomers, 'Dashboard_Strategi_TBW.xlsx');
        } catch (err) {
            console.error(err);
            alert('Failed to export');
        }
    };
      

    // Handle search
    const handleSearch = async () => {
        setLoading(true);
        try {
            if (!user?.area_code) {
                throw new Error('User area_code not found');
            }
            const res = await fetch(`/api/customers?keyword=${encodeURIComponent(searchTerm)}`, {
                credentials: 'include',
            });
            if (!res.ok) throw new Error(`Search failed: ${res.status}`);
            const data = await res.json();
            setCustomers(data);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div>
                {/* Search bar row */}
                <div className="flex gap-2 mb-4 w-full">
                    <input
                    type="text"
                    placeholder="Search by branch code or customer name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md p-3 border border-gray-300 rounded-lg shadow-sm"
                    />
                    <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-[#003A70] text-white rounded-lg"
                    >
                    Search
                    </button>
                </div>

                {/* Add Button (left) + User Info (right) */}
                <div className="flex justify-between items-center mb-4">
                    <Link href="/dashboard/add-customer">
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg">
                        + Add New Customer
                    </button>
                    </Link>

                    {user ? (
                    <div className="text-right">
                        <div className="font-semibold">{user.area_name}</div>
                        <div className="text-sm text-gray-500">Area Code: {user.area_code}</div>
                    </div>
                    ) : (
                    <div>Loading user...</div>
                    )}
                </div>
            </div>



            {/* Loading message */}
            {loading && <p className="text-gray-600 mb-4">Loading data...</p>}           
        
            {/* Strategy filter buttons */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setSelectedStrategy('Ekstensifikasi')}
                    className={`px-4 py-2 rounded-lg text-white ${
                    selectedStrategy === 'Ekstensifikasi' ? 'bg-purple-900' : 'bg-purple-700 hover:bg-purple-900'
                    }`}
                >
                    Show Ekstensifikasi
                </button>
                <button
                    onClick={() => setSelectedStrategy('Intensifikasi')}
                    className={`px-4 py-2 rounded-lg text-white ${
                    selectedStrategy === 'Intensifikasi' ? 'bg-yellow-900' : 'bg-yellow-700 hover:bg-yellow-900'
                    }`}
                >
                    Show Intensifikasi
                </button>
                <button
                    onClick={() => setSelectedStrategy('')}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                >
                    Show All
                </button>
            </div>


            {/* Customer table */}
            <div className="table-wrapper">
                <table className="table-styled">
                    <thead>
                        <tr className="table-header-spacing">
                            <th className="table-column-spacing">No.</th>
                            <th className="table-column-spacing">Branch Code</th>
                            <th className="table-column-spacing">Branch Name</th>
                            <th className="table-column-spacing">Customer Name</th>
                            <th className="table-column-spacing">CIF</th>
                            <th className="table-column-spacing">Account Number</th>
                            <th className="table-column-spacing">Company ID/POB</th>
                            <th className="table-column-spacing">Pipeline Type</th>
                            <th className="table-column-spacing">Entity Type</th>
                            <th className="table-column-spacing">Cycle State</th>
                            <th className="table-column-spacing">Update Date</th>
                            <th className="table-column-spacing">Details</th>
                            <th className="table-column-spacing">Cycle Details</th>
                            <th className="table-column-spacing">Subregion Code</th>
                            <th className="table-column-spacing">Address</th>
                            <th className="table-column-spacing">Strategy</th>
                            <th className="table-column-spacing">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer, index) => (
                                <tr key={customer.id} className="table-row-border">
                                    <td className="table-column-spacing">{index + 1}</td>
                                    <td className="table-column-spacing">{customer.branch_code}</td>
                                    <td className="table-column-spacing">{customer.branch_name}</td>
                                    <td className="table-column-spacing">{customer.customer_name}</td>
                                    <td className="table-column-spacing">{customer.cif}</td>
                                    <td className="table-column-spacing">{customer.account_number}</td>
                                    <td className="table-column-spacing">{customer.company_id}</td>
                                    <td className="table-column-spacing">{customer.pipeline_type}</td>
                                    <td className="table-column-spacing">{customer.entity_type}</td>
                                    <td className="table-column-spacing">{customer.cycle_state}</td>
                                    <td className="table-column-spacing">
                                        {new Date(customer.update_date).toLocaleString()}
                                    </td>
                                    <td className="table-column-spacing">{customer.details}</td>
                                    <td className="table-column-spacing">{customer.cycle_details}</td>
                                    <td className="table-column-spacing">{customer.subregion_code}</td>
                                    <td className="table-column-spacing">{customer.address}</td>
                                    <td className="table-column-spacing">{customer.strategy}</td>
                                    <td className="table-column-spacing">
                                        <Link href={`/dashboard/edit/${customer.id}`}>
                                            <button className="bg-[#003A70] text-white px-3 py-1 rounded-md text-xs">
                                                Update
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={17} className="text-center py-4 text-gray-500">
                                    No data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <button
                onClick={handleExport}
                className="ml-auto px-4 py-2 bg-green-700 hover:bg-green-900 text-white rounded-lg"
            >
                Export to Excel
            </button>
        </div>
    );
};

export default CustomerList;