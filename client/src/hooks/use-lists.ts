import { useQuery } from "@tanstack/react-query";
import type { RestaurantList, Restaurant } from "@shared/schema";

export function useLists() {
  return useQuery<RestaurantList[]>({
    queryKey: ["/api/lists"],
  });
}

export function useList(id: string) {
  return useQuery<RestaurantList>({
    queryKey: ["/api/lists", id],
    enabled: !!id,
  });
}

export function useListRestaurants(listId: string) {
  return useQuery<Restaurant[]>({
    queryKey: ["/api/lists", listId, "restaurants"],
    enabled: !!listId,
  });
}
