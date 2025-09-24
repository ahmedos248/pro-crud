<<<<<<< HEAD
import { useState, useEffect } from "react";
import { readLocalItems, mergeLocalFirst } from "../lib/localItems";

export function useProducts() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://api.escuelajs.co/api/v1/products?offset=0&limit=100");
        const data = await res.json();

        const validProducts = [];
        for (const item of data) {
          const url = item.images?.[0];
          if (!url || !url.startsWith("http")) continue;
          const ok = await new Promise((r)=>{ const img=new Image(); img.src=url; img.onload=()=>r(true); img.onerror=()=>r(false); });
          if (ok && item.title?.trim()) validProducts.push({ id:item.id, img:url, alt:item.title, price:item.price });
        }

        const locals = readLocalItems().map(li => ({
          id: li.id,
          img: li.img || li.image || (Array.isArray(li.images) ? li.images[0] : ""),
          alt: li.title || li.alt || (typeof li.category==="string" ? li.category : "Local Item"),
          price: Number(li.price || 0),
        }));

    const merged = mergeLocalFirst(validProducts, locals);
// Local items first (stable), then API items. Newest local first.
merged.sort((a, b) => {
  const aLocal = String(a?.id || "").startsWith("local-") ? 1 : 0;
  const bLocal = String(b?.id || "").startsWith("local-") ? 1 : 0;
  if (bLocal !== aLocal) return bLocal - aLocal;
  const aTime = Date.parse(a?.createdAt || a?.__createdAt || 0) || 0;
  const bTime = Date.parse(b?.createdAt || b?.__createdAt || 0) || 0;
  return bTime - aTime;
});
setCards(merged);

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return { cards, setCards, loading };
=======
// hooks/useProducts.js
import { useQuery, useQueryClient } from "@tanstack/react-query";

const LOCAL_STORAGE_KEY = "addedProducts";

// Helpers to handle localStorage
export function getLocalProducts() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
}

export function saveLocalProducts(products) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
}

export function useProducts() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            // Fetch API products
            const res = await fetch(
                "https://api.escuelajs.co/api/v1/products?offset=0&limit=40"
            );
            const data = await res.json();

            const apiProducts = data
                .filter((item) => item.title?.trim() && item.images?.[0])
                .map((item) => ({
                    id: item.id,
                    img: item.images[0],
                    alt: item.title,
                    price: item.price,
                }));

            // Get local added products
            const localProducts = getLocalProducts();

            // Show local products first so they appear on top
            return [...localProducts, ...apiProducts];
        },
        staleTime: Infinity,
        cacheTime: Infinity,
    });

    // Add a product
    const addProduct = (product) => {
        const localProducts = getLocalProducts();
        const updatedLocal = [product, ...localProducts];
        saveLocalProducts(updatedLocal);

        queryClient.setQueryData(["products"], (old = []) => [product, ...old]);
    };

    // Delete a product
    const deleteProduct = (id) => {
        const localProducts = getLocalProducts();
        saveLocalProducts(localProducts.filter((p) => p.id !== id));

        queryClient.setQueryData(["products"], (old = []) => old.filter((p) => p.id !== id));
    };

    return { ...query, addProduct, deleteProduct };
>>>>>>> 9fd065e9f786735e7290f992aef420071a825d71
}
