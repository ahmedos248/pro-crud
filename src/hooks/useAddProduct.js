// hooks/useAddProduct.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getLocalProducts, saveLocalProducts } from "./useProducts"; // export them from useProducts

export function useAddProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newProduct) => newProduct,
        onSuccess: (newProduct) => {
            // update cache
            queryClient.setQueryData(["products"], (old = []) => {
                const updated = [newProduct, ...old];
                // save locally
                const localProducts = getLocalProducts();
                saveLocalProducts([newProduct, ...localProducts]);
                return updated;
            });
        },
    });
}
