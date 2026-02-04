'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VideoPlayerProps {
    src: string;
    onEnded?: () => void;
}

export default function VideoPlayer({ src, onEnded }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(console.error);
        }
    }, [src]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-black"
        >
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover"
                onEnded={onEnded}
                playsInline
                muted={false}
            >
                Your browser does not support video playback.
            </video>

            {/* Cinematic Letterbox Effect */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </motion.div>
    );
}

