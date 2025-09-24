// src/pages/Item.jsx
import { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";
import { isLocalId, getLocalItemById } from "../lib/localItems";

export default function Item({ darkMode }) {
  const { id } = useParams();
  const isLocal = isLocalId(id);
  const localRaw = isLocal ? getLocalItemById(id) : null;

  const viewItem = useMemo(() => {
    if (!isLocal || !localRaw) return null;
    const img = localRaw?.image || localRaw?.img || "";
    return {
      ...localRaw,
      images: Array.isArray(localRaw?.images) && localRaw.images.length ? localRaw.images : (img ? [img] : []),
      thumbnail: img,
      image: img,
      category: typeof localRaw?.category === "string" ? { name: localRaw.category } : (localRaw?.category || { name: "Local" }),
      price: Number(localRaw?.price || 0),
      description: localRaw?.description || "",
      alt: localRaw?.title || localRaw?.alt || "Local Item",
      title: localRaw?.title || localRaw?.alt || "Local Item",
    };
  }, [isLocal, localRaw]);

  const { data: item, isLoading, isError } = useQuery({
    enabled: !isLocal,
    queryKey: ["product", String(id)],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data;
    },
    staleTime: 60_000,
    gcTime: 30 * 60_000,
    retry: 1,
  });

  const images = useMemo(() => {
    const raw = isLocal ? viewItem?.images : item?.images;
    return Array.isArray(raw) ? raw.map(String).filter(Boolean) : [];
  }, [isLocal, viewItem, item]);

  const [thumbIndex, setThumbIndex] = useState(0);
  useEffect(() => { setThumbIndex(0); }, [id]);

  const primaryImage = useMemo(() => {
    const fallback = isLocal ? (viewItem?.thumbnail || viewItem?.image || "") : (item?.thumbnail || item?.image || "");
    return images[thumbIndex] || fallback || "";
  }, [images, thumbIndex, isLocal, item, viewItem]);

  if (isLoading && !isLocal) {
    return <div className="mx-auto max-w-6xl p-4 md:p-8">Loading…</div>;
  }

  if ((isLocal && !viewItem) || (!isLocal && isError)) {
    return (
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <p className="text-red-500">error while loading data</p>
        <Link to="/products" className="px-4 py-2 rounded-xl bg-slate-800 text-white inline-block mt-3">return to Products</Link>
      </div>
    );
  }

  const v = isLocal ? viewItem : item;

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      {/* Outer card with faint background image */}
      <div className={`relative rounded-3xl border ${darkMode ? "border-slate-700" : "border-slate-200"} shadow-xl overflow-hidden`}>
        {/* faint bg image */}
        {primaryImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: `url(${primaryImage})` }}
          />
        )}

        {/* Foreground content */}
        <div className="relative p-4 md:p-8">
          {/* Top bar: Title + Category (left), Return button (right) */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                {v?.title || v?.alt}
              </h1>
              <div className="mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm bg-white/70 dark:bg-white/10 border border-white/50 dark:border-white/10">
                {v?.category?.name}
              </div>
            </div>

            <Link
              to="/products"
              className="h-10 px-4 inline-flex items-center rounded-full bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 border border-white/50 dark:border-white/10 transition shadow-sm"
            >
              Return to Products
            </Link>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main image with white border */}
            <div className="relative rounded-[28px] bg-white/90 p-2 md:p-3">
              <div className="rounded-[20px] overflow-hidden">
                { (images[thumbIndex] || v?.image) ? (
                  <img
                    src={images[thumbIndex] || v.image}
                    alt={v?.alt || v?.title || "image"}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-slate-200 dark:bg-slate-800" />
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="text-2xl font-semibold">
                ${Number(v?.price || 0).toFixed(2)}
              </div>

              {v?.description ? (
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {v.description}
                </p>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">no available description</p>
              )}

              {images.length > 1 && (
                <div className="mt-2 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {images.map((src, idx) => (
                    <button
                      key={`${src}-${idx}`}
                      onClick={() => setThumbIndex(idx)}
                      className={`relative rounded-xl overflow-hidden border ${idx === thumbIndex ? "border-violet-500" : "border-transparent"}`}
                      title={`thumbnail ${idx + 1}`}
                    >
                      <img src={src} alt={`thumbnail ${idx + 1}`} loading="lazy" className="w-full h-16 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
