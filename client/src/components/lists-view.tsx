import { useState } from "react";
import { Plus, ChevronRight, Heart, Clock, Utensils, Coffee } from "lucide-react";
import { useLists } from "../hooks/use-lists";
import { useRestaurants } from "../hooks/use-restaurants";
import { Button } from "@/components/ui/button";
import { CreateListDialog } from "./create-list-dialog";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const iconMap = {
  heart: Heart,
  clock: Clock,
  utensils: Utensils,
  coffee: Coffee,
};

export default function ListsView() {
  const { data: lists, isLoading } = useLists();
  const { data: restaurants } = useRestaurants();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-10 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const featuredLists = lists?.slice(0, 4) || [];
  const allLists = lists || [];

  // Get restaurant counts from API data
  const { data: allListRestaurants } = useQuery({
    queryKey: ["/api/list-restaurants"],
    queryFn: async () => {
      const response = await fetch("/api/list-restaurants");
      if (!response.ok) return [];
      return response.json();
    },
  });

  const getListStats = (listId: string) => {
    // Count restaurants in this specific list
    const listRestaurants = allListRestaurants?.filter((lr: any) => lr.listId === listId) || [];
    const restaurantCount = listRestaurants.length;
    
    // Count visited restaurants in this list
    const visitedCount = listRestaurants.filter((lr: any) => {
      const restaurant = restaurants?.find((r: any) => r.id === lr.restaurantId);
      return restaurant?.isVisited;
    }).length;
    
    return { restaurantCount, visitedCount };
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header - Only show when there are lists */}
      {allLists.length > 0 && (
        <div className="px-4 pt-4 pb-2">
          <h2 className="font-bold text-2xl text-gray-800 tracking-tight">
            My Lists
          </h2>
        </div>
      )}

      <div className="flex-1 px-4 pb-4">
        {/* Use shared dialog component */}
        <CreateListDialog 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
        />

        {/* Featured Lists - Only show when there are lists */}
        {allLists.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {featuredLists.map((list: any, index: number) => {
          const stats = getListStats(list.id);
          const IconComponent = iconMap[list.icon as keyof typeof iconMap] || Utensils;
          
          return (
            <button 
              key={list.id} 
              onClick={() => window.location.pathname = `/lists/${list.id}`}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer text-left w-full"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  index === 0 ? 'bg-[hsl(var(--primary))]/10' :
                  index === 1 ? 'bg-[hsl(var(--secondary))]/10' :
                  index === 2 ? 'bg-[hsl(var(--accent))]/10' :
                  'bg-gray-100'
                }`}>
                  <IconComponent className={`w-5 h-5 ${
                    index === 0 ? 'text-[hsl(var(--primary))]' :
                    index === 1 ? 'text-[hsl(var(--secondary))]' :
                    index === 2 ? 'text-[hsl(var(--accent))]' :
                    'text-gray-600'
                  }`} />
                </div>
                <span className="text-xs text-gray-500">{stats.restaurantCount} restaurants</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{list.name}</h3>
              <p className="text-xs text-gray-600">{list.description}</p>
            </button>
          );
            })}
          </div>
        )}

        {/* All Lists Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-800">
              {allLists.length === 0 ? "No Lists Yet" : "All Lists"}
            </h3>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] text-white hover:from-[#ff5252] hover:to-[#ff7979] px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create List</span>
            </Button>
          </div>

          {allLists.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Create Your First List</h3>
              <p className="text-gray-600 mb-6">Organize your favorite restaurants into custom lists</p>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] text-white hover:from-[#ff5252] hover:to-[#ff7979]"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First List
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {allLists.map((list: any) => {
                const stats = getListStats(list.id);
                const IconComponent = iconMap[list.icon as keyof typeof iconMap] || Utensils;
                
                return (
                  <button 
                    key={list.id} 
                    onClick={() => window.location.pathname = `/lists/${list.id}`}
                    className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{list.name}</h4>
                          <p className="text-sm text-gray-600">{stats.restaurantCount} restaurants</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}