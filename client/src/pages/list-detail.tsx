import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit, Trash2, Plus, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import RestaurantCard from "@/components/restaurant-card";

export default function ListDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch list details
  const { data: list, isLoading: listLoading } = useQuery({
    queryKey: ["/api/lists", id],
    queryFn: async () => {
      const response = await fetch(`/api/lists/${id}`);
      if (!response.ok) throw new Error("Failed to fetch list");
      return response.json();
    },
  });

  // Fetch restaurants in this list
  const { data: restaurants, isLoading: restaurantsLoading } = useQuery({
    queryKey: ["/api/lists", id, "restaurants"],
    queryFn: async () => {
      const response = await fetch(`/api/lists/${id}/restaurants`);
      if (!response.ok) throw new Error("Failed to fetch restaurants");
      return response.json();
    },
  });

  // Update list mutation
  const updateListMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const response = await apiRequest("PATCH", `/api/lists/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lists"] });
      queryClient.invalidateQueries({ queryKey: ["/api/lists", id] });
      setIsEditModalOpen(false);
      toast({
        title: "Success",
        description: "List updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update list",
        variant: "destructive",
      });
    },
  });

  // Delete list mutation
  const deleteListMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/lists/${id}`);
      if (!response.ok) throw new Error("Failed to delete list");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lists"] });
      setLocation("/");
      toast({
        title: "Success",
        description: "List deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete list",
        variant: "destructive",
      });
    },
  });

  // Remove restaurant from list mutation
  const removeRestaurantMutation = useMutation({
    mutationFn: async (restaurantId: string) => {
      const response = await apiRequest("DELETE", `/api/lists/${id}/restaurants/${restaurantId}`);
      if (!response.ok) throw new Error("Failed to remove restaurant");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lists", id, "restaurants"] });
      toast({
        title: "Success",
        description: "Restaurant removed from list",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove restaurant",
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    if (list) {
      setEditName(list.name);
      setEditDescription(list.description || "");
      setIsEditModalOpen(true);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    
    updateListMutation.mutate({
      name: editName.trim(),
      description: editDescription.trim(),
    });
  };

  const handleDelete = () => {
    deleteListMutation.mutate();
  };

  if (listLoading || restaurantsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#ffecd6] via-[#f8ddd5] to-[#ffd6e0]">
        <div className="bg-white shadow-sm">
          <div className="p-4 flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="p-4">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffecd6] via-[#f8ddd5] to-[#ffd6e0]">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <h1 className="text-xl font-bold text-gray-800">List Details</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* List Info */}
      <div className="p-4 bg-white/80 backdrop-blur-sm mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{list?.name}</h2>
        {list?.description && (
          <p className="text-gray-600">{list.description}</p>
        )}
        <div className="mt-2 text-sm text-gray-500">
          {restaurants?.length || 0} restaurants
        </div>
      </div>

      {/* Restaurant List */}
      <div className="p-4">
        {restaurants?.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-3xl">🍽️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No restaurants yet</h3>
            <p className="text-gray-600 mb-6">Add restaurants to this list from the search or map view</p>
            <Link href="/">
              <Button className="bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] text-white hover:from-[#ff5252] hover:to-[#ff7979]">
                <Plus className="w-5 h-5 mr-2" />
                Browse Restaurants
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {restaurants?.map((restaurant: any) => (
              <div key={restaurant.id} className="relative">
                <RestaurantCard restaurant={restaurant} />
                <button
                  onClick={() => removeRestaurantMutation.mutate(restaurant.id)}
                  className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                  title="Remove from list"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit List</DialogTitle>
            <DialogDescription>
              Update your list details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium mb-2">
                List Name
              </label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g., Date Night Spots"
                required
              />
            </div>
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium mb-2">
                Description (optional)
              </label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="What's this list for?"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!editName.trim() || updateListMutation.isPending}
                className="bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] text-white hover:from-[#ff5252] hover:to-[#ff7979]"
              >
                {updateListMutation.isPending ? "Updating..." : "Update List"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete List</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{list?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              disabled={deleteListMutation.isPending}
              variant="destructive"
            >
              {deleteListMutation.isPending ? "Deleting..." : "Delete List"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}