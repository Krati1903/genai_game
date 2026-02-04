import React from 'react';

interface InsightsCardProps {
    title: string;
    description: string;
    value: number | string;
}

const InsightsCard: React.FC<InsightsCardProps> = ({ title, description, value }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-gray-600">{description}</p>
            <div className="mt-2 text-xl font-bold">{value}</div>
        </div>
    );
};

export default InsightsCard;