import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, Bell, Sparkles } from 'lucide-react';

const ANNOUNCEMENTS = [
    {
        id: 1,
        title: "ESP32 WiFi Support",
        description: "Connect your kits via WiFi for a seamless wireless coding experience. Now available in the connection panel!",
        icon: <Zap size={24} />,
        gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
        tag: "New Feature"
    },
    {
        id: 2,
        title: "Mars Rover Kit",
        description: "Unlock the full potential of your TEN ROBOTICS kit with the new Mars Rover project. Check it out in the Project Store!",
        icon: <Sparkles size={24} />,
        gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
        tag: "In Stock"
    },
    {
        id: 3,
        title: "Firmware v2.1",
        description: "Experience 2x faster code uploads and improved sensor stability with our latest firmware update.",
        icon: <Bell size={24} />,
        gradient: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
        tag: "Update"
    },
    {
        id: 4,
        title: "Bluetooth Expert",
        description: "Control your projects from your phone with improved Bluetooth Low Energy support. Low latency, high performance.",
        icon: <Zap size={24} />,
        gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        tag: "New"
    },
    {
        id: 5,
        title: "Blockly Blocks+",
        description: "15+ new custom blocks for advanced logic, timing, and motor control. Built for complex robotics projects.",
        icon: <Sparkles size={24} />,
        gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        tag: "BETA"
    }
];

const AnnouncementCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
    };

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            handleNext();
        }, 6500);
        return () => clearInterval(timer);
    }, [currentIndex, isPaused]);


    return (
        <div
            className="carousel-container glass"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{
                position: 'relative',
                height: 'clamp(240px, 35vh, 280px)',
                marginBottom: 'clamp(30px, 6vw, 50px)',
                overflow: 'hidden',
                borderRadius: 'clamp(20px, 4vw, 32px)',
                background: 'var(--surface)',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <AnimatePresence initial={false} custom={direction} mode="wait">
                <Motion.div
                    key={currentIndex}
                    custom={direction}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        padding: '0 60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div style={{
                        width: '100%',
                        maxWidth: '800px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: '1rem',
                        position: 'relative',
                    }}>
                        {/* Background Glow - Parallax Layer (Slowest) */}
                        <Motion.div
                            key={`bg-${currentIndex}`}
                            initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 0.15 }}
                            exit={{ x: direction < 0 ? 100 : -100, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '350px',
                                height: '350px',
                                background: ANNOUNCEMENTS[currentIndex].gradient,
                                filter: 'blur(100px)',
                                borderRadius: '50%',
                                pointerEvents: 'none',
                                zIndex: -1
                            }}
                        />

                        {/* Icon Layer - Parallax Layer (Fastest) */}
                        <Motion.div
                            key={`icon-${currentIndex}`}
                            initial={{ x: direction > 0 ? 200 : -200, scale: 0.5, rotate: direction > 0 ? 45 : -45, opacity: 0 }}
                            animate={{ x: 0, scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ x: direction < 0 ? 200 : -200, scale: 0.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.05 }}
                            style={{
                                background: ANNOUNCEMENTS[currentIndex].gradient,
                                padding: '1.25rem',
                                borderRadius: '1.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 15px 45px rgba(0,0,0,0.4)',
                                marginBottom: '0.5rem',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}
                        >
                            {React.cloneElement(ANNOUNCEMENTS[currentIndex].icon, { color: 'white', size: 32 })}
                        </Motion.div>

                        {/* Content Layer - Parallax Layer (Medium) */}
                        <Motion.div
                            key={`content-${currentIndex}`}
                            initial={{ x: direction > 0 ? 150 : -150, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: direction < 0 ? 150 : -150, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 150, damping: 25, delay: 0.02 }}
                            style={{ minWidth: 0 }}
                        >
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: '4px',
                                color: 'var(--primary)',
                                marginBottom: '0.75rem',
                                display: 'block',
                                textShadow: '0 0 20px rgba(var(--primary-rgb), 0.5)'
                            }}>
                                {ANNOUNCEMENTS[currentIndex].tag}
                            </span>
                            <h2 style={{
                                fontSize: 'clamp(1.75rem, 6vw, 2.5rem)',
                                fontWeight: '800',
                                marginBottom: '1rem',
                                color: 'white',
                                letterSpacing: '-1.5px',
                                lineHeight: '1.1'
                            }}>
                                {ANNOUNCEMENTS[currentIndex].title}
                            </h2>
                            <p style={{
                                color: 'var(--text-muted)',
                                fontSize: 'clamp(1rem, 3vw, 1.15rem)',
                                maxWidth: '650px',
                                margin: '0 auto',
                                lineHeight: '1.7',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical'
                            }}>
                                {ANNOUNCEMENTS[currentIndex].description}
                            </p>
                        </Motion.div>
                    </div>
                </Motion.div>
            </AnimatePresence>

            {/* Side Navigation Controls - Show only on hover */}
            <AnimatePresence>
                {isPaused && (
                    <>
                        <Motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            onClick={handlePrev}
                            className="btn btn-secondary hide-mobile"
                            style={{
                                position: 'absolute',
                                left: '1.5rem',
                                zIndex: 20,
                                padding: '0',
                                borderRadius: '50%',
                                width: '44px',
                                height: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'var(--surface-light)',
                                border: '1px solid var(--border)',
                                backdropFilter: 'blur(10px)',
                                color: 'var(--text)'
                            }}
                        >
                            <ChevronLeft size={24} />
                        </Motion.button>
                        <Motion.button
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            onClick={handleNext}
                            className="btn btn-secondary hide-mobile"
                            style={{
                                position: 'absolute',
                                right: '1.5rem',
                                zIndex: 20,
                                padding: '0',
                                borderRadius: '50%',
                                width: '44px',
                                height: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'var(--surface-light)',
                                border: '1px solid var(--border)',
                                backdropFilter: 'blur(10px)',
                                color: 'var(--text)'
                            }}
                        >
                            <ChevronRight size={24} />
                        </Motion.button>
                    </>
                )}
            </AnimatePresence>

            {/* Mobile Bottom Controls */}
            <div className="show-mobile-only" style={{
                position: 'absolute',
                bottom: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '1.5rem',
                zIndex: 20
            }}>
                <button
                    onClick={handlePrev}
                    style={{ background: 'none', border: 'none', color: 'var(--text)' }}
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={handleNext}
                    style={{ background: 'none', border: 'none', color: 'var(--text)' }}
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Centralized Dots */}
            <div style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '0.6rem',
                zIndex: 10
            }} className="hide-mobile">
                {ANNOUNCEMENTS.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                        style={{
                            width: currentIndex === index ? '30px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            background: currentIndex === index ? 'var(--primary)' : 'var(--text-muted)',
                            opacity: currentIndex === index ? 1 : 0.3,
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            cursor: 'pointer'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default AnnouncementCarousel;
