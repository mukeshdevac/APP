import React, { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const RobotAnimation = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Disappear after the "crazy" animation sequence (approx 6 seconds)
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 8000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <Motion.div
                    style={{
                        position: 'fixed',
                        zIndex: 9999,
                        pointerEvents: 'none',
                        bottom: '100px',
                        left: '-200px',
                        transformStyle: 'preserve-3d'
                    }}
                    initial={{ x: -200, y: 0, rotate: 0, z: 0 }}
                    animate={{
                        x: [0, 400, 400, 800, 1200, 3000],
                        y: [0, -200, 0, -300, 100, 0],
                        z: [0, 400, -200, 600, -400, 0],
                        rotateX: [0, 45, -45, 20, -20, 0],
                        rotateY: [0, -60, 60, -30, 30, 0],
                        rotateZ: [0, 720, 0, 100, -100, 0],
                        scale: [1, 2.5, 0.5, 3.5, 0.3, 1]
                    }}
                    transition={{
                        duration: 8,
                        ease: "easeInOut",
                        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                >
                    <div style={{ position: 'relative', transformStyle: 'preserve-3d' }}>
                        {/* Shadow Layer */}
                        <Motion.div
                            style={{
                                position: 'absolute',
                                bottom: '-30px',
                                left: '40px',
                                width: '100px',
                                height: '20px',
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: '50%',
                                filter: 'blur(10px)',
                                transform: 'translateZ(-50px)'
                            }}
                            animate={{ scale: [1, 1.5, 0.8, 2, 0.6, 1] }}
                            transition={{ duration: 8, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
                        />

                        {/* Main Body */}
                        <Motion.div
                            className="preserve-3d"
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        >
                            <img
                                src="https://png.pngtree.com/png-clipart/20230914/original/pngtree-mars-rover-vector-png-image_11242179.png"
                                alt="Mars Rover"
                                style={{
                                    width: '180px',
                                    height: 'auto',
                                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))'
                                }}
                            />
                        </Motion.div>
                    </div>
                </Motion.div>
            )}
        </AnimatePresence>
    );
};

export default RobotAnimation;
