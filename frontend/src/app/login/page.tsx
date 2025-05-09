'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
    const [area_code, setAreaCode] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ area_code, password }),
        });

        if (res.ok) {
            router.push('/dashboard');
        } else {
            const { message } = await res.json();
            setError(message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen item-center bg-cover bg-center bg-" style={{ backgroundImage: "url('/images/login-bg.png')" }}>
            <div className='absolute top-6 left-6'>
                <img src="..\images\adsol-logo.png" alt='adsol-logo' className='h-24'/>
            </div>
            <div className='flex items-center justify-center min-h-screen bg-black bg-opacity-60'>
                <form onSubmit={handleSubmit} className='bg-white flex flex-col gap-2 items-center p-6 rounded-2xl shadow-md w-80'>

                    <div className='flex items-center justify-start w-full'>
                        <img src="..\images\mandiri-logo.png" alt='mandiri-logo' className='h-6'/>
                    </div>

                    <h1 className='text-gray-800 text-l font-semibold mb-4 text-left w-full'>Dashboard Monitoring Strategi TBW</h1>
                    
                    {error && <p className='text-red-500 text-sm mb-3'>{error}</p>}

                    <input
                        type="text"
                        placeholder='Area Code'
                        value={area_code}
                        onChange={(e) => setAreaCode(e.target.value)}
                        className='text-gray-800 w-full p-2 mb-3 border rounded'
                        required
                    />
                    <input
                        type="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='text-gray-800 w-full p-2 mb-4 border rounded'
                        required
                    />
                    <button
                        type='submit'
                        className='w-full bg-[#003A70] text-white py-2 rounded hover;bg-blue-700'
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    )
}