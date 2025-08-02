import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Utensils, Star, Users } from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-cream))] via-[hsl(var(--lavender)/20)] to-[hsl(var(--mint-green)/20)]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[hsl(var(--coral-pink))] rounded-2xl flex items-center justify-center shadow-md">
              <Utensils className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">FoodieMap</h1>
          </div>
          <a href="/api/login">
            <Button className="bg-[hsl(var(--coral-pink))] hover:bg-[hsl(var(--coral-pink)/90)] text-white font-medium rounded-full px-6">
              Sign In
            </Button>
          </a>
        </nav>

        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[hsl(var(--coral-pink))] to-[hsl(var(--peach))] bg-clip-text text-transparent">
            Discover, Save & Share Your Favorite Restaurants
          </h2>
          <p className="text-xl text-[hsl(var(--muted-foreground))] mb-8 max-w-2xl mx-auto">
            Keep track of amazing places you've eaten, create custom lists, and never forget that perfect spot again.
          </p>
          <a href="/api/login">
            <Button size="lg" className="bg-[hsl(var(--coral-pink))] hover:bg-[hsl(var(--coral-pink)/90)] text-white font-medium rounded-full px-8 text-lg h-14 shadow-lg">
              Get Started Free
            </Button>
          </a>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="w-14 h-14 bg-[hsl(var(--mint-green))] rounded-2xl flex items-center justify-center mb-4">
              <MapPin className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Interactive Map</h3>
            <p className="text-[hsl(var(--muted-foreground))]">
              See all your favorite spots on a beautiful map. Find new places nearby wherever you go.
            </p>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="w-14 h-14 bg-[hsl(var(--sunshine-yellow))] rounded-2xl flex items-center justify-center mb-4">
              <Star className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Rate & Remember</h3>
            <p className="text-[hsl(var(--muted-foreground))]">
              Check in when you visit, rate your experience, and add notes to remember what you loved.
            </p>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="w-14 h-14 bg-[hsl(var(--lavender))] rounded-2xl flex items-center justify-center mb-4">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Smart Lists</h3>
            <p className="text-[hsl(var(--muted-foreground))]">
              Organize restaurants into custom lists. Perfect for date nights, coffee shops, or hidden gems.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}