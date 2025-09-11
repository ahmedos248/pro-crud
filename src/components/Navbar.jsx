import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 relative">
                        {/* Logo */}
                        <Link
                            to="/"
                            className={`text-2xl font-bold text-blue-600 hover:text-blue-700 transition-all duration-300 absolute ${open ? "left-1/3 -translate-x-1/3" : "left-4"
                                }`}
                        >
                            StuCRUD
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-8 text-gray-700 font-medium ml-auto">
                            <Link to="/" className="hover:text-blue-600 transition">
                                Home
                            </Link>
                            <Link to="/students" className="hover:text-blue-600 transition">
                                Students
                            </Link>
                        </div>

                        {/* Mobile Button */}
                        <button
                            onClick={() => setOpen(true)}
                            className="md:hidden ml-auto text-gray-700 hover:text-blue-600 focus:outline-none"
                        >
                            ☰
                        </button>
                    </div>
                </div>
            </nav>

            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Mobile Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-blue-600">Menu</h2>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-gray-600 hover:text-blue-600"
                    >
                        ✖
                    </button>
                </div>

                <div className="flex flex-col space-y-4 p-4 text-gray-700 font-medium">
                    <Link
                        to="/"
                        className="hover:text-blue-600 transition"
                        onClick={() => setOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        to="/students"
                        className="hover:text-blue-600 transition"
                        onClick={() => setOpen(false)}
                    >
                        Students
                    </Link>
                </div>
            </div>
        </>
    );
}
