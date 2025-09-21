import { useState, useEffect } from "react";

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

                // Create validation promises for all items
                const validationPromises = data.map(async (item) => {
                    const url = item.images?.[0];
                    if (!url || !url.startsWith("http") || !item.title?.trim()) return null;

                    const isValid = await new Promise((resolve) => {
                        const img = new Image();
                        img.src = url;
                        img.onload = () => resolve(true);
                        img.onerror = () => resolve(false);
                    });

                    return isValid
                        ? { id: item.id, img: url, alt: item.title, price: item.price }
                        : null;
                });

                // Wait for all validations to finish
                const validProducts = (await Promise.all(validationPromises)).filter(Boolean);

                setCards(validProducts);
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
