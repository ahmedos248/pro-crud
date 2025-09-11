import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

export default function Card({ imgSrc, alt, darkMode }) {
    const controls = useAnimation();
    const [isHover, setIsHover] = useState(false);

    const handleHoverStart = () => {
        setIsHover(true);
        controls.start({
            top: "-50%",
            left: "50%",
            transition: { duration: 0.7, ease: "easeInOut" },
        });
    };

    const handleHoverEnd = () => {
        setIsHover(false);
        controls.start({
            top: "-200%",
            left: "0%",
            transition: { duration: 0.7, ease: "easeInOut" },
        });
    };

    return (
        <div className={`relative overflow-hidden rounded-2xl backdrop-blur-[1px] pb-14 shadow-xl cursor-pointer ${darkMode ? "bg-blue-950/30" : "bg-white/5"
            }`}>
            <motion.div
                className={`relative overflow-hidden rounded-2xl backdrop-blur-[1px] p-4 shadow-xl cursor-pointer ${darkMode ? "bg-blue-950/30" : "bg-white/5"
                    }`}

                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
                animate={{
                    rotateY: isHover ? 10 : 0,
                    rotateX: isHover ? -5 : 0,
                }}
                transition={{ type: "spring", stiffness: 150, damping: 15 }}
                style={{ perspective: 600 }}
            >
                <img
                    src={imgSrc}
                    alt={alt}
                    className="w-full h-full object-cover rounded-xl"
                />

                {/* Sweeping overlay */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 pointer-events-none"
                    initial={{ top: "-200%", left: "0%", rotate: "40deg", width: "30%", height: "300%" }}
                    animate={controls}
                />
            </motion.div>
        </div>
    );
}
