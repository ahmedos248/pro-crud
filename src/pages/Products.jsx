import React, { useState, useEffect, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import Card from "../components/Card";
import AddProductForm from "../components/AddProductForm";
import { removeLocalItem } from "../lib/localItems";
import { filterProducts } from "../utils/filterProducts";

export default function Products({ darkMode }) {
  const { cards, setCards, loading } = useProducts();

  // pagination
  const cardsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // filters (no `q` anywhere)
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("all"); // all | local | api
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [search, source, minPrice, maxPrice]);

  // safe filtering even while API is loading
  const filtered = useMemo(
    () => filterProducts(cards, { search, source, minPrice, maxPrice }),
    [cards, search, source, minPrice, maxPrice]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / cardsPerPage));
  const startIndex = (currentPage - 1) * cardsPerPage;
  const visibleCards = filtered.slice(startIndex, startIndex + cardsPerPage);

  // add/delete
  const handleAdd = (product) => setCards((prev) => [product, ...prev]);
  const handleDelete = (id) => {
    setCards((prev) => prev.filter((c) => String(c.id) !== String(id)));
    if (String(id).startsWith("local-")) { try { removeLocalItem(id); } catch {} }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <div className="mb-4 text-2xl font-semibold">Products</div>

      <AddProductForm onAdd={handleAdd} />

      {/* Filters */}
      <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur p-4 flex flex-wrap items-end gap-3 mt-4">
        <div className="flex-1 min-w-[220px]">
          <label className="block text-sm mb-1">Search</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-2xl px-3 py-2 border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/10 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Source</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="rounded-2xl px-3 py-2 border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/10"
          >
            <option value="all">All</option>
            <option value="local">Local</option>
            <option value="api">API</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Min Price</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            className="w-32 rounded-2xl px-3 py-2 border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/10"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Max Price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="9999"
            className="w-32 rounded-2xl px-3 py-2 border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/10"
          />
        </div>

        <button
          type="button"
          onClick={() => { setSearch(""); setSource("all"); setMinPrice(""); setMaxPrice(""); }}
          className="ml-auto rounded-2xl px-4 py-2 bg-slate-800 text-white hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          Clear
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="mt-6 text-slate-500">Loading…</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCards.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              alt={card.alt}
              price={card.price}
              imgSrc={
                card.img ||
                card.image ||
                (Array.isArray(card.images) ? card.images[0] : "") ||
                card.thumbnail ||
                "https://via.placeholder.com/300"
              }
              onDelete={() => handleDelete(card.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 rounded-xl bg-white/60 dark:bg-white/10 disabled:opacity-50">Prev</button>
        <span className="px-3 py-1">{currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 rounded-xl bg-white/60 dark:bg-white/10 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}
