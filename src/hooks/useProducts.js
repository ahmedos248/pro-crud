
import { useState, useEffect } from "react";


const loadLocalList = () => {
  try {
    return JSON.parse(localStorage.getItem("nb_local_products") || "[]")
      .map(x => ({ ...x, __local: true }));
  } catch { return []; }
};
export function useProducts() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    "https://api.escuelajs.co/api/v1/products?offset=0&limit=100"
                );
                const data = await res.json();

                const validProducts = [];
                for (const item of data) {
                    const url = item.images?.[0];
                    if (!url || !url.startsWith("http")) continue;

                    const isValid = await new Promise((resolve) => {
                        const img = new Image();
                        img.src = url;
                        img.onload = () => resolve(true);
                        img.onerror = () => resolve(false);
                    });

                    if (isValid && item.title?.trim()) {
                        validProducts.push({
                            id: item.id,
                            img: url,
                            alt: item.title,
                            price: item.price,
                        });
                    }
                }

                let localProducts = [];
                // will hold items stored in json-server
                try {
                    const localRes = await fetch("http://localhost:5001/products");
                    // call the local dev API to read persisted items
                    if (localRes.ok) {
                        const localData = await localRes.json();
                        // parse JSON array from json-server
                        localProducts = Array.isArray(localData)
                            ? localData
                                .filter(p => p && p.img)
                                // ensure each local item has an image (matches your Card shape)
                                .map(p => ({
                                    id: p.id,
                                    // id generated in AddProductForm
                                    img: p.img,
                                    // base64 image stored in db.json
                                    alt: p.alt || "No Image",
                                    // fallback alt
                                    category: p.category || "N/A",
                                    // optional category
                                    price: p.price
                                    // optional price if you add it later
                                }))
                            : [];
                    }
                } catch (e) {
                    console.warn("Local API not reachable; continuing with remote only.", e);
                    // if json-server is down, just skip local without breaking the page
                }

                const merged = [...localProducts, ...validProducts];
                // show local items first (newly created) then remote catalog
                setCards(merged);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { cards, setCards, loading };
}
