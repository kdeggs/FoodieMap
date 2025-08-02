import { useState } from "react";
import { MapPin, Search, User, LogOut, List, BarChart } from "lucide-react";
import MapView from "../components/map-view";
import ListsView from "../components/lists-view";
import StatsView from "../components/stats-view";
import SearchView from "@/components/search-view";
import AddRestaurantModal from "../components/add-restaurant-modal";
import FloatingActionButton from "../components/floating-action-button";
import { Button } from "@/components/ui/button";

type TabType = "map" | "lists" | "stats" | "search" | "profile";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("map");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "map":
        return <MapView />;
      case "lists":
        return <ListsView />;
      case "stats":
        return <StatsView />;
      case "search":
        return <SearchView />;
      case "profile":
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile</h3>
              <p className="text-gray-600">Feature coming soon!</p>
            </div>
          </div>
        );
      default:
        return <MapView />;
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--bg-cream))]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[hsl(var(--coral-pink))] rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-bold text-xl text-[hsl(var(--foreground))]">
              FoodieMap
            </h1>
          </div>
          
          <a href="/api/logout">
            <Button variant="ghost" size="sm" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </a>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="flex">
          <button
            onClick={() => setActiveTab("map")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === "map"
                ? "text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5"
                : "text-gray-600 hover:text-[hsl(var(--primary))]"
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Map
          </button>
          <button
            onClick={() => setActiveTab("lists")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === "lists"
                ? "text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5"
                : "text-gray-600 hover:text-[hsl(var(--primary))]"
            }`}
          >
            <List className="w-4 h-4 inline mr-2" />
            Lists
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === "stats"
                ? "text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5"
                : "text-gray-600 hover:text-[hsl(var(--primary))]"
            }`}
          >
            <BarChart className="w-4 h-4 inline mr-2" />
            Stats
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-20">
        {renderContent()}
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-4 py-2">
          <button
            onClick={() => setActiveTab("map")}
            className={`flex flex-col items-center py-2 transition-colors ${
              activeTab === "map" ? "text-[hsl(var(--primary))]" : "text-gray-400"
            }`}
          >
            <MapPin className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Map</span>
          </button>
          <button
            onClick={() => setActiveTab("lists")}
            className={`flex flex-col items-center py-2 transition-colors ${
              activeTab === "lists" ? "text-[hsl(var(--primary))]" : "text-gray-400"
            }`}
          >
            <List className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Lists</span>
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`flex flex-col items-center py-2 transition-colors ${
              activeTab === "search" ? "text-[hsl(var(--coral-pink))]" : "text-gray-400"
            }`}
          >
            <Search className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Search</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center py-2 transition-colors ${
              activeTab === "profile" ? "text-[hsl(var(--primary))]" : "text-gray-400"
            }`}
          >
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>

      {/* Add Restaurant Modal */}
      <AddRestaurantModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
