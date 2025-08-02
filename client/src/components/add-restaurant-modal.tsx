import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLists } from "../hooks/use-lists";

interface AddRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddRestaurantModal({ isOpen, onClose }: AddRestaurantModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    priceRange: "",
    address: "",
    rating: 0,
    notes: "",
    selectedListId: "",
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: lists } = useLists();

  const createRestaurantMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/restaurants", {
        name: data.name,
        cuisine: data.cuisine,
        priceRange: data.priceRange,
        address: data.address,
        rating: data.rating,
        notes: data.notes,
        latitude: "40.7128", // Mock coordinates - in real app would use geocoding
        longitude: "-74.0060",
      });
      return response.json();
    },
    onSuccess: async (restaurant) => {
      // If a list was selected, add restaurant to that list
      if (formData.selectedListId) {
        try {
          await apiRequest("POST", `/api/lists/${formData.selectedListId}/restaurants`, {
            restaurantId: restaurant.id,
          });
        } catch (error) {
          console.error("Failed to add restaurant to list:", error);
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      toast({
        title: "Success",
        description: "Restaurant added successfully",
      });
      
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add restaurant",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setFormData({
      name: "",
      cuisine: "",
      priceRange: "",
      address: "",
      rating: 0,
      notes: "",
      selectedListId: "",
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.cuisine || !formData.priceRange) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    createRestaurantMutation.mutate(formData);
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto slide-up">
        <DialogHeader>
          <DialogTitle className="font-bold text-xl" style={{ fontFamily: 'Poppins' }}>
            Add Restaurant
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter restaurant name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine Type *
            </label>
            <Select value={formData.cuisine} onValueChange={(value) => setFormData(prev => ({ ...prev, cuisine: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select cuisine type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
                <SelectItem value="Mexican">Mexican</SelectItem>
                <SelectItem value="American">American</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="Indian">Indian</SelectItem>
                <SelectItem value="Thai">Thai</SelectItem>
                <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range *
            </label>
            <Select value={formData.priceRange} onValueChange={(value) => setFormData(prev => ({ ...prev, priceRange: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="$">$ - Budget friendly</SelectItem>
                <SelectItem value="$$">$$ - Moderate</SelectItem>
                <SelectItem value="$$$">$$$ - Expensive</SelectItem>
                <SelectItem value="$$$$">$$$$ - Very expensive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter address"
            />
          </div>
          
          {lists && lists.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add to List
              </label>
              <Select value={formData.selectedListId} onValueChange={(value) => setFormData(prev => ({ ...prev, selectedListId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a list (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {lists.map((list: any) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex text-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className={`transition-colors ${
                      star <= formData.rating 
                        ? 'text-[hsl(var(--accent))]' 
                        : 'text-gray-300 hover:text-[hsl(var(--accent))]'
                    }`}
                  >
                    <i className="fas fa-star"></i>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              placeholder="Add your thoughts..."
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={createRestaurantMutation.isPending}
            className="w-full bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))]/90"
          >
            {createRestaurantMutation.isPending ? "Saving..." : "Save Restaurant"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
