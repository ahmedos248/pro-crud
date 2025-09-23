import Card from "../components/Card";
import { useProducts } from "../hooks/useProducts";
import { useResponsiveCards } from "../hooks/useResponsiveCards";
import { useState } from "react";
import AddProductForm from "../components/AddProductForm";

const removeLocal = (id) => {
  try {
    const list = JSON.parse(localStorage.getItem("nb_local_products") || "[]")
      .filter(x => String(x.id) !== String(id));
    localStorage.setItem("nb_local_products", JSON.stringify(list));
    localStorage.removeItem(`nb_product_${id}`);
  } catch {}
};
export default function Products({ darkMode }) {
    const { cards, setCards, loading } = useProducts();
    const cardsPerPage = useResponsiveCards();
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(cards?.length / cardsPerPage);
    const startIndex = (currentPage - 1) * cardsPerPage;
    const visibleCards = cards?.slice(startIndex, startIndex + cardsPerPage);

    const handleAdd = (product) => setCards((prev) => [product, ...prev]);
    const handleDelete = (id) => setCards((prev) => prev.filter((c) => c.id !== id));



    return (
        <div className="p-6 space-y-6">
            <AddProductForm onAdd={handleAdd} />
            {loading ? (
                <div className="text-center py-20">Loading products...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {visibleCards?.map((card) => (
                        <div key={card.id} className="flex-none">
                            <Card
                                imgSrc={card.img || "https://via.placeholder.com/300"}
                                alt={card.alt || "No Image"}
                                darkMode={darkMode}
                                initialPrice={card.price}
                                initialQuantity={1}
                                id={card.id}
                                onDelete={handleDelete}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="px-4 py-2 rounded-3xl bg-slate-200 dark:bg-gray-600 hover:bg-slate-300 hover:dark:bg-gray-700 transition duration-300"
                >
                    ◀ Previous
                </button>
                <span>
                    Page {currentPage} / {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-4 py-2 rounded-3xl bg-slate-200 dark:bg-gray-600 hover:bg-slate-300 hover:dark:bg-gray-700 transition duration-300"
                >
                    Next ▶
                </button>
            </div>
        </div>
    );
}
