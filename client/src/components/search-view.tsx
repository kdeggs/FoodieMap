import { useState } from "react";
import * as React from "react";
import { Search, MapPin, Star, Plus, Loader2, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface SearchResult {
  id: string;
  name: string;
  address?: string;
  rating?: number;
  priceLevel?: number;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  phoneNumber?: string;
  website?: string;
  source: 'google';
}

interface SearchResponse {
  results: SearchResult[];
}

export default function SearchView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: searchResults, isLoading: isSearching, error: searchError } = useQuery<SearchResponse>({
    queryKey: ["/api/search/restaurants", searchQuery, location],
    enabled: searchSubmitted && !!searchQuery && !!location,
    retry: false,
  });

  // Handle authentication errors
  React.useEffect(() => {
    if (searchError && isUnauthorizedError(searchError)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [searchError, toast]);

  const addRestaurantMutation = useMutation({
    mutationFn: async (restaurant: any) => {
      await apiRequest("/api/restaurants", "POST", restaurant);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/restaurants"] });
      toast({
        title: "Restaurant Added",
        description: "The restaurant has been added to your collection!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add restaurant. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && location.trim()) {
      setSearchSubmitted(true);
    }
  };

  const handleAddRestaurant = (result: SearchResult) => {
    const restaurant = {
      name: result.name,
      cuisine: "Various", // Default since we don't get this from search APIs
      priceRange: result.priceLevel || 2,
      address: result.address,
      latitude: result.latitude,
      longitude: result.longitude,
      photoUrl: result.photoUrl,
      phoneNumber: result.phoneNumber,
      website: result.website,
      placeId: result.source === 'google' ? result.id : null,
    };

    addRestaurantMutation.mutate(restaurant);
  };

  const getPriceDisplay = (priceLevel?: number) => {
    if (!priceLevel) return "Price not available";
    return "$".repeat(Math.min(priceLevel, 4));
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return null;
    const stars = Math.round(rating);
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < stars ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-2">
          Discover Restaurants
        </h2>
        <p className="text-[hsl(var(--muted-foreground))]">
          Search for restaurants and add them to your collection
        </p>
      </div>

      {/* Search Form */}
      <Card className="p-6 mb-8 bg-white shadow-lg border-0">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="query" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Restaurant or Cuisine
              </label>
              <Input
                id="query"
                type="text"
                placeholder="Italian, Sushi, Pizza..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-[hsl(var(--border))] focus:ring-[hsl(var(--coral-pink))] focus:border-[hsl(var(--coral-pink))]"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Location
              </label>
              <Input
                id="location"
                type="text"
                placeholder="New York, NY or ZIP code"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-[hsl(var(--border))] focus:ring-[hsl(var(--coral-pink))] focus:border-[hsl(var(--coral-pink))]"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={!searchQuery.trim() || !location.trim() || isSearching}
            className="w-full bg-[hsl(var(--coral-pink))] hover:bg-[hsl(var(--coral-pink)/90)] text-white"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Restaurants
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Search Results */}
      {searchSubmitted && (
        <div>
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--coral-pink))]" />
            </div>
          ) : searchError ? (
            <Card className="p-6 text-center">
              <div className="text-red-600 mb-2">Search failed</div>
              <div className="text-gray-600">
                {isUnauthorizedError(searchError) 
                  ? "Please log in to search restaurants"
                  : "Unable to search restaurants. Please try again."}
              </div>
            </Card>
          ) : searchResults?.results && searchResults.results.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                Search Results ({searchResults.results.length})
              </h3>
              {searchResults.results.map((result: SearchResult) => (
                <Card key={result.id} className="p-6 bg-white shadow-md border-0 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row gap-4">
                    {result.photoUrl && (
                      <div className="w-full md:w-32 h-32 flex-shrink-0">
                        <img
                          src={result.photoUrl}
                          alt={result.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-xl font-semibold text-[hsl(var(--foreground))]">
                          {result.name}
                        </h4>
                        <Badge
                          variant="secondary"
                          className="ml-2 bg-blue-100 text-blue-800"
                        >
                          Google
                        </Badge>
                      </div>
                      
                      {result.address && (
                        <div className="flex items-center text-[hsl(var(--muted-foreground))] mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{result.address}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-4 mb-3">
                        {result.rating && getRatingStars(result.rating)}
                        <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                          {getPriceDisplay(result.priceLevel)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => handleAddRestaurant(result)}
                          disabled={addRestaurantMutation.isPending}
                          className="bg-[hsl(var(--coral-pink))] hover:bg-[hsl(var(--coral-pink)/90)] text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add to Collection
                        </Button>
                        
                        {result.website && (
                          <Button
                            variant="outline"
                            onClick={() => window.open(result.website, '_blank')}
                            className="border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Website
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center bg-white shadow-md border-0">
              <Search className="h-12 w-12 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
                No restaurants found
              </h3>
              <p className="text-[hsl(var(--muted-foreground))]">
                Try adjusting your search terms or location
              </p>
            </Card>
          )}
        </div>
      )}

      {!searchSubmitted && (
        <Card className="p-8 text-center bg-white shadow-md border-0">
          <Search className="h-12 w-12 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
            Ready to discover?
          </h3>
          <p className="text-[hsl(var(--muted-foreground))]">
            Enter a cuisine type or restaurant name and location to get started
          </p>
        </Card>
      )}
    </div>
  );
}