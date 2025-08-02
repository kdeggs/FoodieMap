import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
  onClick: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-20 right-4 z-50">
      <button
        onClick={onClick}
        className="w-14 h-14 bg-[hsl(var(--primary))] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
