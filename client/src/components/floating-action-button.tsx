import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
  onClick: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-20 right-4 z-50">
      <button
        onClick={onClick}
        className="w-14 h-14 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center hover:from-[#ff5252] hover:to-[#ff7979] active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
