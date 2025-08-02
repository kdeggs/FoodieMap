import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { useRestaurants } from "../hooks/use-restaurants";
import RestaurantCard from "./restaurant-card";

interface Stats {
  totalRestaurants: number;
  visitedCount: number;
  wishlistCount: number;
  totalCheckIns: number;
  averageRating: number;
  topCuisines: { cuisine: string; count: number }[];
}

export default function MapView() {
  const { data: restaurants, isLoading } = useRestaurants();
  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  // Mock recent activity restaurants for display
  const recentActivity = restaurants?.slice(0, 2) || [];
  const nearbyRestaurants = restaurants?.slice(2, 4) || [];

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="bg-white m-4 p-4 rounded-xl shadow-sm border border-gray-100 animate-pulse">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="mx-4 h-96 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <section className="relative">
      {/* Quick Stats Banner */}
      <div className="bg-white m-4 p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[hsl(var(--primary))]">
              {stats?.totalRestaurants || 0}
            </div>
            <div className="text-xs text-gray-600 font-medium">Total Pins</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[hsl(var(--secondary))]">
              {stats?.visitedCount || 0}
            </div>
            <div className="text-xs text-gray-600 font-medium">Visited</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[hsl(var(--accent))]">
              {stats?.wishlistCount || 0}
            </div>
            <div className="text-xs text-gray-600 font-medium">Wishlist</div>
          </div>
        </div>
      </div>

      {/* Interactive Map Container - Placeholder */}
      <div className="mx-4 rounded-xl overflow-hidden shadow-lg border border-gray-200">
        <div className="h-96 w-full">
          {restaurants && restaurants.length > 0 ? (
            <div className="h-full w-full bg-gradient-to-br from-blue-50 to-green-50 p-6">
              <div className="text-center mb-6">
                <MapPin className="w-12 h-12 text-[hsl(var(--primary))] mx-auto mb-2" />
                <h3 className="font-semibold text-lg text-gray-800">Restaurant Locations</h3>
                <p className="text-sm text-gray-600">Interactive map coming soon</p>
              </div>
              
              {/* Restaurant Pins Grid */}
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {restaurants.map((restaurant: any) => (
                  <div 
                    key={restaurant.id}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex items-center space-x-2"
                  >
                    <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md transform rotate-45 ${
                      restaurant.isVisited ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--secondary))]'
                    }`}>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45 w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{restaurant.name}</p>
                      <p className="text-xs text-gray-500">{restaurant.cuisine}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No restaurants yet</p>
                <p className="text-sm text-gray-500">Add your first restaurant to see it on the map</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="m-4">
          <h3 className="font-semibold text-lg mb-3" style={{ fontFamily: 'Poppins' }}>
            Recent Activity
          </h3>
          
          <div className="space-y-3">
            {recentActivity.map((restaurant: any) => (
              <div key={restaurant.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                    <i className="fas fa-utensils text-gray-600"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{restaurant.name}</h4>
                    <p className="text-sm text-gray-600">
                      {restaurant.isVisited ? 'Visited' : 'Added to list'} • {restaurant.cuisine}
                    </p>
                    {restaurant.rating > 0 && (
                      <div className="flex items-center mt-1">
                        <div className="flex text-[hsl(var(--accent))] text-xs">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`fas fa-star ${i < restaurant.rating ? '' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        {restaurant.notes && (
                          <span className="text-xs text-gray-500 ml-2">{restaurant.notes}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    restaurant.isVisited ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--secondary))]'
                  }`}>
                    <i className={`fas ${restaurant.isVisited ? 'fa-check' : 'fa-plus'} text-white text-xs`}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Restaurants */}
      {nearbyRestaurants.length > 0 && (
        <div className="m-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg" style={{ fontFamily: 'Poppins' }}>
              Your Restaurants
            </h3>
            <button className="text-[hsl(var(--primary))] text-sm font-medium">
              See All
            </button>
          </div>
          
          <div className="space-y-3">
            {nearbyRestaurants.map((restaurant: any) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
