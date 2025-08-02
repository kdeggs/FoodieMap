import { useState } from "react";
import { Plus, Utensils, List, X } from "lucide-react";

interface ExpandableFabProps {
  onAddRestaurant: () => void;
  onCreateList: () => void;
}

export default function ExpandableFab({ onAddRestaurant, onCreateList }: ExpandableFabProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAction = (action: () => void) => {
    action();
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
          style={{ zIndex: -1 }}
        />
      )}
      
      {/* Action buttons */}
      <div className={`flex flex-col space-y-3 mb-3 transition-all duration-300 ${
        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {/* Create List */}
        <div className="flex items-center space-x-3">
          <span className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-full text-sm font-medium text-gray-800 shadow-lg">
            Create List
          </span>
          <button
            onClick={() => handleAction(onCreateList)}
            className="w-12 h-12 bg-gradient-to-br from-[#ff8e8e] to-[#ffa366] text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
        
        {/* Add Restaurant */}
        <div className="flex items-center space-x-3">
          <span className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-full text-sm font-medium text-gray-800 shadow-lg">
            Add Restaurant
          </span>
          <button
            onClick={() => handleAction(onAddRestaurant)}
            className="w-12 h-12 bg-gradient-to-br from-[#ffa366] to-[#ff6b6b] text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center"
          >
            <Utensils className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main FAB */}
      <button
        onClick={toggleExpanded}
        className={`w-14 h-14 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] text-white rounded-full shadow-xl hover:shadow-2xl transform transition-all duration-300 flex items-center justify-center hover:from-[#ff5252] hover:to-[#ff7979] ${
          isExpanded ? 'rotate-45 scale-110' : 'hover:scale-110'
        }`}
      >
        {isExpanded ? (
          <X className="w-6 h-6" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}