import { Link } from "react-router-dom";
export default function Home() {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen text-gray-900 dark:text-white text-center px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Welcome to <span className="dark:text-violet-400 text-violet-600">Our CRUD System</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-900 dark:text-gray-300 max-w-2xl mb-8">
                Manage your data with ease — create, view, update, and delete records in just a few clicks.
                Built with <span className="dark:text-sky-400 text-sky-600 font-medium">React</span> and <span className="dark:text-teal-400 text-teal-600 font-medium">Tailwind CSS</span>.
            </p>
            <div className="flex gap-4">
                <Link to="/products">
                    <button className="px-6 py-3 bg-violet-500 hover:bg-violet-600 rounded-xl shadow-lg transition">
                        Get Started
                    </button>
                </Link>
                <Link to="/learn-more">
                    <button className="px-6 py-3 border border-gray-500 dark:hover:bg-gray-800 hover:bg-gray-500 rounded-xl transition">
                        Learn More
                    </button>
                </Link>

            </div>
        </section>
    );
}

export default function Home() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-4xl font-bold drop-shadow-lg">
                Welcome to Pro-Crud 🎉
            </h1>
        </div>
    );
}
