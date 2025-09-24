import { useParams, Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

const LOCAL_STORAGE_KEY = "addedProducts";

export default function Item({ darkMode }) {
  const { id } = useParams();

  const { data: item, isLoading, isError, error } = useQuery({
    queryKey: ["product", String(id)],
    queryFn: async () => {
      try {
        const res = await api.get(`/products/${id}`);
        return res.data;
      } catch {
        const localProducts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        const localProduct = localProducts.find((p) => String(p.id) === id);
        if (localProduct) return localProduct;
        throw new Error("Product not found");
      }
    },
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 30,
    retry: 1,
  });

  const title = item?.title || item?.alt || "Untitled";
  const categoryName = item?.category?.name || item?.category || "Uncategorized";

  const imageList = useMemo(() => {
    const raw = Array.isArray(item?.images) ? item.images : [];
    return raw.map(String).filter(Boolean);
  }, [item]);

  const [thumbIndex, setThumbIndex] = useState(0);

  useEffect(() => {
    setThumbIndex(0);
  }, [id]);

  const primaryImage = useMemo(() => {
    const fallback = item?.thumbnail || item?.image || item?.img || "";
    return imageList[thumbIndex] || fallback || "";
  }, [imageList, thumbIndex, item]);

  if (isLoading) return <div className="text-center py-20">Loading product...</div>;

  if (isError)
    return (
      <div className="text-center p-6">
        <p className="text-red-600 dark:text-red-400">
          Error while loading data: {String(error?.message || error)}
        </p>
        <Link to="/products" className="mt-4 inline-block bg-slate-700 text-white px-4 py-2 rounded">
          Return to Products
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
        {primaryImage && (
          <img
            src={primaryImage}
            alt={title}
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-15"
          />
        )}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-white/80 via-white/60 to-transparent dark:from-slate-950/80 dark:via-slate-950/60"></div>

        <div className="p-6 md:p-10">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>

            {categoryName && (
              <span className="rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1 text-xs font-medium">
                {categoryName}
              </span>
            )}

            <div className="ms-auto">
              <Link
                to="/products"
                className="inline-block rounded-full px-4 py-2 text-sm bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                Return to Products
              </Link>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-[360px,1fr]">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4 backdrop-blur-sm">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={title}
                  className="mx-auto aspect-square w-full max-w-[320px] rounded-xl object-cover"
                />
              ) : (
                <div className="aspect-square w-full max-w-[320px] rounded-xl bg-slate-100 dark:bg-slate-800 grid place-items-center text-slate-500">
                  no image
                </div>
              )}
            </div>

            <div className="space-y-4">
              {typeof item?.price === "number" && (
                <div className="text-xl md:text-2xl font-semibold">${item.price.toFixed(2)}</div>
              )}

              {item?.description ? (
                <p className="leading-7 text-slate-700 dark:text-slate-300">{item.description}</p>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">no available description</p>
              )}

              {imageList.length > 1 && (
                <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {imageList.map((src, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setThumbIndex(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden border ${thumbIndex === idx ? "border-violet-500 ring-2 ring-violet-300" : "border-slate-200 dark:border-slate-800"
                        } focus:outline-none`}
                    >
                      <img src={src} alt={`thumbnail ${idx + 1}`} loading="lazy" className="h-full w-full object-cover" />
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
