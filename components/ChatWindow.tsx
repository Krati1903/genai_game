import React from 'react';

const ChatWindow: React.FC = () => {
    return (
        <div className="chat-window">
            <div className="messages">
                {/* Messages will be rendered here */}
            </div>
            <div className="input-area">
                <input type="text" placeholder="Type your message..." className="message-input" />
                <button className="send-button">Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;