import { useQuery } from "@tanstack/react-query";
import { Trophy, Star } from "lucide-react";

interface Stats {
  totalRestaurants: number;
  visitedCount: number;
  wishlistCount: number;
  totalCheckIns: number;
  averageRating: number;
  topCuisines: { cuisine: string; count: number }[];
}

export default function StatsView() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // No fake data - only show real stats

  return (
    <div className="p-4">
      <h2 className="font-bold text-2xl mb-6" style={{ fontFamily: 'Poppins' }}>
        My Statistics
      </h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--pin-red))] text-white rounded-xl p-4">
          <div className="text-3xl font-bold">{stats?.totalRestaurants || 0}</div>
          <div className="text-sm opacity-90">Total Restaurants</div>
          <div className="mt-2 text-xs opacity-75">Added to lists</div>
        </div>
        <div className="bg-gradient-to-br from-[hsl(var(--secondary))] to-green-400 text-white rounded-xl p-4">
          <div className="text-3xl font-bold">{stats?.visitedCount || 0}</div>
          <div className="text-sm opacity-90">Visited Restaurants</div>
          <div className="mt-2 text-xs opacity-75">Places you've been</div>
        </div>
      </div>

      {/* Lists Overview */}
      {stats?.totalRestaurants && stats.totalRestaurants > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-semibold text-lg mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[hsl(var(--primary))]">{stats.wishlistCount || 0}</div>
              <div className="text-sm text-gray-600">On Wishlist</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[hsl(var(--secondary))]">{stats.totalCheckIns || 0}</div>
              <div className="text-sm text-gray-600">Total Check-ins</div>
            </div>
          </div>
        </div>
      )}

      {/* Cuisine Breakdown */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-semibold text-lg mb-4">Favorite Cuisines</h3>
        <div className="space-y-3">
          {stats?.topCuisines?.map((cuisine, index) => (
            <div key={cuisine.cuisine} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  index === 0 ? 'bg-[hsl(var(--primary))]/10' :
                  index === 1 ? 'bg-[hsl(var(--secondary))]/10' :
                  'bg-[hsl(var(--accent))]/10'
                }`}>
                  <span className={`font-medium text-sm ${
                    index === 0 ? 'text-[hsl(var(--primary))]' :
                    index === 1 ? 'text-[hsl(var(--secondary))]' :
                    'text-orange-600'
                  }`}>
                    {index === 0 ? '🍝' : index === 1 ? '🍣' : '🌮'}
                  </span>
                </div>
                <span className="text-sm font-medium">{cuisine.cuisine}</span>
              </div>
              <span className="text-sm text-gray-600">{cuisine.count} restaurants</span>
            </div>
          )) || (
            <div className="text-center py-4 text-gray-500">
              No cuisine data yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-4">Recent Achievements</h3>
        <div className="space-y-3">
          {stats?.totalRestaurants && stats.totalRestaurants >= 10 && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--accent))] to-orange-400 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Foodie Explorer</h4>
                <p className="text-xs text-gray-600">Added 10+ restaurants</p>
              </div>
            </div>
          )}
          
          {stats?.totalCheckIns && stats.totalCheckIns >= 5 && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--secondary))] to-green-400 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Regular Visitor</h4>
                <p className="text-xs text-gray-600">5+ check-ins recorded</p>
              </div>
            </div>
          )}

          {(!stats || (stats.totalRestaurants === 0 && stats.totalCheckIns === 0)) && (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Start adding restaurants to earn achievements!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
