import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRestaurants } from "../hooks/use-restaurants";

interface Stats {
  totalRestaurants: number;
  visitedCount: number;
  wishlistCount: number;
  totalCheckIns: number;
  averageRating: number;
  topCuisines: { cuisine: string; count: number }[];
}

export default function MapView() {
  const { data: restaurants, isLoading } = useRestaurants();
  const { data: stats } = useQuery<Stats>({ queryKey: ["/api/stats"] });
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const L = (window as any).L;
    if (!mapRef.current || !L) return;

    const center =
      restaurants && restaurants.length > 0 && restaurants[0].latitude && restaurants[0].longitude
        ? [Number(restaurants[0].latitude), Number(restaurants[0].longitude)]
        : [40.7128, -74.0060];

    const map = L.map(mapRef.current).setView(center, 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    restaurants?.forEach((r: any) => {
      if (r.latitude && r.longitude) {
        L.marker([Number(r.latitude), Number(r.longitude)]).addTo(map).bindPopup(r.name);
      }
    });

    return () => {
      map.remove();
    };
  }, [restaurants]);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="bg-white m-4 p-4 rounded-xl shadow-sm border border-gray-100 animate-pulse">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="mx-4 h-96 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <section className="h-full flex flex-col">
      <div className="bg-white/95 backdrop-blur-md m-4 p-6 rounded-2xl shadow-lg border-0">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] bg-clip-text text-transparent">
              {stats?.totalRestaurants || 0}
            </div>
            <div className="text-sm text-gray-600 font-medium">Total Pins</div>
          </div>
          <div>
            <div className="text-3xl font-bold bg-gradient-to-br from-[#ff8e8e] to-[#ffa366] bg-clip-text text-transparent">
              {stats?.visitedCount || 0}
            </div>
            <div className="text-sm text-gray-600 font-medium">Visited</div>
          </div>
          <div>
            <div className="text-3xl font-bold bg-gradient-to-br from-[#ffa366] to-[#ff6b6b] bg-clip-text text-transparent">
              {stats?.wishlistCount || 0}
            </div>
            <div className="text-sm text-gray-600 font-medium">Wishlist</div>
          </div>
        </div>
      </div>
      <div className="flex-1 mx-4 mb-4 rounded-2xl overflow-hidden shadow-xl border-0">
        {restaurants && restaurants.length > 0 ? (
          <div ref={mapRef} className="h-full w-full" />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-orange-100 via-red-50 to-pink-100">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl">🗺️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No restaurants yet</h3>
              <p className="text-gray-600 mb-4">Add your first restaurant to see it on the map</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
