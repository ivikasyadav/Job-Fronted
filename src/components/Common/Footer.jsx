// client/src/components/Common/Footer.jsx
import React from 'react';

/**
 * @component Footer
 * @description Renders the application's footer.
 */
const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6 mt-8">
            <div className="container mx-auto text-center text-sm">
                <p>&copy; {new Date().getFullYear()} Job Portal. All rights reserved.</p>
                <p className="mt-2">Built with React, Node.js, and MongoDB.</p>
            </div>
        </footer>
    );
};

export default Footer;
