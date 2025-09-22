import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

export default function Card({ imgSrc, alt, darkMode, initialPrice, initialQuantity }) {
    const [src, setSrc] = useState(
        imgSrc && imgSrc.startsWith("http") ? imgSrc : "/fallback.png"
    );
    const controls = useAnimation();
    const [isHover, setIsHover] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [price, setPrice] = useState(initialPrice ?? 100);
    const [quantity, setQuantity] = useState(initialQuantity ?? 1);


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

    const toggleExpand = () => setIsExpanded(prev => !prev);
    const increasePrice = () => setPrice(prev => prev + 1);
    const decreasePrice = () => setPrice(prev => (prev > 0 ? prev - 1 : 0));
    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => setQuantity(prev => (prev > 0 ? prev - 1 : 0));

    return (
        <motion.div
            className={`relative rounded-2xl shadow-xl cursor-pointer overflow-hidden ${darkMode ? "bg-blue-950/30" : "bg-white/5"}`}
            initial={{ height: "auto" }}
            animate={{ height: "auto" }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
        >
            {/* <<< SMALL CARD >>> */}
            <motion.div
                className={`relative overflow-hidden rounded-2xl backdrop-blur-[1px] p-4 shadow-xl cursor-pointer ${darkMode ? "bg-blue-950/30" : "bg-white/5"}`}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
                onClick={toggleExpand}
                animate={{
                    rotateY: isHover ? 10 : 0,
                    rotateX: isHover ? -5 : 0,
                }}
                transition={{ type: "spring", stiffness: 150, damping: 15 }}
                style={{ perspective: 600 }}
            >
                <img
                    src={src}
                    alt={alt || "Product"}
                    loading="lazy"
                    onError={() => setSrc("/fallback.png")}
                    className="w-full h-full object-cover rounded-xl"
                />

                {/* Price & Quantity overlay inside small card */}
                <div className="absolute bottom-0 left-0 w-full text-white rounded flex justify-between p-4 gap-3 text-sm">
                    <span className="bg-green-600/70 rounded-3xl p-1">${price}</span>
                    <span
                        className={`rounded-3xl p-1 ${quantity === 0 ? "bg-red-600/70" : "bg-green-600/70"
                            }`}
                    >
                        Qty: {quantity}
                    </span>

                </div>

                {/* Sweeping overlay */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 pointer-events-none"
                    initial={{ top: "-200%", left: "0%", rotate: "40deg", width: "30%", height: "300%" }}
                    animate={controls}
                />
            </motion.div>

            {/* <<< EXPANDABLE CONTROLS >>> */}
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
                className="overflow-hidden"
            >
                <div className="p-2 sm:p-4 flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="flex justify-between gap-2 w-full">
                        <button className="bg-red-500 text-white px-2 py-1 rounded text-base sm:text-sm md:text-sm md:px-1 md:py-0.5">Delete</button>
                        <button className="bg-blue-500 text-white px-2 py-1 rounded text-base sm:text-sm md:text-sm md:px-1 md:py-0.5">View</button>
                    </div>

                    <div className="flex justify-between items-center gap-2 w-full">
                        <div className="flex items-center text-center gap-2 md:gap-[1px]">
                            <button onClick={decreasePrice} className="py-1 dark:bg-gray-600 bg-slate-300 rounded text-base sm:text-sm px-[5px] md:py-0.5 md:text-sm">-</button>
                            <span className="text-base sm:text-sm md:text-xs">Price: ${price}</span>
                            <button onClick={increasePrice} className="py-1 dark:bg-gray-600 bg-slate-300 rounded text-base sm:text-sm px-[3px] md:py-0.5 md:text-sm">+</button>
                        </div>

                        <div className="flex items-center gap-2 md:gap-1">
                            <button onClick={decreaseQuantity} className="py-1 dark:bg-gray-600 bg-slate-300 rounded text-base sm:text-sm px-[5px] md:py-0.5 md:text-sm">-</button>
                            <span className={`px-2 py-1 rounded-2xl text-base sm:text-sm md:px-1 md:py-0.5 md:text-xs ${quantity === 0 ? 'bg-red-600' : 'bg-green-600'}`}>
                                Qty: {quantity}
                            </span>
                            <button onClick={increaseQuantity} className="py-1 dark:bg-gray-600 bg-slate-300 rounded text-base sm:text-sm px-[3px] md:py-0.5 md:text-sm">+</button>
                        </div>
                    </div>
                </div>

            </motion.div>
        </motion.div>

    );
}
