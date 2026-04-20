import { useQuery } from "@tanstack/react-query";
import { fetchEcommerceProducts, fetchProductById, Product } from "@/lib/api";

/**
 * Fetches all visible products from the backend.
 * Cached for 5 minutes — no hammer on the API.
 */
export function useProducts() {
    return useQuery<Product[], Error>({
        queryKey: ["ecommerce-products"],
        queryFn: fetchEcommerceProducts,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
    });
}

/**
 * Fetches a single product by id.
 */
export function useProduct(id: number | undefined) {
    return useQuery<Product | null, Error>({
        queryKey: ["ecommerce-product", id],
        queryFn: () => fetchProductById(id!),
        enabled: id !== undefined,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });
}
