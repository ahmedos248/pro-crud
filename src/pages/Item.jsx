import { useParams, Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";
import { isLocalId, getLocalItemById } from "../lib/localItems";

export default function Item({ darkMode }) {
  const { id } = useParams();

  // --- Local-first: if id is local-..., read from localStorage and disable API query
  const __isLocal = isLocalId(id);
  const __localRaw = __isLocal ? getLocalItemById(id) : null;

  const __viewItem = useMemo(() => {
    if (!__isLocal || !__localRaw) return null;
    const img = __localRaw?.image || __localRaw?.img || "";
    return {
      ...__localRaw,
      images: Array.isArray(__localRaw?.images) && __localRaw.images.length ? __localRaw.images : (img ? [img] : []),
      thumbnail: img,
      image: img,
      category: typeof __localRaw?.category === "string" ? { name: __localRaw.category } : (__localRaw?.category || { name: "Local" }),
      price: Number(__localRaw?.price || 0),
      description: __localRaw?.description || "",
      title: __localRaw?.title || __localRaw?.alt || "Local Item",
    };
  }, [__isLocal, __localRaw]);

  const {
    data: item,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", String(id)],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data;
    },
    enabled: !__isLocal,        // ⬅️ don't call API for local ids
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });

  // Image list (works for local + API items)
  const imageList = useMemo(() => {
    const raw = __isLocal ? __viewItem?.images : (Array.isArray(item?.images) ? item.images : []);
    return Array.isArray(raw) ? raw.map(String).filter(Boolean) : [];
  }, [item, __isLocal, __viewItem]);

  const [thumbIndex, setThumbIndex] = useState(0);
  useEffect(() => { setThumbIndex(0); }, [id]);

  const primaryImage = useMemo(() => {
    const fallback = __isLocal
      ? (__viewItem?.thumbnail || __viewItem?.image || "")
      : (item?.thumbnail || item?.image || "");
    return imageList[thumbIndex] || fallback || "";
  }, [imageList, thumbIndex, item, __isLocal, __viewItem]);

  // --- Old design branches kept as-is, only swapping `item` with a view object where needed
  if (isLoading && !__isLocal) {
    return (
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="animate-pulse rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-10">
          <div className="h-8 w-52 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
          <div className="grid gap-6 md:grid-cols-[360px,1fr]">
            <div className="h-[320px] bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
            <div className="space-y-4">
              <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-24 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if ((!__isLocal && isError) || (__isLocal && !__viewItem)) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <p className="mb-4 text-red-600 dark:text-red-400 font-medium">
          {__isLocal ? "Item not found locally" : `error while loading data: ${String(error?.message || error)}`}
        </p>
        <Link
          to="/products"
          className="inline-block rounded-lg px-4 py-2 bg-slate-700 text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          return to Products
        </Link>
      </div>
    );
  }

  const view = __isLocal ? __viewItem : item;

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      {/* Outer feature card: border + shadow + background */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Subtle background image */}
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={view?.title || "item"}
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-15"
          />
        ) : null}
        {/* Gradient overlay to improve text contrast */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-white/80 via-white/60 to-transparent dark:from-slate-950/80 dark:via-slate-950/60"></div>

        <div className="p-6 md:p-10">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {view?.title || "Untitled"}
            </h1>

            {view?.category?.name ? (
              <span className="rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1 text-xs font-medium">
                {view.category.name}
              </span>
            ) : null}

            <div className="ms-auto">
              <Link
                to="/products"
                className="inline-block rounded-full px-4 py-2 text-sm bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                Return to Products
              </Link>
            </div>
          </div>

          {/* Card body */}
          <div className="grid gap-8 md:grid-cols-[360px,1fr]">
            {/* Image box */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4 backdrop-blur-sm">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={view?.title || "product image"}
                  className="mx-auto aspect-square w-full max-w-[320px] rounded-xl object-cover"
                />
              ) : (
                <div className="aspect-square w-full max-w-[320px] rounded-xl bg-slate-100 dark:bg-slate-800 grid place-items-center text-slate-500">
                  no image
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-4">
              {/* Price */}
              {typeof view?.price === "number" ? (
                <div className="text-xl md:text-2xl font-semibold">
                  ${Number(view.price).toFixed(2)}
                </div>
              ) : null}

              {/* Description */}
              {view?.description ? (
                <p className="leading-7 text-slate-700 dark:text-slate-300">
                  {view.description}
                </p>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">
                  no available description
                </p>
              )}

              {imageList.length > 1 && (
                <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {imageList.map((src, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setThumbIndex(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden border ${
                        thumbIndex === idx
                          ? "border-violet-500 ring-2 ring-violet-300"
                          : "border-slate-200 dark:border-slate-800"
                      } focus:outline-none`}
                    >
                      <img
                        src={src}
                        alt={`thumbnail ${idx + 1}`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
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
