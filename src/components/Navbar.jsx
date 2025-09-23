import React, { useState } from "react";
import { Link } from "react-router-dom";
import { colorPalette } from "../utils/colorPalette";

export default function Navbar({ darkMode, setDarkMode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 w-full z-50">
                <div
                    className={`${darkMode ? colorPalette.dark.navbar : colorPalette.light.navbar
                        } shadow-md`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link
                                to="/"
                                className="text-2xl font-extrabold text-white drop-shadow-sm"
                            >
                                Pro-Crud
                            </Link>

                            {/* Desktop menu */}
                            <div className="hidden md:flex gap-6 items-center text-white font-medium">
                                <Link to="/" className="hover:underline">
                                    Home
                                </Link>
                                <Link to="/Products" className="hover:underline">
                                    Products
                                </Link>
                               
                            </div>

                            {/* Right actions */}
                            <div className="flex items-center gap-3">
                                {/* Dark mode toggle */}
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition"
                                    aria-label="Toggle dark mode"
                                >
                                    {darkMode ? "☀️" : "🌙"}
                                </button>

                                {/* Mobile button */}
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className="md:hidden p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
                                    aria-label="Open menu"
                                >
                                    ☰
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* MOBILE DRAWER */}
            <div
                className={`fixed inset-0 z-50 transition ${isOpen ? "visible" : "invisible"
                    }`}
            >
                {/* Backdrop */}
                <div
                    onClick={() => setIsOpen(false)}
                    className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
                        }`}
                />

                {/* Drawer */}
                <aside
                    className={`fixed top-0 left-0 h-full w-72 p-6 ${darkMode ? "bg-black/50" : "bg-white/50"
                        } shadow-xl transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >

                    <div className="flex items-center justify-between">
                        {/* Logo inside drawer */}
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-10 h-10 rounded-md flex items-center justify-center text-white font-bold ${darkMode ? colorPalette.dark.navbar : colorPalette.light.navbar
                                    }`}
                            >
                                PC
                            </div>
                            <div
                                className={`text-lg font-semibold ${darkMode ? colorPalette.dark.text : colorPalette.light.text
                                    }`}
                            >
                                Pro-Crud
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className={`text-xl ${darkMode ? colorPalette.dark.text : colorPalette.light.text
                                }`}
                            aria-label="Close menu"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Links */}
                    <nav
                        className={`mt-8 flex flex-col gap-4 font-medium ${darkMode ? colorPalette.dark.text : colorPalette.light.text
                            }`}
                    >
                        <Link
                            to="/"
                            onClick={() => setIsOpen(false)}
                            className={`py-2 px-2 rounded transition ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/Products"
                            onClick={() => setIsOpen(false)}
                            className={`py-2 px-2 rounded transition ${darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                                }`}
                        >
                            Products
                        </Link>
                    </nav>
                </aside>
            </div>
        </>
    );
}
