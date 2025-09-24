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
}
