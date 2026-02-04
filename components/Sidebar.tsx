import React from 'react';

const Sidebar: React.FC = () => {
    return (
        <div className="w-64 h-full bg-gray-800 text-white">
            <h2 className="text-lg font-bold p-4">GenAI Dashboard</h2>
            <ul className="mt-4">
                <li className="p-2 hover:bg-gray-700">Dashboard</li>
                <li className="p-2 hover:bg-gray-700">Models</li>
                <li className="p-2 hover:bg-gray-700">Insights</li>
                <li className="p-2 hover:bg-gray-700">Chat</li>
            </ul>
        </div>
    );
};

export default Sidebar;