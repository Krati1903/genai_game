import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ChatWindow from '../../components/ChatWindow';
import InsightsCard from '../../components/InsightsCard';
import ModelSelector from '../../components/ModelSelector';

const DashboardPage = () => {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-4">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <ModelSelector />
                    <InsightsCard />
                    <ChatWindow />
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;