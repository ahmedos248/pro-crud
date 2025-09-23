import { useParams, Link } from "react-router-dom";
import { useMemo,useState,useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

export default function Item({ darkMode }) {
  const { id } = useParams();
  const {
    data: item,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", String(id)],
      // KEY for every product
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data;
    },

    staleTime: 1000 * 60 ,
    // keep data fresh for 1 minute
    gcTime: 1000 * 60 * 30,
    // keep data in cache for 30 minutes
    retry: 1,
    // only one retry on failure
  });
  // state from React Query: isLoading / isError / data

  const imageList = useMemo(() => {
    const raw = Array.isArray(item?.images) ? item.images : [];
    // normalize: ensure we have an array; otherwise fallback to empty

    return raw.map(String).filter(Boolean);
    // stringify and filter out falsy entries (null/undefined/"")
  }, [item]);
  // recompute only when `item` changes

  const [thumbIndex, setThumbIndex] = useState(0);
  // index of the currently selected thumbnail

  useEffect(() => {
    setThumbIndex(0);
    // reset selection whenever the route param (id) changes
  }, [id]);
  // id comes from useParams

  const primaryImage = useMemo(() => {
    const fallback = item?.thumbnail || item?.image || "";
    // fallback image if the list is empty or invalid

    return imageList[thumbIndex] || fallback || "";
    // main image = selected thumbnail, else fallback, else empty string
  }, [imageList, thumbIndex, item]);
  // updates when list or selection changes

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
  // Loading UI: skeleton that matches the final card layout

  if (isError) {
    // Error UI: show message and back button
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <p className="mb-4 text-red-600 dark:text-red-400 font-medium">
       
       error while loading data: {String(error?.message || error)}
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
  // Error UI: straightforward and clear

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      {/* Outer feature card: border + shadow + background */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Subtle background image */}
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={item?.title || "item"}
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-15"
          />
        ) : null}
        {/* The background is faint (opacity-15) to set mood without distraction */}

        {/* Gradient overlay to improve text contrast */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-white/80 via-white/60 to-transparent dark:from-slate-950/80 dark:via-slate-950/60"></div>

        <div className="p-6 md:p-10">
          {/* Header */}
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

          {/* Card body */}
          <div className="grid gap-8 md:grid-cols-[360px,1fr]">
            {/* Image box */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4 backdrop-blur-sm">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={item?.title || "product image"}
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
              {typeof item?.price === "number" ? (
                <div className="text-xl md:text-2xl font-semibold">
                  ${item.price.toFixed(2)}
                </div>
              ) : null}

              {/* Description */}
              {item?.description ? (
                <p className="leading-7 text-slate-700 dark:text-slate-300">
                  {item.description}
                </p>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">
             no available description
                </p>
              )}

              {imageList.length > 1 && (
                // Render thumbnails grid only when there are multiple images
                <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">

                  {imageList.map((src, idx) => (
                    // One button per thumbnail
                    <button
                      key={idx}
                      // Unique key per thumbnail

                      type="button"
                      // Avoid implicit submit inside potential forms

                      onClick={() => setThumbIndex(idx)}
                      // Select this thumbnail as the main image

                      className={`relative aspect-square rounded-lg overflow-hidden border ${
                        thumbIndex === idx
                          ? 'border-violet-500 ring-2 ring-violet-300'
                          : 'border-slate-200 dark:border-slate-800'
                      } focus:outline-none`}
                      // Highlight the selected one; keep others neutral
                    >
                      <img
                        src={src}
                        // Thumbnail source

                        alt={`thumbnail ${idx + 1}`}
                        // Accessible alt text

                        loading="lazy"
                        // Defer loading of offscreen thumbnails for performance

                        className="h-full w-full object-cover"
                        // Fill the square and crop overflow for consistent tiles
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* end of card */}
    </div>
  );
}
