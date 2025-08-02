import { useQuery } from "@tanstack/react-query";
import type { Restaurant } from "@shared/schema";

export function useRestaurants() {
  return useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants"],
  });
}

export function useRestaurant(id: string) {
  return useQuery<Restaurant>({
    queryKey: ["/api/restaurants", id],
    enabled: !!id,
  });
}
