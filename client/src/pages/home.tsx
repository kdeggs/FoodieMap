import { useState } from "react";
import { MapPin, Search, User, LogOut, List, BarChart } from "lucide-react";
import MapView from "../components/map-view";
import ListsView from "../components/lists-view";
import CreateListModal from "../components/create-list-modal";
import StatsView from "../components/stats-view";
import SearchView from "@/components/search-view";
import AddRestaurantModal from "../components/add-restaurant-modal";
import ExpandableFab from "../components/expandable-fab";
import { Button } from "@/components/ui/button";

type TabType = "map" | "lists" | "stats" | "search" | "profile";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("map");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Beautiful Gradient Background like Landing Page */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Header */}
      <header className="relative z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-lg">🍽️</span>
            </div>
            <h1 className="font-bold text-xl text-gray-800 tracking-tight">
              FoodieMap
            </h1>
          </div>
          
          <a href="/api/logout">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 font-medium">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </a>
        </div>
      </header>

      {/* Main Content - Full Height to Bottom Nav */}
      <main className="relative z-10 h-[calc(100vh-80px)] pb-16 overflow-hidden">
        {renderContent()}
      </main>

      {/* Expandable Floating Action Button */}
      <ExpandableFab 
        onAddRestaurant={() => setIsAddModalOpen(true)}
        onCreateList={() => setIsCreateListModalOpen(true)}
      />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-4 py-2">
          <button
            onClick={() => setActiveTab("map")}
            className={`flex flex-col items-center py-2 transition-colors ${
              activeTab === "map" ? "text-[hsl(var(--coral-pink))]" : "text-gray-400"
            }`}
          >
            <MapPin className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Map</span>
          </button>
          <button
            onClick={() => setActiveTab("lists")}
            className={`flex flex-col items-center py-2 transition-colors ${
              activeTab === "lists" ? "text-[hsl(var(--coral-pink))]" : "text-gray-400"
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
              activeTab === "profile" ? "text-[hsl(var(--coral-pink))]" : "text-gray-400"
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
      
      {/* Create List Modal */}
      <CreateListModal
        isOpen={isCreateListModalOpen}
        onClose={() => setIsCreateListModalOpen(false)}
      />
    </div>
  );
}
