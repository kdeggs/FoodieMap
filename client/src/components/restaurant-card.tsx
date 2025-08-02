import { useState } from "react";
import { Bookmark, MapPin, Check } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Restaurant } from "@shared/schema";

interface RestaurantCardProps {
  restaurant: Restaurant;
  compact?: boolean;
}

export default function RestaurantCard({ restaurant, compact = false }: RestaurantCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const checkInMutation = useMutation({
    mutationFn: async (data: { restaurantId: string; rating?: number; notes?: string }) => {
      const response = await apiRequest("POST", "/api/checkins", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Check-in recorded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record check-in",
        variant: "destructive",
      });
    },
  });

  const handleCheckIn = () => {
    checkInMutation.mutate({
      restaurantId: restaurant.id,
      rating: restaurant.rating || undefined,
      notes: `Checked in at ${restaurant.name}`,
    });
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, this would call an API to add/remove from a list
  };

  if (compact) {
    return (
      <div className="p-3 max-w-xs">
        <h4 className="font-semibold text-gray-900 mb-1">{restaurant.name}</h4>
        <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine} • {restaurant.priceRange}</p>
        
        {restaurant.rating && restaurant.rating > 0 && (
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex text-[hsl(var(--accent))] text-sm">
              {[...Array(5)].map((_, i) => (
                <i 
                  key={i} 
                  className={`fas fa-star ${i < restaurant.rating! ? '' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">{restaurant.rating}/5</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className={`w-2 h-2 rounded-full ${restaurant.isVisited ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            <span className="text-xs text-gray-600">{restaurant.isVisited ? 'Visited' : 'Not visited'}</span>
          </div>
          
          {!restaurant.isVisited && (
            <button
              onClick={handleCheckIn}
              disabled={checkInMutation.isPending}
              className="px-2 py-1 bg-[hsl(var(--primary))] text-white text-xs rounded-md hover:bg-[hsl(var(--primary))]/90 transition-colors"
            >
              Check In
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex space-x-3">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
          <i className="fas fa-utensils text-gray-600"></i>
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">{restaurant.name}</h4>
              <p className="text-sm text-gray-600">{restaurant.cuisine} • {restaurant.priceRange}</p>
              {restaurant.address && (
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {restaurant.address}
                </p>
              )}
            </div>
            <button 
              onClick={handleBookmarkToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'text-[hsl(var(--primary))] fill-current' : 'text-gray-400'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              {restaurant.rating && restaurant.rating > 0 && (
                <>
                  <div className="flex text-[hsl(var(--accent))] text-sm">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`fas fa-star ${i < restaurant.rating! ? '' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{restaurant.rating}/5</span>
                  {restaurant.checkInCount && restaurant.checkInCount > 0 && (
                    <span className="text-xs text-gray-500">({restaurant.checkInCount} visits)</span>
                  )}
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <span className={`w-2 h-2 rounded-full ${restaurant.isVisited ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span className="text-xs text-gray-600">{restaurant.isVisited ? 'Visited' : 'Want to try'}</span>
              </div>
              
              {!restaurant.isVisited && (
                <button
                  onClick={handleCheckIn}
                  disabled={checkInMutation.isPending}
                  className="px-3 py-1 bg-[hsl(var(--primary))] text-white text-xs rounded-md hover:bg-[hsl(var(--primary))]/90 transition-colors flex items-center space-x-1"
                >
                  <Check className="w-3 h-3" />
                  <span>{checkInMutation.isPending ? "..." : "Check In"}</span>
                </button>
              )}
            </div>
          </div>

          {restaurant.notes && (
            <p className="text-xs text-gray-600 mt-2 italic">"{restaurant.notes}"</p>
          )}
        </div>
      </div>
    </div>
  );
}
