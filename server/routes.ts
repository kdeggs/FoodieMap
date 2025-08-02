import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRestaurantSchema, insertRestaurantListSchema, insertListRestaurantSchema, insertCheckInSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Restaurants
  app.get("/api/restaurants", async (req, res) => {
    try {
      const restaurants = await storage.getRestaurants();
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

  app.post("/api/restaurants", async (req, res) => {
    try {
      const validatedData = insertRestaurantSchema.parse(req.body);
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
  app.get("/api/lists", async (req, res) => {
    try {
      const lists = await storage.getLists();
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

  app.post("/api/lists", async (req, res) => {
    try {
      const validatedData = insertRestaurantListSchema.parse(req.body);
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

  app.post("/api/checkins", async (req, res) => {
    try {
      const validatedData = insertCheckInSchema.parse(req.body);
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
