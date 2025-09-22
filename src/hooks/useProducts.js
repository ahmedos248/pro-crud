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

                // Map products directly (no pre-validation)
                const products = data
                    .filter((item) => item.title?.trim() && item.images?.[0])
                    .map((item) => ({
                        id: item.id,
                        img: item.images[0],
                        alt: item.title,
                        price: item.price,
                    }));

                setCards(products);
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
