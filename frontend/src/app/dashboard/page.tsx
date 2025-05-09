'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import CustomerList, { Customer } from '@/components/CustomerList';
import { exportToExcel } from '@/utils/exportToExcel';
import { parseExcelFile } from '@/utils/importFromExcel';

export default function DashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Logout handler
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  // Export: fetch data then call util
  {/*
  const handleExport = async () => {
    try {
      const res = await fetch('/api/customers');
      if (!res.ok) throw new Error(`Export failed: ${res.status}`);
      const filteredCustomers: Customer[] = await res.json();
      exportToExcel(filteredCustomers, 'Dashboard_Strategi_TBW.xlsx');
    } catch (err) {
      console.error(err);
      alert('Failed to export');
    }
  };
  */}

  {/* 
  // Open file picker
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  */}

  // Import: parse via util then POST to API
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await parseExcelFile(file);
      const res = await fetch('/api/customers/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Import failed: ${res.status}`);
      alert('Import successful');
      // refresh list if needed:
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to import');
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gray-50 text-gray-900">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className='flex items-center gap-2'>
          <img src="..\images\mandiri-logo.png" alt='mandiri-logo' className='h-8'/>
        </div>
        <h1 className="text-2xl font-semibold">Customer Cycle Update</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-700 hover:bg-[#700000] text-white rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Customer List</h2>
        <CustomerList />
      </div>

      {/* Import / Export Controls */}
      <div className="mt-4 flex justify-end">
        {/*{/* hidden file input for import
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls"
          onChange={handleImport}
          className="hidden"
        />
        <button
          onClick={handleImportClick}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
        >
          Import Excel
        </button> */}
        {/*
        <button
          onClick={handleExport}
          className="px-4 py-2 gap-10 bg-[#007047] text-white rounded-lg"
        >
          Export Excel
        </button>
        */}
      </div>
    </main>
  );
}
