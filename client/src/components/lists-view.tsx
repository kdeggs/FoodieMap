import { useState } from "react";
import { Plus, ChevronRight, Heart, Clock, Utensils, Coffee } from "lucide-react";
import { useLists } from "../hooks/use-lists";
import { useRestaurants } from "../hooks/use-restaurants";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createListMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const response = await apiRequest("POST", "/api/lists", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lists"] });
      setIsCreateModalOpen(false);
      setNewListName("");
      setNewListDescription("");
      toast({
        title: "Success",
        description: "List created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create list",
        variant: "destructive",
      });
    },
  });

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    
    createListMutation.mutate({
      name: newListName,
      description: newListDescription,
    });
  };

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

  // Calculate restaurant counts for each list
  const getListStats = (listId: string) => {
    // In a real app, this would come from the API
    const restaurantCount = Math.floor(Math.random() * 20) + 1;
    const visitedCount = Math.floor(restaurantCount * 0.6);
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
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New List</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">List Name</label>
                <Input
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Enter list name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (optional)</label>
                <Textarea
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="Describe your list"
                  rows={3}
                />
              </div>
              <Button 
                onClick={handleCreateList}
                disabled={!newListName.trim() || createListMutation.isPending}
                className="w-full bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90"
              >
                {createListMutation.isPending ? "Creating..." : "Create List"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Featured Lists - Only show when there are lists */}
        {allLists.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {featuredLists.map((list: any, index: number) => {
          const stats = getListStats(list.id);
          const IconComponent = iconMap[list.icon as keyof typeof iconMap] || Utensils;
          
          return (
            <div key={list.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
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
                <span className="text-xs text-gray-500">{stats.restaurantCount} places</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{list.name}</h3>
              <p className="text-xs text-gray-600">{list.description}</p>
            </div>
            );
          })}
        </div>
        )}

        {/* All Lists - Only show when there are multiple lists */}
        {allLists.length > 4 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-gray-800 tracking-tight">
              All Lists
            </h3>
            
            {allLists.map((list: any, index: number) => {
          const stats = getListStats(list.id);
          const IconComponent = iconMap[list.icon as keyof typeof iconMap] || Utensils;
          
          return (
            <div key={list.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center ${
                  index % 3 === 0 ? 'from-[hsl(var(--primary))] to-[hsl(var(--pin-red))]' :
                  index % 3 === 1 ? 'from-[hsl(var(--secondary))] to-green-400' :
                  'from-[hsl(var(--accent))] to-orange-400'
                }`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{list.name}</h4>
                  <p className="text-sm text-gray-600">{list.description}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500">{stats.restaurantCount} restaurants</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{stats.visitedCount} visited</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            );
          })}
        </div>
        )}

        {/* Empty State */}
        {allLists.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No lists yet</h3>
              <p className="text-gray-600 mb-6">Create your first list to organize your restaurants</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] text-white font-semibold px-8 py-3 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-[#ff5252] hover:to-[#ff7979]"
              >
                <Plus className="w-5 h-5 mr-2 inline" />
                Create Your First List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
