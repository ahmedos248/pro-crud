export default function LearnMore() {
    return (
        <section className="min-h-screen dark:text-white text-gray-900 px-6 py-12 flex flex-col items-center">
            <div className="max-w-3xl text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Learn More About <span className="dark:text-violet-400 text-violet-600">Our CRUD System</span>
                </h1>

                <p className="text-lg dark:text-gray-300 text-gray-600 mb-6">
                    This CRUD application is designed to help you manage your products with ease.
                    You can <span className="text-green-400 font-medium">add</span> new products,
                    <span className="text-blue-400 font-medium"> view</span> details,
                    <span className="text-yellow-400 font-medium"> update</span> existing products
                    (including price, quantity, and images), or
                    <span className="text-red-400 font-medium"> delete</span> products you no longer need.
                </p>

                <div className="dark:bg-gray-800/60 bg-gray-200/60 p-6 rounded-2xl shadow-lg mb-8">
                    <h2 className="text-2xl font-semibold mb-4 dark:text-violet-300 text-violet-600">Features</h2>
                    <ul className="space-y-2 dark:text-gray-300 text-gray-600 text-left list-disc list-inside">
                        <li>Add new products with price, quantity, and images</li>
                        <li>View all products in a clean layout</li>
                        <li>Edit product details including price and quantity</li>
                        <li>Upload images directly from your computer</li>
                        <li>Delete products instantly</li>
                    </ul>
                </div>

                <div className="dark:bg-gray-800/60 bg-gray-200/60  p-6 rounded-2xl shadow-lg mb-8">
                    <h2 className="text-2xl font-semibold mb-4 dark:text-violet-300 text-violet-600">Technologies Used</h2>
                    <p className="dark:text-gray-300 text-gray-600">
                        This project is built with <span className="font-medium text-sky-400">React</span>,
                        styled using <span className="font-medium text-teal-400">Tailwind CSS</span>, and powered by
                        <span className="font-medium dark:text-yellow-300 text-yellow-500"> TanStack React Query</span> for data fetching and caching.
                        Form handling is done with <span className="font-medium text-pink-400">Formik</span> and
                        validation with <span className="font-medium text-green-400">Yup</span>.
                        We also use a fake API to provide product data.
                    </p>
                </div>

                <div className="dark:bg-gray-800/60 bg-gray-200/60  p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 dark:text-violet-300 text-violet-600">Developers</h2>
                    <p className="dark:text-gray-300 text-gray-600">
                        This system was developed by <span className="font-medium text-violet-400">Ahmed Osama </span>
                        and <span className="font-medium text-violet-400">Eslam</span>.
                    </p>
                </div>
            </div>
        </section>
    );
}
