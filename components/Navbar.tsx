import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between">
                <div className="text-white text-lg font-bold">GenAI Dashboard</div>
                <div className="space-x-4">
                    <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
                    <Link href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
                    <Link href="/about" className="text-gray-300 hover:text-white">About</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;