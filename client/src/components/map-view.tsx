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
    <section className="h-full flex flex-col">
      {/* Quick Stats Banner */}
      <div className="bg-white/95 backdrop-blur-md m-4 p-6 rounded-2xl shadow-lg border-0">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] bg-clip-text text-transparent">
              {stats?.totalRestaurants || 0}
            </div>
            <div className="text-sm text-gray-600 font-medium">Total Pins</div>
          </div>
          <div>
            <div className="text-3xl font-bold bg-gradient-to-br from-[#ff8e8e] to-[#ffa366] bg-clip-text text-transparent">
              {stats?.visitedCount || 0}
            </div>
            <div className="text-sm text-gray-600 font-medium">Visited</div>
          </div>
          <div>
            <div className="text-3xl font-bold bg-gradient-to-br from-[#ffa366] to-[#ff6b6b] bg-clip-text text-transparent">
              {stats?.wishlistCount || 0}
            </div>
            <div className="text-sm text-gray-600 font-medium">Wishlist</div>
          </div>
        </div>
      </div>

      {/* Interactive Map Container - Full Height */}
      <div className="flex-1 mx-4 mb-4 rounded-2xl overflow-hidden shadow-xl border-0">
        <div className="h-full w-full">
          {restaurants && restaurants.length > 0 ? (
            <div className="h-full w-full bg-gradient-to-br from-orange-100 via-red-50 to-pink-100 p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <span className="text-2xl">🗺️</span>
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">Restaurant Locations</h3>
                <p className="text-sm text-gray-600">Your food journey mapped out</p>
              </div>
              
              {/* Restaurant Pins Grid */}
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {restaurants.map((restaurant: any) => (
                  <div 
                    key={restaurant.id}
                    className="bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-lg border-0 flex items-center space-x-3 hover:bg-white/95 transition-all duration-200"
                  >
                    <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg transform rotate-45 ${
                      restaurant.isVisited ? 'bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e]' : 'bg-gradient-to-br from-[#ffa366] to-[#ff6b6b]'
                    }`}>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45 w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{restaurant.name}</p>
                      <p className="text-xs text-gray-600 font-medium">{restaurant.cuisine}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-orange-100 via-red-50 to-pink-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-3xl">🗺️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No restaurants yet</h3>
                <p className="text-gray-600 mb-4">Add your first restaurant to see it on the map</p>
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                  <span className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-gray-700">Use the + button to start exploring</span>
                </div>
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
