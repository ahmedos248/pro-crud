import { useParams, Link, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

export default function Item({ darkMode }) {
  const { id } = useParams();
  const navLocation = useLocation();

  // --- local storage helper ---
  const readLocal = (id) => {
    try {
      const one = localStorage.getItem(`nb_product_${id}`);
      if (one) return JSON.parse(one);
      const list = JSON.parse(localStorage.getItem("nb_local_products") || "[]");
      return list.find((x) => String(x.id) === String(id));
    } catch {
      return null;
    }
  };

  // --- priority: state -> local -> API ---
  const fromState = navLocation.state?.item;
  const localItem = !fromState ? readLocal(id) : null;

  const {
    data: fetchedItem,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.get(`/products/${id}`).then((r) => r.data),
    enabled: !fromState && !localItem,
    staleTime: 5 * 60 * 1000,
  });

  const item = fromState || localItem || fetchedItem || {};

  // derived fields
  const price =
    item.price != null
      ? Number(item.price)
      : item.cost != null
      ? Number(item.cost)
      : null;

  const description =
    item.description && String(item.description).trim().length
      ? item.description
      : "No description available for this product.";

  const images =
    Array.isArray(item.images) && item.images.length
      ? item.images
      : item.image
      ? [item.image]
      : [];

  // --- image thumbnails ---
  const imageList = useMemo(() => {
    const raw = Array.isArray(item?.images) ? item.images : [];
    return raw.map(String).filter(Boolean);
  }, [item]);

  const [thumbIndex, setThumbIndex] = useState(0);

  useEffect(() => {
    setThumbIndex(0);
  }, [id]);

  const primaryImage = useMemo(() => {
    const fallback = item?.thumbnail || item?.image || "";
    return imageList[thumbIndex] || fallback || "";
  }, [imageList, thumbIndex, item]);

  // --- guards ---
  if (isLoading) {
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

  if (isError) {
    const status = error?.response?.status;
    const msg =
      status === 400
        ? "Bad request: invalid product id."
        : String(error?.message || error);
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <p className="mb-4 text-red-600 dark:text-red-400 font-medium">
          error while loading data: {msg}
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

  // --- success ---
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={item?.title || "item"}
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-15"
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-white/80 via-white/60 to-transparent dark:from-slate-950/80 dark:via-slate-950/60"></div>

        <div className="p-6 md:p-10">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {item?.title || "Untitled"}
            </h1>
            {item?.category?.name ? (
              <span className="rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1 text-xs font-medium">
                {item.category.name}
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

          <div className="grid gap-8 md:grid-cols-[360px,1fr]">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4 backdrop-blur-sm">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={item?.title || "product image"}
                  className="mx-auto aspect-square w-full max-w-[320px] rounded-xl object-cover"
                />
              ) : (
                <div className="aspect-square w-full max-w-[320px] rounded-xl bg-slate-100 dark:bg-slate-800 grid place-items-center text-slate-500">
                  No image
                </div>
              )}
            </div>

            <div className="space-y-4">
              {typeof price === "number" ? (
                <div className="text-xl md:text-2xl font-semibold">
                  ${price.toFixed(2)}
                </div>
              ) : null}

              <p className="leading-7 text-slate-700 dark:text-slate-300">
                {description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item?.brand ? (
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                    <div className="text-xs text-slate-500">Brand</div>
                    <div className="font-medium">{item.brand}</div>
                  </div>
                ) : null}
              </div>

              {imageList.length > 1 && (
                <div className="mt-6 md:mt-8 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
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
