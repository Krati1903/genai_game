import React from 'react';

const ModelSelector: React.FC = () => {
    const models = ['Model A', 'Model B', 'Model C']; // Example models
    const [selectedModel, setSelectedModel] = React.useState(models[0]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedModel(event.target.value);
    };

    return (
        <div className="model-selector">
            <label htmlFor="model-select" className="block text-sm font-medium text-gray-700">
                Select AI Model
            </label>
            <select
                id="model-select"
                value={selectedModel}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            >
                {models.map((model) => (
                    <option key={model} value={model}>
                        {model}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ModelSelector;