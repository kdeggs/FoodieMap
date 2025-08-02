import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertRestaurantSchema, insertRestaurantListSchema, insertListRestaurantSchema, insertCheckInSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Restaurant search API
  app.get("/api/search/restaurants", isAuthenticated, async (req, res) => {
    try {
      const { query, location } = req.query;
      
      if (!query || !location) {
        return res.status(400).json({ message: "Query and location are required" });
      }

      const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;
      const yelpApiKey = process.env.YELP_API_KEY;

      let results = [];

      // Try Google Places API first if available
      if (googleApiKey) {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(String(query) + ' restaurant ' + String(location))}&type=restaurant&key=${googleApiKey}`
          );
          const data = await response.json();
          
          if (data.results) {
            results = data.results.map((place: any) => ({
              id: place.place_id,
              name: place.name,
              address: place.formatted_address,
              rating: place.rating,
              priceLevel: place.price_level,
              latitude: place.geometry?.location?.lat,
              longitude: place.geometry?.location?.lng,
              photoUrl: place.photos?.[0] ? 
                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${googleApiKey}` 
                : null,
              source: 'google'
            }));
          }
        } catch (error) {
          console.error('Google Places API error:', error);
        }
      }

      // If no Google results and Yelp is available, try Yelp
      if (results.length === 0 && yelpApiKey) {
        try {
          const response = await fetch(
            `https://api.yelp.com/v3/businesses/search?term=${encodeURIComponent(String(query))}&location=${encodeURIComponent(String(location))}&categories=restaurants`,
            {
              headers: {
                'Authorization': `Bearer ${yelpApiKey}`
              }
            }
          );
          const data = await response.json();
          
          if (data.businesses) {
            results = data.businesses.map((business: any) => ({
              id: business.id,
              name: business.name,
              address: business.location?.display_address?.join(', '),
              rating: business.rating,
              priceLevel: business.price?.length || null,
              latitude: business.coordinates?.latitude,
              longitude: business.coordinates?.longitude,
              photoUrl: business.image_url,
              phoneNumber: business.phone,
              website: business.url,
              source: 'yelp'
            }));
          }
        } catch (error) {
          console.error('Yelp API error:', error);
        }
      }

      res.json({ results });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ message: "Failed to search restaurants" });
    }
  });

  // Restaurants
  app.get("/api/restaurants", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const restaurants = await storage.getRestaurants(userId);
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurants" });
    }
  });

  app.get("/api/restaurants/:id", async (req, res) => {
    try {
      const restaurant = await storage.getRestaurant(req.params.id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurant" });
    }
  });

  app.post("/api/restaurants", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertRestaurantSchema.parse({ ...req.body, userId });
      const restaurant = await storage.createRestaurant(validatedData);
      res.status(201).json(restaurant);
    } catch (error) {
      res.status(400).json({ message: "Invalid restaurant data", error });
    }
  });

  app.patch("/api/restaurants/:id", async (req, res) => {
    try {
      const updates = insertRestaurantSchema.partial().parse(req.body);
      const restaurant = await storage.updateRestaurant(req.params.id, updates);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data", error });
    }
  });

  app.delete("/api/restaurants/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteRestaurant(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete restaurant" });
    }
  });

  // Lists
  app.get("/api/lists", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const lists = await storage.getLists(userId);
      res.json(lists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lists" });
    }
  });

  app.get("/api/lists/:id", async (req, res) => {
    try {
      const list = await storage.getList(req.params.id);
      if (!list) {
        return res.status(404).json({ message: "List not found" });
      }
      res.json(list);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch list" });
    }
  });

  app.post("/api/lists", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertRestaurantListSchema.parse({ ...req.body, userId });
      const list = await storage.createList(validatedData);
      res.status(201).json(list);
    } catch (error) {
      res.status(400).json({ message: "Invalid list data", error });
    }
  });

  app.delete("/api/lists/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteList(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "List not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete list" });
    }
  });

  // List Restaurants
  app.get("/api/lists/:id/restaurants", async (req, res) => {
    try {
      const restaurants = await storage.getListRestaurants(req.params.id);
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch list restaurants" });
    }
  });

  app.post("/api/lists/:listId/restaurants", async (req, res) => {
    try {
      const validatedData = insertListRestaurantSchema.parse({
        ...req.body,
        listId: req.params.listId
      });
      const listRestaurant = await storage.addRestaurantToList(validatedData);
      res.status(201).json(listRestaurant);
    } catch (error) {
      res.status(400).json({ message: "Invalid data", error });
    }
  });

  app.delete("/api/lists/:listId/restaurants/:restaurantId", async (req, res) => {
    try {
      const removed = await storage.removeRestaurantFromList(req.params.listId, req.params.restaurantId);
      if (!removed) {
        return res.status(404).json({ message: "Restaurant not found in list" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove restaurant from list" });
    }
  });

  // Check-ins
  app.get("/api/restaurants/:id/checkins", async (req, res) => {
    try {
      const checkIns = await storage.getCheckIns(req.params.id);
      res.json(checkIns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch check-ins" });
    }
  });

  app.post("/api/checkins", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertCheckInSchema.parse({ ...req.body, userId });
      const checkIn = await storage.createCheckIn(validatedData);
      res.status(201).json(checkIn);
    } catch (error) {
      res.status(400).json({ message: "Invalid check-in data", error });
    }
  });

  // Statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
