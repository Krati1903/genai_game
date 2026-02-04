'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface CustomInputProps {
    onSubmit: (choice: string) => void;
    accentColor: string;
}

export default function CustomInput({ onSubmit, accentColor }: CustomInputProps) {
    const [customPath, setCustomPath] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customPath.trim()) {
            onSubmit(customPath.trim());
            setCustomPath('');
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            onSubmit={handleSubmit}
            className="relative mt-4"
        >
            {/* Label */}
            <p className="text-center text-gray-500 text-xs tracking-widest uppercase mb-3">
                Or forge your own path
            </p>

            {/* Input Container */}
            <div className="relative group">
                {/* Glow Effect */}
                <div 
                    className="absolute inset-0 rounded-xl blur-xl transition-opacity duration-300"
                    style={{ 
                        backgroundColor: accentColor,
                        opacity: isFocused ? 0.2 : 0
                    }}
                />

                {/* Input Field */}
                <div 
                    className="relative flex items-center rounded-xl border backdrop-blur-sm overflow-hidden transition-all duration-300"
                    style={{ 
                        borderColor: isFocused ? `${accentColor}60` : `${accentColor}20`,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                >
                    {/* Decorative Icon */}
                    <span className="pl-5 text-gray-500">✦</span>
                    
                    <input
                        type="text"
                        value={customPath}
                        onChange={(e) => setCustomPath(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Describe your own narrative direction..."
                        className="flex-1 px-4 py-4 bg-transparent text-white placeholder-gray-600 focus:outline-none font-light"
                    />
                    
                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!customPath.trim()}
                        className="m-2 px-6 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ 
                            backgroundColor: customPath.trim() ? accentColor : `${accentColor}30`,
                            color: customPath.trim() ? '#000' : '#fff'
                        }}
                    >
                        Create
                    </motion.button>
                </div>
            </div>

            {/* Hint */}
            <p className="text-center text-gray-700 text-xs mt-3">
                Be specific and creative—your words shape the next scene
            </p>
        </motion.form>
    );
}

