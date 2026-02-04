'use client';

import { motion } from 'framer-motion';

interface Choice {
    id: number;
    text: string;
}

interface ChoiceButtonsProps {
    choices: Choice[];
    onSelect: (choice: string) => void;
    accentColor: string;
}

export default function ChoiceButtons({ choices, onSelect, accentColor }: ChoiceButtonsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {choices.map((choice, index) => (
                <motion.button
                    key={choice.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(choice.text)}
                    className="group relative text-left"
                >
                    {/* Glow Effect */}
                    <div 
                        className="absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                        style={{ backgroundColor: accentColor }}
                    />
                    
                    {/* Button Content */}
                    <div 
                        className="relative flex items-center gap-4 p-5 rounded-xl border backdrop-blur-sm transition-all duration-300"
                        style={{ 
                            borderColor: `${accentColor}30`,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        {/* Number Badge */}
                        <span 
                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                            style={{ 
                                backgroundColor: `${accentColor}20`,
                                color: accentColor
                            }}
                        >
                            {choice.id}
                        </span>
                        
                        {/* Choice Text */}
                        <span className="text-gray-200 group-hover:text-white transition-colors font-light">
                            {choice.text}
                        </span>
                        
                        {/* Arrow */}
                        <svg 
                            className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all"
                            style={{ color: accentColor }}
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </motion.button>
            ))}
        </div>
    );
}

