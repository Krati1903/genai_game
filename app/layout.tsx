import React from 'react';
import './globals.css';

const Layout = ({ children }) => {
    return (
        <html lang="en">
            <head>
                <title>GenAI Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
};

export default Layout;