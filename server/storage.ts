import { 
  type Restaurant, 
  type InsertRestaurant,
  type RestaurantList,
  type InsertRestaurantList,
  type ListRestaurant,
  type InsertListRestaurant,
  type CheckIn,
  type InsertCheckIn,
  type User,
  type UpsertUser
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Restaurants
  getRestaurants(userId: string): Promise<Restaurant[]>;
  getRestaurant(id: string): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: string, restaurant: Partial<InsertRestaurant>): Promise<Restaurant | undefined>;
  deleteRestaurant(id: string): Promise<boolean>;

  // Lists
  getLists(userId: string): Promise<RestaurantList[]>;
  getList(id: string): Promise<RestaurantList | undefined>;
  createList(list: InsertRestaurantList): Promise<RestaurantList>;
  updateList(id: string, list: Partial<InsertRestaurantList>): Promise<RestaurantList | undefined>;
  deleteList(id: string): Promise<boolean>;

  // List Restaurants
  getListRestaurants(listId: string): Promise<Restaurant[]>;
  addRestaurantToList(data: InsertListRestaurant): Promise<ListRestaurant>;
  removeRestaurantFromList(listId: string, restaurantId: string): Promise<boolean>;

  // Check-ins
  getCheckIns(restaurantId: string): Promise<CheckIn[]>;
  createCheckIn(checkIn: InsertCheckIn): Promise<CheckIn>;
  
  // Statistics
  getStats(): Promise<{
    totalRestaurants: number;
    visitedCount: number;
    wishlistCount: number;
    totalCheckIns: number;
    averageRating: number;
    topCuisines: { cuisine: string; count: number }[];
  }>;
}

export class MemStorage implements IStorage {
  private restaurants: Map<string, Restaurant>;
  private lists: Map<string, RestaurantList>;
  private listRestaurants: Map<string, ListRestaurant>;
  private checkIns: Map<string, CheckIn>;
  private users: Map<string, User>;

  constructor() {
    this.restaurants = new Map();
    this.lists = new Map();
    this.listRestaurants = new Map();
    this.checkIns = new Map();
    this.users = new Map();
    
    // Initialize with default lists
    this.initializeDefaultLists();
  }

  private initializeDefaultLists() {
    // Skip initialization in memory storage since lists are now user-specific
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const id = userData.id || randomUUID();
    const existingUser = this.users.get(id);
    const user: User = {
      id,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getRestaurants(userId: string): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values()).filter(r => r.userId === userId);
  }

  async getRestaurant(id: string): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const id = randomUUID();
    const restaurant: Restaurant = { 
      id,
      userId: insertRestaurant.userId,
      name: insertRestaurant.name,
      cuisine: insertRestaurant.cuisine,
      priceRange: insertRestaurant.priceRange,
      address: insertRestaurant.address || null,
      latitude: insertRestaurant.latitude || null,
      longitude: insertRestaurant.longitude || null,
      rating: insertRestaurant.rating || 0,
      notes: insertRestaurant.notes || null,
      isVisited: insertRestaurant.isVisited || false,
      checkInCount: insertRestaurant.checkInCount || 0,
      placeId: insertRestaurant.placeId || null,
      photoUrl: insertRestaurant.photoUrl || null,
      phoneNumber: insertRestaurant.phoneNumber || null,
      website: insertRestaurant.website || null,
      createdAt: new Date(),
    };
    this.restaurants.set(id, restaurant);
    return restaurant;
  }

  async updateRestaurant(id: string, updates: Partial<InsertRestaurant>): Promise<Restaurant | undefined> {
    const restaurant = this.restaurants.get(id);
    if (!restaurant) return undefined;

    const updated = { ...restaurant, ...updates };
    this.restaurants.set(id, updated);
    return updated;
  }

  async deleteRestaurant(id: string): Promise<boolean> {
    return this.restaurants.delete(id);
  }

  async getLists(userId: string): Promise<RestaurantList[]> {
    return Array.from(this.lists.values()).filter(l => l.userId === userId);
  }

  async getList(id: string): Promise<RestaurantList | undefined> {
    return this.lists.get(id);
  }

  async createList(insertList: InsertRestaurantList): Promise<RestaurantList> {
    const id = randomUUID();
    const list: RestaurantList = { 
      ...insertList, 
      id, 
      createdAt: new Date(),
      icon: insertList.icon || "utensils",
      color: insertList.color || "primary",
      description: insertList.description || null
    };
    this.lists.set(id, list);
    return list;
  }

  async updateList(id: string, updates: Partial<InsertRestaurantList>): Promise<RestaurantList | undefined> {
    const list = this.lists.get(id);
    if (!list) return undefined;

    const updated = { ...list, ...updates };
    this.lists.set(id, updated);
    return updated;
  }

  async deleteList(id: string): Promise<boolean> {
    return this.lists.delete(id);
  }

  async getListRestaurants(listId: string): Promise<Restaurant[]> {
    const listRestaurants = Array.from(this.listRestaurants.values())
      .filter(lr => lr.listId === listId);
    
    const restaurants = [];
    for (const lr of listRestaurants) {
      const restaurant = this.restaurants.get(lr.restaurantId);
      if (restaurant) {
        restaurants.push(restaurant);
      }
    }
    return restaurants;
  }

  async addRestaurantToList(data: InsertListRestaurant): Promise<ListRestaurant> {
    const id = randomUUID();
    const listRestaurant: ListRestaurant = { 
      ...data, 
      id, 
      addedAt: new Date() 
    };
    this.listRestaurants.set(id, listRestaurant);
    return listRestaurant;
  }

  async removeRestaurantFromList(listId: string, restaurantId: string): Promise<boolean> {
    for (const [id, lr] of Array.from(this.listRestaurants.entries())) {
      if (lr.listId === listId && lr.restaurantId === restaurantId) {
        return this.listRestaurants.delete(id);
      }
    }
    return false;
  }

  async getCheckIns(restaurantId: string): Promise<CheckIn[]> {
    return Array.from(this.checkIns.values())
      .filter(ci => ci.restaurantId === restaurantId);
  }

  async createCheckIn(insertCheckIn: InsertCheckIn): Promise<CheckIn> {
    const id = randomUUID();
    const checkIn: CheckIn = { 
      ...insertCheckIn, 
      id, 
      visitDate: new Date(),
      rating: insertCheckIn.rating || null,
      notes: insertCheckIn.notes || null
    };
    this.checkIns.set(id, checkIn);

    // Update restaurant check-in count and visited status
    const restaurant = this.restaurants.get(insertCheckIn.restaurantId);
    if (restaurant) {
      const updated = { 
        ...restaurant, 
        checkInCount: (restaurant.checkInCount || 0) + 1,
        isVisited: true
      };
      this.restaurants.set(restaurant.id, updated);
    }

    return checkIn;
  }

  async getStats(userId?: string): Promise<{
    totalRestaurants: number;
    visitedCount: number;
    wishlistCount: number;
    totalCheckIns: number;
    averageRating: number;
    topCuisines: { cuisine: string; count: number }[];
  }> {
    // Filter by user if userId is provided
    const restaurants = Array.from(this.restaurants.values())
      .filter(r => !userId || r.userId === userId);
    const userRestaurantIds = new Set(restaurants.map(r => r.id));
    const checkIns = Array.from(this.checkIns.values())
      .filter(ci => !userId || userRestaurantIds.has(ci.restaurantId));
    
    const totalRestaurants = restaurants.length;
    const visitedCount = restaurants.filter(r => r.isVisited).length;
    const wishlistCount = restaurants.filter(r => !r.isVisited).length;
    const totalCheckIns = checkIns.length;

    // Calculate average rating from check-ins
    const ratingsFromCheckIns = checkIns.filter(ci => ci.rating).map(ci => ci.rating!);
    const averageRating = ratingsFromCheckIns.length > 0 
      ? ratingsFromCheckIns.reduce((sum, rating) => sum + rating, 0) / ratingsFromCheckIns.length
      : 0;

    // Calculate top cuisines
    const cuisineCounts = restaurants.reduce((acc, restaurant) => {
      acc[restaurant.cuisine] = (acc[restaurant.cuisine] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCuisines = Object.entries(cuisineCounts)
      .map(([cuisine, count]) => ({ cuisine, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalRestaurants,
      visitedCount,
      wishlistCount,
      totalCheckIns,
      averageRating: Math.round(averageRating * 10) / 10,
      topCuisines
    };
  }
}

export const storage = new MemStorage();
