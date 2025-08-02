import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Utensils, Star, Users } from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--bg-cream))] via-[hsl(var(--lavender)/30)] to-[hsl(var(--mint-green)/30)]">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[hsl(var(--coral-pink)/20)] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[hsl(var(--sunshine-yellow)/20)] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[hsl(var(--mint-green)/20)] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--coral-pink))] to-[hsl(var(--coral-pink)/80)] rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🍽️</span>
            </div>
            <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] tracking-tight">FoodieMap</h1>
          </div>
          <a href="/api/login">
            <Button className="bg-[hsl(var(--coral-pink))] hover:bg-[hsl(var(--coral-pink)/90)] text-white font-semibold rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all">
              Sign In
            </Button>
          </a>
        </nav>

        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg mb-8">
              <span className="w-2 h-2 bg-[hsl(var(--coral-pink))] rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-[hsl(var(--foreground))]">✨ Now with real restaurant data from Google & Yelp</span>
            </div>
          </div>
          
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-[hsl(var(--coral-pink))] via-[hsl(var(--peach))] to-[hsl(var(--sunshine-yellow))] bg-clip-text text-transparent leading-tight tracking-tight">
            Your Food Journey Starts Here
          </h2>
          
          <p className="text-2xl md:text-3xl text-[hsl(var(--muted-foreground))] mb-4 max-w-4xl mx-auto leading-relaxed font-medium">
            Discover amazing restaurants, save your favorites, 
          </p>
          <p className="text-2xl md:text-3xl text-[hsl(var(--muted-foreground))] mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            and never forget that perfect spot again 🌟
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/api/login">
              <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--coral-pink))] to-[hsl(var(--peach))] hover:from-[hsl(var(--coral-pink)/90)] hover:to-[hsl(var(--peach)/90)] text-white font-bold rounded-full px-12 py-6 text-xl h-auto shadow-2xl transform hover:scale-105 transition-all duration-300 group">
                <span className="mr-2">🚀</span>
                Start Exploring Now
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Button>
            </a>
            <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] text-lg">
              <span>💯</span>
              <span className="font-medium">Free forever</span>
            </div>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="mt-32 mb-16">
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-4 text-[hsl(var(--foreground))]">
            Everything you need to track your food adventures
          </h3>
          <p className="text-xl text-center text-[hsl(var(--muted-foreground))] mb-16 max-w-3xl mx-auto">
            From discovery to memory-keeping, we've got you covered
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="p-10 bg-white/95 backdrop-blur-md border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 rounded-3xl group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[hsl(var(--mint-green)/20)] to-transparent rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-[hsl(var(--mint-green))] to-[hsl(var(--mint-green)/70)] rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <span className="text-4xl">🗺️</span>
                </div>
                <h4 className="text-3xl font-bold mb-4 text-[hsl(var(--foreground))]">Interactive Map</h4>
                <p className="text-lg text-[hsl(var(--muted-foreground))] leading-relaxed">
                  See all your favorite spots on a beautiful map. Find new places nearby wherever you go. Never lose track of that amazing hole-in-the-wall again.
                </p>
              </div>
            </Card>

            <Card className="p-10 bg-white/95 backdrop-blur-md border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 rounded-3xl group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[hsl(var(--sunshine-yellow)/20)] to-transparent rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-[hsl(var(--sunshine-yellow))] to-[hsl(var(--sunshine-yellow)/70)] rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <span className="text-4xl">⭐</span>
                </div>
                <h4 className="text-3xl font-bold mb-4 text-[hsl(var(--foreground))]">Rate & Remember</h4>
                <p className="text-lg text-[hsl(var(--muted-foreground))] leading-relaxed">
                  Check in when you visit, rate your experience, and add notes to remember what you loved. Build your personal food diary with memories.
                </p>
              </div>
            </Card>

            <Card className="p-10 bg-white/95 backdrop-blur-md border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 rounded-3xl group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[hsl(var(--lavender)/20)] to-transparent rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-[hsl(var(--lavender))] to-[hsl(var(--lavender)/70)] rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <span className="text-4xl">📝</span>
                </div>
                <h4 className="text-3xl font-bold mb-4 text-[hsl(var(--foreground))]">Smart Lists</h4>
                <p className="text-lg text-[hsl(var(--muted-foreground))] leading-relaxed">
                  Organize restaurants into custom lists. Perfect for date nights, coffee shops, or hidden gems. Share your favorites with friends.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}