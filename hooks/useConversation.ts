import { useState, useEffect } from 'react';

const useConversation = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (message) => {
        setLoading(true);
        setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'user' }]);

        // Simulate an API call to send the message and receive a response
        const response = await fakeApiCall(message);
        setMessages((prevMessages) => [...prevMessages, { text: response, sender: 'ai' }]);
        setLoading(false);
    };

    const fakeApiCall = async (message) => {
        // Simulate a delay for the API response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`AI response to: ${message}`);
            }, 1000);
        });
    };

    return {
        messages,
        loading,
        sendMessage,
    };
};

export default useConversation;