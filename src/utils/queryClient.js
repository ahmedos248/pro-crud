import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            gcTime: Infinity,
        },
    },
});

// Define a localStorage persister manually
const localStoragePersister = {
    persistClient: (client) => {
        localStorage.setItem("reactQuery", JSON.stringify(client));
    },
    restoreClient: () => {
        const cache = localStorage.getItem("reactQuery");
        return cache ? JSON.parse(cache) : undefined;
    },
    removeClient: () => {
        localStorage.removeItem("reactQuery");
    },
};

persistQueryClient({
    queryClient,
    persister: localStoragePersister,
});

export default queryClient;
